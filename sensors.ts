namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        colorDetected: boolean
        obstacleDetected: boolean
        touchPressed: boolean
    }

    export class Sensors {
        constructor(private hardware: RobotHardware) {}

        read(): SensorSnapshot {
            return {
                infraredProximity: this.hardware.infraredProximity(),
                colorDetected: false,
                obstacleDetected: false,
                touchPressed: false
            }
        }

        ballSeen(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX
        }

        ballClose(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX
        }
    }
}
