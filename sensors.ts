namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        infraredHeading: number
        detectedColor: ColorSensorColor
    }

    export class Sensors {
        constructor(private hardware: RobotHardware) {}

        read(): SensorSnapshot {
            return {
                infraredProximity: this.hardware.infraredProximity(),
                infraredHeading: this.hardware.infraredHeading(),
                detectedColor: this.hardware.colorDetected()
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

        goalSeen(snapshot: SensorSnapshot) {
            return snapshot.detectedColor === Config.GOAL_COLOR
        }
    }
}
