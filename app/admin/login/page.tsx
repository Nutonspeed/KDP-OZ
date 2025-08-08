"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLogin() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [credentials, setCredentials] = useState({ email: "", password: "" })

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(credentials.email, credentials.password)
    if (success) {
      router.push("/admin")
    } else {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded bg-white p-6 shadow"
      >
        <div>
          <Label htmlFor="email" className="font-sarabun">
            อีเมล
          </Label>
          <Input
            id="email"
            type="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            className="font-sarabun"
            placeholder="admin@example.com"
          />
        </div>
        <div>
          <Label htmlFor="password" className="font-sarabun">
            รหัสผ่าน
          </Label>
          <Input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            className="font-sarabun"
            placeholder="password123"
          />
        </div>
        <Button type="submit" className="w-full">
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  )
}

