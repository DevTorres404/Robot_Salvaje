namespace RobotSoccer {
    export interface RobotHardware {
        drive(leftSpeed: number, rightSpeed: number): void
        stopDrive(): void
        runAuxiliary(speed: number): void
        stopAuxiliary(): void
        holdAuxiliary(): void
        stopAll(): void
        infraredProximity(): number
        colorDetected(): ColorSensorColor
        groundColorDetected(): ColorSensorColor
        obstacleDistance(): number
        leftWheelAngle(): number
        rightWheelAngle(): number
        millis(): number
    }

    // Única frontera entre la lógica del robot y las APIs de MakeCode EV3.
    export class EV3RobotHardware implements RobotHardware {
        drive(leftSpeed: number, rightSpeed: number) {
            Config.LEFT_MOTOR.run(leftSpeed * Config.LEFT_MOTOR_DIRECTION)
            Config.RIGHT_MOTOR.run(rightSpeed * Config.RIGHT_MOTOR_DIRECTION)
        }

        stopDrive() {
            Config.LEFT_MOTOR.stop()
            Config.RIGHT_MOTOR.stop()
        }

        runAuxiliary(speed: number) {
            Config.AUXILIARY_MOTOR.run(speed * Config.AUXILIARY_MOTOR_DIRECTION)
        }

        stopAuxiliary() {
            Config.AUXILIARY_MOTOR.stop()
        }

        holdAuxiliary() {
            Config.AUXILIARY_MOTOR.setBrake(true)
            Config.AUXILIARY_MOTOR.stop()
        }

        stopAll() {
            Config.LEFT_MOTOR.stop()
            Config.RIGHT_MOTOR.stop()
            Config.AUXILIARY_MOTOR.stop()
        }

        infraredProximity() {
            return Config.INFRARED_SENSOR.proximity()
        }

        colorDetected() {
            return Config.COLOR_SENSOR.color()
        }

        groundColorDetected() {
            return Config.GROUND_COLOR_SENSOR.color()
        }

        obstacleDistance() {
            return Config.OBSTACLE_SENSOR.distance()
        }

        leftWheelAngle() {
            return Config.LEFT_MOTOR.angle() * Config.LEFT_MOTOR_DIRECTION
        }

        rightWheelAngle() {
            return Config.RIGHT_MOTOR.angle() * Config.RIGHT_MOTOR_DIRECTION
        }

        millis() {
            return control.millis()
        }
    }
}
