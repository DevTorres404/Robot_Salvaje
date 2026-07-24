# Relación con el proyecto maestro

`soccer-robot` es la fuente de verdad para la arquitectura, la FSM completa, los adaptadores, las pruebas y los documentos técnicos. Este repositorio no lo sustituye ni replica sus dependencias.

```text
soccer-robot (arquitectura y especificación)
        ↓ traducción limitada a APIs MakeCode EV3
Robot_Soccer_EV3_MakeCode (runtime)
        ↓ compilación desde MakeCode EV3
archivo .uf2
        ↓ carga/ejecución
Virtual Robot Toolkit o ladrillo EV3
```

La adaptación conserva los conceptos de movimiento, sensores, estrategias y FSM, pero no incorpora capas de simulación ni de infraestructura ajenas a MakeCode. VRT ejecuta el `.uf2`; no es un adaptador incluido en el código.

## Mapeo de la FSM

| Estado MakeCode | Origen conceptual |
| --- | --- |
| `INIT` | `BOOT` y preparación mínima |
| `SEARCH` | `SEARCH_BALL` |
| `APPROACH` | `TRACK_BALL` y alineación básica |
| `ATTACK` | captura/ataque simplificados |
| `DEFEND` | `DEFEND` |
| `RECOVER` | `RECOVER`/escape básico |
| `STOP` | `IDLE` o parada del operador |
| `ERROR` | `ERROR` |

Las transiciones ejecutables están en `stateMachine.ts`: inicio→búsqueda; pelota IR→aproximación; pelota cerca→ataque; pelota perdida→búsqueda; tiempo de búsqueda agotado→defensa; obstáculo/tacto→recuperación; recuperación terminada→búsqueda; botón Enter→parada.
