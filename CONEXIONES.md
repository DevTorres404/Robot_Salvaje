# 🤖 Guía de Conexiones - Robot Soccer EV3

Para que el robot funcione correctamente, las conexiones físicas de los cables en el ladrillo EV3 **deben coincidir exactamente** con lo que espera el código.

A continuación te detallo cómo tenés que conectar cada motor y sensor, o cómo cambiar el código si decidís enchufarlos en otro lado.

---

## 🔌 Conexiones Físicas Requeridas (Por Defecto)

Basado en la configuración actual de tu archivo `config.ts`, esta es la forma en la que tenés que enchufar los cables al EV3:

### ⚙️ Motores (Puertos con Letras)
*   **Puerto A:** Motor Mediano (Pateador / Dribbler / Auxiliar)
*   **Puerto B:** Motor Grande (Rueda Izquierda)
*   **Puerto C:** Motor Grande (Rueda Derecha)
### 📡 Sensores (Puertos con Números)
*   **Puerto 1:** Sensor Infrarrojo (Buscador de pelota)
*   **Puerto 2:** Sensor Color
*   **Puerto 3:** Sensor Color

---

## 🛠️ ¿Qué pasa si armé el robot distinto? (Cómo cambiar el código)

Si los cables ya te quedaron conectados en otros puertos por cómo armaste el robot, **no hace falta que desarmes todo**. Podés cambiar el código para que se adapte a tu armado físico.

Para hacerlo:
1. Abrí el archivo `config.ts`.
2. Buscá las líneas donde se definen los motores y sensores (líneas 4 a 10).
3. Cambiá la letra o número final de la propiedad.

### Ejemplo - Cambiar los motores de las ruedas:
Si en tu robot la Rueda Izquierda está en el puerto **C** y la Rueda Derecha está en el puerto **B**, tenés que cambiar esto en `config.ts`:

**De esto:**
```typescript
export const LEFT_MOTOR = motors.largeB
export const RIGHT_MOTOR = motors.largeC
```

**A esto:**
```typescript
export const LEFT_MOTOR = motors.largeC
export const RIGHT_MOTOR = motors.largeB
```

> **Importante:** Si usás la interfaz visual de bloques de MakeCode, al cambiar un motor desde el menú desplegable (como el de tu captura de pantalla), MakeCode automáticamente actualiza el código TypeScript por detrás. Pero si estás programando en TypeScript (como en este repo), ¡la fuente de la verdad es el archivo `config.ts`!
