import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/dashboard/BottomNavigation'
import CreateTribeModal from '@/components/tribes/CreateTribeModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const auth = useAuth()
  const [showCreateTribe, setShowCreateTribe] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto pb-16">
        <Outlet />
      </div>

      <BottomNavigation />
      {auth.isExpert && (
        <div className="fixed bottom-[130px] right-0 left-0 max-w-md mx-auto pointer-events-none z-40">
          <Button
            onClick={() => setShowCreateTribe(true)}
            className="absolute right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 pointer-events-auto"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      <CreateTribeModal
        isOpen={showCreateTribe}
        onClose={() => setShowCreateTribe(false)}
        onTribeCreated={() => {}}
      />
    </div>
  )
}
