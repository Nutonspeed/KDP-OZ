"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { MousePointer, DollarSign, Eye, Plus, Play, Pause, Settings, BarChart3, Target } from "lucide-react"
import { useAuthStore, useMarketingStore } from "@/lib/store"

export default function MarketingDashboard() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { campaigns, analytics, createCampaign, updateCampaign } = useMarketingStore()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    objective: "",
    budget: "",
    audience: "",
    adContent: "",
    targetProduct: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleCreateCampaign = () => {
    createCampaign({
      ...newCampaign,
      budget: Number.parseFloat(newCampaign.budget),
      status: "draft",
    })
    setNewCampaign({
      name: "",
      objective: "",
      budget: "",
      audience: "",
      adContent: "",
      targetProduct: "",
    })
    setIsCreateDialogOpen(false)
  }

  const campaignData = [
    { name: "Campaign A", impressions: 12500, clicks: 450, conversions: 23 },
    { name: "Campaign B", impressions: 8900, clicks: 320, conversions: 18 },
    { name: "Campaign C", impressions: 15600, clicks: 680, conversions: 35 },
  ]

  const conversionData = [
    { date: "1/1", conversions: 12 },
    { date: "1/2", conversions: 19 },
    { date: "1/3", conversions: 15 },
    { date: "1/4", conversions: 25 },
    { date: "1/5", conversions: 22 },
    { date: "1/6", conversions: 30 },
    { date: "1/7", conversions: 28 },
  ]

  const audienceData = [
    { name: "วิศวกร", value: 35, color: "#3b82f6" },
    { name: "ช่างไฟฟ้า", value: 28, color: "#10b981" },
    { name: "ผู้จัดการโครงการ", value: 22, color: "#f59e0b" },
    { name: "อื่นๆ", value: 15, color: "#ef4444" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sarabun">Marketing Dashboard</h1>
            <p className="text-gray-600 font-sarabun">จัดการ Facebook Ads และการตลาดออนไลน์</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                สร้าง Campaign ใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-sarabun">สร้าง Facebook Ad Campaign</DialogTitle>
                <DialogDescription className="font-sarabun">กำหนดรายละเอียดสำหรับ Campaign ใหม่</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaignName" className="font-sarabun">
                    ชื่อ Campaign
                  </Label>
                  <Input
                    id="campaignName"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="เช่น Conduit Body LB - Q1 2024"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="objective" className="font-sarabun">
                      วัตถุประสงค์
                    </Label>
                    <Select
                      value={newCampaign.objective}
                      onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, objective: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกวัตถุประสงค์" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traffic">เพิ่มการเข้าชมเว็บไซต์</SelectItem>
                        <SelectItem value="conversions">เพิ่มการแปลงลูกค้า</SelectItem>
                        <SelectItem value="leads">สร้าง Leads</SelectItem>
                        <SelectItem value="awareness">สร้างการรับรู้แบรนด์</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget" className="font-sarabun">
                      งบประมาณ (บาท/วัน)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={newCampaign.budget}
                      onChange={(e) => setNewCampaign((prev) => ({ ...prev, budget: e.target.value }))}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="audience" className="font-sarabun">
                    กลุ่มเป้าหมาย
                  </Label>
                  <Select
                    value={newCampaign.audience}
                    onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, audience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกกลุ่มเป้าหมาย" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineers">วิศวกรไฟฟ้า</SelectItem>
                      <SelectItem value="electricians">ช่างไฟฟ้า</SelectItem>
                      <SelectItem value="contractors">ผู้รับเหมา</SelectItem>
                      <SelectItem value="project-managers">ผู้จัดการโครงการ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetProduct" className="font-sarabun">
                    สินค้าเป้าหมาย
                  </Label>
                  <Select
                    value={newCampaign.targetProduct}
                    onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, targetProduct: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสินค้า" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conduit-body-lb">Conduit Body LB</SelectItem>
                      <SelectItem value="conduit-body-c">Conduit Body C</SelectItem>
                      <SelectItem value="conduit-body-t">Conduit Body T</SelectItem>
                      <SelectItem value="conduit-body-ll">Conduit Body LL</SelectItem>
                      <SelectItem value="conduit-body-lr">Conduit Body LR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adContent" className="font-sarabun">
                    เนื้อหาโฆษณา
                  </Label>
                  <Textarea
                    id="adContent"
                    value={newCampaign.adContent}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, adContent: e.target.value }))}
                    placeholder="เขียนข้อความโฆษณาที่น่าสนใจ..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button onClick={handleCreateCampaign}>สร้าง Campaign</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="font-sarabun">
              ภาพรวม
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="font-sarabun">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-sarabun">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="audiences" className="font-sarabun">
              กลุ่มเป้าหมาย
            </TabsTrigger>
            <TabsTrigger value="pixels" className="font-sarabun">
              Facebook Pixel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-sarabun">Total Impressions</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,847,392</div>
                  <p className="text-xs text-muted-foreground font-sarabun">+12.5% จากเดือนที่แล้ว</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-sarabun">Clicks</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45,231</div>
                  <p className="text-xs text-muted-foreground font-sarabun">+8.2% จากเดือนที่แล้ว</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-sarabun">Conversions</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground font-sarabun">+15.3% จากเดือนที่แล้ว</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-sarabun">ROAS</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2x</div>
                  <p className="text-xs text-muted-foreground font-sarabun">+0.3x จากเดือนที่แล้ว</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">Performance by Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={campaignData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="impressions" fill="#3b82f6" />
                      <Bar dataKey="clicks" fill="#10b981" />
                      <Bar dataKey="conversions" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">Conversion Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="conversions" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">Active Campaigns</CardTitle>
                <CardDescription className="font-sarabun">จัดการและติดตาม Facebook Ad Campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sarabun">Campaign</TableHead>
                      <TableHead className="font-sarabun">สถานะ</TableHead>
                      <TableHead className="font-sarabun">งบประมาณ</TableHead>
                      <TableHead className="font-sarabun">Impressions</TableHead>
                      <TableHead className="font-sarabun">Clicks</TableHead>
                      <TableHead className="font-sarabun">CTR</TableHead>
                      <TableHead className="font-sarabun">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium font-sarabun">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                            {campaign.status === "active" ? "กำลังทำงาน" : "หยุดชั่วคราว"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-sarabun">฿{campaign.budget.toLocaleString()}/วัน</TableCell>
                        <TableCell>{campaign.impressions?.toLocaleString() || "-"}</TableCell>
                        <TableCell>{campaign.clicks?.toLocaleString() || "-"}</TableCell>
                        <TableCell>{campaign.ctr || "-"}%</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              {campaign.status === "active" ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="w-4 h-4" />
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-sarabun">Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <span className="font-sarabun">Impressions</span>
                      <span className="font-bold">2,847,392</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <span className="font-sarabun">Clicks</span>
                      <span className="font-bold">45,231 (1.59%)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <span className="font-sarabun">Landing Page Views</span>
                      <span className="font-bold">38,947 (86.1%)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <span className="font-sarabun">Form Submissions</span>
                      <span className="font-bold">1,247 (3.2%)</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <span className="font-sarabun">Qualified Leads</span>
                      <span className="font-bold">892 (71.5%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">Audience Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {audienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audiences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">Custom Audiences</CardTitle>
                <CardDescription className="font-sarabun">จัดการกลุ่มเป้าหมายสำหรับ Facebook Ads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-sarabun">วิศวกรไฟฟ้า</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">ขนาด:</span>
                          <span className="text-sm font-bold">45,230 คน</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">อายุ:</span>
                          <span className="text-sm">25-45 ปี</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">สถานะ:</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-sarabun">ช่างไฟฟ้า</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">ขนาด:</span>
                          <span className="text-sm font-bold">32,150 คน</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">อายุ:</span>
                          <span className="text-sm">20-50 ปี</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">สถานะ:</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-sarabun">ผู้รับเหมา</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">ขนาด:</span>
                          <span className="text-sm font-bold">18,940 คน</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">อายุ:</span>
                          <span className="text-sm">30-55 ปี</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-sarabun">สถานะ:</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pixels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">Facebook Pixel Setup</CardTitle>
                <CardDescription className="font-sarabun">
                  ติดตั้งและจัดการ Facebook Pixel สำหรับติดตามการแปลง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-bold text-green-800 font-sarabun">Pixel Status: Active</span>
                    </div>
                    <p className="text-sm text-green-700 font-sarabun">
                      Facebook Pixel ID: 1234567890123456 กำลังทำงานปกติ
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-sarabun">Events Tracked</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-sarabun">Page View</span>
                            <Badge variant="default">Active</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-sarabun">View Content</span>
                            <Badge variant="default">Active</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-sarabun">Add to Cart</span>
                            <Badge variant="default">Active</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-sarabun">Lead</span>
                            <Badge variant="default">Active</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-sarabun">Purchase</span>
                            <Badge variant="secondary">Inactive</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-sarabun">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-sarabun">Page Views (24h)</span>
                            <span className="font-bold">2,847</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-sarabun">Product Views (24h)</span>
                            <span className="font-bold">1,234</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-sarabun">Leads (24h)</span>
                            <span className="font-bold">45</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-sarabun">Form Submissions (24h)</span>
                            <span className="font-bold">23</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-sarabun">Pixel Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <code className="text-sm">
                          {`<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1234567890123456');
fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->`}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
