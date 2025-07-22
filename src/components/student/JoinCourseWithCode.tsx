import React, { useState } from 'react';
import { Search, UserPlus, AlertCircle, CheckCircle, X } from 'lucide-react';
import { apiService, Course } from '../../services/api';

interface JoinCourseWithCodeProps {
  userId: string;
  onCourseJoined?: (course: Course) => void;
  onClose?: () => void;
}

export const JoinCourseWithCode: React.FC<JoinCourseWithCodeProps> = ({ 
  userId, 
  onCourseJoined,
  onClose 
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const verifyCode = async () => {
    if (!accessCode.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa un código' });
      return;
    }

    try {
      setVerifying(true);
      setMessage(null);
      
      const course = await apiService.verifyAccessCode(accessCode.trim().toUpperCase());
      
      if (course) {
        setPreviewCourse(course);
        setMessage(null);
      } else {
        setPreviewCourse(null);
        setMessage({ type: 'error', text: 'Código inválido o curso no disponible' });
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setMessage({ type: 'error', text: 'Error al verificar el código' });
    } finally {
      setVerifying(false);
    }
  };

  const joinCourse = async () => {
    if (!previewCourse) return;

    try {
      setLoading(true);
      setMessage(null);

      const result = await apiService.enrollStudentWithCode(userId, accessCode.trim().toUpperCase());
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        onCourseJoined?.(result.course!);
        // Reset form after successful enrollment
        setTimeout(() => {
          setAccessCode('');
          setPreviewCourse(null);
          setMessage(null);
          onClose?.();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Error joining course:', error);
      setMessage({ type: 'error', text: 'Error al unirse al curso' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (previewCourse) {
        joinCourse();
      } else {
        verifyCode();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Unirse con Código</h3>
            <p className="text-sm text-gray-500">Ingresa el código que te proporcionó tu profesor</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Input del código */}
        <div>
          <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
            Código de Acceso
          </label>
          <div className="flex gap-3">
            <input
              id="accessCode"
              type="text"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value.toUpperCase());
                setPreviewCourse(null);
                setMessage(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Ej: ABC123"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-wider"
              maxLength={6}
            />
            <button
              onClick={verifyCode}
              disabled={verifying || !accessCode.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Search className={`w-5 h-5 ${verifying ? 'animate-spin' : ''}`} />
              {verifying ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } flex items-center gap-2`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Preview del curso */}
        {previewCourse && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-4">
              <img
                src={previewCourse.thumbnail}
                alt={previewCourse.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{previewCourse.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{previewCourse.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>👨‍🏫 {previewCourse.instructor}</span>
                  <span>⏱️ {previewCourse.duration}h</span>
                  <span>📚 {previewCourse.difficulty}</span>
                  <span>👥 {previewCourse.studentsEnrolled} estudiantes</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  ¿Quieres unirte a este curso?
                </div>
                <button
                  onClick={joinCourse}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {loading ? 'Uniéndose...' : 'Unirse al Curso'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        {!previewCourse && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los códigos suelen tener 6 caracteres (letras y números)</li>
              <li>• Puedes obtener el código de tu profesor o coordinador</li>
              <li>• Los códigos no distinguen entre mayúsculas y minúsculas</li>
              <li>• Si el código no funciona, verifica que esté escrito correctamente</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
