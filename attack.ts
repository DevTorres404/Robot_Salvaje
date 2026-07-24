namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            movement.forward()
        }
    }
}
