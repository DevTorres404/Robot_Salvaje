namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        private phase: number
        private originHeading: number
        private originSet: boolean
        private driveStartedAt: number

        constructor() {
            this.reset()
        }

        reset() {
            this.phase = 0
            this.originHeading = 0
            this.originSet = false
            this.driveStartedAt = 0
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (!this.originSet) {
                this.originHeading = movement.headingDegrees()
                this.originSet = true
            }

            if (this.phase == 0) {
                if (movement.turnTowardFieldHeading(
                    this.originHeading + Config.SEARCH_NEAR_SWEEP_DEGREES)) this.phase = 1
                return
            }

            if (this.phase == 1) {
                if (movement.turnTowardFieldHeading(
                    this.originHeading - Config.SEARCH_NEAR_SWEEP_DEGREES)) this.phase = 2
                return
            }

            if (this.phase == 2) {
                if (movement.turnTowardFieldHeading(
                    this.originHeading + Config.SEARCH_MID_SWEEP_DEGREES)) this.phase = 3
                return
            }

            if (this.phase == 3) {
                if (movement.turnTowardFieldHeading(
                    this.originHeading - Config.SEARCH_MID_SWEEP_DEGREES)) this.phase = 4
                return
            }

            if (this.phase == 4) {
                if (movement.turnTowardFieldHeading(
                    this.originHeading + Config.SEARCH_WIDE_SWEEP_DEGREES)) this.phase = 5
                return
            }

            if (this.phase == 5) {
                if (movement.turnTowardFieldHeading(
                    this.originHeading - Config.SEARCH_WIDE_SWEEP_DEGREES)) this.phase = 6
                return
            }

            if (this.phase == 6) {
                if (movement.turnTowardFieldHeading(this.originHeading)) {
                    this.phase = 7
                    this.driveStartedAt = control.millis()
                }
                return
            }

            if (this.phase == 7) {
                movement.forward()
                if (control.millis() - this.driveStartedAt > Config.SEARCH_DRIVE_MS) {
                    movement.stop()
                    this.reset()
                }
                return
            }
        }
    }
}
