namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        detectedColor: ColorSensorColor
    }

    export class Sensors {
        constructor(private hardware: RobotHardware) {}

        read(): SensorSnapshot {
            return {
                infraredProximity: this.hardware.infraredProximity(),
                detectedColor: this.hardware.colorDetected()
            }
        }

        ballCandidate(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity >= 0
                && snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX
        }

        ballConfirmed(snapshot: SensorSnapshot) {
            return snapshot.detectedColor === Config.BALL_COLOR
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
    }
}
