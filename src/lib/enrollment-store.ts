import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  students as initialStudents,
  courses as initialCourses,
  enrollments as initialEnrollments,
} from "@/lib/mock-data";
import type { Course, Enrollment, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  /** Admin ลงทะเบียนวิชาให้นักศึกษาคนใดก็ได้ (ไม่ซ้ำกับที่มีอยู่แล้ว) */
  enroll: (studentId: string, courseId: string) => void;
  /** Admin ยกเลิกการลงทะเบียนของนักศึกษาคนใดก็ได้ */
  drop: (studentId: string, courseId: string) => void;
  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeStudent: (studentId: string, courseCode: string) => void;
  addCourse: ({ courseCode, courseTitle, instructors }: Course) => void;
  removeCourse: (course: Course) => void;
  removeInstructor: (course: Course, intrusctor: string) => void;

};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,
      enrollments: initialEnrollments,

      enroll: (studentId, courseId) =>
        set((state) => ({
          students: state.students.map((s) => 
            s.studentId === studentId ?
            {
              ...s, enrolledCourses: [...s.enrolledCourses, courseId]
            }
          : s
          )
        })),

      drop: (studentId, courseId) =>
        set((state) => ({
          enrollments: state.enrollments.filter(
            (e) => !(e.studentId === studentId && e.courseId === courseId),
          ),
        })),

      addCourse: ({ courseCode, courseTitle, instructors }) =>
        set((state) => ({
          courses: [...state.courses, { courseCode, courseTitle, instructors }],
        })),

      removeCourse: (course) =>
        set((state) => ({
          courses: state.courses.filter((c) => c !== course)
        })),

      removeInstructor: (course, instructor) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.courseCode === course.courseCode ?
              {
                ...c, instructors: c.instructors?.filter((i) => i !== instructor)
              }
              : c
          )
        })),

      removeStudent: (studentId: String, courseCode: String) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.studentId === studentId ?
              {
                ...s, enrolledCourses: s.enrolledCourses.filter((code) => code !== courseCode)
              }
              : s
          )
        })),
    }),
    {
      name: "enrollment-storage",
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
);