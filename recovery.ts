namespace RobotSoccer {
    export class RecoveryStrategy implements Strategy {
        private done: boolean;
        private escapeForward: boolean;

        constructor() {
            this.done = false;
            this.escapeForward = false;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (this.done) return
            this.done = true
            if (this.escapeForward) {
                movement.forwardTime(Config.RECOVERY_REVERSE_MS)
            } else {
                movement.reverseTime(Config.RECOVERY_REVERSE_MS)
            }
            movement.turnLeftTime(Config.RECOVERY_TURN_MS)
        }

        reset(escapeForward: boolean) {
            this.done = false
            this.escapeForward = escapeForward
        }
    }
}
