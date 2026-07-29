namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.touchPressed) {
                movement.stop()
            } else {
                movement.forward()
            }
        }
    }
}
