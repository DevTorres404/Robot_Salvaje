namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick: number;

        constructor() {
            this.lastKick = -Config.ATTACK_RESET_MS;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            let ballControlled = snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX
                && snapshot.detectedColor === Config.BALL_COLOR

            if (ballControlled) {
                if (control.millis() - this.lastKick > Config.ATTACK_RESET_MS) {
                    movement.stop()
                    movement.kick()
                    this.lastKick = control.millis()
                }
                return
            }

            movement.forward()
        }
    }
}
