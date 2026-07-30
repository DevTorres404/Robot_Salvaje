namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        constructor() {}

        run(snapshot: SensorSnapshot, movement: Movement) {
            // Seek mode: heading != 0 means we can see the ball directly — drive toward it
            if (snapshot.infraredHeading != 0) {
                movement.driveTowardHeading(snapshot.infraredHeading, snapshot.infraredProximity)
                return
            }

            // No ball in sight — rotate to scan the field
            let cycle = control.millis() % 4000
            if (cycle < 1500) {
                movement.turnLeft()
            } else if (cycle < 2500) {
                movement.forward()
            } else {
                movement.turnRight()
            }
        }
    }
}
