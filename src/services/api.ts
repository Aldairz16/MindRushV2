const API_BASE_URL = 'http://localhost:3001';

export interface User {
  id: number;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  name: string;
  avatar?: string;
  stats: any;
  progress?: any;
  enrolledCourses?: string[];
  courses?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  category: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: number;
  rating: number;
  studentsEnrolled: number;
  thumbnail: string;
  tags: string[];
  objectives: string[];
  prerequisites: string[];
  modules: any[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  completionRate: number;
  certificateEnabled: boolean;
}

export interface UserProgress {
  completedModules: string[];
  currentModule: string;
  xp: number;
  lastActivity: string;
}

export interface Activity {
  id?: number;
  userId: number;
  courseId: string;
  moduleId: string;
  type: string;
  score?: number;
  xpEarned: number;
  timestamp: string;
}

class ApiService {
  async login(email: string, password: string): Promise<User | null> {
    try {
      console.log('🔗 API login request:', email);
      const response = await fetch(`${API_BASE_URL}/users?email=${email}&password=${password}`);
      console.log('📡 API response status:', response.status);
      const users = await response.json();
      console.log('👥 API users found:', users.length);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('💥 API Login error:', error);
      return null;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async getCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourse(id: string): Promise<Course | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  async createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'studentsEnrolled'>): Promise<Course> {
    try {
      const newCourse = {
        ...course,
        id: `course-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        rating: 0,
        studentsEnrolled: 0
      };

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to create course');
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, updatedAt: new Date().toISOString().split('T')[0] })
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to update course');
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  async updateUserProgress(userId: number, courseId: string, progress: UserProgress): Promise<void> {
    try {
      // Obtener usuario actual
      const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!userResponse.ok) return;
      
      const user = await userResponse.json();
      
      if (!user.progress) user.progress = {};
      user.progress[courseId] = progress;

      // Actualizar usuario
      await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      // Registrar actividad
      await this.logActivity({
        userId,
        courseId,
        moduleId: progress.currentModule,
        type: 'progress_update',
        xpEarned: progress.xp,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  async enrollUser(userId: number, courseId: string): Promise<void> {
    try {
      // Verificar si ya está enrollado
      const enrollmentsResponse = await fetch(`${API_BASE_URL}/enrollments?userId=${userId}&courseId=${courseId}`);
      const existingEnrollments = await enrollmentsResponse.json();
      
      if (existingEnrollments.length > 0) {
        console.log('User already enrolled in this course');
        return;
      }

      // Crear nuevo enrollment
      const enrollment = {
        userId,
        courseId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
      };

      await fetch(`${API_BASE_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment)
      });

      // Actualizar lista de cursos del usuario
      const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (userResponse.ok) {
        const user = await userResponse.json();
        if (!user.enrolledCourses) user.enrolledCourses = [];
        if (!user.enrolledCourses.includes(courseId)) {
          user.enrolledCourses.push(courseId);
          
          await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          });
        }
      }

      // Incrementar contador de estudiantes en el curso
      const courseResponse = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      if (courseResponse.ok) {
        const course = await courseResponse.json();
        course.studentsEnrolled = (course.studentsEnrolled || 0) + 1;
        
        await fetch(`${API_BASE_URL}/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course)
        });
      }
    } catch (error) {
      console.error('Error enrolling user:', error);
      throw error;
    }
  }

  async logActivity(activity: Omit<Activity, 'id'>): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  async getStudentsByTeacher(teacherId: number): Promise<User[]> {
    try {
      // Obtener cursos del profesor
      const coursesResponse = await fetch(`${API_BASE_URL}/courses?instructorId=${teacherId}`);
      const courses = await coursesResponse.json();
      const courseIds = courses.map((c: Course) => c.id);

      if (courseIds.length === 0) return [];

      // Obtener enrollments de esos cursos
      const enrollmentsResponse = await fetch(`${API_BASE_URL}/enrollments`);
      const allEnrollments = await enrollmentsResponse.json();
      
      const studentIds = allEnrollments
        .filter((e: any) => courseIds.includes(e.courseId))
        .map((e: any) => e.userId);

      if (studentIds.length === 0) return [];

      // Obtener estudiantes únicos
      const uniqueStudentIds = [...new Set(studentIds)];
      const studentsResponse = await fetch(`${API_BASE_URL}/users?role=student`);
      const students = await studentsResponse.json();
      
      return students.filter((s: User) => uniqueStudentIds.includes(s.id));
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  async getActivities(userId?: number, courseId?: string): Promise<Activity[]> {
    try {
      let url = `${API_BASE_URL}/activities?`;
      if (userId) url += `userId=${userId}&`;
      if (courseId) url += `courseId=${courseId}&`;
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  async getEnrollments(userId?: number): Promise<any[]> {
    try {
      let url = `${API_BASE_URL}/enrollments`;
      if (userId) url += `?userId=${userId}`;
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  }

  async updateActivity(activity: {
    userId: number;
    courseId: string;
    type: string;
    score?: number;
    data?: any;
    completedAt: string;
  }): Promise<void> {
    try {
      const activityData = {
        ...activity,
        id: `activity-${Date.now()}`,
        timestamp: activity.completedAt
      };

      await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  // Método para verificar si el servidor está disponible
  async isServerAvailable(): Promise<boolean> {
    try {
      console.log('🏥 Checking server health...');
      const response = await fetch(`${API_BASE_URL}/users?_limit=1`);
      const available = response.ok;
      console.log('✅ Server health check:', available);
      return available;
    } catch (error) {
      console.log('❌ Server health check failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
