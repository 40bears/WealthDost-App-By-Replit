import CreateAccount from '@/pages/create-account'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateAccount />
}
