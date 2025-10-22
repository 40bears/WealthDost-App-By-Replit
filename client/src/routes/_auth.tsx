import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/dashboard/BottomNavigation'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    console.log('AuthRoute beforeLoad check', context.auth)
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
  return (
    <div className="flex flex-col h-screen">
      {/* Header - Fixed at top */}
      <Header />
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto pb-16">
        <Outlet />
      </div>
      
      {/* Bottom Navigation - Fixed at bottom */}
      <BottomNavigation />
    </div>
  )
}
