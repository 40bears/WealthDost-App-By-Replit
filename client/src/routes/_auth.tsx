import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import BottomNavigation from '@/components/dashboard/BottomNavigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'

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
  const [showCreateTribe, setShowCreateTribe] = useState(false)
  const [monetizationType, setMonetizationType] = useState<"free" | "premium">("free")

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

      {/* Floating Action Button */}
      <div className="fixed bottom-[130px] right-0 left-0 max-w-md mx-auto pointer-events-none z-40">
        <Button
          onClick={() => setShowCreateTribe(true)}
          className="absolute right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 pointer-events-auto"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Create Tribe Modal */}
      {showCreateTribe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-100 w-full max-w-md rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 flex items-center justify-between bg-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Create New Tribe</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-200"
                onClick={() => setShowCreateTribe(false)}
              >
                <span className="text-2xl leading-none">&times;</span>
              </Button>
            </div>

            {/* Content */}
            <div className="px-5 pb-5 overflow-y-auto flex-1">
              <div className="space-y-4">
                {/* Tribe Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Tribe Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Tech Growth Investors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Description</label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="eg. Deep dive into fundamental analysis and long-term value investing strategies"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Industry</label>
                  <Select>
                    <SelectTrigger className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="value-investing">Value Investing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="banking">Banking</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Monetization */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Monetization</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="monetization"
                        value="free"
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        checked={monetizationType === "free"}
                        onChange={() => setMonetizationType("free")}
                      />
                      <span className="text-sm text-gray-900">Free</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="monetization"
                        value="premium"
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        checked={monetizationType === "premium"}
                        onChange={() => setMonetizationType("premium")}
                      />
                      <span className="text-sm text-gray-900">Premium</span>
                    </label>
                  </div>
                  {monetizationType === "premium" && (
                    <input
                      type="text"
                      className="w-full mt-3 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="eg : 500"
                    />
                  )}
                </div>

                {/* Tribe Features */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Tribe Features</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-900">Discussion posts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-900">Stock Tips</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Live events & webinars (coming soon)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Premium polls & insights  (coming soon)</span>
                    </label>
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">Cover image</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-500 text-sm">@</span>
                    </div>
                    <span className="text-sm text-gray-500">Select file</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 pt-0 pb-6">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 py-6 text-base font-medium bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-xl"
                  onClick={() => setShowCreateTribe(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 py-6 text-base font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                  onClick={() => setShowCreateTribe(false)}
                >
                  Create Tribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
