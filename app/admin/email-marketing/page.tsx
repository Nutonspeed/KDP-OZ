"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Mail, Users, Send, TrendingUp, Plus, Eye, Edit, Trash2, Play, Pause } from "lucide-react"

// Mock data for email campaigns
const mockCampaigns = [
  {
    id: 1,
    name: "Welcome Series - New Customers",
    type: "automation",
    status: "active",
    subject: "ยินดีต้อนรับสู่ KDP Engineering",
    sent: 1250,
    opened: 875,
    clicked: 156,
    openRate: 70.0,
    clickRate: 12.5,
    createdAt: "2024-01-15",
    scheduledAt: null,
  },
  {
    id: 2,
    name: "Monthly Product Newsletter",
    type: "newsletter",
    status: "sent",
    subject: "สินค้าใหม่ประจำเดือน - Conduit Body O-Z/Gedney",
    sent: 3200,
    opened: 1920,
    clicked: 384,
    openRate: 60.0,
    clickRate: 12.0,
    createdAt: "2024-01-01",
    scheduledAt: "2024-01-05",
  },
  {
    id: 3,
    name: "Abandoned Cart Recovery",
    type: "automation",
    status: "active",
    subject: "อย่าลืมสินค้าในตะกร้าของคุณ",
    sent: 450,
    opened: 270,
    clicked: 81,
    openRate: 60.0,
    clickRate: 18.0,
    createdAt: "2024-01-10",
    scheduledAt: null,
  },
  {
    id: 4,
    name: "Special Promotion - Chinese New Year",
    type: "campaign",
    status: "draft",
    subject: "โปรโมชั่นพิเศษ ตรุษจีน 2024",
    sent: 0,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: "2024-01-20",
    scheduledAt: "2024-02-10",
  },
]

const mockSubscribers = [
  {
    id: 1,
    email: "somchai@company.com",
    name: "สมชาย วิศวกร",
    status: "active",
    subscribed: "2024-01-15",
    tags: ["customer", "engineer"],
    lastActivity: "2024-01-25",
  },
  {
    id: 2,
    email: "niran@construction.com",
    name: "นิรันดร์ ช่างไฟฟ้า",
    status: "active",
    subscribed: "2024-01-10",
    tags: ["prospect", "electrician"],
    lastActivity: "2024-01-24",
  },
  {
    id: 3,
    email: "prayut@industrial.com",
    name: "ประยุทธ์ หัวหน้าโครงการ",
    status: "unsubscribed",
    subscribed: "2024-01-05",
    tags: ["customer", "manager"],
    lastActivity: "2024-01-20",
  },
]

