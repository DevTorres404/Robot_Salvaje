namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            // Como el sensor IR solo da proximidad (sin heading), el robot gira
            // en un patr\u00f3n para barrer la cancha hasta que detecte la pelota.
            let time = control.millis() % 3000
            if (time < 1000) {
                movement.turnLeft()
            } else if (time < 1500) {
                movement.forward()
            } else {
                movement.turnRight()
            }
        }
    }
}
