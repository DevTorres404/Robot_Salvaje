namespace RobotSoccer {
    export class DefenseStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            movement.turnLeft()
        }
    }
}
