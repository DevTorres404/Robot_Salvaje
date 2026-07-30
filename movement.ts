namespace RobotSoccer {
    export class Movement {
        constructor(private hardware: RobotHardware) {}

        forward() { this.hardware.drive(Config.DRIVE_SPEED, Config.DRIVE_SPEED) }
        reverse() { this.hardware.drive(-Config.DRIVE_SPEED, -Config.DRIVE_SPEED) }
        turnLeft() { this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED) }
        turnRight() { this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED) }
        stop() { this.hardware.stopDrive() }
        drive(leftSpeed: number, rightSpeed: number) { this.hardware.drive(leftSpeed, rightSpeed) }
        kick() {
            this.hardware.runAuxiliary(Config.AUXILIARY_SPEED)
            pause(Config.KICK_DURATION_MS)
            this.hardware.stopAuxiliary()
        }

        alignToGyro(target: number) {
            const current = this.hardware.gyroAngle()
            let diff = target - current
            
            while (diff > 180) diff -= 360
            while (diff < -180) diff += 360
            
            if (Math.abs(diff) < 5) {
                this.forward()
                return
            }
            
            let speed = Math.abs(diff) * 1.5
            if (speed < 10) speed = 10
            if (speed > Config.TURN_SPEED) speed = Config.TURN_SPEED
            
            if (diff > 0) {
                this.hardware.drive(speed, -speed)
            } else {
                this.hardware.drive(-speed, speed)
            }
        }

        turnLeftDegrees(degrees: number) {
            const start = this.hardware.gyroAngle()
            const target = start - degrees
            if (this.hardware.gyroAngle() <= target) return
            this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED)
            const timeout = this.hardware.millis() + 2000
            while (this.hardware.gyroAngle() > target && this.hardware.millis() < timeout) {
                pause(10)
            }
            this.hardware.stopDrive()
        }

        turnRightDegrees(degrees: number) {
            const start = this.hardware.gyroAngle()
            const target = start + degrees
            if (this.hardware.gyroAngle() >= target) return
            this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED)
            const timeout = this.hardware.millis() + 2000
            while (this.hardware.gyroAngle() < target && this.hardware.millis() < timeout) {
                pause(10)
            }
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
    }
}
