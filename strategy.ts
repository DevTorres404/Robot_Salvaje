namespace RobotSoccer {
    export interface Strategy {
        run(snapshot: SensorSnapshot, movement: Movement): void
    }
}
