import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  UserCheck,
  AlertTriangle,
  Star,
  Calendar
} from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  activeSection?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, activeSection = 'dashboard' }) => {
  // Render different sections based on activeSection
  if (activeSection === 'users') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
          <p className="text-red-100">Próximamente - Panel de administración de usuarios</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'courses-admin') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Gestión de Cursos</h1>
          <p className="text-blue-100">Próximamente - Administración global de cursos</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'analytics') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Analíticas del Sistema</h1>
          <p className="text-green-100">Próximamente - Dashboard de analíticas globales</p>
        </div>
      </div>
    );
  }

  if (activeSection === 'settings') {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Configuración del Sistema</h1>
          <p className="text-purple-100">Próximamente - Panel de configuración avanzada</p>
        </div>
      </div>
    );
  }

  // Default admin dashboard
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-red-100">Bienvenido, {user.name} - Control total del sistema MindRush</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 mb-1">2,847</p>
            <p className="text-gray-600 text-sm">Usuarios Activos</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+8%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 mb-1">156</p>
            <p className="text-gray-600 text-sm">Cursos Activos</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+5%</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 mb-1">87%</p>
            <p className="text-gray-600 text-sm">Engagement Rate</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500 p-3 rounded-full">
              <Star className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+0.2</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 mb-1">4.8/5</p>
            <p className="text-gray-600 text-sm">Satisfacción</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <div className="font-semibold text-gray-800">Gestionar Usuarios</div>
              <div className="text-sm text-gray-600">Administrar docentes y estudiantes</div>
            </button>

            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <BookOpen className="w-8 h-8 text-green-600 mb-2" />
              <div className="font-semibold text-gray-800">Supervisar Cursos</div>
              <div className="text-sm text-gray-600">Revisar y aprobar contenido</div>
            </button>

            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
              <div className="font-semibold text-gray-800">Ver Analíticas</div>
              <div className="text-sm text-gray-600">Métricas y reportes del sistema</div>
            </button>

            <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
              <Activity className="w-8 h-8 text-gray-600 mb-2" />
              <div className="font-semibold text-gray-800">Configuración</div>
              <div className="text-sm text-gray-600">Ajustes del sistema</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Actividad Reciente</h2>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Nuevo docente registrado: Prof. María López</p>
                <p className="text-xs text-gray-500">2 min ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Curso "Matemáticas Avanzadas" actualizado</p>
                <p className="text-xs text-gray-500">15 min ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">Alerta: Servidor de backup requiere atención</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <Star className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">50 estudiantes completaron certificación</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
