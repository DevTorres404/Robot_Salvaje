namespace RobotSoccer {
    export class RecoveryStrategy implements Strategy {
        private done = false

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.done) return
            this.done = true
            movement.reverseTime(Config.RECOVERY_REVERSE_MS)
            movement.turnLeftDegrees(90)
        }

        reset() {
            this.done = false
        }
    }
}
