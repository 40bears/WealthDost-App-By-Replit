import { createFileRoute } from '@tanstack/react-router'
import PostDetailPage from '@/pages/post-detail'

export const Route = createFileRoute('/_auth/posts/$postId')({
  component: PostDetailPage,
})
