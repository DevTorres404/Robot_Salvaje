namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.infraredHeading != 0) {
                movement.driveTowardHeading(snapshot.infraredHeading, snapshot.infraredProximity)
                return
            }
            let time = control.millis() % 4000
            if (time < 1500) {
                movement.turnLeft()
            } else if (time < 2500) {
                movement.forward()
            } else {
                movement.turnRight()
            }
        }
    }
}
