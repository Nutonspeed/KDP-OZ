"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Mail, KeyRound } from 'lucide-react'
import { useAuthStore } from "@/lib/store"
import { fetchUsers, createUser, updateUser, deleteUser } from "@/actions/users"
import type { User } from "@/lib/mock/users"

export default function AdminUsers() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "viewer", // Default custom role
  })
  const [formError, setFormError] = useState("")

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, loading])

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      if (isAuthenticated) {
        const { users: fetchedUsers } = await fetchUsers()
        setUsers(fetchedUsers)
      }
      setLoading(false)
    }
    loadUsers()
  }, [isAuthenticated])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <p className="font-sarabun">กำลังโหลด...</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (!editingUser && formData.password !== formData.confirmPassword) {
      setFormError("รหัสผ่านไม่ตรงกัน")
      return
    }

    let result
    if (editingUser) {
      const updates: { email?: string; password?: string; user_metadata?: { role: string } } = {
        email: formData.email,
        user_metadata: { role: formData.role },
      }
      if (formData.password) { // Only update password if provided
        updates.password = formData.password
      }
      result = await updateUser(editingUser.id, updates)
    } else {
      result = await createUser({ email: formData.email, password: formData.password, role: formData.role })
    }

    if (result.success) {
      const { users: fetchedUsers } = await fetchUsers()
      setUsers(fetchedUsers)
      resetForm()
      setIsDialogOpen(false)
    } else {
      setFormError(result.error || "เกิดข้อผิดพลาดในการบันทึกผู้ใช้")
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      role: "viewer",
    })
    setEditingUser(null)
    setFormError("")
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: "", // Passwords are not fetched for security
      confirmPassword: "",
      role: user.user_metadata?.role || "viewer",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้")) {
      const result = await deleteUser(id)
      if (result.success) {
      const { users: fetchedUsers } = await fetchUsers()
      setUsers(fetchedUsers)
      } else {
        alert(`Failed to delete user: ${result.error}`)
      }
    }
  }

  // Export the list of users to a CSV file.  Include core fields such as
  // id, email, role, created_at, email_confirmed_at, and last_sign_in_at.  Fields
  // that may contain nested objects (user_metadata) are omitted for clarity.
  const handleExportCSV = () => {
    if (!users || users.length === 0) {
      alert('ไม่มีผู้ใช้สำหรับส่งออก')
      return
    }
    const headers = ['id', 'email', 'role', 'created_at', 'email_confirmed_at', 'last_sign_in_at']
    const lines = users.map((u) => [
      u.id,
      u.email,
      u.user_metadata?.role || '',
      u.created_at,
      u.email_confirmed_at || '',
      u.last_sign_in_at || '',
    ])
    const csv = [headers.join(','), ...lines.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'users.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getRoleBadgeVariant = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sarabun">จัดการผู้ใช้</h1>
            <p className="text-gray-600 font-sarabun">เพิ่ม แก้ไข หรือลบผู้ใช้ในระบบ</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV} className="font-sarabun">
              ส่งออก CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มผู้ใช้ใหม่
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-sarabun">{editingUser ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}</DialogTitle>
                <DialogDescription className="font-sarabun">กรอกข้อมูลผู้ใช้ให้ครบถ้วน</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="font-sarabun">
                    อีเมล
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="font-sarabun">
                    รหัสผ่าน {editingUser && "(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required={!editingUser} // Password is required only for new users
                  />
                </div>

                {!editingUser && (
                  <div>
                    <Label htmlFor="confirmPassword" className="font-sarabun">
                      ยืนยันรหัสผ่าน
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="role" className="font-sarabun">
                    บทบาท (Custom Role)
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกบทบาท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formError && <div className="text-red-600 text-sm font-sarabun">{formError}</div>}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit">{editingUser ? "บันทึกการแก้ไข" : "เพิ่มผู้ใช้"}</Button>
                </div>
              </form>
            </DialogContent>
            </Dialog>
          </div>
          {/* Close header wrapper */}
          </div>

          <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">รายการผู้ใช้</CardTitle>
            <CardDescription className="font-sarabun">จำนวนผู้ใช้ทั้งหมด: {users.length} รายการ</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sarabun">อีเมล</TableHead>
                  <TableHead className="font-sarabun">บทบาท</TableHead>
                  <TableHead className="font-sarabun">ยืนยันอีเมล</TableHead>
                  <TableHead className="font-sarabun">เข้าสู่ระบบล่าสุด</TableHead>
                  <TableHead className="font-sarabun">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium font-sarabun">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.user_metadata?.role)}>
                        {user.user_metadata?.role || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.email_confirmed_at ? (
                        <Badge variant="default">ยืนยันแล้ว</Badge>
                      ) : (
                        <Badge variant="destructive">ยังไม่ยืนยัน</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-sarabun">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("th-TH") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
