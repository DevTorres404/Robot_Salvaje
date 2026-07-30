namespace RobotSoccer {
    export class DefenseStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.infraredHeading != 0) {
                movement.driveTowardHeading(snapshot.infraredHeading, snapshot.infraredProximity)
            } else {
                movement.turnLeft()
            }
        }
    }
}
