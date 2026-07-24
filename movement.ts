namespace RobotSoccer {
    export class Movement {
        constructor(private runtime: EV3Runtime) {}

        forward() { this.runtime.drive(DRIVE_SPEED, DRIVE_SPEED) }
        reverse() { this.runtime.drive(-DRIVE_SPEED, -DRIVE_SPEED) }
        turnLeft() { this.runtime.drive(-TURN_SPEED, TURN_SPEED) }
        turnRight() { this.runtime.drive(TURN_SPEED, -TURN_SPEED) }
        stop() { this.runtime.stopDrive() }
        kick() { this.runtime.runAuxiliary(AUXILIARY_SPEED) }
    }
}
