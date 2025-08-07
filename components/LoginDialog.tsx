'use client'

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuthStore } from "@/lib/store"
import { supabaseBrowser } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface LoginDialogProps {
  children: React.ReactNode;
}

export function LoginDialog({ children }: LoginDialogProps) {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check auth state on component mount
    useAuthStore.getState().checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false) // Close dialog if already authenticated
      router.push("/admin") // Redirect to admin page
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error: authError } = await supabaseBrowser().auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (authError) {
        setError(authError.message)
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: authError.message,
          variant: "destructive",
        })
      } else if (data.user) {
        login({ id: data.user.id, email: data.user.email ?? '' }) // Pass minimal user info to store
        setIsOpen(false) // Close dialog on successful login
        router.push("/admin")
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับสู่ Admin Panel",
        })
      } else {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
        toast({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ: " + err.message)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-sarabun">เข้าสู่ระบบ Admin</DialogTitle>
          <DialogDescription className="font-sarabun">
            กรุณาเข้าสู่ระบบเพื่อจัดการเว็บไซต์
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="email" className="font-sarabun">
              อีเมล
            </Label>
            <Input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
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
              onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
              required
              className="font-sarabun"
              placeholder="password123"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={credentials.remember}
              onCheckedChange={(checked) => setCredentials((prev) => ({ ...prev, remember: checked as boolean }))}
            />
            <Label htmlFor="remember" className="text-sm font-sarabun">
              จดจำการเข้าสู่ระบบ
            </Label>
          </div>

          {error && <div className="text-red-600 text-sm font-sarabun">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </form>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-sarabun">
            <strong>ข้อมูลทดสอบ:</strong>
            <br />
            อีเมล: admin@example.com
            <br />
            รหัสผ่าน: password123
            <br />
            (คุณสามารถลงทะเบียนผู้ใช้ใหม่ได้ใน Supabase Auth)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
