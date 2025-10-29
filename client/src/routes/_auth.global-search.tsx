import { createFileRoute } from '@tanstack/react-router'
import GlobalSearch from '@/pages/global-search'

export const Route = createFileRoute('/_auth/global-search')({
  component: GlobalSearch,
})