namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        private phase: number
        private advanceStartedAt: number

        constructor() {
            this.reset()
        }

        reset() {
            this.phase = 0
            this.advanceStartedAt = 0
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.phase == 0) {
                if (movement.turnTowardFieldHeading(Config.SEARCH_SWEEP_DEGREES)) this.phase = 1
                return
            }

            if (this.phase == 1) {
                if (movement.turnTowardFieldHeading(-Config.SEARCH_SWEEP_DEGREES)) this.phase = 2
                return
            }

            if (this.phase == 2) {
                if (movement.turnTowardFieldHeading(175)) this.phase = 3
                return
            }

            if (this.phase == 3) {
                if (movement.turnTowardFieldHeading(Config.GOAL_HEADING_DEGREES)) {
                    this.phase = 4
                    this.advanceStartedAt = control.millis()
                }
                return
            }

            movement.forward()
            if (control.millis() - this.advanceStartedAt >= Config.SEARCH_ADVANCE_MS) {
                this.reset()
            }
        }
    }
}
