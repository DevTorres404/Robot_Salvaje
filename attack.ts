namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private approachPhase: number
        private approachOriginHeading: number
        private bestBallHeading: number
        private bestBallProximity: number
        private phase: number
        private secureStartedAt: number
        private driveStartedAt: number
        private shotStartedAt: number
        private done: boolean

        constructor() {
            this.resetApproach()
            this.reset()
        }

        resetApproach() {
            this.approachPhase = 0
            this.approachOriginHeading = 0
            this.bestBallHeading = 0
            this.bestBallProximity = 101
        }

        reset() {
            this.phase = 0
            this.secureStartedAt = 0
            this.driveStartedAt = 0
            this.shotStartedAt = 0
            this.done = false
        }

        approach(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.detectedColor === Config.BALL_COLOR
                && snapshot.infraredProximity >= 0
                && snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX
                && snapshot.infraredProximity < this.bestBallProximity) {
                this.bestBallProximity = snapshot.infraredProximity
                this.bestBallHeading = movement.headingDegrees()
            }

            if (this.approachPhase == 0) {
                this.approachOriginHeading = movement.headingDegrees()
                this.bestBallHeading = this.approachOriginHeading
                this.approachPhase = 1
            }

            if (this.approachPhase == 1) {
                if (movement.turnTowardFieldHeading(
                    this.approachOriginHeading + Config.BALL_ALIGN_SWEEP_DEGREES)) {
                    this.approachPhase = 2
                }
                return
            }

            if (this.approachPhase == 2) {
                if (movement.turnTowardFieldHeading(
                    this.approachOriginHeading - Config.BALL_ALIGN_SWEEP_DEGREES)) {
                    this.approachPhase = 3
                }
                return
            }

            if (this.approachPhase == 3) {
                if (movement.turnTowardFieldHeading(this.bestBallHeading)) {
                    this.approachPhase = 4
                }
                return
            }

            if (snapshot.detectedColor === Config.BALL_COLOR
                && snapshot.infraredProximity >= 0
                && snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX) {
                movement.approachBall()
            } else {
                movement.stop()
            }
        }

        cancel(movement: Movement) {
            movement.holdBallHook()
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
                movement.engageBallHook()
                movement.secureBall()
                if (control.millis() - this.secureStartedAt >= Config.BALL_SECURE_MS) {
                    movement.holdBallHook()
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
