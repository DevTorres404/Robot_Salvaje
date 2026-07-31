let hardware = new RobotSoccer.EV3RobotHardware()
let movement = new RobotSoccer.Movement(hardware)
let sensorsRuntime = new RobotSoccer.Sensors(hardware)
let stateMachine = new RobotSoccer.StateMachine(hardware)
let rushStrategy = new RobotSoccer.RushStrategy()
let searchStrategy = new RobotSoccer.SearchStrategy()
let attackStrategy = new RobotSoccer.AttackStrategy()
let defenseStrategy = new RobotSoccer.DefenseStrategy()
let recoveryStrategy = new RobotSoccer.RecoveryStrategy()
let kamikazeStrategy = new RobotSoccer.KamikazeStrategy()
let previousState = RobotSoccer.RobotState.INIT

brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    stateMachine.transition(RobotSoccer.RobotState.STOP)
    hardware.stopAll()
})

brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    stateMachine.transition(RobotSoccer.RobotState.SEARCH)
})

brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    movement.resetHeading()
    stateMachine.transition(RobotSoccer.RobotState.INIT)
})

// Warmup delay para que los sensores de VRT se inicialicen correctamente
pause(500)

forever(function () {
    let snapshot = sensorsRuntime.read()
    stateMachine.update(snapshot, sensorsRuntime, movement)

    let current = stateMachine.current()
    if (control.millis() % 1000 < 100) {
        console.log("St:" + current + " IR:" + snapshot.infraredProximity
            + " C:" + snapshot.detectedColor + " G:" + snapshot.groundColor
            + " H:" + Math.round(movement.headingDegrees()))
    }

    if (current == RobotSoccer.RobotState.RECOVER && previousState != RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.reset(stateMachine.recoveryMovesForward())
    }
    if (current == RobotSoccer.RobotState.ATTACK && previousState != RobotSoccer.RobotState.ATTACK) {
        attackStrategy.reset()
    }
    if (current == RobotSoccer.RobotState.APPROACH && previousState != RobotSoccer.RobotState.APPROACH) {
        attackStrategy.resetApproach()
    }
    if (current != RobotSoccer.RobotState.ATTACK && previousState == RobotSoccer.RobotState.ATTACK) {
        attackStrategy.cancel(movement)
    }
    if (current == RobotSoccer.RobotState.SEARCH && previousState != RobotSoccer.RobotState.SEARCH) {
        searchStrategy.reset()
    }
    if (current == RobotSoccer.RobotState.DEFEND && previousState != RobotSoccer.RobotState.DEFEND) {
        defenseStrategy.reset()
    }
    previousState = current

    if (current == RobotSoccer.RobotState.RUSH) {
        rushStrategy.run(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.SEARCH) {
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
    } else if (current == RobotSoccer.RobotState.KAMIKAZE) {
        kamikazeStrategy.run(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.run(snapshot, movement)
    }
    pause(RobotSoccer.Config.LOOP_INTERVAL_MS)
})
