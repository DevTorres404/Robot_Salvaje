namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick: number;

        constructor() {
            this.lastKick = 0;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.touchPressed) {
                movement.stop()
                return
            }

            // Asumimos que atrapó la pelota si la proximidad de la baliza IR es muy corta
            const hasBall = snapshot.infraredProximity < 20;

            if (hasBall) {
                // (a) Use compass sensor to point at the net
                movement.alignToGyro(0)
                
                // (b) Shoot the ball
                // Pateamos solo si estamos más o menos alineados al arco
                if (Math.abs(snapshot.gyroAngle) < 15) {
                    if (control.millis() - this.lastKick > Config.KICK_DURATION_MS + 100) {
                        movement.kick()
                        this.lastKick = control.millis()
                    }
                }
            } else {
                // Avanzamos directo: la transici\u00f3n a ATTACK ocurri\u00f3 porque
                // el robot detect\u00f3 la pelota por proximidad al girar.
                movement.forward()
            }
        }
    }
}
