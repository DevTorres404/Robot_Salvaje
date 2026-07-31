namespace RobotSoccer {
    export class RushStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement): void {
            // Rush at full speed forward, but keep aligned with the goal
            movement.driveTowardFieldHeading(Config.GOAL_HEADING_DEGREES)
        }
    }
}
