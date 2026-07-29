namespace RobotSoccer {
    export class Movement {
        constructor(private hardware: RobotHardware) {}

        forward() { this.hardware.drive(Config.DRIVE_SPEED, Config.DRIVE_SPEED) }
        reverse() { this.hardware.drive(-Config.DRIVE_SPEED, -Config.DRIVE_SPEED) }
        turnLeft() { this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED) }
        turnRight() { this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED) }
        stop() { this.hardware.stopDrive() }
        kick() { this.hardware.runAuxiliary(Config.AUXILIARY_SPEED) }

        turnLeftDegrees(degrees: number) {
            const start = this.hardware.gyroAngle()
            this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED)
            pauseUntil(() => this.hardware.gyroAngle() <= start - degrees)
            this.hardware.stopDrive()
        }

        turnRightDegrees(degrees: number) {
            const start = this.hardware.gyroAngle()
            this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED)
            pauseUntil(() => this.hardware.gyroAngle() >= start + degrees)
            this.hardware.stopDrive()
        }

        reverseTime(ms: number) {
            this.hardware.drive(-Config.DRIVE_SPEED, -Config.DRIVE_SPEED)
            pause(ms)
            this.hardware.stopDrive()
        }
    }
}
