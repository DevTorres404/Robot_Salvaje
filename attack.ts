namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private phase: number
        private secureStartedAt: number
        private driveStartedAt: number
        private shotStartedAt: number
        private done: boolean

        constructor() {
            this.reset()
        }

        reset() {
            this.phase = 0
            this.secureStartedAt = 0
            this.driveStartedAt = 0
            this.shotStartedAt = 0
            this.done = false
        }

        approach(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.detectedColor === Config.BALL_COLOR) {
                movement.approachBall()
            } else {
                movement.stop()
            }
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.done) {
                movement.stop()
                return
            }

            if (this.phase == 0) {
                if (this.secureStartedAt == 0) {
                    this.secureStartedAt = control.millis()
                }
                movement.secureBall()
                if (control.millis() - this.secureStartedAt >= Config.BALL_SECURE_MS) {
                    this.phase = 1
                    this.driveStartedAt = control.millis()
                }
                return
            }

            if (this.phase == 1) {
                let aligned = movement.driveTowardFieldHeading(Config.GOAL_HEADING_DEGREES)
                let carryTime = control.millis() - this.driveStartedAt
                if (carryTime >= Config.GOAL_CARRY_MS
                    && (aligned || carryTime >= Config.GOAL_CARRY_MAX_MS)) {
                    this.phase = 2
                    this.shotStartedAt = control.millis()
                }
                return
            }

            movement.attackForward()
            if (control.millis() - this.shotStartedAt >= Config.SHOT_STRAIGHT_MS) {
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
