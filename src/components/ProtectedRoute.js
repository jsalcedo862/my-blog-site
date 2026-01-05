import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/../lib/supabaseClient'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return <p className="p-6">Checking authentication...</p>
  }

  return children
}
