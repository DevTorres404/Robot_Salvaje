namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private driveStartedAt: number
        private done: boolean

        constructor() {
            this.reset()
        }

        reset() {
            this.driveStartedAt = 0
            this.done = false
        }

        approach(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.detectedColor === Config.BALL_COLOR) {
                movement.attackForward()
            } else {
                movement.stop()
            }
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.done) {
                movement.stop()
                return
            }

            if (this.driveStartedAt == 0) {
                this.driveStartedAt = control.millis()
            }

            movement.driveTowardFieldHeading(Config.GOAL_HEADING_DEGREES)
            if (control.millis() - this.driveStartedAt >= Config.GOAL_CARRY_MS) {
                movement.stop()
                movement.kick()
                this.done = true
            }
        }

        finished() {
            return this.done
        }
    }
}
