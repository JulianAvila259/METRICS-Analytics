# METRICS Analytics ⚽📊
> **Mide tu juego. Supera tus límites.**
---
## 📝 Misión
Brindar a los deportistas una herramienta de análisis de alto rendimiento para medir y potenciar su nivel competitivo, a través de una plataforma innovadora basada en inteligencia y visión artificial que transforma videos convencionales en datos métricos precisos.
---
## 🚀 Visión (2031)
Ser la aplicación líder en análisis deportivo, creando experiencias únicas y momentos divertidos con partidos o jugadas, incluyendo funciones de narración y gemelos digitales.
---
## 🚀 Estructura del Proyecto

El repositorio está organizado siguiendo estándares de ingeniería para separar la lógica de datos de la aplicación móvil:

* **`/data`**: Almacenamiento de datasets y archivos procesados.
* **`/docs`**: Documentación técnica y académica.
* **`/src`**: Código fuente.
    * **`/mobile-app`**: Aplicación móvil desarrollada con **React Native + Expo**.
        * `App.js`: Punto de entrada de la aplicación.
        * `/screens`: Pantallas de la interfaz (Login, Dashboard, etc.).
        * `/tests`: Pruebas unitarias y de integración.

---

## ⚖️ Licencia
Este proyecto está bajo la Licencia MIT.
---
# 🚀 Guía de Flujo de Trabajo con Ramas Protegidas

Para mantener la estabilidad de nuestro código, la rama principal (**main/master**) está protegida. Sigue estos tres pasos para integrar tus cambios correctamente:

---

### 1. Sincronizar el Proyecto
Antes de empezar, asegúrate de tener la versión más reciente del código para evitar conflictos innecesarios.

* **Cámbiate a la rama principal:**
    ```bash
    git checkout main
    ```
* **Actualiza tu repositorio local:**
    ```bash
    git pull origin main
    ```

---

### 2. Crear y Trabajar en una Rama Nueva
Nunca trabajes directamente sobre una rama protegida. Crea una rama independiente para tus tareas.

* **Crea y salta a la nueva rama:**
    ```bash
    git checkout -b nombre-de-tu-rama
    ```
* **Realiza tus cambios y guarda el progreso:**
    ```bash
    git add .
    git commit -m "Descripción breve de lo que hiciste usando los conventional commits"
    ```

---

### 3. Subir Cambios y Solicitar Revisión (Pull Request)
Una vez terminado el trabajo, sube tu rama al servidor para que el equipo pueda revisarla.

* **Sube tu rama a GitHub:**
    ```bash
    git push origin nombre-de-tu-rama
    ```
* **Finaliza en la Web:** Ve a la página del repositorio en GitHub. Verás un banner amarillo que dice **"Compare & pull request"**. Haz clic en él, describe tus cambios y solicita la revisión para que tus compañeros puedan aprobar e integrar el código.

---

> **Nota:** Recuerda que al estar la rama protegida, no podrás hacer `merge` tú mismo hasta que se cumplan los requisitos (aprobaciones o tests pasados).
---
## 🤝 Guía de Contribución

Para mantener un historial de cambios limpio y profesional, utilizamos **Conventional Commits**. Por favor, inicia tus mensajes de commit con una de estas etiquetas:

- `feat:` Nueva funcionalidad (ej: `feat: detección de balón con YOLO`).
- `fix:` Corrección de un error (ej: `fix: error en cálculo de metros`).
- `docs:` Cambios en documentación (ej: `docs: actualizar análisis DOFA`).
- `style:` Cambios visuales o de formato (no afectan lógica).
- `refactor:` Optimización de código existente.
- `chore:` Tareas de mantenimiento (ej: `chore: actualizar .gitignore`).

**Ejemplo:** `git commit -m "feat: implementar matriz de homografía"`
---
