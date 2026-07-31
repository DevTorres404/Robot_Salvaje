# Comportamiento del Robot (Robot Soccer EV3)

El robot está programado utilizando una **Máquina de Estados (State Machine)**. Esto significa que en cada momento el robot se encuentra en un estado o "modo" específico, y toma decisiones de transición basadas en las lecturas de los sensores (Infrarrojo y Color).

A continuación se detalla el ciclo de vida y la lógica de cada estado.

## Zonas de la Cancha (GPS por Color)
El robot utiliza el sensor de color apuntando al suelo para saber en qué parte de la cancha está. Las zonas configuradas son:
- **Verde (`CENTER_ZONE`)**: Zona neutral / centro de la cancha.
- **Amarillo (`OPPONENT_ZONE`)**: Área del arco rival.
- **Azul (`OWN_ZONE`)**: Área del arco propio.
- **Negro (`CORNER_ZONE`)**: Bordes laterales y esquinas.
- **Blanco (`OUT_OF_BOUNDS`)**: Línea perimetral de la cancha (fuera de límites).

---

## Controles Manuales (Botones del Ladrillo EV3)
- **Botón Abajo (`buttonDown`)**: Resetea el giroscopio interno y activa el estado `INIT` (lo cual dispara el `RUSH`). **Muy útil para cuando el simulador (VRT) teletransporta el robot al centro tras un gol o salida de cancha**.
- **Botón Arriba (`buttonUp`)**: Fuerza al robot a entrar en estado `SEARCH`.
- **Botón Enter (`buttonEnter`)**: Fuerza al robot a entrar en estado `STOP` y detiene todos los motores.

---

## Estados del Robot

### 1. INIT (Inicio)
- **Acción**: El robot espera un tiempo de calentamiento (`pause(500)`) para asegurarse de que todos los sensores del simulador (VRT) hayan cargado correctamente.
- **Transición**: Automáticamente pasa al estado `RUSH`.

### 2. RUSH (Ataque Kamikaze Inicial)
- **Acción**: El robot arranca los motores a velocidad máxima en línea recta hacia adelante, pero **utilizando una corrección giroscópica** (a través de la rotación de las ruedas) para mantener siempre el rumbo exacto de 0° (apuntando al arco rival) y evitar desviarse. Este ataque inicial dura un máximo de 4 segundos. Durante este estado, el robot **ignora** la línea blanca de fuera de límites (para poder salir del círculo central).
- **Transiciones**:
  - Si choca físicamente contra algo (ej. el otro robot), pasa a `RECOVER`.
  - Si llega a la zona Amarilla (arco rival), frena el pique y pasa a `SEARCH`.
  - Si detecta la pelota de frente, pasa a `APPROACH`.
  - Si pasan 4 segundos sin que pase nada, pasa a `SEARCH`.

### 3. SEARCH (Búsqueda o Escaneo)
- **Acción**: El robot realiza un escaneo tipo "radar" girando sobre su eje. Primero escanea cerca (±30°), luego a media distancia (±70°), y luego de forma amplia (±120°). Si termina de girar y no ve nada, avanza un poco hacia adelante y repite el proceso.
- **Evitación de Esquinas**: Si durante el avance pisa la zona Negra, retrocede y gira hacia el centro para no quedarse trabado contra la pared.
- **Transiciones**:
  - Si ve la pelota, pasa a `APPROACH`.
  - Si busca durante más de 15 segundos (`SEARCH_TIMEOUT`) sin encontrar nada, pasa a `DEFEND`.

### 4. APPROACH (Acercamiento)
- **Acción**: El robot ha detectado la pelota a lo lejos y se acerca a ella corrigiendo su trayectoria con el sensor infrarrojo para no perderla de vista. 
- **Transiciones**:
  - Si se acerca lo suficiente y confirma que la pelota está pegada, pasa a `ATTACK`.
  - Si la pelota desaparece de los sensores repentinamente, pasa a `RECOVER` para tomar distancia y volver a buscar.

### 5. ATTACK (Ataque y Control)
- **Acción**: El robot atrapa la pelota (usando el motor auxiliar) y la asegura. Una vez asegurada, gira buscando el arco rival (Rumbo 0°) y avanza para patear.
- **Lógica de Zonas Avanzada**:
  - **Modo Gol**: Si entra a la zona Amarilla, deja de intentar girar y embiste con todo hacia adelante para asegurar el gol.
  - **Modo Despeje**: Si agarra la pelota dentro de su propia zona Azul, la patea inmediatamente hacia adelante para despejar el peligro.
- **Transiciones**:
  - Si patea con éxito, vuelve a `SEARCH`.
  - Si pierde la pelota mientras la lleva, tiene un "período de gracia" de 400ms. Si no la recupera, pasa a `SEARCH`.

### 6. DEFEND (Retirada Táctica)
- **Acción**: Se activa cuando el robot lleva mucho tiempo perdido (15s en `SEARCH`). El robot se alinea mirando hacia el arco rival y **retrocede en línea recta** durante un máximo de 10 segundos, asegurándose de volver a su mitad de la cancha.
- **Transiciones**:
  - Si en el camino de regreso detecta la pelota, aborta la defensa y pasa a `APPROACH`.
  - Si pisa su zona Azul (`OWN_ZONE`), frena el retroceso y pasa a `SEARCH` desde una posición segura.
  - Si pasan los 10 segundos, frena y pasa a `SEARCH`.

### 7. RECOVER (Maniobra Evasiva para Paredes y Arcos)
- **Acción**: Es un estado de emergencia. Se activa cuando el robot pisa la línea Blanca (fuera de límites) o cuando el **sensor infrarrojo principal** detecta un obstáculo y el robot verifica que es una pared o el arco (leyendo colores Negro, Azul o Amarillo, o tocando los bordes con el sensor de piso). El robot retrocede violentamente a máxima velocidad (`RECOVERY_SPEED`) durante una fracción de segundo y luego da un giro rápido para salir del peligro sin quedarse atascado.
- **Transición**: Automáticamente pasa a `SEARCH` una vez finalizada la maniobra.

### 8. KAMIKAZE (Ataque al Rival)
- **Acción**: Si el **sensor infrarrojo principal** detecta un obstáculo muy cerca de frente, pero el robot verifica que **no es la pared ni el arco** (es decir, está en la zona Verde y no lee colores de los bordes/arcos), asume que chocó contra el robot enemigo. Acelera hacia adelante a máxima velocidad y activa el motor auxiliar para intentar robarle la pelota.
- **Transiciones**:
  - Si durante el choque logra ver la pelota blanca, pasa a `APPROACH`.
  - Si el sensor de piso toca un borde (Negro o Blanco) o el sensor frontal llega a leer el color de la pared/arco, aborta el ataque inmediatamente y pasa a `RECOVER`.
  - Si pasan 2.5 segundos sin ver la pelota, aborta y pasa a `RECOVER`.

---
*Este documento resume la lógica principal de `stateMachine.ts`, `sensors.ts` y las estrategias de cada fase.*
