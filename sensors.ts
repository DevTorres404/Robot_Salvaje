namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        detectedColor: ColorSensorColor
        groundColor: ColorSensorColor
        obstacleDistance: number
    }

    export class Sensors {
        constructor(private hardware: RobotHardware) {}

        read(): SensorSnapshot {
            return {
                infraredProximity: this.hardware.infraredProximity(),
                detectedColor: this.hardware.colorDetected(),
                groundColor: this.hardware.groundColorDetected(),
                obstacleDistance: this.hardware.obstacleDistance()
            }
        }

        ballCandidate(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity >= 0
                && snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX
        }

        ballConfirmed(snapshot: SensorSnapshot) {
            return snapshot.detectedColor === Config.BALL_COLOR
                && this.ballCandidate(snapshot)
        }

        ballSeen(snapshot: SensorSnapshot) {
            return this.ballConfirmed(snapshot) || this.ballCandidate(snapshot)
        }

        ballClose(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX
                && snapshot.detectedColor === Config.BALL_COLOR
        }

        obstacleClose(snapshot: SensorSnapshot) {
            // El sensor de obstáculos ultrasónico está montado más alto (puerto 4)
            // Un valor válido mayor a 0 y menor al umbral indica un obstáculo
            return snapshot.obstacleDistance > 0
                && snapshot.obstacleDistance <= Config.OBSTACLE_DISTANCE_MAX_CM
                && snapshot.detectedColor !== Config.BALL_COLOR
        }

        outOfBounds(snapshot: SensorSnapshot) {
            return snapshot.groundColor == Config.OUT_OF_BOUNDS_COLOR
        }

        inOpponentZone(snapshot: SensorSnapshot) {
            return snapshot.groundColor == Config.OPPONENT_ZONE_COLOR
        }

        inOwnZone(snapshot: SensorSnapshot) {
            return snapshot.groundColor == Config.OWN_ZONE_COLOR
        }

        inCornerZone(snapshot: SensorSnapshot) {
            return snapshot.groundColor == Config.CORNER_ZONE_COLOR
        }
    }
}
