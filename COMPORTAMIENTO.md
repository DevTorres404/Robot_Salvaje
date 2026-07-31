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
- **Acción**: El robot arranca los motores a velocidad máxima en línea recta hacia adelante, pero **utilizando una corrección giroscópica** (a través de la rotación de las ruedas) para mantener siempre el rumbo exacto de 0° (apuntando al arco rival) y evitar desviarse.
- **Transiciones**:
  - Si detecta la pelota de frente, pasa a `APPROACH`.
  - Si choca físicamente contra algo (ej. el otro robot), pasa a `RECOVER`.
  - Si llega a la zona Amarilla (arco rival) sin ver nada, aborta el Rush y pasa a `DEFEND` para volver a su arco.
  - Si pasan 4 segundos sin que pase nada, asume que falló y pasa a `DEFEND` para volver a su arco.

### 3. SEARCH (Búsqueda Inteligente)
- **Acción**: El robot escanea la cancha girando sobre su eje. Primero busca cerca (±30°), luego a media distancia (±70°), y luego de forma amplia (±120°). Si termina de girar y no ve la pelota, avanza hacia adelante y repite.
- **Evitación Proactiva de Obstáculos**: Si durante el avance el sensor de color frontal detecta Negro (Pared), Amarillo (Arco Rival) o Azul (Arco Propio), el robot retrocede y gira ANTES de chocar físicamente. Si pisa la zona Negra, también hace lo mismo.
- **Transiciones**:
  - Si ve la pelota, pasa a `APPROACH`.
  - Si busca durante más de 15 segundos (`SEARCH_TIMEOUT`) sin encontrar nada, pasa a `DEFEND`.

### 4. APPROACH (Acercamiento)
- **Acción**: El robot ha detectado la pelota a lo lejos y se acerca a ella corrigiendo su trayectoria con el sensor infrarrojo para no perderla de vista. 
- **Transiciones**:
  - Si se acerca lo suficiente y confirma que la pelota está pegada, pasa a `ATTACK`.
  - Si la pelota desaparece de los sensores repentinamente, frena y pasa a `RECOVER` para tomar distancia y volver a buscar.

### 5. ATTACK (Ataque Salvaje y Dominio)
- **Acción**: El robot embiste a toda velocidad y atrapa la pelota con el motor auxiliar a máxima potencia. A diferencia de las versiones anteriores, no frena: arrasa con todo para arrancar la pelota de las garras del rival. Una vez asegurada, se alinea buscando el arco rival (Rumbo 0°) y la acarrea por un máximo de 2.2 segundos antes de patear.
- **Lógica de Zonas Avanzada**:
  - **Modo Gol**: Si entra a la zona Amarilla con la pelota, deja de intentar girar y embiste en línea recta contra el arco rival por un máximo de 2 segundos para asegurar que la pelota entre.
  - **Modo Despeje**: Si agarra la pelota dentro de su propia zona Azul, la patea inmediatamente hacia adelante para despejar el peligro.
- **Transiciones**:
  - Si patea con éxito o completa el Modo Gol, inicia su retirada táctica pasando automáticamente a `DEFEND`.
  - Si pierde la pelota y se agota el "período de gracia" de 400ms, aborta el ataque.

### 6. DEFEND (Retirada Táctica)
- **Acción**: Es el estado de repliegue defensivo. Se activa cuando el robot hace un disparo, falla el Rush, o lleva mucho tiempo perdido. El robot se alinea mirando hacia el arco rival y **pone reversa a toda velocidad** en línea recta hacia su mitad de la cancha.
- **Transiciones**:
  - Si pisa su zona Azul (`OWN_ZONE`), comprende que llegó a la base, frena el retroceso y pasa a `SEARCH` desde una posición defensiva segura.
  - Si en el camino de regreso detecta la pelota de frente, aborta la defensa y pasa a `APPROACH`.
  - Si pasan 10 segundos de retroceso continuo, frena y pasa a `SEARCH`.

### 7. RECOVER (Maniobra Evasiva para Paredes)
- **Acción**: Es el estado de emergencia para salir de atascos. Se activa cuando el robot pisa la línea Blanca (fuera de límites) o cuando choca físicamente contra sus **propias paredes o arco** (leyendo Azul o Negro y no estando en el centro). El robot retrocede violentamente a máxima velocidad y luego da un giro rápido para salir del peligro.
- **Transición**: Automáticamente pasa a `SEARCH` una vez finalizada la maniobra.

### 8. KAMIKAZE (Embestida Definitiva)
- **Acción**: Se activa si el robot choca contra un obstáculo en el **Centro de la cancha (Verde)** o en el **Área Rival (Amarilla)**. Como en esas zonas no hay paredes propias, asume que es el robot enemigo o el arco rival. Acelera hacia adelante a máxima velocidad y activa la succión para robarle la pelota a la fuerza o empujarla al fondo de la red.
- **Transiciones**:
  - Si durante la embestida logra ver la pelota blanca, pasa a `APPROACH`.
  - Si empuja accidentalmente la pared propia en otra zona, aborta el ataque inmediatamente y pasa a `RECOVER`.
  - Si pasan 2.5 segundos de empuje continuo sin resultados, aborta y pasa a `RECOVER`.
