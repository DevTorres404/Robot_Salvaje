namespace RobotSoccer {
    export class DefenseStrategy implements Strategy {
        private phase: number

        constructor() {
            this.reset()
        }

        reset() {
            this.phase = 0
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.phase == 0) {
                if (movement.turnTowardFieldHeading(Config.GOAL_HEADING_DEGREES)) {
                    this.phase = 1
                }
                return
            }

            let cycle = control.millis() % (Config.DEFENSE_ARC_PERIOD_MS * 2)
            let offset = cycle < Config.DEFENSE_ARC_PERIOD_MS
                ? Config.DEFENSE_ARC_DEGREES
                : -Config.DEFENSE_ARC_DEGREES
            movement.reverseTowardFieldHeading(Config.GOAL_HEADING_DEGREES + offset)
        }
    }
}
