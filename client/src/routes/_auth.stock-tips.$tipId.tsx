import { createFileRoute } from '@tanstack/react-router'
import StockTipDetailPage from '@/pages/stock-tip-detail'

export const Route = createFileRoute('/_auth/stock-tips/$tipId')({
  component: StockTipDetailPage,
})
