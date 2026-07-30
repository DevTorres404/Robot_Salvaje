namespace RobotSoccer {
    export interface RobotHardware {
        drive(leftSpeed: number, rightSpeed: number): void
        stopDrive(): void
        runAuxiliary(speed: number): void
        stopAuxiliary(): void
        stopAll(): void
        infraredProximity(): number
        infraredHeading(): number
        gyroAngle(): number
        touchPressed(): boolean
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

        stopAll() {
            Config.LEFT_MOTOR.stop()
            Config.RIGHT_MOTOR.stop()
            Config.AUXILIARY_MOTOR.stop()
        }

        private lastIrVal: number;

        constructor() {
            this.lastIrVal = 0;
        }

        infraredProximity() {
            return Config.INFRARED_SENSOR.proximity()
        }

        // El sensor IR en pxt-ev3 no expone heading en modo Seek de forma pública.
        // La búsqueda se hace por rotación y la proximidad decide el ataque.
        infraredHeading() {
            return 0
        }

        gyroAngle() {
            return Config.GYRO_SENSOR.angle()
        }

        touchPressed() {
            return Config.TOUCH_SENSOR.isPressed()
        }

        millis() {
            return control.millis()
        }
    }
}
