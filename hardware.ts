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

        private lastIrVal: number = 0;

        private updateIrSeek() {
            // Actualizamos la lectura del modo Seek solo si pasaron varios ms, o simplemente la leemos.
            // Para mantenerlo simple, leemos el valor de 16 bits (Heading + Distance).
            this.lastIrVal = (Config.INFRARED_SENSOR as any).getDirectionAndDistance()
        }

        infraredProximity() {
            this.updateIrSeek()
            // El byte alto (shift 8) contiene la distancia al IR Beacon (0 a 100)
            let distance = (this.lastIrVal >> 8) & 0xFF
            // En modo Seek, si no hay pelota suele dar -128 (en complemento a 2 es 128 o 255), 
            // asumimos que si es mayor a 100, es que no la ve, devolvemos 100 (lejos)
            if (distance > 100) return 100
            return distance
        }

        infraredHeading() {
            // Ya leímos el valor en infraredProximity, así que no hace falta llamar a updateIrSeek de nuevo,
            // pero por las dudas usamos el último valor guardado.
            let heading = this.lastIrVal & 0xFF
            if (heading > 127) heading -= 256
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
