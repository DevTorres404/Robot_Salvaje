namespace RobotSoccer {
    export class RecoveryStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            movement.reverseTime(Config.RECOVERY_REVERSE_MS)
            movement.turnLeftDegrees(90)
        }
    }
}