const performanceData = [
  { month: "ม.ค.", sent: 2800, opened: 1680, clicked: 336 },
  { month: "ก.พ.", sent: 3200, opened: 1920, clicked: 384 },
  { month: "มี.ค.", sent: 2900, opened: 1740, clicked: 348 },
  { month: "เม.ย.", sent: 3500, opened: 2100, clicked: 420 },
  { month: "พ.ค.", sent: 3100, opened: 1860, clicked: 372 },
]

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [subscribers, setSubscribers] = useState(mockSubscribers)
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">ใช้งาน</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">ส่งแล้ว</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">ร่าง</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">หยุดชั่วคราว</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSubscriberStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">ใช้งาน</Badge>
      case "unsubscribed":
        return <Badge className="bg-red-100 text-red-800">ยกเลิก</Badge>
      case "bounced":
        return <Badge className="bg-yellow-100 text-yellow-800">ส่งไม่ได้</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
  const totalOpened = campaigns.reduce((sum, campaign) => sum + campaign.opened, 0)
  const totalClicked = campaigns.reduce((sum, campaign) => sum + campaign.clicked, 0)
  const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
  const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600 mt-2">จัดการแคมเปญอีเมลและผู้สมัครรับข่าวสาร</p>
        </div>
        <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              สร้างแคมเปญใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>สร้างแคมเปญอีเมลใหม่</DialogTitle>
              <DialogDescription>เลือกประเภทแคมเปญและกำหนดรายละเอียด</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignType">ประเภทแคมเปญ</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทแคมเปญ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotion">โปรโมชั่น</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="announcement">ประกาศ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="campaignName">ชื่อแคมเปญ</Label>
                <Input id="campaignName" placeholder="เช่น Monthly Newsletter January 2024" />
              </div>
              <div>
                <Label htmlFor="subject">หัวข้ออีเมล</Label>
                <Input id="subject" placeholder="หัวข้อที่จะแสดงในกล่องจดหมาย" />
              </div>
              <div>
                <Label htmlFor="template">เทมเพลต</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเทมเพลต" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter Template</SelectItem>
                    <SelectItem value="promotion">Promotion Template</SelectItem>
                    <SelectItem value="welcome">Welcome Email Template</SelectItem>
                    <SelectItem value="custom">Custom Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">เนื้อหาอีเมล</Label>
                <Textarea id="content" placeholder="เขียนเนื้อหาอีเมลของคุณ..." className="min-h-[120px]" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateCampaignOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => setIsCreateCampaignOpen(false)}>สร้างแคมเปญ</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">อีเมลที่ส่ง</p>
                <p className="text-2xl font-bold text-gray-900">{totalSent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">อัตราการเปิด</p>
                <p className="text-2xl font-bold text-gray-900">{avgOpenRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">อัตราการคลิก</p>
                <p className="text-2xl font-bold text-gray-900">{avgClickRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ผู้สมัครรับข่าว</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Send className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">แคมเปญใช้งาน</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">แคมเปญ</TabsTrigger>
          <TabsTrigger value="subscribers">ผู้สมัครรับข่าว</TabsTrigger>
          <TabsTrigger value="templates">เทมเพลต</TabsTrigger>
          <TabsTrigger value="analytics">วิเคราะห์ผล</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>แคมเปญทั้งหมด</CardTitle>
              <CardDescription>จัดการและติดตามแคมเปญอีเมลของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อแคมเปญ</TableHead>
                    <TableHead>ประเภท</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>ส่งแล้ว</TableHead>
                    <TableHead>เปิดแล้ว</TableHead>
                    <TableHead>คลิกแล้ว</TableHead>
                    <TableHead>อัตราเปิด</TableHead>
                    <TableHead>อัตราคลิก</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-500">{campaign.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell>{campaign.opened.toLocaleString()}</TableCell>
                      <TableCell>{campaign.clicked.toLocaleString()}</TableCell>
                      <TableCell>{campaign.openRate.toFixed(1)}%</TableCell>
                      <TableCell>{campaign.clickRate.toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {campaign.status === "active" ? (
                            <Button variant="outline" size="sm">
                              <Pause className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ผู้สมัครรับข่าวสาร</CardTitle>
              <CardDescription>จัดการรายชื่อผู้สมัครรับข่าวสาร</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Input placeholder="ค้นหาอีเมล..." className="w-64" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="สถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="active">ใช้งาน</SelectItem>
                      <SelectItem value="unsubscribed">ยกเลิก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มผู้สมัคร
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>วันที่สมัคร</TableHead>
                    <TableHead>แท็ก</TableHead>
                    <TableHead>กิจกรรมล่าสุด</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell>{subscriber.name}</TableCell>
                      <TableCell>{getSubscriberStatusBadge(subscriber.status)}</TableCell>
                      <TableCell>{new Date(subscriber.subscribed).toLocaleDateString("th-TH")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {subscriber.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(subscriber.lastActivity).toLocaleDateString("th-TH")}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Template</CardTitle>
                <CardDescription>เทมเพลตสำหรับจดหมายข่าวประจำเดือน</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    ดูตัวอย่าง
                  </Button>
                  <Button size="sm" className="flex-1">
                    ใช้เทมเพลต
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Promotion Template</CardTitle>
                <CardDescription>เทมเพลตสำหรับโปรโมชั่นพิเศษ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    ดูตัวอย่าง
                  </Button>
                  <Button size="sm" className="flex-1">
                    ใช้เทมเพลต
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Welcome Email</CardTitle>
                <CardDescription>เทมเพลตต้อนรับสมาชิกใหม่</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    ดูตัวอย่าง
                  </Button>
                  <Button size="sm" className="flex-1">
                    ใช้เทมเพลต
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ประสิทธิภาพแคมเปญตามเวลา</CardTitle>
              <CardDescription>ติดตามการส่งอีเมลและการตอบสนองในแต่ละเดือน</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sent: {
                    label: "ส่งแล้ว",
                    color: "hsl(var(--chart-1))",
                  },
                  opened: {
                    label: "เปิดแล้ว",
                    color: "hsl(var(--chart-2))",
                  },
                  clicked: {
                    label: "คลิกแล้ว",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sent" fill="var(--color-sent)" name="ส่งแล้ว" />
                    <Bar dataKey="opened" fill="var(--color-opened)" name="เปิดแล้ว" />
                    <Bar dataKey="clicked" fill="var(--color-clicked)" name="คลิกแล้ว" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>แคมเปญที่ดีที่สุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns
                    .filter((c) => c.sent > 0)
                    .sort((a, b) => b.clickRate - a.clickRate)
                    .slice(0, 3)
                    .map((campaign, index) => (
                      <div key={campaign.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-500">อัตราคลิก: {campaign.clickRate.toFixed(1)}%</p>
                        </div>
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>สถิติรวม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">อีเมลส่งทั้งหมด</span>
                    <span className="font-bold">{totalSent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">อัตราการเปิดเฉลี่ย</span>
                    <span className="font-bold text-green-600">{avgOpenRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">อัตราการคลิกเฉลี่ย</span>
                    <span className="font-bold text-blue-600">{avgClickRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ผู้สมัครใหม่เดือนนี้</span>
                    <span className="font-bold text-purple-600">+24</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
