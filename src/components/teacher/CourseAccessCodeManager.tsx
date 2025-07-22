import React, { useState } from 'react';
import { Copy, RefreshCw, Users, CheckCircle, Key } from 'lucide-react';
import { apiService, Course } from '../../services/api';

interface CourseAccessCodeManagerProps {
  course: Course;
  onCodeGenerated?: (code: string) => void;
}

export const CourseAccessCodeManager: React.FC<CourseAccessCodeManagerProps> = ({ 
  course, 
  onCodeGenerated 
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(course.accessCode || '');

  const generateNewCode = async () => {
    try {
      setLoading(true);
      const newCode = await apiService.generateCourseAccessCode(course.id);
      setCurrentCode(newCode);
      onCodeGenerated?.(newCode);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Key className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Código de Acceso</h3>
          <p className="text-sm text-gray-500">Comparte este código con tus estudiantes</p>
        </div>
      </div>

      {currentCode ? (
        <div className="space-y-4">
          {/* Código actual */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Código Actual:</p>
                <div className="flex items-center gap-2">
                  <code className="text-2xl font-mono font-bold text-blue-600 bg-white px-3 py-2 rounded border">
                    {currentCode}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copiar código"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Información del curso */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{course.studentsEnrolled} estudiantes inscritos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${course.allowSelfEnrollment ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>
                {course.allowSelfEnrollment ? 'Inscripción habilitada' : 'Inscripción deshabilitada'}
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-3">
            <button
              onClick={generateNewCode}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generando...' : 'Generar Nuevo Código'}
            </button>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copiado!' : 'Copiar Código'}
            </button>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Instrucciones para estudiantes:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Ir a la sección "Explorar Cursos" en su dashboard</li>
              <li>2. Hacer clic en "Unirse con Código"</li>
              <li>3. Ingresar el código: <strong>{currentCode}</strong></li>
              <li>4. Confirmar la inscripción</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay código generado</h3>
          <p className="text-gray-500 mb-4">Genera un código de acceso para que los estudiantes puedan unirse a este curso</p>
          <button
            onClick={generateNewCode}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
          >
            <Key className="w-4 h-4" />
            {loading ? 'Generando...' : 'Generar Código'}
          </button>
        </div>
      )}
    </div>
  );
};
