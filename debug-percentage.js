// Debug script para verificar el cálculo de porcentajes
const user = {
  progress: {
    "historia-universal-2024": {
      "completedModules": ["mod-1"],
      "progress": 50
    }
  }
};

const course = {
  id: "historia-universal-2024",
  modules: [
    { id: "mod-1", title: "Civilizaciones Antiguas" },
    { id: "mod-2", title: "Grecia y Roma Clásicas" }
  ]
};

// Simular el cálculo del componente
const courseProgress = user.progress[course.id];
const totalModules = course.modules?.length || 0;
const userCompletedModules = courseProgress?.completedModules || [];

// Solo contar módulos que realmente existen en el curso
const realModuleIds = course.modules?.map(m => m.id) || [];
const validCompletedModules = userCompletedModules.filter((moduleId) => 
  realModuleIds.includes(moduleId)
);
const completedModules = validCompletedModules.length;

// Usar progreso recalculado basado en módulos reales
const displayProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

console.log("Debug información:");
console.log("Total módulos:", totalModules);
console.log("Módulos completados por usuario:", userCompletedModules);
console.log("Módulos reales del curso:", realModuleIds);
console.log("Módulos válidos completados:", validCompletedModules);
console.log("Número de módulos completados:", completedModules);
console.log("Porcentaje calculado:", displayProgress);
