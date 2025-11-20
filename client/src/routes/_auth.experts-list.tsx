import { createFileRoute } from '@tanstack/react-router'
import ExpertsList from '@/pages/experts-list'

export const Route = createFileRoute('/_auth/experts-list')({
  component: ExpertsList,
})
