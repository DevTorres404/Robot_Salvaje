namespace RobotSoccer {
    export namespace Config {
        // Configuración física oficial del robot. No se importan módulos del proyecto.
        export const LEFT_MOTOR = motors.largeB
        export const RIGHT_MOTOR = motors.largeC
        export const AUXILIARY_MOTOR = motors.mediumA
        export const INFRARED_SENSOR = sensors.infrared1
        export const GYRO_SENSOR = sensors.gyro2
        export const TOUCH_SENSOR = sensors.touch3

        // Los signos adaptan la orientación mecánica de cada actuador.
        export const LEFT_MOTOR_DIRECTION = -1
        export const RIGHT_MOTOR_DIRECTION = -1
        export const AUXILIARY_MOTOR_DIRECTION = 1

        export const WHEEL_DIAMETER_MM = 56
        export const WHEEL_RADIUS_MM = WHEEL_DIAMETER_MM / 2
        export const WHEEL_CIRCUMFERENCE_MM = Math.PI * WHEEL_DIAMETER_MM
        export const DRIVE_TRACK_WIDTH_MM = 120

        export const DRIVE_SPEED = 100
        export const TURN_SPEED = 60
        export const AUXILIARY_SPEED = 100
        export const SEARCH_TURN_MS = 350
        export const RECOVERY_REVERSE_MS = 450
        export const RECOVERY_TURN_MS = 300
        // El IR sensor está en X=21.95, el centro del robot en X=123.8.
        // El offset ~8 compensa esa diferencia a ~300mm de distancia.
        export const IR_HEADING_OFFSET = 8
        export const IR_BALL_SEEN_MAX = 50
        export const IR_ATTACK_DISTANCE_MAX = 15
        export const LOOP_INTERVAL_MS = 100
        export const KICK_DURATION_MS = 300
        export const SEARCH_TIMEOUT_MS = 15000
    }}
