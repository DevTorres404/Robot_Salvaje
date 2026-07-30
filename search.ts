namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        private bestProximity = 100
        private bestGyro = 0

        run(snapshot: SensorSnapshot, movement: Movement) {
            // Recordar la mejor proximidad vista y a qué ángulo
            if (snapshot.infraredProximity < this.bestProximity) {
                this.bestProximity = snapshot.infraredProximity
                this.bestGyro = snapshot.gyroAngle
            }

            // Si vimos algo medianamente cerca, virar hacia esa dirección
            if (this.bestProximity < Config.IR_BALL_SEEN_MAX * 1.5) {
                let diff = this.bestGyro - snapshot.gyroAngle
                while (diff > 180) diff -= 360
                while (diff < -180) diff += 360
                if (Math.abs(diff) > 5) {
                    movement.alignToGyro(this.bestGyro)
                } else {
                    movement.forward()
                }
                return
            }

            // Zigzag: avanza y va girando para cubrir área nueva
            let cycle = control.millis() % 5000
            if (cycle < 2000) {
                movement.forward()
            } else if (cycle < 2500) {
                movement.turnLeft()
            } else if (cycle < 3500) {
                movement.forward()
            } else {
                movement.turnRight()
            }
        }

        reset() {
            this.bestProximity = 100
            this.bestGyro = 0
        }
    }
}
