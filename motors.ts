namespace RobotSoccer {
    // Sustituya estas tres vinculaciones únicamente después de actualizar los
    // TODO_CONFIRM de config.ts con el cableado real. Se usan objetos MakeCode,
    // no números de puerto dispersos por la lógica.
    const leftMotor = motors.largeB
    const rightMotor = motors.largeC
    const auxiliaryMotor = motors.mediumA

    export class EV3Runtime {
        drive(leftSpeed: number, rightSpeed: number) {
            if (!HARDWARE_CONFIRMED) return
            leftMotor.run(leftSpeed)
            rightMotor.run(rightSpeed)
        }

        stopDrive() {
            leftMotor.stop()
            rightMotor.stop()
        }

        runAuxiliary(speed: number) {
            if (!HARDWARE_CONFIRMED) return
            auxiliaryMotor.run(speed)
        }

        stopAll() {
            motors.stopAll()
        }
    }
}
