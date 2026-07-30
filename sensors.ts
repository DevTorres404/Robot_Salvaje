namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        infraredHeading: number
        gyroAngle: number
        detectedColor: number
        touchPressed: boolean
    }

    export class Sensors {
        constructor(private hardware: RobotHardware) {}

        read(): SensorSnapshot {
            return {
                infraredProximity: this.hardware.infraredProximity(),
                infraredHeading: this.hardware.infraredHeading(),
                gyroAngle: this.hardware.gyroAngle(),
                detectedColor: this.hardware.colorDetected(),
                touchPressed: this.hardware.touchPressed()
            }
        }

        ballSeen(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX
        }

        ballClose(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX
        }

        isOnPlayableField(snapshot: SensorSnapshot) {
            return snapshot.detectedColor === Config.FIELD_COLOR
        }
    }
}
