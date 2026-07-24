namespace RobotSoccer {
    export class RecoveryStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            movement.reverse()
        }
    }
}
