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

            // Alinear al arco y empujar la pelota
            movement.alignToGyro(0)
        }
    }
}
