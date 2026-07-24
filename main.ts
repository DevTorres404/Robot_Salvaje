let runtime = new RobotSoccer.EV3Runtime()
let movement = new RobotSoccer.Movement(runtime)
let sensorsRuntime = new RobotSoccer.Sensors()
let stateMachine = new RobotSoccer.StateMachine()
let searchStrategy = new RobotSoccer.SearchStrategy()
let attackStrategy = new RobotSoccer.AttackStrategy()
let defenseStrategy = new RobotSoccer.DefenseStrategy()
let recoveryStrategy = new RobotSoccer.RecoveryStrategy()

brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    stateMachine.transition(RobotSoccer.RobotState.STOP)
    runtime.stopAll()
})

brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    stateMachine.transition(RobotSoccer.RobotState.SEARCH)
})

forever(function () {
    let snapshot = sensorsRuntime.read()
    stateMachine.update(snapshot, sensorsRuntime, movement)

    if (stateMachine.current() == RobotSoccer.RobotState.SEARCH) {
        searchStrategy.run(snapshot, movement)
    } else if (stateMachine.current() == RobotSoccer.RobotState.APPROACH || stateMachine.current() == RobotSoccer.RobotState.ATTACK) {
        attackStrategy.run(snapshot, movement)
    } else if (stateMachine.current() == RobotSoccer.RobotState.DEFEND) {
        defenseStrategy.run(snapshot, movement)
    } else if (stateMachine.current() == RobotSoccer.RobotState.RECOVER) {
        recoveryStrategy.run(snapshot, movement)
    }
    pause(RobotSoccer.LOOP_INTERVAL_MS)
})
