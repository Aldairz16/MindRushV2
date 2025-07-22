import { Course } from '../data/demoCourses';

const COURSES_STORAGE_KEY = 'lms_courses';

export const saveCoursesToStorage = (courses: Course[]) => {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    console.error('Error saving courses to localStorage:', error);
  }
};

export const loadCoursesFromStorage = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    if (storedCourses) {
      return JSON.parse(storedCourses);
    }
  } catch (error) {
    console.error('Error loading courses from localStorage:', error);
  }
  return [];
};

export const initializeCoursesStorage = (defaultCourses: Course[]): Course[] => {
  const storedCourses = loadCoursesFromStorage();
  if (storedCourses.length === 0) {
    saveCoursesToStorage(defaultCourses);
    return defaultCourses;
  }
  return storedCourses;
};
