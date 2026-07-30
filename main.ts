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

    console.log("State: " + current)
    console.log("IR H: " + snapshot.infraredHeading)
    console.log("IR P: " + snapshot.infraredProximity)
    console.log("Touch: " + snapshot.touchPressed)

    if (current == RobotSoccer.RobotState.RECOVER && previousState != RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.reset()
    }
    previousState = current

    if (current == RobotSoccer.RobotState.SEARCH) {
        searchStrategy.run(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.APPROACH || current == RobotSoccer.RobotState.ATTACK) {
        attackStrategy.run(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.DEFEND) {
        defenseStrategy.run(snapshot, movement)
    } else if (current == RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.run(snapshot, movement)
    }
    pause(RobotSoccer.Config.LOOP_INTERVAL_MS)
})
