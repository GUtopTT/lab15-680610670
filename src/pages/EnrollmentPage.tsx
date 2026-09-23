import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import { RegisterDialog } from "@/components/register-dialog";
import {
  courses,
  currentStudent,
  enrollments as initialEnrollments,
} from "@/lib/mock-data";
import type { Enrollment } from "@/lib/types";

export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(
    initialEnrollments.filter((e) => e.studentId === currentStudent.studentId),
  );

  const enrolledCourseIds = useMemo(
    () => new Set(enrollments.map((e) => e.courseId)),
    [enrollments],
  );

  const availableCourses = useMemo(
    () => courses.filter((c) => !enrolledCourseIds.has(c.courseId)),
    [enrolledCourseIds],
  );

  function handleRegister(courseId: string, time: string) {
    const enrolledAt = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    enrolledAt.setHours(hours, minutes, 0, 0);

    setEnrollments((prev) => [
      ...prev,
      {
        studentId: currentStudent.studentId,
        courseId,
        enrolledAt: enrolledAt.toISOString(),
      },
    ]);
  }

  function handleCancel(courseId: string) {
    setEnrollments((prev) => prev.filter((e) => e.courseId !== courseId));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">รายวิชาทั้งหมด</h1>
          <p className="text-sm text-muted-foreground">
            {currentStudent.firstName} {currentStudent.lastName} (
            {currentStudent.studentId})
          </p>
        </div>
        <RegisterDialog
          availableCourses={availableCourses}
          student={currentStudent}
          onRegister={handleRegister}
        />
      </div>

      <div className="flex flex-col gap-4">
        {courses.map((course) => {
          const enrollment = enrollments.find(
            (e) => e.courseId === course.courseId,
          );
          return (
            <CourseCard
              key={course.courseId}
              course={course}
              student={currentStudent}
              isEnrolled={!!enrollment}
              enrolledAt={enrollment?.enrolledAt}
              onCancel={() => handleCancel(course.courseId)}
            />
          );
        })}
      </div>
    </div>
  );
}
