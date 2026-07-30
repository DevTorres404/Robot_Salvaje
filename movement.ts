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

        turnLeftTime(ms: number) {
            this.hardware.drive(-Config.TURN_SPEED, Config.TURN_SPEED)
            pause(ms)
            this.hardware.stopDrive()
        }

        turnRightTime(ms: number) {
            this.hardware.drive(Config.TURN_SPEED, -Config.TURN_SPEED)
            pause(ms)
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
