namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        constructor() {}

        run(snapshot: SensorSnapshot, movement: Movement) {
            // Spin to scan the field. We rely on Proximity hitting a threshold (handled in stateMachine)
            let cycle = control.millis() % 4000
            if (cycle < 1000) {
                movement.turnLeft()
            } else if (cycle < 1500) {
                movement.forward()
            } else {
                movement.turnRight()
            }
        }
    }
}
