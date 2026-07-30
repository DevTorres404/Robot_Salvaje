namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick: number;

        constructor() {
            this.lastKick = 0;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            // Si la pelota está muy cerca (la tiene en el control)
            if (snapshot.infraredProximity <= 5) {
                // Si ve el arco con el sensor de color, patea
                if (snapshot.detectedColor === Config.GOAL_COLOR) {
                    if (control.millis() - this.lastKick > Config.KICK_DURATION_MS + 200) {
                        movement.stop()
                        movement.kick()
                        this.lastKick = control.millis()
                    }
                } else {
                    // Si no ve el arco, gira con la pelota para alinearse
                    movement.turnLeft()
                }
                return
            }

            // Avanzar hacia la pelota
            movement.forward()
        }
    }
}
