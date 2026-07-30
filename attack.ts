namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick: number;

        constructor() {
            this.lastKick = 0;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            // Touch = estamos contra el arco, pateamos
            if (snapshot.touchPressed) {
                if (control.millis() - this.lastKick > Config.KICK_DURATION_MS + 100) {
                    movement.kick()
                    this.lastKick = control.millis()
                }
                return
            }

            const hasBall = snapshot.infraredProximity < 20;

            if (hasBall) {
                // Alinear al arco y empujar
                movement.alignToGyro(0)
            } else {
                // Avanzar hacia la pelota
                movement.forward()
            }
        }
    }
}
