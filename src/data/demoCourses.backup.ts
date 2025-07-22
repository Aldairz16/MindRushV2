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
  type: 'multiple-choice' | 'true-false' | 'type-answer' | 'select-image' | 'order-sequence';
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
          },
          {
            id: 'content-4',
            type: 'resource',
            title: 'Guía de Referencia ES6+',
            content: 'Descarga esta guía completa con todos los ejemplos y ejercicios del módulo. Incluye casos de uso avanzados y mejores prácticas.',
            duration: 5
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
          },
          {
            id: 'q4',
            question: '¿Cuál es la palabra clave para declarar una variable que no puede ser reasignada?',
            type: 'type-answer',
            options: [],
            correctAnswer: 0,
            correctText: 'const',
            explanation: 'La palabra clave "const" declara una variable de solo lectura que no puede ser reasignada.',
            timeLimit: 20,
            points: 125,
            difficulty: 'medium',
            category: 'JavaScript'
          },
          {
            id: 'q5',
            question: 'Ordena estos pasos del ciclo de vida de React en el orden correcto:',
            type: 'order-sequence',
            options: ['componentDidMount', 'constructor', 'render', 'componentWillUnmount'],
            correctAnswer: 0,
            sequenceOrder: [1, 2, 0, 3], // constructor, render, componentDidMount, componentWillUnmount
            explanation: 'El orden correcto es: constructor → render → componentDidMount → componentWillUnmount',
            timeLimit: 45,
            points: 200,
            difficulty: 'hard',
            category: 'React'
          }
        ],
        content: [
          {
            id: 'content-4',
            type: 'video',
            title: 'Entendiendo las Promises',
            content: 'Explicación completa del patrón Promise y su implementación',
            duration: 25
          },
          {
            id: 'content-5',
            type: 'text',
            title: 'Async/Await en Profundidad',
            content: 'Guía completa sobre el uso de async/await para código más limpio',
            duration: 20
          },
          {
            id: 'content-6',
            type: 'quiz',
            title: 'Quiz: Programación Asíncrona',
            content: 'Evaluación de conocimientos sobre Promises y async/await',
            duration: 15
          }
        ]
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
            id: 'content-7',
            type: 'text',
            title: 'Introducción a los Closures',
            content: '<h3>¿Qué es un Closure?</h3><p>Un closure es una función que tiene acceso a variables en su alcance exterior, incluso después de que la función exterior haya terminado de ejecutarse.</p><h4>Ejemplo Básico:</h4><pre><code>function crearContador() {\n  let contador = 0;\n  \n  return function() {\n    contador++;\n    return contador;\n  };\n}\n\nconst contador1 = crearContador();\nconsole.log(contador1()); // 1\nconsole.log(contador1()); // 2\n\nconst contador2 = crearContador();\nconsole.log(contador2()); // 1</code></pre><p>Cada llamada a <code>crearContador()</code> crea un nuevo closure con su propia variable <code>contador</code>.</p>',
            duration: 15
          },
          {
            id: 'content-8',
            type: 'video',
            title: 'Closures en la Práctica',
            content: '<p>Este video muestra casos de uso reales de closures:</p><ul><li>Módulos privados</li><li>Factory functions</li><li>Event handlers con estado</li><li>Decoradores de funciones</li></ul>',
            duration: 12
          },
          {
            id: 'content-9',
            type: 'text',
            title: 'El Contexto "this" en JavaScript',
            content: '<h3>Entendiendo "this"</h3><p>El valor de <code>this</code> en JavaScript depende de cómo se llama la función:</p><h4>1. Método de Objeto:</h4><pre><code>const persona = {\n  nombre: "Ana",\n  saludar() {\n    console.log(`Hola, soy ${this.nombre}`);\n  }\n};\npersona.saludar(); // "Hola, soy Ana"</code></pre><h4>2. Arrow Functions:</h4><pre><code>const persona = {\n  nombre: "Ana",\n  saludar: () => {\n    console.log(`Hola, soy ${this.nombre}`); // undefined!\n  }\n};\n// Las arrow functions no tienen su propio "this"</code></pre><h4>3. Call, Apply, Bind:</h4><pre><code>function saludar() {\n  console.log(`Hola, soy ${this.nombre}`);\n}\n\nconst persona = { nombre: "Carlos" };\nsaludar.call(persona); // "Hola, soy Carlos"</code></pre>',
            duration: 18
          },
          {
            id: 'content-10',
            type: 'interactive',
            title: 'Ejercicio: Implementa un Módulo',
            content: '<h3>Desafío: Crea un Módulo Contador</h3><p>Implementa un módulo que:</p><ul><li>Tenga métodos para incrementar, decrementar y obtener el valor</li><li>Mantenga el contador privado usando closures</li><li>Permita establecer un valor inicial</li></ul><h4>Plantilla:</h4><pre><code>function crearModuloContador(valorInicial = 0) {\n  // Tu código aquí\n  return {\n    // métodos públicos\n  };\n}</code></pre>',
            duration: 15
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Evaluación: Conceptos Avanzados',
        description: 'Pon a prueba tu conocimiento sobre closures y this',
        type: 'quiz',
        duration: 30,
        order: 4,
        nodeType: 'trivia',
        triviaQuestions: [
          {
            id: 'q6',
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
            id: 'q7',
            question: 'En una arrow function, ¿de dónde toma el valor de "this"?',
            type: 'multiple-choice',
            options: [
              'Del objeto que la contiene',
              'Del contexto léxico donde se define',
              'Del objeto global',
              'No tiene "this"'
            ],
            correctAnswer: 1,
            explanation: 'Las arrow functions heredan el valor de "this" del contexto léxico donde se definen.',
            timeLimit: 25,
            points: 120,
            difficulty: 'medium',
            category: 'JavaScript'
          },
          {
            id: 'q8',
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
      },
      {
        id: 'mod-5',
        title: 'Proyecto Final: API REST con JavaScript',
        description: 'Construye una aplicación completa aplicando todos los conceptos',
        type: 'project',
        duration: 120,
        order: 5,
        nodeType: 'theory',
        content: [
          {
            id: 'content-11',
            type: 'text',
            title: 'Especificaciones del Proyecto',
            content: '<h3>Proyecto Final: Sistema de Gestión de Tareas</h3><p>Desarrollarás una aplicación web completa que incluya:</p><h4>Funcionalidades:</h4><ul><li>Crear, editar y eliminar tareas</li><li>Organizar tareas por categorías</li><li>Marcar tareas como completadas</li><li>Filtrar y buscar tareas</li><li>Persistencia en localStorage</li></ul><h4>Tecnologías a usar:</h4><ul><li>JavaScript ES6+ (async/await, destructuring, etc.)</li><li>DOM manipulation</li><li>Event handling</li><li>Local Storage API</li><li>Fetch API (opcional: conexión a API real)</li></ul>',
            duration: 20
          },
          {
            id: 'content-12',
            type: 'video',
            title: 'Arquitectura del Proyecto',
            content: '<p>En este video aprenderás:</p><ul><li>Cómo estructurar el código usando módulos</li><li>Patrón MVC aplicado al frontend</li><li>Separación de responsabilidades</li><li>Mejores prácticas de organización</li></ul>',
            duration: 25
          },
          {
            id: 'content-13',
            type: 'interactive',
            title: 'Implementación Paso a Paso',
            content: '<h3>Desarrollo Guiado</h3><p>Implementaremos el proyecto en etapas:</p><h4>Fase 1: Estructura Base</h4><pre><code>// app.js\nclass TaskManager {\n  constructor() {\n    this.tasks = this.loadTasks();\n    this.initEventListeners();\n  }\n  \n  // Tu implementación aquí\n}</code></pre><p>Cada fase incluye ejercicios prácticos y revisión de código.</p>',
            duration: 45
          },
          {
            id: 'content-14',
            type: 'resource',
            title: 'Recursos y Documentación',
            content: 'Descarga el starter pack con archivos base, documentación de APIs utilizadas y ejemplos de referencia.',
            duration: 5
          }
        ]
      }
    ],
        ]
          },
          {
            id: 'content-8',
            type: 'resource',
            title: 'Recursos y Plantillas',
            content: 'Archivos base y recursos necesarios para el proyecto',
            resources: ['starter-template.zip', 'api-documentation.pdf']
          }
        ]
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
    instructor: 'Prof. Carlos Rodríguez',
    instructorId: '2',
    category: 'programming',
    difficulty: 'Intermedio',
    duration: 35,
    rating: 4.6,
    studentsEnrolled: 189,
    thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['react', 'frontend', 'javascript', 'hooks', 'components'],
    objectives: [
      'Crear componentes React reutilizables y eficientes',
      'Manejar estado local y global con hooks y Context API',
      'Implementar routing con React Router',
      'Aplicar mejores prácticas de desarrollo React',
      'Construir aplicaciones React completas y escalables'
    ],
    prerequisites: [
      'Conocimientos sólidos de JavaScript',
      'Experiencia con HTML y CSS',
      'Familiaridad con ES6+'
    ],
    modules: [
      {
        id: 'react-mod-1',
        title: 'Fundamentos de React',
        description: 'Componentes, JSX y props',
        type: 'lesson',
        duration: 50,
        order: 1,
        nodeType: 'theory',
        content: [
          {
            id: 'react-content-1',
            type: 'video',
            title: 'Introducción a React',
            content: 'Qué es React y por qué usarlo',
            duration: 15
          },
          {
            id: 'react-content-2',
            type: 'text',
            title: 'Tu Primer Componente',
            content: 'Creando componentes funcionales y de clase',
            duration: 20
          },
          {
            id: 'react-content-3',
            type: 'interactive',
            title: 'Práctica: Props y JSX',
            content: 'Ejercicios para dominar props y JSX',
            duration: 15
          }
        ]
      },
      {
        id: 'react-mod-2',
        title: 'Hooks y Estado',
        description: 'useState, useEffect y hooks personalizados',
        type: 'lesson',
        duration: 45,
        order: 2,
        nodeType: 'trivia',
        triviaQuestions: [
          {
            id: 'q1',
            question: '¿Cuál es la diferencia principal entre useState y useEffect?',
            options: [
              'useState maneja estado, useEffect maneja efectos secundarios',
              'No hay diferencias',
              'useState es para componentes de clase',
              'useEffect es más rápido'
            ],
            correctAnswer: 0,
            explanation: 'useState gestiona el estado local del componente, mientras que useEffect maneja efectos secundarios como llamadas a APIs.',
            timeLimit: 30,
            points: 100
          }
        ],
        content: [
          {
            id: 'react-content-4',
            type: 'video',
            title: 'useState en Profundidad',
            content: 'Manejo de estado local con hooks',
            duration: 20
          },
          {
            id: 'react-content-5',
            type: 'video',
            title: 'useEffect y Ciclo de Vida',
            content: 'Efectos secundarios y limpieza',
            duration: 25
          }
        ]
      }
    ],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    status: 'published',
    completionRate: 65,
    certificateEnabled: true
  },
  {
    id: 'ux-design-principles-2024',
    title: 'Principios de Diseño UX/UI Moderno',
    description: 'Domina los fundamentos del diseño de experiencia de usuario y interfaces modernas con herramientas profesionales.',
    instructor: 'Prof. Ana Martínez',
    instructorId: '4',
    category: 'design',
    difficulty: 'Principiante',
    duration: 25,
    rating: 4.9,
    studentsEnrolled: 156,
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['ux', 'ui', 'design', 'figma', 'user-experience'],
    objectives: [
      'Comprender los principios fundamentales del diseño UX/UI',
      'Crear wireframes y prototipos efectivos',
      'Dominar herramientas como Figma y Adobe XD',
      'Aplicar metodologías de design thinking',
      'Realizar testing de usabilidad'
    ],
    prerequisites: [
      'Interés en diseño digital',
      'Conocimientos básicos de computación',
      'Creatividad y pensamiento analítico'
    ],
    modules: [
      {
        id: 'ux-mod-1',
        title: 'Fundamentos del Diseño UX',
        description: 'Principios básicos y metodologías',
        type: 'lesson',
        duration: 40,
        order: 1,
        nodeType: 'theory',
        content: [
          {
            id: 'ux-content-1',
            type: 'video',
            title: 'Introducción al UX Design',
            content: 'Qué es UX y por qué es importante',
            duration: 15
          },
          {
            id: 'ux-content-2',
            type: 'text',
            title: 'Design Thinking Process',
            content: 'Las 5 etapas del design thinking',
            duration: 25
          }
        ]
      }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10',
    status: 'published',
    completionRate: 82,
    certificateEnabled: true
  },
  {
    id: 'data-science-python-2024',
    title: 'Data Science con Python: Análisis y Visualización',
    description: 'Aprende análisis de datos, machine learning y visualización usando Python, pandas, numpy y scikit-learn.',
    instructor: 'Dr. Luis García',
    instructorId: '5',
    category: 'science',
    difficulty: 'Avanzado',
    duration: 50,
    rating: 4.7,
    studentsEnrolled: 98,
    thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['python', 'data-science', 'machine-learning', 'pandas', 'visualization'],
    objectives: [
      'Manipular y analizar datos con pandas y numpy',
      'Crear visualizaciones efectivas con matplotlib y seaborn',
      'Implementar algoritmos de machine learning básicos',
      'Realizar análisis estadístico de datos',
      'Construir pipelines de datos completos'
    ],
    prerequisites: [
      'Conocimientos básicos de Python',
      'Conceptos básicos de estadística',
      'Matemáticas de nivel universitario'
    ],
    modules: [
      {
        id: 'ds-mod-1',
        title: 'Introducción a Data Science',
        description: 'Conceptos fundamentales y herramientas',
        type: 'lesson',
        duration: 60,
        order: 1,
        nodeType: 'trivia',
        triviaQuestions: [
          {
            id: 'q1',
            question: '¿Cuál es la principal ventaja de usar pandas para análisis de datos?',
            options: [
              'Es más rápido que Excel',
              'Proporciona estructuras de datos potentes y herramientas de análisis',
              'Es gratis',
              'Funciona solo con Python'
            ],
            correctAnswer: 1,
            explanation: 'Pandas ofrece DataFrames y Series que facilitan la manipulación y análisis de datos de manera eficiente.',
            timeLimit: 35,
            points: 120
          }
        ],
        content: [
          {
            id: 'ds-content-1',
            type: 'video',
            title: 'Qué es Data Science',
            content: 'Introducción al mundo de la ciencia de datos',
            duration: 20
          },
          {
            id: 'ds-content-2',
            type: 'text',
            title: 'Configuración del Entorno',
            content: 'Instalación de Python, Jupyter y librerías',
            duration: 25
          },
          {
            id: 'ds-content-3',
            type: 'interactive',
            title: 'Primer Análisis de Datos',
            content: 'Ejercicio práctico con un dataset real',
            duration: 15
          }
        ]
      }
    ],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08',
    status: 'published',
    completionRate: 45,
    certificateEnabled: true
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return demoCourses.find(course => course.id === id);
};

export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return demoCourses.filter(course => course.instructorId === instructorId);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return demoCourses.filter(course => course.category === category);
};