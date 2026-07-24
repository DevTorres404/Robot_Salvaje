namespace RobotSoccer {
    export interface SensorSnapshot {
        infraredProximity: number
        colorDetected: boolean
        obstacleDetected: boolean
        touchPressed: boolean
    }

    export class Sensors {
        read(): SensorSnapshot {
            // Solo el IR está confirmado por la documentación de construcción.
            // Seleccione el puerto real al sustituir la vinculación infrarroja.
            const infraredProximity = sensors.infrared1.proximity()
            return {
                infraredProximity: infraredProximity,
                colorDetected: false, // TODO_CONFIRM: sensor no confirmado
                obstacleDetected: false, // TODO_CONFIRM: sensor no confirmado
                touchPressed: false // TODO_CONFIRM: sensor no confirmado
            }
        }

        ballSeen(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity <= IR_BALL_SEEN_MAX
        }

        ballClose(snapshot: SensorSnapshot) {
            return snapshot.infraredProximity <= IR_ATTACK_DISTANCE_MAX
        }
    }
}
