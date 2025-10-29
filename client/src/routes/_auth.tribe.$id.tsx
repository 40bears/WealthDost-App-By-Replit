import { createFileRoute } from '@tanstack/react-router'
import TribeDetail from '@/pages/tribe-detail'

export const Route = createFileRoute('/_auth/tribe/$id')({
  component: TribeDetail,
})
