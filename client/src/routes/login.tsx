import { createFileRoute, redirect, useRouter, useRouterState } from '@tanstack/react-router'
import * as React from 'react'
import { z } from 'zod'

import Login from '@/pages/login'
import { useAuth } from '../components/auth/auth-context'

const fallback = '/dashboard'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const auth = useAuth()
  const router = useRouter()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const navigate = Route.useNavigate()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const search = Route.useSearch()

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    try {
      evt.preventDefault()
      const data = new FormData(evt.currentTarget)
      const fieldValue = data.get('username')

      if (!fieldValue) return
      const username = fieldValue.toString()
      await auth.login(username)

      await router.invalidate()

      await navigate({ to: search.redirect || fallback })
    } catch (error) {
      console.error('Error logging in: ', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // const isLoggingIn = isLoading || isSubmitting

  return (
    <Login />
  )
}
