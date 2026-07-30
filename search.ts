namespace RobotSoccer {
    export class SearchStrategy implements Strategy {
        run(snapshot: SensorSnapshot, movement: Movement) {
            // Patrón de búsqueda: gira, avanza, gira al otro lado
            let time = control.millis() % 4000;
            
            if (time < 1500) {
                movement.turnLeft();   // Gira buscando la pelota
            } else if (time < 2500) {
                movement.forward();    // Avanza para explorar el mapa
            } else {
                movement.turnRight();  // Gira hacia el otro lado
            }
        }
    }
}
