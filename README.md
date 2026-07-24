# Robot Soccer EV3 MakeCode

Runtime compacto para Microsoft MakeCode EV3, derivado conceptualmente de `soccer-robot`. Genera un programa `.uf2` para EV3 o Virtual Robot Toolkit (VRT); la arquitectura completa permanece en el proyecto maestro.

## Antes de ejecutar

Los documentos maestros confirman dos motores grandes, un motor mediano y un sensor infrarrojo, pero **no sus puertos**. En `config.ts` los puertos siguen como `TODO_CONFIRM` y `HARDWARE_CONFIRMED` está en `false`, por lo que el programa no moverá motores accidentalmente.

Después de comprobar físicamente cada cable con potencia baja:

1. Actualice los valores `*_PORT` de `config.ts`.
2. Sustituya las tres vinculaciones de `motors.ts` y la de IR de `sensors.ts` por los puertos confirmados.
3. Cambie `HARDWARE_CONFIRMED` a `true`.
4. Calibre los umbrales IR de `config.ts` en la cancha o VRT.

## Importar y compilar

1. Publique este directorio como un repositorio GitHub (no incluya los archivos de `soccer-robot` en él).
2. Abra [Microsoft MakeCode EV3](https://makecode.mindstorms.com/).
3. Seleccione **Import Project** → **Import URL** e introduzca la URL del repositorio GitHub.
4. Edite o compile el proyecto y pulse **Download** para generar el `.uf2`.
5. Copie el `.uf2` al EV3 o cárguelo en el flujo de Virtual Robot Toolkit.

El archivo `pxt.json` declara la dependencia estándar `core` y todos los `.ts`, requisito para que MakeCode lo detecte como proyecto válido al importarlo desde GitHub.

## Controles

- Botón **Up**: inicia/reanuda `SEARCH`.
- Botón **Enter**: detiene todos los motores y pasa a `STOP`.

## Diseño

La FSM y sus transiciones están en `stateMachine.ts`; las estrategias básicas están en `attack.ts`, `defense.ts`, `search.ts` y `recovery.ts`. Consulte [PROJECT_RELATION.md](PROJECT_RELATION.md) para el límite entre el modelo maestro y este runtime.
