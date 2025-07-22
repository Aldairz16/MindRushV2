import React, { useState } from 'react';
import { LogOut, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { apiService, Course } from '../../services/api';

interface CourseUnenrollManagerProps {
  course: Course;
  userId: string;
  onCourseLeft?: (courseId: string) => void;
  onClose?: () => void;
}

export const CourseUnenrollManager: React.FC<CourseUnenrollManagerProps> = ({ 
  course, 
  userId, 
  onCourseLeft,
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUnenroll = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const result = await apiService.unenrollStudent(userId, course.id);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        onCourseLeft?.(course.id);
        // Close after successful unenrollment
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Error leaving course:', error);
      setMessage({ type: 'error', text: 'Error al salirse del curso' });
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const resetState = () => {
    setShowConfirmation(false);
    setMessage(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Salir del Curso</h3>
            <p className="text-sm text-gray-500">Gestiona tu inscripción a este curso</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={() => {
              resetState();
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Información del curso */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
        <div className="flex items-start gap-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{course.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>👨‍🏫 {course.instructor}</span>
              <span>⏱️ {course.duration}h</span>
              <span>📚 {course.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`p-4 rounded-lg border mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        } flex items-center gap-2`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {!showConfirmation ? (
        <div className="space-y-4">
          {/* Advertencias */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-2">⚠️ Importante:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Perderás acceso a todo el contenido del curso</li>
                  <li>• Tu progreso actual se mantendrá guardado</li>
                  <li>• Podrás volver a unirte usando el código del curso</li>
                  <li>• Los certificados obtenidos se conservarán</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmation(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir del Curso
            </button>
            
            {onClose && (
              <button
                onClick={() => {
                  resetState();
                  onClose();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Confirmación */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-2">¿Estás seguro?</h4>
                <p className="text-sm text-red-800 mb-3">
                  Esta acción eliminará tu inscripción del curso "<strong>{course.title}</strong>". 
                  Podrás volver a unirte más tarde si tienes el código de acceso.
                </p>
                <p className="text-xs text-red-700">
                  Tu progreso se mantendrá guardado y podrás continuar donde lo dejaste si vuelves a inscribirte.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de confirmación */}
          <div className="flex gap-3">
            <button
              onClick={handleUnenroll}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {loading ? 'Saliendo...' : 'Sí, Salir del Curso'}
            </button>
            
            <button
              onClick={() => setShowConfirmation(false)}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              No, Mantener Inscripción
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
