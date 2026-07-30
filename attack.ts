namespace RobotSoccer {
    export class AttackStrategy implements Strategy {
        private lastKick = 0

        run(snapshot: SensorSnapshot, movement: Movement) {
            if (snapshot.touchPressed) {
                movement.stop()
                return
            }
            if (snapshot.infraredProximity <= Config.IR_ATTACK_DISTANCE_MAX) {
                // Nos alineamos hacia el arco (ángulo 0) y avanzamos
                movement.alignToGyro(0)
                
                // Si vemos el color del arco, ¡pateamos!
                if (snapshot.colorDetected == Config.GOAL_COLOR) {
                    if (control.millis() - this.lastKick > Config.KICK_DURATION_MS + 100) {
                        movement.kick()
                        this.lastKick = control.millis()
                    }
                }
            } else {
                movement.forward()
            }
        }
    }
}
