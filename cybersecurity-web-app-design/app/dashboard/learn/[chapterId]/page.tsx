import { redirect } from 'next/navigation'

// Redirect legacy /dashboard/learn/[chapterId] → /dashboard/course/[chapterId]
export default function LearnChapterRedirect({ params }: { params: { chapterId: string } }) {
  redirect(`/dashboard/course/${params.chapterId}`)
}
