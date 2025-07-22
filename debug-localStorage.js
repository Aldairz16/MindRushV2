// Debug localStorage - pero localStorage no está disponible en Node.js
// Necesitaremos verificar esto en el navegador

console.log("Este script está destinado para ejecutarse en el navegador, no en Node.js");
console.log("Para debuggear localStorage, abre la consola del navegador y ejecuta:");
console.log("const userData = localStorage.getItem('user');");
console.log("if (userData) { const user = JSON.parse(userData); console.log('User progress data:', user.progress); }");
