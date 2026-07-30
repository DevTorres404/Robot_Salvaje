namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        detectedColor: ColorSensorColor
        groundColor: ColorSensorColor
    }

    export class Sensors {
        constructor(private hardware: RobotHardware) {}

        read(): SensorSnapshot {
            return {
                infraredProximity: this.hardware.infraredProximity(),
                detectedColor: this.hardware.colorDetected(),
                groundColor: this.hardware.groundColorDetected()
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
            return snapshot.infraredProximity <= 5
                && snapshot.detectedColor !== Config.BALL_COLOR
        }

        outOfBounds(snapshot: SensorSnapshot) {
            return snapshot.groundColor === Config.OUT_OF_BOUNDS_COLOR
        }
    }
}
