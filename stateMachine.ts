namespace RobotSoccer {
    export enum RobotState {
        INIT,
        RUSH,
        SEARCH,
        APPROACH,
        ATTACK,
        DEFEND,
        RECOVER,
        KAMIKAZE,
        STOP,
        ERROR
    }

    export class StateMachine {
        private state = RobotState.INIT
        private enteredAt: number
        private lastBallSeenAt: number
        private recoveryForward = false


        constructor(private hardware: RobotHardware) {
            this.enteredAt = hardware.millis()
            this.lastBallSeenAt = this.enteredAt
        }

        current() { return this.state }
        recoveryMovesForward() { return this.recoveryForward }

        transition(next: RobotState) {
            this.state = next
            this.enteredAt = this.hardware.millis()
        }

        update(snapshot: SensorSnapshot, sensors: Sensors, movement: Movement) {
            if (sensors.ballSeen(snapshot)) this.lastBallSeenAt = this.hardware.millis()

            if (sensors.outOfBounds(snapshot)
                && this.state != RobotState.STOP
                && this.state != RobotState.ERROR
                && this.state != RobotState.RECOVER
                && this.state != RobotState.RUSH) {
                // DEFEND retrocede; para deshacer ese cruce debe avanzar.
                this.recoveryForward = this.state == RobotState.DEFEND
                this.transition(RobotState.RECOVER)
            }

            // Los sensores son frontales: proximidad extrema sin blanco indica un obstáculo.
            if (sensors.obstacleClose(snapshot)
                && this.state != RobotState.STOP
                && this.state != RobotState.ERROR
                && this.state != RobotState.ATTACK
                && this.state != RobotState.KAMIKAZE
                && this.state != RobotState.RECOVER) {
                
                // Distinguir entre rival (kamikaze) y pared/arco (esquivar)
                // Si el sensor frontal ve los colores del arco (Amarillo/Azul) o de la pared (Negro)
                let isWallOrGoal = snapshot.detectedColor == Config.OPPONENT_ZONE_COLOR ||
                                   snapshot.detectedColor == Config.OWN_ZONE_COLOR ||
                                   snapshot.detectedColor == ColorSensorColor.Black

                let atEdge = snapshot.groundColor == Config.CORNER_ZONE_COLOR ||
                             snapshot.groundColor == Config.OUT_OF_BOUNDS_COLOR

                let inCenter = snapshot.groundColor == Config.CENTER_ZONE_COLOR
                let inOpponentZone = snapshot.groundColor == Config.OPPONENT_ZONE_COLOR

                if (inCenter || inOpponentZone || (!isWallOrGoal && !atEdge)) {
                    // ¡Es el enemigo o el arco rival! Embestir.
                    this.transition(RobotState.KAMIKAZE)
                } else {
                    // Es nuestra pared o nuestro arco: retroceder y esquivar
                    this.recoveryForward = false
                    this.transition(RobotState.RECOVER)
                }
            }

            if (this.state == RobotState.INIT) this.transition(RobotState.RUSH)
            else if (this.state == RobotState.RUSH) {
                if (sensors.ballSeen(snapshot)) this.transition(RobotState.APPROACH)
                else if (sensors.inOpponentZone(snapshot)) this.transition(RobotState.DEFEND)
                else if (this.hardware.millis() - this.enteredAt > Config.RUSH_TIMEOUT_MS) this.transition(RobotState.DEFEND)
            }
            else if (this.state == RobotState.SEARCH) {
                if (sensors.ballSeen(snapshot)) this.transition(RobotState.APPROACH)
                else if (this.hardware.millis() - this.enteredAt > Config.SEARCH_TIMEOUT_MS) this.transition(RobotState.DEFEND)
            } else if (this.state == RobotState.APPROACH) {
                if (sensors.ballConfirmed(snapshot) && sensors.ballClose(snapshot)) {
                    this.transition(RobotState.ATTACK)
                }
                else if (!sensors.ballConfirmed(snapshot)
                    && this.hardware.millis() - this.enteredAt > Config.BALL_VERIFY_MS) {
                    this.recoveryForward = false
                    this.transition(RobotState.RECOVER)
                }
            } else if (this.state == RobotState.ATTACK) {
                if (this.hardware.millis() - this.lastBallSeenAt > Config.BALL_LOST_GRACE_MS) {
                    this.transition(RobotState.SEARCH)
                }
                else if (this.hardware.millis() - this.enteredAt > Config.ATTACK_TIMEOUT_MS) {
                    this.transition(RobotState.SEARCH)
                }
            } else if (this.state == RobotState.DEFEND) {
                if (sensors.ballSeen(snapshot)) this.transition(RobotState.APPROACH)
                else if (sensors.inOwnZone(snapshot)) {
                    // Ya está en su propia área protegida, pasa a buscar
                    this.transition(RobotState.SEARCH)
                }
                else if (this.hardware.millis() - this.enteredAt > Config.DEFEND_DURATION_MS) {
                    this.transition(RobotState.SEARCH)
                }
            } else if (this.state == RobotState.RECOVER) {
                if (this.hardware.millis() - this.enteredAt > Config.RECOVERY_REVERSE_MS + Config.RECOVERY_TURN_MS) {
                    this.transition(RobotState.SEARCH)
                }
            } else if (this.state == RobotState.KAMIKAZE) {
                let isWallOrGoal = snapshot.detectedColor == Config.OPPONENT_ZONE_COLOR ||
                                   snapshot.detectedColor == Config.OWN_ZONE_COLOR ||
                                   snapshot.detectedColor == ColorSensorColor.Black
                let atEdge = sensors.inCornerZone(snapshot) || sensors.outOfBounds(snapshot)
                
                let inCenter = snapshot.groundColor == Config.CENTER_ZONE_COLOR
                let inOpponentZone = snapshot.groundColor == Config.OPPONENT_ZONE_COLOR

                // Si descubrimos que estábamos empujando NUESTRA pared o arco, abortamos de inmediato
                if (!inCenter && !inOpponentZone && (isWallOrGoal || atEdge)) {
                    this.recoveryForward = false
                    this.transition(RobotState.RECOVER)
                }
                // Si encontramos la pelota mientras embestimos, la agarramos
                else if (sensors.ballSeen(snapshot)) {
                    this.transition(RobotState.APPROACH)
                }
                // Si pasa el timeout y no vimos la pelota, probablemente era una pared invisible. Recuperar.
                else if (this.hardware.millis() - this.enteredAt > Config.KAMIKAZE_TIMEOUT_MS) {
                    this.recoveryForward = false
                    this.transition(RobotState.RECOVER)
                }
            }

            if (this.state == RobotState.STOP || this.state == RobotState.ERROR) movement.stop()
        }
    }
}
