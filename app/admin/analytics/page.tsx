"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, ShoppingCart, Download, Calendar, Globe, Smartphone, Monitor, Tablet } from 'lucide-react'
import { useAuthStore } from "@/lib/store"
import { AnimatedCounter } from "@/components/AnimatedComponents"

export default function AdminAnalytics() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [dateRange, setDateRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Mock Analytics Data
  const overviewStats = [
    {
      title: "ผู้เยี่ยมชมทั้งหมด",
      value: 12847,
      change: 12.5,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "หน้าเว็บที่เข้าชม",
      value: 34521,
      change: 8.2,
      trend: "up",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "อัตราการคลิก",
      value: 3.4,
      change: -2.1,
      trend: "down",
      icon: MousePointer,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      suffix: "%"
    },
    {
      title: "การแปลงเป็นลีด",
      value: 247,
      change: 15.8,
      trend: "up",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  const trafficData = [
    { date: "01/01", visitors: 1200, pageviews: 3400, bounceRate: 45 },
    { date: "02/01", visitors: 1350, pageviews: 3800, bounceRate: 42 },
    { date: "03/01", visitors: 1100, pageviews: 3200, bounceRate: 48 },
    { date: "04/01", visitors: 1450, pageviews: 4100, bounceRate: 38 },
    { date: "05/01", visitors: 1600, pageviews: 4500, bounceRate: 35 },
    { date: "06/01", visitors: 1380, pageviews: 3900, bounceRate: 41 },
    { date: "07/01", visitors: 1520, pageviews: 4300, bounceRate: 37 },
    { date: "08/01", visitors: 1750, pageviews: 4900, bounceRate: 33 },
    { date: "09/01", visitors: 1650, pageviews: 4600, bounceRate: 36 },
    { date: "10/01", visitors: 1800, pageviews: 5100, bounceRate: 31 },
    { date: "11/01", visitors: 1920, pageviews: 5400, bounceRate: 29 },
    { date: "12/01", visitors: 2100, pageviews: 5900, bounceRate: 27 }
  ]

  const conversionFunnelData = [
    { stage: "เข้าชมเว็บไซต์", visitors: 10000, percentage: 100 },
    { stage: "ดูหน้าสินค้า", visitors: 6500, percentage: 65 },
    { stage: "เพิ่มในตะกร้า", visitors: 2800, percentage: 28 },
    { stage: "เริ่มกรอกฟอร์ม", visitors: 1200, percentage: 12 },
    { stage: "ส่งคำขอใบเสนอราคา", visitors: 850, percentage: 8.5 }
  ]

  const trafficSourcesData = [
    { name: "Organic Search", value: 45, color: "#3B82F6" },
    { name: "Direct", value: 25, color: "#10B981" },
    { name: "Social Media", value: 15, color: "#F59E0B" },
    { name: "Referral", value: 10, color: "#EF4444" },
    { name: "Email", value: 5, color: "#8B5CF6" }
  ]

  const deviceData = [
    { device: "Desktop", sessions: 8500, percentage: 68 },
    { device: "Mobile", sessions: 3200, percentage: 26 },
    { device: "Tablet", sessions: 750, percentage: 6 }
  ]

  const topPagesData = [
    { page: "/", views: 12500, bounceRate: 25, avgTime: "2:45" },
    { page: "/products", views: 8900, bounceRate: 32, avgTime: "3:12" },
    { page: "/products/oz-gedney-lb-75-conduit-body", views: 5600, bounceRate: 28, avgTime: "4:20" },
    { page: "/contact", views: 4200, bounceRate: 15, avgTime: "1:55" },
    { page: "/order", views: 3800, bounceRate: 22, avgTime: "5:30" },
    { page: "/about", views: 2900, bounceRate: 35, avgTime: "2:10" }
  ]

  const leadSourcesData = [
    { source: "Contact Form", leads: 145, conversion: 12.5 },
    { source: "Product Inquiry", leads: 89, conversion: 8.9 },
    { source: "Phone Call", leads: 67, conversion: 15.2 },
    { source: "Live Chat", leads: 43, conversion: 18.7 },
    { source: "Email", leads: 28, conversion: 9.8 }
  ]

  const revenueData = [
    { month: "ม.ค.", revenue: 450000, orders: 45, avgOrder: 10000 },
    { month: "ก.พ.", revenue: 520000, orders: 52, avgOrder: 10000 },
    { month: "มี.ค.", revenue: 680000, orders: 62, avgOrder: 10968 },
    { month: "เม.ย.", revenue: 750000, orders: 68, avgOrder: 11029 },
    { month: "พ.ค.", revenue: 890000, orders: 78, avgOrder: 11410 },
    { month: "มิ.ย.", revenue: 920000, orders: 82, avgOrder: 11220 }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sarabun">Analytics Dashboard</h1>
            <p className="text-gray-600 font-sarabun">ภาพรวมการใช้งานเว็บไซต์และประสิทธิภาพการตลาด</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 วันที่ผ่านมา</SelectItem>
                <SelectItem value="30d">30 วันที่ผ่านมา</SelectItem>
                <SelectItem value="90d">90 วันที่ผ่านมา</SelectItem>
                <SelectItem value="1y">1 ปีที่ผ่านมา</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="font-sarabun">ภาพรวม</TabsTrigger>
            <TabsTrigger value="traffic" className="font-sarabun">การเข้าชม</TabsTrigger>
            <TabsTrigger value="conversions" className="font-sarabun">การแปลง</TabsTrigger>
            <TabsTrigger value="revenue" className="font-sarabun">รายได้</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => (
                <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 font-sarabun">{stat.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl font-bold text-slate-900">
                            <AnimatedCounter end={stat.value} duration={1500} suffix={stat.suffix} />
                          </span>
                          <div className={`flex items-center gap-1 text-sm ${
                            stat.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}>
                            {stat.trend === "up" ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {Math.abs(stat.change)}%
                          </div>
                        </div>
                      </div>
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Traffic Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">ภาพรวมการเข้าชม</CardTitle>
                <CardDescription className="font-sarabun">
                  จำนวนผู้เยี่ยมชมและหน้าเว็บที่เข้าชมในช่วง 30 วันที่ผ่านมา
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="visitors" 
                        stackId="1" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6}
                        name="ผู้เยี่ยมชม"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pageviews" 
                        stackId="2" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.6}
                        name="หน้าเว็บที่เข้าชม"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">แหล่งที่มาของการเข้าชม</CardTitle>
                  <CardDescription className="font-sarabun">
                    ช่องทางที่ผู้เยี่ยมชมเข้ามายังเว็บไซต์
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficSourcesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {trafficSourcesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">อุปกรณ์ที่ใช้เข้าชม</CardTitle>
                  <CardDescription className="font-sarabun">
                    ประเภทอุปกรณ์ที่ผู้เยี่ยมชมใช้
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceData.map((device) => (
                      <div key={device.device} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {device.device === "Desktop" && <Monitor className="w-5 h-5 text-blue-600" />}
                          {device.device === "Mobile" && <Smartphone className="w-5 h-5 text-green-600" />}
                          {device.device === "Tablet" && <Tablet className="w-5 h-5 text-purple-600" />}
                          <span className="font-medium font-sarabun">{device.device}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <Progress value={device.percentage} className="h-2" />
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">
                            {device.sessions.toLocaleString()} ({device.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">หน้าเว็บยอดนิยม</CardTitle>
                  <CardDescription className="font-sarabun">
                    หน้าเว็บที่มีผู้เข้าชมมากที่สุด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPagesData.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{page.page}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                            <span>{page.views.toLocaleString()} views</span>
                            <span>{page.bounceRate}% bounce</span>
                            <span>{page.avgTime} avg time</span>
                          </div>
                        </div>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bounce Rate Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">อัตราการออกจากเว็บไซต์</CardTitle>
                  <CardDescription className="font-sarabun">
                    แนวโน้มอัตราการออกจากเว็บไซต์
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="bounceRate" 
                          stroke="#EF4444" 
                          strokeWidth={2}
                          name="Bounce Rate (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversions Tab */}
          <TabsContent value="conversions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">Conversion Funnel</CardTitle>
                  <CardDescription className="font-sarabun">
                    การเปลี่ยนแปลงจากผู้เยี่ยมชมเป็นลูกค้า
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionFunnelData.map((stage, index) => (
                      <div key={stage.stage} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium font-sarabun">{stage.stage}</span>
                          <span className="text-sm text-gray-600">
                            {stage.visitors.toLocaleString()} ({stage.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${stage.percentage}%` }}
                          ></div>
                        </div>
                        {index < conversionFunnelData.length - 1 && (
                          <div className="flex justify-center mt-2">
                            <TrendingDown className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lead Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sarabun">แหล่งที่มาของลีด</CardTitle>
                  <CardDescription className="font-sarabun">
                    ช่องทางที่สร้างลีดมากที่สุด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leadSourcesData.map((source) => (
                      <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm font-sarabun">{source.source}</p>
                          <p className="text-xs text-gray-600">{source.leads} leads</p>
                        </div>
                        <Badge variant="secondary">{source.conversion}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">แนวโน้มรายได้</CardTitle>
                <CardDescription className="font-sarabun">
                  รายได้และจำนวนคำสั่งซื้อรายเดือน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3B82F6" name="รายได้ (บาท)" />
                      <Bar dataKey="orders" fill="#10B981" name="จำนวนคำสั่งซื้อ" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    ฿<AnimatedCounter end={4210000} duration={2000} />
                  </div>
                  <p className="text-sm text-gray-600 font-sarabun">รายได้รวม 6 เดือน</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    <AnimatedCounter end={387} duration={2000} />
                  </div>
                  <p className="text-sm text-gray-600 font-sarabun">คำสั่งซื้อทั้งหมด</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    ฿<AnimatedCounter end={10880} duration={2000} />
                  </div>
                  <p className="text-sm text-gray-600 font-sarabun">มูลค่าเฉลี่ยต่อคำสั่งซื้อ</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
