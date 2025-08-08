"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Download } from 'lucide-react'
import { useAuthStore } from "@/lib/store" // Keep useAuthStore for client-side auth state
import { fetchLeads, updateLeadStatus, addNoteToLead } from "@/actions/leads" // Import new Server Actions
import type { Lead } from "@/lib/mockDb"

export default function AdminLeads() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    checkAuth() // Check auth state on mount
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated && !loading) { // Only redirect if not authenticated and done loading
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, loading])

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true)
      if (isAuthenticated) {
        const fetchedLeads = await fetchLeads()
        setLeads(fetchedLeads)
      }
      setLoading(false)
    }
    loadLeads()
  }, [isAuthenticated]) // Reload leads when auth state changes

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <p className="font-sarabun">กำลังโหลด...</p>
      </div>
    )
  }

  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    const result = await updateLeadStatus(leadId, newStatus)
    if (result.success) {
      // Optimistically update UI or refetch
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)),
      )
      // If the detailed view is open for this lead, update its status too
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } else {
      alert(`Failed to update status: ${result.error}`)
    }
  }

  const handleAddNote = async () => {
    if (selectedLead && newNote.trim()) {
      const result = await addNoteToLead(selectedLead.id, newNote.trim())
      if (result.success) {
        // Update selected lead to show new note
        const updatedLead = leads.find((l) => l.id === selectedLead.id)
        setSelectedLead(updatedLead || null) // Ensure selectedLead is updated
        setNewNote("")
        // Re-fetch leads to ensure consistency if needed, or update optimistically
        const fetchedLeads = await fetchLeads()
        setLeads(fetchedLeads)
      } else {
        alert(`Failed to add note: ${result.error}`)
      }
    }
  }

  const exportToCSV = () => {
    const headers = ["วันที่", "ชื่อลูกค้า", "บริษัท", "เบอร์โทร", "อีเมล", "สินค้าที่สนใจ", "ขนาด", "จำนวน", "สถานะ", "หมายเหตุ"]
    const csvContent = [
      headers.join(","),
      ...leads.map((lead) =>
        [
          new Date(lead.created_at).toLocaleDateString("th-TH"), // Use created_at
          lead.customer_name, // Use customer_name
          lead.company || "",
          lead.phone,
          lead.email,
          lead.product_interest, // Use product_interest
          lead.size || "",
          lead.quantity || "",
          lead.status,
          (lead.notes || []).join("; "),
        ]
          .map((field) => `"${field}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "รอติดต่อ":
        return "destructive"
      case "กำลังเจรจา":
        return "default"
      case "ปิดการขาย":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sarabun">จัดการ Leads</h1>
            <p className="text-gray-600 font-sarabun">ติดตามและจัดการลูกค้าที่สนใจ</p>
          </div>

          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-sarabun">รายการ Leads</CardTitle>
            <CardDescription className="font-sarabun">จำนวน Leads ทั้งหมด: {leads.length} รายการ</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sarabun">วันที่</TableHead>
                  <TableHead className="font-sarabun">ชื่อลูกค้า</TableHead>
                  <TableHead className="font-sarabun">บริษัท</TableHead>
                  <TableHead className="font-sarabun">ติดต่อ</TableHead>
                  <TableHead className="font-sarabun">สินค้าที่สนใจ</TableHead>
                  <TableHead className="font-sarabun">สถานะ</TableHead>
                  <TableHead className="font-sarabun">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-sarabun">
                      {new Date(lead.created_at).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell className="font-medium font-sarabun">{lead.customer_name}</TableCell>
                    <TableCell className="font-sarabun">{lead.company || "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-sarabun">{lead.phone}</div>
                        <div className="text-gray-500 font-sarabun">{lead.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-sarabun">
                      <div>
                        <div>{lead.product_interest}</div>
                        {lead.size && (
                          <div className="text-sm text-gray-500">
                            ขนาด: {lead.size}" จำนวน: {lead.quantity}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value as Lead["status"])}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="รอติดต่อ">รอติดต่อ</SelectItem>
                          <SelectItem value="กำลังเจรจา">กำลังเจรจา</SelectItem>
                          <SelectItem value="ปิดการขาย">ปิดการขาย</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Dialog onOpenChange={setIsDetailOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedLead(lead)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="font-sarabun">รายละเอียด Lead</DialogTitle>
                            <DialogDescription className="font-sarabun">ข้อมูลลูกค้าและการติดตาม</DialogDescription>
                          </DialogHeader>

                          {selectedLead && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-bold mb-2 font-sarabun">ข้อมูลลูกค้า</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>ชื่อ:</strong> {selectedLead.customer_name}
                                    </div>
                                    <div>
                                      <strong>บริษัท:</strong> {selectedLead.company || "-"}
                                    </div>
                                    <div>
                                      <strong>โทร:</strong> {selectedLead.phone}
                                    </div>
                                    <div>
                                      <strong>อีเมล:</strong> {selectedLead.email}
                                    </div>
                                    <div>
                                      <strong>ที่อยู่:</strong> {selectedLead.address || "-"}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-bold mb-2 font-sarabun">ข้อมูลสินค้า</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>สินค้า:</strong> {selectedLead.product_interest}
                                    </div>
                                    <div>
                                      <strong>ขนาด:</strong> {selectedLead.size || "-"}
                                    </div>
                                    <div>
                                      <strong>จำนวน:</strong> {selectedLead.quantity || "-"}
                                    </div>
                                    <div>
                                      <strong>สถานะ:</strong>
                                      <Badge variant={getStatusBadgeVariant(selectedLead.status)} className="ml-2">
                                        {selectedLead.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-bold mb-2 font-sarabun">บันทึกการติดตาม</h4>
                                <div className="space-y-2 mb-4">
                                  {selectedLead.notes && selectedLead.notes.length > 0 ? (
                                    selectedLead.notes.map((note: string, index: number) => (
                                      <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm font-sarabun">
                                        {note}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500 text-sm font-sarabun">ยังไม่มีบันทึก</p>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <Textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="เพิ่มบันทึกใหม่..."
                                    rows={2}
                                    className="flex-1 font-sarabun"
                                  />
                                  <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                                    เพิ่ม
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
