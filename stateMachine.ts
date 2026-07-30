namespace RobotSoccer {
    export enum RobotState {
        INIT,
        SEARCH,
        APPROACH,
        ATTACK,
        DEFEND,
        RECOVER,
        STOP,
        ERROR
    }

    export class StateMachine {
        private state = RobotState.INIT
        private enteredAt: number
        private touchPrev = false

        constructor(private hardware: RobotHardware) {
            this.enteredAt = hardware.millis()
        }

        current() { return this.state }

        transition(next: RobotState) {
            this.state = next
            this.enteredAt = this.hardware.millis()
        }

        update(snapshot: SensorSnapshot, sensors: Sensors, movement: Movement) {
            // Touch en SEARCH/APPROACH/DEFEND = obstáculo, recuperar
            // Touch sensor check re-enabled: if we hit a wall, back up!
            if (snapshot.touchPressed && !this.touchPrev
                && this.state != RobotState.ATTACK
                && this.state != RobotState.STOP
                && this.state != RobotState.ERROR
                && this.state != RobotState.RECOVER) {
                this.transition(RobotState.RECOVER)
            }
            this.touchPrev = snapshot.touchPressed

            if (this.state == RobotState.INIT) this.transition(RobotState.SEARCH)
            else if (this.state == RobotState.SEARCH) {
                if (sensors.ballSeen(snapshot)) this.transition(RobotState.APPROACH)
                else if (this.hardware.millis() - this.enteredAt > Config.SEARCH_TIMEOUT_MS) this.transition(RobotState.DEFEND)
            } else if (this.state == RobotState.APPROACH) {
                if (!sensors.ballSeen(snapshot)) this.transition(RobotState.SEARCH)
                else if (sensors.ballClose(snapshot)) this.transition(RobotState.ATTACK)
            } else if (this.state == RobotState.ATTACK) {
                // En ATTACK, touch no saca de aquí (lo maneja AttackStrategy para patear)
                if (!sensors.ballSeen(snapshot)) this.transition(RobotState.SEARCH)
            } else if (this.state == RobotState.RECOVER) {
                if (this.hardware.millis() - this.enteredAt > Config.RECOVERY_REVERSE_MS + Config.RECOVERY_TURN_MS) this.transition(RobotState.SEARCH)
            }

            if (this.state == RobotState.STOP || this.state == RobotState.ERROR) movement.stop()
        }
    }
}
