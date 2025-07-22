# 🎓 MindRush - Instrucciones de Uso

## 🔐 Cuentas de Demo Disponibles

### Estudiante
- **Email:** `student@mindrush.com`
- **Contraseña:** `password`
- **Acceso a:** Dashboard del estudiante, Explorar Cursos, Mi Progreso

### Profesor
- **Email:** `teacher@mindrush.com`
- **Contraseña:** `password`
- **Acceso a:** Gestión de Cursos, Crear Curso, Estudiantes, Analíticas, Tareas

### Administrador
- **Email:** `admin@mindrush.com`
- **Contraseña:** `password`
- **Acceso a:** Panel de administración (próximamente)

## ✅ Problemas Solucionados

1. **Estado de autenticación unificado**: Se eliminó la duplicación de estado entre `App.tsx` y `AuthContext`
2. **Persistencia de sesión**: La sesión ahora se mantiene al recargar la página
3. **Mejor manejo de errores**: Se agregaron mensajes de error claros en el login
4. **Tipado mejorado**: Se corrigieron los tipos TypeScript para evitar errores
5. **Componentes corregidos**: Se solucionaron importaciones faltantes

## 🚀 Cómo Usar

1. **Iniciar la aplicación:**
   ```bash
   npm run dev
   ```

2. **Acceder al sistema:**
   - Visita `http://localhost:5174/`
   - Usa cualquiera de las cuentas de demo listadas arriba
   - O haz clic en los botones de demostración para auto-completar credenciales

3. **Navegación:**
   - **Dashboard**: Vista principal con estadísticas
   - **Para Estudiantes:**
     - **Explorar Cursos**: Sistema progresivo con mapas de niveles por curso
     - **Mi Progreso**: Seguimiento detallado de aprendizaje
   - **Para Docentes:**
     - **Mis Cursos**: Gestión de cursos creados
     - **Crear Curso**: Herramienta de creación de contenido
     - **Estudiantes**: Gestión y seguimiento de estudiantes
     - **Analíticas**: Métricas de rendimiento
     - **Tareas**: Gestión de evaluaciones

4. **Cerrar sesión:**
   - Haz clic en "Cerrar Sesión" en la barra lateral

## 📱 Funcionalidades

### ✅ Estudiantes
- **Mapa de Niveles**: Sistema progresivo estilo Duolingo con 10 niveles
- Dashboard interactivo con estadísticas personales
- Explorador de cursos con mapas de niveles progresivos estilo Duolingo
- Sistema de progreso con XP y niveles por curso
- Seguimiento detallado de actividad y rendimiento

### ✅ Docentes  
- Gestión completa de cursos con estadísticas
- Creador de cursos intuitivo con módulos y lecciones
- Panel de estudiantes con métricas de rendimiento
- Herramientas de analíticas (próximamente)
- Sistema de tareas y evaluaciones (próximamente)

### ✅ Sistema General
- Login/Logout funcional con roles diferenciados
- Persistencia de sesión
- Navegación responsive adaptada por rol
- Interfaz moderna y accesible

## 🔧 Notas Técnicas

- La aplicación usa autenticación mock (no real)
- Los datos se almacenan localmente en localStorage
- La contraseña para todas las cuentas demo es `password`
