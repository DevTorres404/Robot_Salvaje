namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        private phase: number

        constructor() {
            this.reset()
        }

        reset() {
            this.phase = 0
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
                if (movement.turnTowardFieldHeading(Config.SEARCH_SWEEP_DEGREES)) this.reset()
                return
            }
        }
    }
}
