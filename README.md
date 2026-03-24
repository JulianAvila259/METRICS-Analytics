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
## 🛠️ Guía de Colaboración (Git Flow)

Para mantener la integridad de **METRIX**, seguimos un flujo de trabajo basado en ramas (branches). **Nadie debe trabajar ni subir cambios directamente a la rama `main`.**

### 1. Preparación
Antes de empezar cualquier tarea, asegúrate de tener la última versión del proyecto:
* `git checkout main`
* `git pull origin main`

### 2. Crear una rama nueva
Crea una rama descriptiva para tu tarea. Usa prefijos como `feat-` para funciones nuevas o `fix-` para corregir errores:
```bash
git checkout -b nombre-de-tu-rama