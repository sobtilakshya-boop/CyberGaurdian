import { redirect } from 'next/navigation'

// Redirect legacy /dashboard/learn → /dashboard/course
export default function LearnIndexRedirect() {
  redirect('/dashboard/course')
}
