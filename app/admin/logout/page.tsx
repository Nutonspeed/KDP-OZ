'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function AdminLogout() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    logout().then(() => {
      router.replace('/admin/login')
    })
  }, [logout, router])

  return <p className="p-4">Logging out...</p>
}
