import React, { useState, useEffect } from 'react';
import { WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export const SystemDiagnostic: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [usersCount, setUsersCount] = useState<number>(0);
  const [coursesCount, setCoursesCount] = useState<number>(0);
  const [lastError, setLastError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`[DIAGNOSTIC] ${message}`);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    addLog('Starting system diagnostic...');
    setServerStatus('checking');
    setLastError('');

    try {
      // Test server availability
      addLog('Checking server availability...');
      const isAvailable = await apiService.isServerAvailable();
      
      if (isAvailable) {
        addLog('✅ Server is available');
        setServerStatus('online');
        
        // Test endpoints
        addLog('Testing users endpoint...');
        const users = await apiService.getUsers();
        setUsersCount(users.length);
        addLog(`✅ Users loaded: ${users.length}`);
        
        addLog('Testing courses endpoint...');
        const courses = await apiService.getCourses();
        setCoursesCount(courses.length);
        addLog(`✅ Courses loaded: ${courses.length}`);
        
        // Test specific user login
        addLog('Testing student login...');
        const studentUser = await apiService.login('student@mindrush.com', 'password');
        if (studentUser) {
          addLog(`✅ Student login successful: ${studentUser.name}`);
        } else {
          addLog('❌ Student login failed');
        }
        
      } else {
        addLog('❌ Server is not available');
        setServerStatus('offline');
        setLastError('JSON Server is not running on port 3001');
      }
      
    } catch (error) {
      addLog(`❌ Diagnostic failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setServerStatus('offline');
      setLastError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const getStatusIcon = () => {
    switch (serverStatus) {
      case 'checking':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>;
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'checking':
        return 'bg-yellow-50 border-yellow-200';
      case 'online':
        return 'bg-green-50 border-green-200';
      case 'offline':
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔧 System Diagnostic</h1>
      
      {/* Status Overview */}
      <div className={`border rounded-lg p-4 mb-6 ${getStatusColor()}`}>
        <div className="flex items-center gap-3 mb-2">
          {getStatusIcon()}
          <h2 className="text-lg font-semibold">
            Server Status: {serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1)}
          </h2>
        </div>
        
        {serverStatus === 'online' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600">Users in Database</div>
              <div className="text-xl font-bold">{usersCount}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600">Courses in Database</div>
              <div className="text-xl font-bold">{coursesCount}</div>
            </div>
          </div>
        )}
        
        {lastError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <strong>Error:</strong> {lastError}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={runDiagnostic}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          🔄 Run Diagnostic Again
        </button>
        
        <button
          onClick={() => setLogs([])}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          🗑️ Clear Logs
        </button>
      </div>

      {/* Diagnostic Logs */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
        <h3 className="text-white font-bold mb-2">📋 Diagnostic Logs</h3>
        <div className="max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet. Run diagnostic to see output.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">📖 Troubleshooting Instructions</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure JSON Server is running: <code className="bg-gray-200 px-1 rounded">npm run server</code></li>
          <li>Check if port 3001 is available</li>
          <li>Verify db.json file exists and has valid JSON</li>
          <li>Check browser console for CORS or network errors</li>
          <li>Try restarting both servers if issues persist</li>
        </ol>
      </div>
    </div>
  );
};
