namespace RobotSoccer {
    export class Movement {
        private initialLeftAngle: number
        private initialRightAngle: number

        constructor(private hardware: RobotHardware) {
            this.initialLeftAngle = hardware.leftWheelAngle()
            this.initialRightAngle = hardware.rightWheelAngle()
        }

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

        headingDegrees() {
            let leftDegrees = this.hardware.leftWheelAngle() - this.initialLeftAngle
            let rightDegrees = this.hardware.rightWheelAngle() - this.initialRightAngle
            let leftDistance = leftDegrees * Config.WHEEL_CIRCUMFERENCE_MM / 360
            let rightDistance = rightDegrees * Config.WHEEL_CIRCUMFERENCE_MM / 360
            let heading = (rightDistance - leftDistance) / Config.DRIVE_TRACK_WIDTH_MM * 180 / Math.PI

            while (heading > 180) heading -= 360
            while (heading < -180) heading += 360
            return heading
        }

        driveTowardFieldHeading(targetDegrees: number) {
            let error = targetDegrees - this.headingDegrees()
            while (error > 180) error -= 360
            while (error < -180) error += 360

            if (Math.abs(error) <= Config.GOAL_ALIGN_TOLERANCE_DEGREES) {
                this.forward()
                return true
            }

            let steer = Math.round(error)
            if (steer > Config.GOAL_ALIGN_SPEED) steer = Config.GOAL_ALIGN_SPEED
            if (steer < -Config.GOAL_ALIGN_SPEED) steer = -Config.GOAL_ALIGN_SPEED
            let base = Math.round(Config.DRIVE_SPEED / 2)
            this.hardware.drive(base - steer, base + steer)
            return false
        }

        turnTowardFieldHeading(targetDegrees: number) {
            let error = targetDegrees - this.headingDegrees()
            while (error > 180) error -= 360
            while (error < -180) error += 360

            if (Math.abs(error) <= Config.SEARCH_ALIGN_TOLERANCE_DEGREES) {
                this.stop()
                return true
            }

            if (error > 0) {
                this.hardware.drive(-Config.SEARCH_TURN_SPEED, Config.SEARCH_TURN_SPEED)
            } else {
                this.hardware.drive(Config.SEARCH_TURN_SPEED, -Config.SEARCH_TURN_SPEED)
            }
            return false
        }

    }
}
