import VerifyOtp from '@/pages/verify-otp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verify-otp')({
  component: RouteComponent,
})

function RouteComponent() {
  return <VerifyOtp />
}
