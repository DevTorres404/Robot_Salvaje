namespace RobotSoccer {
    export class RushStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            // Rush at full speed forward
            movement.attackForward()
        }
    }
}
