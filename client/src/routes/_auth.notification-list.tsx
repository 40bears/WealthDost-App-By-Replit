import NotificationList from '@/pages/notification-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/notification-list')({
  component: NotificationList,
})
