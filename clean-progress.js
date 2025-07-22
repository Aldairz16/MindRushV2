// Script para limpiar datos de progreso corruptos
console.log("Limpiando localStorage de datos de progreso corruptos...");

// Limpiar todos los datos de progreso de curso que puedan estar corruptos
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('course_progress_')) {
    console.log(`Eliminando datos corruptos de: ${key}`);
    localStorage.removeItem(key);
  }
});

console.log("Datos corruptos eliminados. Recargar la página para ver los cambios.");
