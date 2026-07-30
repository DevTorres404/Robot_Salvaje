namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick: number;

        constructor() {
            this.lastKick = 0;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            // Ball is right in front — KICK
            if (snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX) {
                if (control.millis() - this.lastKick > Config.KICK_DURATION_MS + 200) {
                    movement.stop()
                    movement.kick()
                    this.lastKick = control.millis()
                }
                return
            }

            // Drive toward the ball using the IR heading
            movement.driveTowardHeading(snapshot.infraredHeading, snapshot.infraredProximity)
        }
    }
}
