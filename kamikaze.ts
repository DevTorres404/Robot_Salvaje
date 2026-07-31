namespace RobotSoccer {
    export class KamikazeStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement): void {
            // Embestir a toda velocidad asumiendo que es el rival
            movement.attackForward()
            // Intentar atrapar la pelota al mismo tiempo
            movement.engageBallHook()
        }
    }
}
