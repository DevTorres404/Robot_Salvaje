namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        infraredHeading: number
        gyroAngle: number
        touchPressed: boolean
        colorDetected: number
    }

    export class Sensors {
        constructor(private hardware: RobotHardware) {}

        read(): SensorSnapshot {
            return {
                infraredProximity: this.hardware.infraredProximity(),
                infraredHeading: this.hardware.infraredHeading(),
                gyroAngle: this.hardware.gyroAngle(),
                touchPressed: this.hardware.touchPressed(),
                colorDetected: this.hardware.colorDetected()
            }
        }

        ballSeen(snapshot: SensorSnapshot) {
            return snapshot.infraredHeading != 0 || snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX
        }

        ballClose(snapshot: SensorSnapshot) {
            return snapshot.infraredHeading != 0 && snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX
        }
    }
}
