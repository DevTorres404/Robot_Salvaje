namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick = 0

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.touchPressed) {
                movement.stop()
                return
            }
            movement.driveTowardHeading(snapshot.infraredHeading, snapshot.infraredProximity)

            if (snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX
                && snapshot.colorDetected == Config.GOAL_COLOR
                && control.millis() - this.lastKick > Config.KICK_DURATION_MS + 100) {
                movement.kick()
                this.lastKick = control.millis()
            }
        }
    }
}
