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
            if (heading == 0) {
                this.forward()
                return
            }
            const base = Config.DRIVE_SPEED
            const offset = proximity > 25 ? 15 : proximity > 10 ? 8 : 4
            const centered = heading - offset
            const steer = Math.round(centered * 0.8)
            this.hardware.drive(base - steer, base + steer)
        }
    }
}
