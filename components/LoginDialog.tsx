'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuthStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface LoginDialogProps { children: React.ReactNode }

export function LoginDialog({ children }: LoginDialogProps) {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [credentials, setCredentials] = useState({ email: "", password: "", remember: false })

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false)
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(credentials.email, credentials.password)
    if (success) {
      setIsOpen(false)
      router.push("/admin")
      toast({ title: "เข้าสู่ระบบสำเร็จ" })
    } else {
      toast({ title: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-sarabun">เข้าสู่ระบบ Admin</DialogTitle>
          <DialogDescription className="font-sarabun">กรุณาเข้าสู่ระบบเพื่อจัดการเว็บไซต์</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="email" className="font-sarabun">อีเมล</Label>
            <Input id="email" type="email" value={credentials.email} onChange={(e)=>setCredentials(prev=>({...prev,email:e.target.value}))} required className="font-sarabun" placeholder="admin@example.com" />
          </div>
          <div>
            <Label htmlFor="password" className="font-sarabun">รหัสผ่าน</Label>
            <Input id="password" type="password" value={credentials.password} onChange={(e)=>setCredentials(prev=>({...prev,password:e.target.value}))} required className="font-sarabun" placeholder="password123" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" checked={credentials.remember} onCheckedChange={(checked)=>setCredentials(prev=>({...prev,remember:checked as boolean}))} />
            <Label htmlFor="remember" className="text-sm font-sarabun">จดจำการเข้าสู่ระบบ</Label>
          </div>
          <Button type="submit" className="w-full">เข้าสู่ระบบ</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
