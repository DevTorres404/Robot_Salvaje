let hardware = new RobotSoccer.EV3RobotHardware()
let movement = new RobotSoccer.Movement(hardware)
let sensorsRuntime = new RobotSoccer.Sensors(hardware)
let stateMachine = new RobotSoccer.StateMachine(hardware)
let searchStrategy = new RobotSoccer.SearchStrategy()
let attackStrategy = new RobotSoccer.AttackStrategy()
let defenseStrategy = new RobotSoccer.DefenseStrategy()
let recoveryStrategy = new RobotSoccer.RecoveryStrategy()
let previousState = RobotSoccer.RobotState.INIT

brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    stateMachine.transition(RobotSoccer.RobotState.STOP)
    hardware.stopAll()
})

brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    stateMachine.transition(RobotSoccer.RobotState.SEARCH)
})

forever(function () {
    let snapshot = sensorsRuntime.read()
    stateMachine.update(snapshot, sensorsRuntime, movement)

    let current = stateMachine.current()
    if (control.millis() % 1000 < 100) {
        console.log("St:" + current + " IR:" + snapshot.infraredProximity
            + " C:" + snapshot.detectedColor + " H:" + Math.round(movement.headingDegrees()))
    }

    if (current == RobotSoccer.RobotState.RECOVER && previousState != RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.reset()
    }
    if (current == RobotSoccer.RobotState.ATTACK && previousState != RobotSoccer.RobotState.ATTACK) {
        attackStrategy.reset()
    }
    previousState = current

    if (current == RobotSoccer.RobotState.SEARCH) {
        searchStrategy.run(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.APPROACH) {
        attackStrategy.approach(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.ATTACK) {
        attackStrategy.run(snapshot, movement)
        if (attackStrategy.finished()) {
            stateMachine.transition(RobotSoccer.RobotState.SEARCH)
        }
    } else if (current == RobotSoccer.RobotState.DEFEND) {
        defenseStrategy.run(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.run(snapshot, movement)
    }
    pause(RobotSoccer.Config.LOOP_INTERVAL_MS)
})
