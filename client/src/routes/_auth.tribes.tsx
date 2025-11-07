import { createFileRoute } from '@tanstack/react-router'
import InvestmentRooms from '@/pages/investment-rooms'

export const Route = createFileRoute('/_auth/tribes')({
  component: InvestmentRooms,
})