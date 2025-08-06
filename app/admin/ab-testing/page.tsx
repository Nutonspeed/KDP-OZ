"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Play, Pause, BarChart3, TrendingUp, Target, Plus, Eye } from "lucide-react"

// Mock data for A/B tests
const mockABTests = [
  {
    id: 1,
    name: "Homepage Hero Button Color",
    status: "running",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    variants: [
      { name: "Control (Blue)", visitors: 1250, conversions: 87, conversionRate: 6.96 },
      { name: "Variant A (Green)", visitors: 1180, conversions: 102, conversionRate: 8.64 },
    ],
    confidence: 85.2,
    winner: "Variant A",
    description: "Testing green vs blue CTA button on homepage",
  },
  {
    id: 2,
    name: "Product Page Layout",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    variants: [
      { name: "Control", visitors: 2100, conversions: 168, conversionRate: 8.0 },
      { name: "Variant A", visitors: 2050, conversions: 205, conversionRate: 10.0 },
    ],
    confidence: 95.8,
    winner: "Variant A",
    description: "Testing new product page layout with larger images",
  },
  {
    id: 3,
    name: "Checkout Process",
    status: "draft",
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    variants: [
      { name: "Control", visitors: 0, conversions: 0, conversionRate: 0 },
      { name: "Variant A", visitors: 0, conversions: 0, conversionRate: 0 },
    ],
    confidence: 0,
    winner: null,
    description: "Testing simplified checkout process",
  },
]

const performanceData = [
  { date: "2024-01-01", control: 6.5, variant: 7.2 },
  { date: "2024-01-08", control: 6.8, variant: 7.8 },
  { date: "2024-01-15", control: 7.0, variant: 8.1 },
  { date: "2024-01-22", control: 6.9, variant: 8.4 },
  { date: "2024-01-29", control: 7.1, variant: 8.6 },
]

export default function ABTestingPage() {
  const [tests, setTests] = useState(mockABTests)
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-100 text-green-800">กำลังทดสอบ</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">เสร็จสิ้น</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">ร่าง</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateSignificance = (control: any, variant: any) => {
    // Simplified statistical significance calculation
    const n1 = control.visitors
    const n2 = variant.visitors
    const p1 = control.conversions / n1
    const p2 = variant.conversions / n2

    if (n1 === 0 || n2 === 0) return 0

    const pooled = (control.conversions + variant.conversions) / (n1 + n2)
    const se = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2))
    const z = Math.abs(p2 - p1) / se

    // Convert z-score to confidence percentage (simplified)
    return Math.min(99.9, Math.max(0, (1 - 2 * (1 - 0.8413 * z)) * 100))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">A/B Testing</h1>
          <p className="text-gray-600 mt-2">จัดการและวิเคราะห์การทดสอบ A/B เพื่อปรับปรุงประสิทธิภาพเว็บไซต์</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              สร้างการทดสอบใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>สร้างการทดสอบ A/B ใหม่</DialogTitle>
              <DialogDescription>กำหนดรายละเอียดการทดสอบและตัวแปรที่ต้องการเปรียบเทียบ</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="testName">ชื่อการทดสอบ</Label>
                <Input id="testName" placeholder="เช่น Homepage Button Color Test" />
              </div>
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea id="description" placeholder="อธิบายสิ่งที่ต้องการทดสอบ..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">วันที่เริ่ม</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">วันที่สิ้นสุด</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="trafficSplit">การแบ่งผู้เข้าชม (%)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกการแบ่งผู้เข้าชม" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50-50">50% - 50%</SelectItem>
                    <SelectItem value="70-30">70% - 30%</SelectItem>
                    <SelectItem value="80-20">80% - 20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>สร้างการทดสอบ</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">การทดสอบทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">กำลังทดสอบ</p>
                <p className="text-2xl font-bold text-gray-900">{tests.filter((t) => t.status === "running").length}</p>
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
                <p className="text-sm font-medium text-gray-600">อัตราการแปลงเฉลี่ย</p>
                <p className="text-2xl font-bold text-gray-900">8.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">การปรับปรุงเฉลี่ย</p>
                <p className="text-2xl font-bold text-gray-900">+15.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">การทดสอบทั้งหมด</TabsTrigger>
          <TabsTrigger value="performance">ประสิทธิภาพ</TabsTrigger>
          <TabsTrigger value="insights">ข้อมูลเชิงลึก</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid gap-6">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        {test.name}
                        {getStatusBadge(test.status)}
                      </CardTitle>
                      <CardDescription className="mt-2">{test.description}</CardDescription>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>เริ่ม: {new Date(test.startDate).toLocaleDateString("th-TH")}</span>
                        <span>สิ้นสุด: {new Date(test.endDate).toLocaleDateString("th-TH")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                      {test.status === "running" && (
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-2" />
                          หยุดการทดสอบ
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {test.status !== "draft" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {test.variants.map((variant, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-3">{variant.name}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">ผู้เข้าชม:</span>
                                <span className="font-medium">{variant.visitors.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">การแปลง:</span>
                                <span className="font-medium">{variant.conversions.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">อัตราการแปลง:</span>
                                <span className="font-bold text-blue-600">{variant.conversionRate.toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {test.confidence > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">ความเชื่อมั่นทางสถิติ</span>
                            <span className="text-lg font-bold text-green-600">{test.confidence.toFixed(1)}%</span>
                          </div>
                          <Progress value={test.confidence} className="mb-2" />
                          {test.winner && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold text-green-600">{test.winner}</span> มีประสิทธิภาพดีกว่า
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ประสิทธิภาพการทดสอบตามเวลา</CardTitle>
              <CardDescription>เปรียบเทียบอัตราการแปลงระหว่าง Control และ Variant</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  control: {
                    label: "Control",
                    color: "hsl(var(--chart-1))",
                  },
                  variant: {
                    label: "Variant",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="control"
                      stroke="var(--color-control)"
                      name="Control"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="variant"
                      stroke="var(--color-variant)"
                      name="Variant"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อเสนอแนะ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ การปรับปรุงที่แนะนำ</h4>
                  <p className="text-sm text-green-700">ปุ่ม CTA สีเขียวให้ผลลัพธ์ดีกว่าสีน้ำเงิน 24% ควรนำไปใช้ทั่วเว็บไซต์</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 การทดสอบต่อไป</h4>
                  <p className="text-sm text-blue-700">ทดสอบข้อความบนปุ่ม CTA เพื่อเพิ่มอัตราการแปลงเพิ่มเติม</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ ข้อควรระวัง</h4>
                  <p className="text-sm text-yellow-700">
                    การทดสอบ Checkout Process ยังไม่มีข้อมูลเพียงพอ ควรรอให้ครบ 2 สัปดาห์
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>สถิติการทดสอบ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">การทดสอบที่สำเร็จ</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">การปรับปรุงเฉลี่ย</span>
                    <span className="font-bold text-green-600">+15.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ผู้เข้าชมทั้งหมด</span>
                    <span className="font-bold">12,580</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">การแปลงเพิ่มขึ้น</span>
                    <span className="font-bold text-blue-600">+127</span>
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
