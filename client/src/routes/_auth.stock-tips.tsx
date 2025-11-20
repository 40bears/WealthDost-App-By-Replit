import { createFileRoute } from '@tanstack/react-router'
import StockTips from '@/pages/stock-tips'

export const Route = createFileRoute('/_auth/stock-tips')({
  component: StockTips,
})
