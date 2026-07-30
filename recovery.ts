namespace RobotSoccer {
    export class RecoveryStrategy implements Strategy {
        private done: boolean;

        constructor() {
            this.done = false;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.done) return
            this.done = true
            movement.reverseTime(Config.RECOVERY_REVERSE_MS)
            movement.turnLeftTime(Config.RECOVERY_TURN_MS)
        }

        reset() {
            this.done = false
        }
    }
}
