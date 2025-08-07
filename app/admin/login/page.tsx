"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"

export default function AdminLogin() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  useEffect(() => {
    login()
    router.push("/admin")
  }, [login, router])
  return null
}
