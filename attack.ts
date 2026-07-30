namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private phase: number
        private driveStartedAt: number
        private done: boolean

        constructor() {
            this.reset()
        }

        reset() {
            this.phase = 0
            this.driveStartedAt = 0
            this.done = false
        }

        approach(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.detectedColor === Config.BALL_COLOR) {
                movement.forward()
            } else {
                movement.stop()
            }
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.phase == 0) {
                if (movement.driveTowardFieldHeading(Config.GOAL_HEADING_DEGREES)) {
                    this.phase = 1
                    this.driveStartedAt = control.millis()
                }
                return
            }

            if (this.phase == 1) {
                movement.forward()
                if (control.millis() - this.driveStartedAt >= Config.GOAL_DRIVE_MS) {
                    movement.stop()
                    movement.kick()
                    this.phase = 2
                    this.done = true
                }
                return
            }

            movement.stop()
        }

        finished() {
            return this.done
        }
    }
}
