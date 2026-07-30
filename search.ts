namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        private lowFrames = 0
        private eventStartAngle = 0
        private ballCenter = 0
        private hasBall = false
        private ballFirstSeen = 0

        run(snapshot: SensorSnapshot, movement: Movement) {
            const prox = snapshot.infraredProximity
            const gyro = snapshot.gyroAngle

            // Si identificamos una pelota, vamos hacia su centro
            if (this.hasBall) {
                // Timeout: si pasó 1s sin llegar, era una pared mal clasificada
                if (control.millis() - this.ballFirstSeen > 1000) {
                    this.hasBall = false
                } else {
                    let diff = this.ballCenter - gyro
                    while (diff > 180) diff -= 360
                    while (diff < -180) diff += 360
                    if (Math.abs(diff) > 5) {
                        movement.alignToGyro(this.ballCenter)
                    } else {
                        movement.forward()
                    }
                    return
                }
            }

            // Shape detection: medir frames de señal baja
            if (prox < Config.IR_BALL_SEEN_MAX) {
                if (this.lowFrames == 0) {
                    this.eventStartAngle = gyro
                }
                this.lowFrames++
            } else if (this.lowFrames > 0) {
                // Evento terminó. A 10 de velocidad, ~15°/frame
                // 1-2 frames = angosto (pelota). 3+ = ancho (pared)
                if (this.lowFrames <= 2) {
                    this.ballCenter = (this.eventStartAngle + gyro) / 2
                    this.hasBall = true
                    this.ballFirstSeen = control.millis()
                }
                this.lowFrames = 0
            }

            // Barrido lento alternado para medir formas
            let cycle = control.millis() % 6000
            if (cycle < 3000) {
                movement.drive(10, -10)   // scan izq lento
            } else if (cycle < 4000) {
                movement.forward()          // reposicionar
            } else {
                movement.drive(-10, 10)    // scan der lento
            }
        }

        reset() {
            this.lowFrames = 0
            this.hasBall = false
        }
    }
}
