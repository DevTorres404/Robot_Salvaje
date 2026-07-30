namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick = 0

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.touchPressed) {
                movement.stop()
                return
            }
            if (snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX) {
                movement.driveTowardHeading(snapshot.infraredHeading)
                if (control.millis() - this.lastKick > Config.KICK_DURATION_MS + 100) {
                    movement.kick()
                    this.lastKick = control.millis()
                }
            } else {
                movement.driveTowardHeading(snapshot.infraredHeading)
            }
        }
    }
}
