import { notFound } from "next/navigation";
import CourseDetailView from "@/components/deen/learning/CourseDetailView";
import { getCourseById } from "@/lib/learning/courses";

export async function generateMetadata({ params }) {
    const { courseId } = await params;
    const course = getCourseById(courseId);

    if (!course) return { title: "Course | Quran Learning Academy" };

    return {
        title: `${course.title} | Quran Learning Academy`,
        description: course.description,
    };
}

export default async function CourseDetailPage({ params }) {
    const { courseId } = await params;
    const course = getCourseById(courseId);

    if (!course) notFound();

    return <CourseDetailView course={course} />;
}
