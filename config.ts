namespace RobotSoccer {
    // Fuente de verdad: soccer-robot/docs/{HARDWARE,MOTOR_MAP,SENSOR_MAP}.md.
    // Esos documentos no confirman el cableado. No active el robot hasta verificarlo.
    export const HARDWARE_CONFIRMED = false // TODO_CONFIRM
    export const LEFT_MOTOR_PORT = "TODO_CONFIRM"
    export const RIGHT_MOTOR_PORT = "TODO_CONFIRM"
    export const AUXILIARY_MOTOR_PORT = "TODO_CONFIRM"
    export const INFRARED_SENSOR_PORT = "TODO_CONFIRM"
    export const COLOR_SENSOR_PORT = "TODO_CONFIRM"
    export const ULTRASONIC_SENSOR_PORT = "TODO_CONFIRM"
    export const TOUCH_SENSOR_PORT = "TODO_CONFIRM"

    export const DRIVE_SPEED = 35
    export const TURN_SPEED = 25
    export const AUXILIARY_SPEED = 40
    export const SEARCH_TURN_MS = 350
    export const RECOVERY_REVERSE_MS = 450
    export const RECOVERY_TURN_MS = 300
    // IR devuelve 0 (muy cerca) a 100 (muy lejos); calibrar en la cancha.
    export const IR_BALL_SEEN_MAX = 65
    export const IR_ATTACK_DISTANCE_MAX = 25
    export const LOOP_INTERVAL_MS = 100
    export const SEARCH_TIMEOUT_MS = 15000
}
