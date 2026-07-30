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
        colorDetected(): number
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

        infraredProximity() {
            return Config.INFRARED_SENSOR.proximity()
        }

        infraredHeading() {
            // Hack para acceder al modo Seek (Rastreo de Balón) que MakeCode oculta
            const val = (Config.INFRARED_SENSOR as any).getDirectionAndDistance()
            let heading = val & 0xFF
            // Convertir a número con signo (-25 a 25)
            if (heading > 127) heading -= 256
            // Multiplicamos por 3 para que el steering sea más agresivo (aprox grados)
            return heading * 3
        }

        gyroAngle() {
            return Config.GYRO_SENSOR.angle()
        }

        touchPressed() {
            return Config.TOUCH_SENSOR.isPressed()
        }

        colorDetected() {
            return Config.COLOR_SENSOR.color()
        }

        millis() {
            return control.millis()
        }
    }
}
