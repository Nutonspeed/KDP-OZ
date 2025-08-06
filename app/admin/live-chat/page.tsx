"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Users, Clock, TrendingUp, Send, Mail, User } from "lucide-react"

// Mock data for chat conversations
const mockConversations = [
  {
    id: 1,
    customer: {
      name: "สมชาย วิศวกร",
      email: "somchai@company.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    agent: {
      name: "นางสาวมาลี",
      id: "agent_001",
    },
    status: "active",
    priority: "high",
    startTime: "2024-01-25T10:30:00",
    lastMessage: "ขอบคุณครับ ผมจะรอใบเสนอราคา",
    unreadCount: 0,
    tags: ["quote-request", "conduit-body"],
    messages: [
      {
        id: 1,
        sender: "customer",
        message: "สวัสดีครับ ผมต้องการสอบถามเรื่อง Conduit Body O-Z/Gedney",
        timestamp: "2024-01-25T10:30:00",
        type: "text",
      },
      {
        id: 2,
        sender: "agent",
        message: "สวัสดีค่ะ ยินดีให้คำปรึกษาค่ะ คุณต้องการรุ่นไหนคะ?",
        timestamp: "2024-01-25T10:31:00",
        type: "text",
      },
      {
        id: 3,
        sender: "customer",
        message: 'ผมต้องการ LB Series ขนาด 1/2" ถึง 2" ประมาณ 50 ชิ้น',
        timestamp: "2024-01-25T10:32:00",
        type: "text",
      },
      {
        id: 4,
        sender: "agent",
        message: "ได้ค่ะ ขอให้ทีมเตรียมใบเสนอราคาให้นะคะ ประมาณ 30 นาทีค่ะ",
        timestamp: "2024-01-25T10:33:00",
        type: "text",
      },
      {
        id: 5,
        sender: "customer",
        message: "ขอบคุณครับ ผมจะรอใบเสนอราคา",
        timestamp: "2024-01-25T10:34:00",
        type: "text",
      },
    ],
  },
  {
    id: 2,
    customer: {
      name: "นิรันดร์ ช่างไฟฟ้า",
      email: "niran@construction.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    agent: {
      name: "คุณสมหมาย",
      id: "agent_002",
    },
    status: "waiting",
    priority: "medium",
    startTime: "2024-01-25T11:15:00",
    lastMessage: "มีสต็อกไหมครับ?",
    unreadCount: 2,
    tags: ["stock-inquiry"],
    messages: [
      {
        id: 1,
        sender: "customer",
        message: 'สอบถามสต็อก T Series 3/4" ครับ',
        timestamp: "2024-01-25T11:15:00",
        type: "text",
      },
      {
        id: 2,
        sender: "customer",
        message: "มีสต็อกไหมครับ?",
        timestamp: "2024-01-25T11:16:00",
        type: "text",
      },
    ],
  },
  {
    id: 3,
    customer: {
      name: "ประยุทธ์ หัวหน้าโครงการ",
      email: "prayut@industrial.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    agent: null,
    status: "closed",
    priority: "low",
    startTime: "2024-01-25T09:00:00",
    lastMessage: "ขอบคุณครับ",
    unreadCount: 0,
    tags: ["completed"],
    messages: [],
  },
]

const mockAgents = [
  {
    id: "agent_001",
    name: "นางสาวมาลี",
    email: "malee@kdp.com",
    status: "online",
    activeChats: 2,
    totalChats: 45,
    avgResponseTime: "2.5 นาที",
    satisfaction: 4.8,
  },
  {
    id: "agent_002",
    name: "คุณสมหมาย",
    email: "sommai@kdp.com",
    status: "busy",
    activeChats: 3,
    totalChats: 38,
    avgResponseTime: "3.1 นาที",
    satisfaction: 4.6,
  },
  {
    id: "agent_003",
    name: "คุณวิชัย",
    email: "wichai@kdp.com",
    status: "offline",
    activeChats: 0,
    totalChats: 52,
    avgResponseTime: "2.8 นาที",
    satisfaction: 4.9,
  },
]

const cannedResponses = [
  {
    id: 1,
    title: "ทักทาย",
    message: "สวัสดีค่ะ ยินดีให้คำปรึกษาเรื่อง Conduit Body O-Z/Gedney ค่ะ มีอะไรให้ช่วยไหมคะ?",
  },
  {
    id: 2,
    title: "สอบถามใบเสนอราคา",
    message: "ขอให้ทีมเตรียมใบเสนอราคาให้นะคะ กรุณารอประมาณ 30 นาที เราจะส่งไปทางอีเมลค่ะ",
  },
  {
    id: 3,
    title: "ตรวจสอบสต็อก",
    message: "ขอเช็คสต็อกให้นะคะ รอสักครู่ค่ะ",
  },
  {
    id: 4,
    title: "ขอบคุณ",
    message: "ขอบคุณที่ติดต่อมาค่ะ หากมีคำถามเพิ่มเติม สามารถติดต่อมาได้ตลอดเวลาค่ะ",
  },
]

export default function LiveChatPage() {
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<any>(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [agents, setAgents] = useState(mockAgents)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">กำลังสนทนา</Badge>
      case "waiting":
        return <Badge className="bg-yellow-100 text-yellow-800">รอตอบ</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">ปิดแล้ว</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">สูง</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">ปานกลาง</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">ต่ำ</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getAgentStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">ออนไลน์</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800">ไม่ว่าง</Badge>
      case "offline":
        return <Badge className="bg-gray-100 text-gray-800">ออฟไลน์</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message = {
      id: selectedConversation.messages.length + 1,
      sender: "agent",
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    }

    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, message],
      lastMessage: newMessage,
    }

    setSelectedConversation(updatedConversation)
    setConversations(conversations.map((conv) => (conv.id === selectedConversation.id ? updatedConversation : conv)))
    setNewMessage("")
  }

  const useCannedResponse = (response: string) => {
    setNewMessage(response)
  }

  const totalActiveChats = conversations.filter((c) => c.status === "active").length
  const totalWaitingChats = conversations.filter((c) => c.status === "waiting").length
  const avgResponseTime = "2.8 นาที"
  const customerSatisfaction = 4.7

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Chat Support</h1>
          <p className="text-gray-600 mt-2">จัดการการสนทนาและให้บริการลูกค้าแบบเรียลไทม์</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">การสนทนาที่ใช้งาน</p>
                <p className="text-2xl font-bold text-gray-900">{totalActiveChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">รอการตอบ</p>
                <p className="text-2xl font-bold text-gray-900">{totalWaitingChats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">เวลาตอบเฉลี่ย</p>
                <p className="text-2xl font-bold text-gray-900">{avgResponseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ความพึงพอใจ</p>
                <p className="text-2xl font-bold text-gray-900">{customerSatisfaction}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chat">การสนทนา</TabsTrigger>
          <TabsTrigger value="agents">เจ้าหน้าที่</TabsTrigger>
          <TabsTrigger value="settings">การตั้งค่า</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Chat List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">การสนทนาทั้งหมด</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 p-4">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? "bg-blue-50 border-blue-200 border"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={conversation.customer.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{conversation.customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{conversation.customer.name}</p>
                              <div className="flex gap-1 mt-1">
                                {getStatusBadge(conversation.status)}
                                {getPriorityBadge(conversation.priority)}
                              </div>
                            </div>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">{conversation.unreadCount}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(conversation.startTime).toLocaleTimeString("th-TH", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedConversation.customer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{selectedConversation.customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{selectedConversation.customer.name}</CardTitle>
                          <CardDescription>{selectedConversation.customer.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(selectedConversation.status)}
                        {getPriorityBadge(selectedConversation.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[350px] p-4">
                      <div className="space-y-4">
                        {selectedConversation.messages.map((message: any) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender === "agent" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender === "agent" ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {new Date(message.timestamp).toLocaleTimeString("th-TH", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="พิมพ์ข้อความ..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>เลือกการสนทนาเพื่อเริ่มต้น</p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Customer Info & Canned Responses */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">ข้อมูลลูกค้า & ข้อความสำเร็จรูป</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedConversation && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">ข้อมูลลูกค้า</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{selectedConversation.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{selectedConversation.customer.email}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedConversation.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">ข้อความสำเร็จรูป</h4>
                      <div className="space-y-2">
                        {cannedResponses.map((response) => (
                          <Button
                            key={response.id}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start h-auto p-2 bg-transparent"
                            onClick={() => useCannedResponse(response.message)}
                          >
                            <div>
                              <p className="font-medium text-xs">{response.title}</p>
                              <p className="text-xs text-gray-500 truncate">{response.message.substring(0, 40)}...</p>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>เจ้าหน้าที่ให้บริการ</CardTitle>
              <CardDescription>จัดการและติดตามประสิทธิภาพของเจ้าหน้าที่</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>การสนทนาที่ใช้งาน</TableHead>
                    <TableHead>การสนทนาทั้งหมด</TableHead>
                    <TableHead>เวลาตอบเฉลี่ย</TableHead>
                    <TableHead>ความพึงพอใจ</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-gray-500">{agent.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getAgentStatusBadge(agent.status)}</TableCell>
                      <TableCell>{agent.activeChats}</TableCell>
                      <TableCell>{agent.totalChats}</TableCell>
                      <TableCell>{agent.avgResponseTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{agent.satisfaction}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            ดูรายละเอียด
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

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>การตั้งค่าทั่วไป</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="businessHours">เวลาทำการ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกเวลาทำการ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24-7">24 ชั่วโมง</SelectItem>
                      <SelectItem value="business">เวลาทำการ (9:00-18:00)</SelectItem>
                      <SelectItem value="custom">กำหนดเอง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="autoResponse">ข้อความตอบกลับอัตโนมัติ</Label>
                  <Textarea
                    id="autoResponse"
                    placeholder="ข้อความที่จะแสดงเมื่อไม่มีเจ้าหน้าที่ออนไลน์"
                    defaultValue="สวัสดีค่ะ ขณะนี้เจ้าหน้าที่ไม่ว่าง กรุณาฝากข้อความไว้ เราจะติดต่อกลับโดยเร็วที่สุดค่ะ"
                  />
                </div>
                <div>
                  <Label htmlFor="maxChats">จำนวนการสนทนาสูงสุดต่อเจ้าหน้าที่</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจำนวน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 การสนทนา</SelectItem>
                      <SelectItem value="5">5 การสนทนา</SelectItem>
                      <SelectItem value="10">10 การสนทนา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>การแจ้งเตือน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotif">แจ้งเตือนทางอีเมล</Label>
                  <input type="checkbox" id="emailNotif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="soundNotif">เสียงแจ้งเตือน</Label>
                  <input type="checkbox" id="soundNotif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="desktopNotif">การแจ้งเตือนบนเดสก์ท็อป</Label>
                  <input type="checkbox" id="desktopNotif" />
                </div>
                <div>
                  <Label htmlFor="responseTime">เวลาแจ้งเตือนการตอบช้า (นาที)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกเวลา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 นาที</SelectItem>
                      <SelectItem value="5">5 นาที</SelectItem>
                      <SelectItem value="10">10 นาที</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
