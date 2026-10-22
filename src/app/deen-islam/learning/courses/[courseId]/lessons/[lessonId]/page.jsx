import { notFound } from "next/navigation";
import LessonWorkspace from "@/components/deen/learning/LessonWorkspace";
import {
    getCourseById,
    getCourseLesson,
} from "@/lib/learning/courses";

export async function generateMetadata({ params }) {
    const { courseId, lessonId } = await params;
    const course = getCourseById(courseId);
    const lesson = course ? getCourseLesson(course, lessonId) : null;

    if (!course || !lesson) {
        return { title: "Lesson | Quran Learning Academy" };
    }

    return {
        title: `${lesson.title} | ${course.title} | Quran Learning Academy`,
        description: lesson.summary,
    };
}

export default async function LessonPage({ params }) {
    const { courseId, lessonId } = await params;
    const course = getCourseById(courseId);
    const lesson = course ? getCourseLesson(course, lessonId) : null;

    if (!course || !lesson) notFound();

    return <LessonWorkspace course={course} lesson={lesson} />;
}
