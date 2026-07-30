namespace RobotSoccer {
    export namespace Config {
        // Configuración física oficial del robot. No se importan módulos del proyecto.
        export const LEFT_MOTOR = motors.largeB
        export const RIGHT_MOTOR = motors.largeC
        export const AUXILIARY_MOTOR = motors.mediumA
        export const INFRARED_SENSOR = sensors.infrared1
        export const COLOR_SENSOR = sensors.color4
        export const BALL_COLOR = ColorSensorColor.White
        // Los signos adaptan la orientación mecánica de cada actuador.
        export const LEFT_MOTOR_DIRECTION = -1
        export const RIGHT_MOTOR_DIRECTION = -1
        export const AUXILIARY_MOTOR_DIRECTION = 1

        export const WHEEL_DIAMETER_MM = 56
        export const WHEEL_RADIUS_MM = WHEEL_DIAMETER_MM / 2
        export const WHEEL_CIRCUMFERENCE_MM = Math.PI * WHEEL_DIAMETER_MM
        export const DRIVE_TRACK_WIDTH_MM = 120

        export const DRIVE_SPEED = 70
        export const BALL_SECURE_SPEED = 55
        export const BALL_SECURE_MS = 350
        export const BALL_HOOK_SPEED = 45
        export const ATTACK_DRIVE_SPEED = 100
        export const TURN_SPEED = 75
        export const AUXILIARY_SPEED = 100
        export const SEARCH_NEAR_SWEEP_DEGREES = 30
        export const SEARCH_MID_SWEEP_DEGREES = 70
        export const SEARCH_WIDE_SWEEP_DEGREES = 120
        export const SEARCH_TURN_SPEED = 50
        export const SEARCH_ALIGN_TOLERANCE_DEGREES = 6
        export const BALL_ALIGN_SWEEP_DEGREES = 12
        export const BALL_VERIFY_MS = 2200
        export const RECOVERY_REVERSE_MS = 325
        export const RECOVERY_TURN_MS = 240
        export const IR_BALL_SEEN_MAX = 45
        export const IR_ATTACK_DISTANCE_MAX = 15
        export const LOOP_INTERVAL_MS = 40
        export const KICK_DURATION_MS = 300
        // El rumbo 0 se registra al iniciar: el robot debe comenzar mirando al arco rival.
        export const GOAL_HEADING_DEGREES = 0
        export const GOAL_ALIGN_TOLERANCE_DEGREES = 12
        export const GOAL_ALIGN_SPEED = 20
        export const GOAL_CARRY_MS = 1300
        export const GOAL_CARRY_MAX_MS = 2200
        export const SHOT_STRAIGHT_MS = 250
        export const BALL_LOST_GRACE_MS = 400
        export const ATTACK_TIMEOUT_MS = 3200
        export const SEARCH_TIMEOUT_MS = 15000
        export const DEFENSE_REVERSE_SPEED = 45
        export const DEFENSE_STEER_MAX = 12
        export const DEFENSE_ARC_DEGREES = 12
        export const DEFENSE_ARC_PERIOD_MS = 600
        export const DEFEND_DURATION_MS = 3500
    }}
