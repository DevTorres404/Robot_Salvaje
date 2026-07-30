namespace RobotSoccer {
    export class Movement {
        constructor(private hardware: RobotHardware) {}

        forward() { this.hardware.drive(Config.DRIVE_SPEED, Config.DRIVE_SPEED) }
        reverse() { this.hardware.drive(-Config.DRIVE_SPEED, -Config.DRIVE_SPEED) }
        turnLeft() { this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED) }
        turnRight() { this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED) }
        stop() { this.hardware.stopDrive() }
        kick() {
            this.hardware.runAuxiliary(Config.AUXILIARY_SPEED)
            pause(Config.KICK_DURATION_MS)
            this.hardware.stopAuxiliary()
        }

        turnLeftDegrees(degrees: number) {
            const start = this.hardware.gyroAngle()
            const target = start - degrees
            if (this.hardware.gyroAngle() <= target) return
            this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED)
            pauseUntil(() => this.hardware.gyroAngle() <= target)
            this.hardware.stopDrive()
        }

        turnRightDegrees(degrees: number) {
            const start = this.hardware.gyroAngle()
            const target = start + degrees
            if (this.hardware.gyroAngle() >= target) return
            this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED)
            pauseUntil(() => this.hardware.gyroAngle() >= target)
            this.hardware.stopDrive()
        }

        reverseTime(ms: number) {
            this.hardware.drive(-Config.DRIVE_SPEED, -Config.DRIVE_SPEED)
            pause(ms)
            this.hardware.stopDrive()
        }

        driveTowardHeading(heading: number, proximity: number) {
            const base = Config.DRIVE_SPEED
            const offset = proximity > 25 ? 15 : proximity > 10 ? 8 : 4
            const centered = heading - offset
            const steer = Math.round(centered * 0.8)
            this.hardware.drive(base - steer, base + steer)
        }

        alignToGyro(target: number) {
            const current = this.hardware.gyroAngle()
            const error = target - current
            
            // Si ya estamos casi alineados (margen de 5 grados), avanzamos
            if (Math.abs(error) < 5) {
                this.forward()
                return true
            }

            // Giramos proporcionalmente hacia el ángulo deseado
            const steer = error > 0 ? Config.TURN_SPEED : -Config.TURN_SPEED
            this.hardware.drive(steer, -steer)
            return false
        }
    }
}
