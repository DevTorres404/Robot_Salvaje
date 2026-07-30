namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick: number;

        constructor() {
            this.lastKick = 0;
        }

        run(snapshot: SensorSnapshot, movement: Movement) {
            // Proximity = patear
            if (snapshot.infraredProximity <= 5) {
                if (control.millis() - this.lastKick > Config.KICK_DURATION_MS + 200) {
                    movement.stop()
                    movement.kick()
                    this.lastKick = control.millis()
                }
                return
            }

            // Avanzar hacia la pelota
            movement.forward()
        }
    }
}
