namespace RobotSoccer {
    export class DefenseStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.infraredProximity <= Config.IR_BALL_SEEN_MAX) {
                movement.forward()
            } else {
                let cycle = control.millis() % 2400
                if (cycle < 1200) movement.turnLeft()
                else movement.turnRight()
            }
        }
    }
}
