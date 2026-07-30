namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick = 0

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.touchPressed) {
                movement.stop()
                return
            }

            // Si el sensor de color ve algo que no es ni verde (3) ni "nada" (0), asumimos que atrapó la pelota.
            // (La pelota blanca en VRT suele leerse como blanco (6) o a veces gris).
            const hasBall = snapshot.colorDetected > 0 && snapshot.colorDetected != 3;

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
                // (a) Use the IR Seeker sensor to point at the ball
                // (b) Drive forward
                movement.driveTowardHeading(snapshot.infraredHeading, 100)
            }
        }
    }
}
