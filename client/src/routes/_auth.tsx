import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/dashboard/BottomNavigation'
import CreateTribeModal from '@/components/tribes/CreateTribeModal'
import CreateStockTipModal from '@/components/stocks/CreateStockTipModal'
import ShareThoughtsModal from '@/components/dashboard/ShareThoughtsModal'
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
  const routerState = useRouterState()
  const [showCreateTribe, setShowCreateTribe] = useState(false)
  const [showCreateStockTip, setShowCreateStockTip] = useState(false)
  const [showShareThoughts, setShowShareThoughts] = useState(false)

  // Only show FAB on specific routes
  const allowedRoutes = ['/dashboard', '/stock-tips', '/tribes']
  const currentPath = routerState.location.pathname
  const showFAB = auth.isExpert && allowedRoutes.includes(currentPath)

  // Determine which modal to open based on current route
  const handleFABClick = () => {
    if (currentPath === '/stock-tips') {
      setShowCreateStockTip(true)
    } else if (currentPath === '/dashboard') {
      setShowShareThoughts(true)
    } else {
      setShowCreateTribe(true)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto pb-16">
        <Outlet />
      </div>

      <BottomNavigation />
      {showFAB && (
        <div className="fixed bottom-[130px] right-0 left-0 max-w-md mx-auto pointer-events-none z-40">
          <Button
            onClick={handleFABClick}
            className="absolute right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 pointer-events-auto"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      <ShareThoughtsModal
        isOpen={showShareThoughts}
        onClose={() => setShowShareThoughts(false)}
        onPostCreated={() => {
          console.log('Post created');
        }}
      />

      <CreateTribeModal
        isOpen={showCreateTribe}
        onClose={() => setShowCreateTribe(false)}
        onTribeCreated={() => {}}
      />

      <CreateStockTipModal
        isOpen={showCreateStockTip}
        onClose={() => setShowCreateStockTip(false)}
        onTipCreated={() => {
          console.log('Stock tip created');
        }}
      />
    </div>
  )
}
