export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  category: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: number; // in hours
  rating: number;
  studentsEnrolled: number;
  thumbnail: string;
  tags: string[];
  objectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  completionRate: number;
  certificateEnabled: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'quiz' | 'project' | 'assignment';
  duration: number; // in minutes
  content: ModuleContent[];
  order: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  nodeType: 'theory' | 'trivia';
  triviaQuestions?: TriviaQuestion[];
}

export interface TriviaQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'type-answer' | 'select-image' | 'order-sequence' | 'multiple-select';
  options: string[];
  correctAnswer: number;
  correctAnswers?: number[]; // Para preguntas de múltiple selección
  correctText?: string; // Para preguntas de texto libre
  imageUrl?: string; // Para preguntas con imagen
  sequenceOrder?: number[]; // Para preguntas de ordenamiento
  explanation: string;
  timeLimit: number; // in seconds
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface ModuleContent {
  id: string;
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'resource';
  title: string;
  content: string;
  duration?: number;
  resources?: string[];
}

export const demoCourses: Course[] = [
  {
    id: 'js-advanced-2024',
    title: 'JavaScript Avanzado para Desarrolladores',
    description: 'Domina conceptos avanzados de JavaScript incluyendo ES6+, async/await, closures, prototypes y patrones de diseño modernos.',
    instructor: 'Prof. Carlos Rodríguez',
    instructorId: '2',
    category: 'programming',
    difficulty: 'Avanzado',
    duration: 40,
    rating: 4.8,
    studentsEnrolled: 234,
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['javascript', 'es6', 'async', 'programming', 'web-development'],
    objectives: [
      'Dominar características avanzadas de ES6+ como destructuring, spread operator y modules',
      'Implementar patrones de programación asíncrona con Promises y async/await',
      'Comprender closures, scope y el contexto de "this" en JavaScript',
      'Aplicar patrones de diseño modernos en aplicaciones JavaScript',
      'Optimizar el rendimiento del código JavaScript'
    ],
    prerequisites: [
      'Conocimientos básicos de JavaScript',
      'Experiencia con HTML y CSS',
      'Familiaridad con herramientas de desarrollo web'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Introducción a ES6+ y Características Modernas',
        description: 'Explora las nuevas características de JavaScript moderno',
        type: 'lesson',
        duration: 45,
        order: 1,
        nodeType: 'theory',
        content: [
          {
            id: 'content-1',
            type: 'video',
            title: 'Bienvenida al Curso',
            content: '<p>¡Bienvenido al curso de JavaScript Avanzado!</p><p>En este video introductorio aprenderás:</p><ul><li>Los objetivos principales del curso</li><li>Qué esperamos que logres al finalizar</li><li>La metodología que usaremos</li></ul><p>¡Prepárate para llevar tus habilidades de JavaScript al siguiente nivel!</p>',
            duration: 10
          },
          {
            id: 'content-2',
            type: 'text',
            title: 'Let, Const y Block Scope',
            content: '<h3>Variables en ES6+</h3><p>ES6 introdujo nuevas formas de declarar variables que resuelven problemas comunes de JavaScript:</p><h4>1. Let</h4><pre><code>let nombre = "Juan";\nif (true) {\n  let nombre = "María"; // Variable diferente\n  console.log(nombre); // "María"\n}\nconsole.log(nombre); // "Juan"</code></pre><h4>2. Const</h4><pre><code>const PI = 3.14159;\nconst usuario = { nombre: "Ana", edad: 25 };\n// PI = 3.14; // Error!\nusuario.edad = 26; // Esto sí está permitido</code></pre><h4>3. Block Scope</h4><p>A diferencia de <code>var</code>, <code>let</code> y <code>const</code> tienen alcance de bloque:</p><pre><code>for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100); // 0, 1, 2\n}</code></pre>',
            duration: 15
          },
          {
            id: 'content-3',
            type: 'interactive',
            title: 'Práctica: Destructuring',
            content: '<h3>Destructuring Assignment</h3><p>El destructuring te permite extraer valores de arrays y objetos de forma elegante:</p><h4>Array Destructuring:</h4><pre><code>const colores = ["rojo", "verde", "azul"];\nconst [primero, segundo] = colores;\nconsole.log(primero); // "rojo"</code></pre><h4>Object Destructuring:</h4><pre><code>const persona = { nombre: "Carlos", edad: 30, ciudad: "Madrid" };\nconst { nombre, edad } = persona;\nconsole.log(nombre); // "Carlos"</code></pre><p><strong>Ejercicio:</strong> Practica destructuring con diferentes estructuras de datos.</p>',
            duration: 20
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Programación Asíncrona Avanzada',
        description: 'Domina Promises, async/await y manejo de errores',
        type: 'lesson',
        duration: 60,
        order: 2,
        nodeType: 'trivia',
        triviaQuestions: [
          {
            id: 'q1',
            question: '¿Cuál es la principal ventaja de usar async/await sobre Promises?',
            type: 'multiple-choice',
            options: [
              'Es más rápido en ejecución',
              'Hace el código más legible y fácil de mantener',
              'Consume menos memoria',
              'No hay diferencias significativas'
            ],
            correctAnswer: 1,
            explanation: 'async/await hace que el código asíncrono se vea y se comporte más como código síncrono, mejorando la legibilidad.',
            timeLimit: 30,
            points: 100,
            difficulty: 'medium',
            category: 'JavaScript'
          },
          {
            id: 'q2',
            question: '¿Qué sucede si no usas await con una función async?',
            type: 'multiple-choice',
            options: [
              'Se ejecuta de forma síncrona',
              'Retorna una Promise pendiente',
              'Genera un error',
              'No pasa nada especial'
            ],
            correctAnswer: 1,
            explanation: 'Sin await, la función async retorna inmediatamente una Promise que puede estar pendiente de resolución.',
            timeLimit: 25,
            points: 150,
            difficulty: 'hard',
            category: 'JavaScript'
          },
          {
            id: 'q3',
            question: 'JavaScript es un lenguaje de programación compilado.',
            type: 'true-false',
            options: ['Verdadero', 'Falso'],
            correctAnswer: 1,
            explanation: 'JavaScript es un lenguaje interpretado, no compilado. Se ejecuta directamente en el navegador o en Node.js.',
            timeLimit: 15,
            points: 75,
            difficulty: 'easy',
            category: 'JavaScript'
          }
        ],
        content: []
      },
      {
        id: 'mod-3',
        title: 'Closures y Context (this)',
        description: 'Comprende conceptos avanzados de JavaScript',
        type: 'lesson',
        duration: 40,
        order: 3,
        nodeType: 'theory',
        content: [
          {
            id: 'content-4',
            type: 'text',
            title: 'Introducción a los Closures',
            content: '<h3>¿Qué es un Closure?</h3><p>Un closure es una función que tiene acceso a variables en su alcance exterior, incluso después de que la función exterior haya terminado de ejecutarse.</p><h4>Ejemplo Básico:</h4><pre><code>function crearContador() {\n  let contador = 0;\n  \n  return function() {\n    contador++;\n    return contador;\n  };\n}\n\nconst contador1 = crearContador();\nconsole.log(contador1()); // 1\nconsole.log(contador1()); // 2</code></pre>',
            duration: 15
          },
          {
            id: 'content-5',
            type: 'video',
            title: 'El Contexto "this" en JavaScript',
            content: '<p>En este video aprenderás cómo funciona "this" en diferentes contextos:</p><ul><li>Métodos de objeto</li><li>Arrow functions</li><li>Call, apply y bind</li><li>Casos comunes y errores típicos</li></ul>',
            duration: 18
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Evaluación Final',
        description: 'Pon a prueba todo tu conocimiento',
        type: 'quiz',
        duration: 30,
        order: 4,
        nodeType: 'trivia',
        triviaQuestions: [
          {
            id: 'q4',
            question: '¿Qué output produce este código?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
            type: 'multiple-choice',
            options: ['0 1 2', '3 3 3', '0 0 0', 'Error'],
            correctAnswer: 1,
            explanation: 'Con var, todas las funciones comparten la misma variable i, que al final del loop vale 3.',
            timeLimit: 30,
            points: 150,
            difficulty: 'hard',
            category: 'JavaScript'
          },
          {
            id: 'q5',
            question: 'Los closures pueden causar memory leaks si no se manejan correctamente.',
            type: 'true-false',
            options: ['Verdadero', 'Falso'],
            correctAnswer: 0,
            explanation: 'Verdadero. Los closures mantienen referencias a variables del scope exterior, lo que puede prevenir la recolección de basura.',
            timeLimit: 20,
            points: 100,
            difficulty: 'medium',
            category: 'JavaScript'
          }
        ],
        content: []
      }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    status: 'published',
    completionRate: 78,
    certificateEnabled: true
  },
  {
    id: 'react-fundamentals-2024',
    title: 'React Fundamentals: De Cero a Héroe',
    description: 'Aprende React desde los fundamentos hasta conceptos avanzados. Incluye hooks, context, routing y mejores prácticas.',
    instructor: 'Prof. Ana García',
    instructorId: '1',
    category: 'programming',
    difficulty: 'Intermedio',
    duration: 35,
    rating: 4.6,
    studentsEnrolled: 189,
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['react', 'frontend', 'javascript', 'hooks', 'components'],
    objectives: [
      'Crear componentes React funcionales y de clase',
      'Manejar estado con useState y useEffect',
      'Implementar routing con React Router',
      'Gestionar estado global con Context API'
    ],
    prerequisites: [
      'Conocimientos sólidos de JavaScript',
      'Experiencia con HTML y CSS',
      'Familiaridad con ES6+'
    ],
    modules: [
      {
        id: 'mod-react-1',
        title: 'Fundamentos de React',
        description: 'Aprende los conceptos básicos de React',
        type: 'lesson',
        duration: 50,
        order: 1,
        nodeType: 'theory',
        content: [
          {
            id: 'react-content-1',
            type: 'text',
            title: 'Introducción a React',
            content: '<h3>¿Qué es React?</h3><p>React es una biblioteca de JavaScript para construir interfaces de usuario, especialmente aplicaciones web de una sola página (SPA).</p><h4>Características principales:</h4><ul><li>Componentes reutilizables</li><li>Virtual DOM para mejor rendimiento</li><li>Flujo de datos unidireccional</li><li>Ecosistema rico</li></ul>',
            duration: 20
          },
          {
            id: 'react-content-2',
            type: 'video',
            title: 'Tu Primer Componente',
            content: '<p>Aprende a crear tu primer componente React paso a paso:</p><ul><li>JSX y su sintaxis</li><li>Props y su uso</li><li>Renderizado condicional</li><li>Listas y keys</li></ul>',
            duration: 30
          }
        ]
      },
      {
        id: 'mod-react-2',
        title: 'Hooks de React',
        description: 'Domina useState, useEffect y hooks personalizados',
        type: 'lesson',
        duration: 45,
        order: 2,
        nodeType: 'trivia',
        triviaQuestions: [
          {
            id: 'react-q1',
            question: '¿Cuál es la diferencia principal entre useState y useEffect?',
            type: 'multiple-choice',
            options: [
              'useState maneja estado, useEffect maneja efectos secundarios',
              'No hay diferencias',
              'useState es para componentes de clase',
              'useEffect es más rápido'
            ],
            correctAnswer: 0,
            explanation: 'useState se usa para manejar el estado del componente, mientras que useEffect maneja efectos secundarios como llamadas a APIs.',
            timeLimit: 30,
            points: 100,
            difficulty: 'medium',
            category: 'React'
          }
        ],
        content: []
      }
    ],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    status: 'published',
    completionRate: 65,
    certificateEnabled: true
  },
  {
    id: 'python-data-science-2024',
    title: 'Python para Ciencia de Datos',
    description: 'Aprende a usar Python para análisis de datos, visualización y machine learning básico usando pandas, matplotlib y scikit-learn.',
    instructor: 'Dr. Miguel Santos',
    instructorId: '3',
    category: 'science',
    difficulty: 'Intermedio',
    duration: 45,
    rating: 4.7,
    studentsEnrolled: 156,
    thumbnail: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['python', 'data-science', 'pandas', 'matplotlib', 'machine-learning'],
    objectives: [
      'Manipular datos con pandas',
      'Crear visualizaciones con matplotlib',
      'Aplicar algoritmos básicos de machine learning',
      'Limpiar y preparar datasets'
    ],
    prerequisites: [
      'Conocimientos básicos de Python',
      'Matemáticas de nivel universitario',
      'Conceptos básicos de estadística'
    ],
    modules: [
      {
        id: 'mod-python-1',
        title: 'Introducción a Pandas',
        description: 'Aprende a manipular datos con pandas',
        type: 'lesson',
        duration: 60,
        order: 1,
        nodeType: 'theory',
        content: [
          {
            id: 'python-content-1',
            type: 'text',
            title: 'DataFrames y Series',
            content: '<h3>Estructuras de datos en Pandas</h3><p>Pandas proporciona dos estructuras principales:</p><h4>Series:</h4><pre><code>import pandas as pd\n\n# Crear una Serie\ntemperaturas = pd.Series([22, 25, 24, 26], index=["Lunes", "Martes", "Miércoles", "Jueves"])\nprint(temperaturas)</code></pre><h4>DataFrame:</h4><pre><code># Crear un DataFrame\ndatos = {\n    "Nombre": ["Ana", "Luis", "Carmen"],\n    "Edad": [25, 30, 28],\n    "Ciudad": ["Madrid", "Barcelona", "Valencia"]\n}\ndf = pd.DataFrame(datos)\nprint(df)</code></pre>',
            duration: 25
          }
        ]
      },
      {
        id: 'mod-python-2',
        title: 'Análisis de Datos',
        description: 'Técnicas básicas de análisis',
        type: 'lesson',
        duration: 45,
        order: 2,
        nodeType: 'trivia',
        triviaQuestions: [
          {
            id: 'python-q1',
            question: '¿Cuál es la principal ventaja de usar pandas para análisis de datos?',
            type: 'multiple-choice',
            options: [
              'Es más rápido que Excel',
              'Maneja grandes volúmenes de datos de forma eficiente',
              'Es gratuito',
              'Tiene mejor interfaz gráfica'
            ],
            correctAnswer: 1,
            explanation: 'Pandas está optimizado para manejar grandes datasets de manera eficiente en memoria.',
            timeLimit: 25,
            points: 100,
            difficulty: 'medium',
            category: 'Python'
          }
        ],
        content: []
      }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-09',
    status: 'published',
    completionRate: 55,
    certificateEnabled: true
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return demoCourses.find(course => course.id === id);
};

export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return demoCourses.filter(course => course.instructorId === instructorId);
};
