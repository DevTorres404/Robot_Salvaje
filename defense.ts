namespace RobotSoccer {
    export class DefenseStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX) {
                movement.forward()
            } else {
                movement.turnTowardFieldHeading(Config.GOAL_HEADING_DEGREES)
            }
        }
    }
}
