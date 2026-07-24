namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            movement.turnLeft()
        }
    }
}
