"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Phone, Mail, Clock, User, Bot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "agent" | "bot"
  timestamp: Date
  type?: "text" | "quick-reply" | "contact-info"
}

const quickReplies = ["สอบถามราคาสินค้า", "ขอใบเสนอราคา", "สอบถามสต็อกสินค้า", "ติดต่อฝ่ายขาย", "สอบถามการจัดส่ง"]

const botResponses: { [key: string]: string } = {
  สอบถามราคาสินค้า: "กรุณาแจ้งรุ่นและขนาดสินค้าที่ต้องการ เราจะแจ้งราคาให้ทันที หรือสามารถโทร 0-2925-9633-4",
  ขอใบเสนอราคา: "กรุณาแจ้งรายการสินค้า จำนวน และข้อมูลบริษัท เราจะจัดทำใบเสนอราคาให้ภายใน 24 ชั่วโมง",
  สอบถามสต็อกสินค้า: "เรามีสต็อกสินค้า O-Z/Gedney ครบทุกรุ่น หากต้องการเช็คสต็อกเฉพาะรุ่น กรุณาแจ้งรุ่นที่ต้องการ",
  ติดต่อฝ่ายขาย: "ฝ่ายขายพร้อมให้บริการ จันทร์-ศุกร์ 8:00-17:00 น. โทร 0-2925-9633-4 หรือ info@kdp.co.th",
  สอบถามการจัดส่ง: "เราจัดส่งทั่วประเทศ ส่งฟรีสำหรับคำสั่งซื้อเกิน 5,000 บาท ระยะเวลาจัดส่ง 1-3 วันทำการ",
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "สวัสดีครับ! ยินดีต้อนรับสู่ KDP Engineering ผู้จำหน่าย O-Z/Gedney Conduit Body มีอะไรให้ช่วยเหลือไหมครับ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Simulate online/offline status
    const interval = setInterval(() => {
      const now = new Date()
      const hour = now.getHours()
      setIsOnline(hour >= 8 && hour < 17) // 8 AM to 5 PM
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = (text: string, isQuickReply = false) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate bot response
    setIsTyping(true)
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponses[text] || "ขอบคุณสำหรับข้อความ เราจะติดต่อกลับโดยเร็วที่สุด หรือสามารถโทรติดต่อได้ที่ 0-2925-9633-4",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg relative"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96"
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">KDP</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-sarabun">KDP Engineering</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-400"}`} />
                        <span className="text-sm text-blue-100 font-sarabun">{isOnline ? "ออนไลน์" : "ออฟไลน์"}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === "user" ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm font-sarabun">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                          >
                            {message.timestamp.toLocaleTimeString("th-TH", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 2 && (
                  <div className="p-4 border-t bg-gray-50">
                    <p className="text-sm text-gray-600 mb-3 font-sarabun">คำถามที่พบบ่อย:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <Button
                          key={reply}
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(reply, true)}
                          className="text-xs font-sarabun"
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="p-4 border-t bg-blue-50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Phone className="w-4 h-4 text-blue-600 mb-1" />
                      <span className="text-xs text-gray-600 font-sarabun">โทร</span>
                      <span className="text-xs font-semibold font-sarabun">0-2925-9633</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Mail className="w-4 h-4 text-blue-600 mb-1" />
                      <span className="text-xs text-gray-600 font-sarabun">อีเมล</span>
                      <span className="text-xs font-semibold font-sarabun">info@kdp.co.th</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Clock className="w-4 h-4 text-blue-600 mb-1" />
                      <span className="text-xs text-gray-600 font-sarabun">เวลา</span>
                      <span className="text-xs font-semibold font-sarabun">8:00-17:00</span>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความ..."
                      className="flex-1 font-sarabun"
                      disabled={!isOnline}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!inputMessage.trim() || !isOnline}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {!isOnline && (
                    <p className="text-xs text-gray-500 mt-2 font-sarabun">
                      ขณะนี้อยู่นอกเวลาทำการ กรุณาฝากข้อความไว้ เราจะติดต่อกลับ
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
