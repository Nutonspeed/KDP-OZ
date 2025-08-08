"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Building, Users, Globe, CheckCircle } from 'lucide-react'
import { FadeInSection, SlideInSection } from "@/components/AnimatedComponents"
import { addLead } from "@/actions/leads"
import { useToast } from "@/hooks/use-toast"
import { fbPixelTrack } from "@/components/FacebookPixel"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    productInterest: "",
    urgency: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fd = new FormData()
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
      const res = await addLead(fd)
      if (res.success) {
        fbPixelTrack.lead("Contact Form")
        toast({
          title: "ส่งข้อความสำเร็จ!",
          description: "ขอบคุณสำหรับการติดต่อ เราจะติดต่อกลับภายใน 24 ชั่วโมง",
        })
        setFormData({
          name: "",
          company: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
          productInterest: "",
          urgency: ""
        })
      } else {
        toast({ title: "เกิดข้อผิดพลาด", description: res.error || "ไม่สามารถบันทึกข้อมูลได้", variant: "destructive" })
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาลองใหม่อีกครั้ง หรือติดต่อโดยตรงที่ 0-2925-9633-4",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "โทรศัพท์",
      details: ["0-2925-9633-4", "0-2925-9635"],
      description: "จันทร์-ศุกร์ 8:00-17:00 น.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Mail,
      title: "อีเมล",
      details: ["info@kdp.co.th", "sales@kdp.co.th"],
      description: "ตอบกลับภายใน 24 ชั่วโมง",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: MapPin,
      title: "ที่อยู่",
      details: ["14/1763 หมู่ 13 ถนนกาญจนาภิเษก", "ต.บางบัวทอง อ.บางบัวทอง จ.นนทบุรี 11110"],
      description: "สำนักงานใหญ่และคลังสินค้า",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Clock,
      title: "เวลาทำการ",
      details: ["จันทร์-ศุกร์: 8:00-17:00 น.", "เสาร์: 8:00-12:00 น."],
      description: "ปิดทำการวันอาทิตย์และวันหยุดนักขัตฤกษ์",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

  const departments = [
    {
      name: "ฝ่ายขาย",
      phone: "0-2925-9633 ต่อ 101",
      email: "sales@kdp.co.th",
      description: "สอบถามราคา, ใบเสนอราคา, คำสั่งซื้อ"
    },
    {
      name: "ฝ่ายเทคนิค",
      phone: "0-2925-9633 ต่อ 102",
      email: "technical@kdp.co.th",
      description: "คำปรึกษาทางเทคนิค, การเลือกสินค้า"
    },
    {
      name: "ฝ่ายบริการลูกค้า",
      phone: "0-2925-9633 ต่อ 103",
      email: "support@kdp.co.th",
      description: "บริการหลังการขาย, การร้องเรียน"
    },
    {
      name: "ฝ่ายบัญชี",
      phone: "0-2925-9633 ต่อ 104",
      email: "accounting@kdp.co.th",
      description: "การชำระเงิน, ใบกำกับภาษี"
    }
  ]

  const faqs = [
    {
      question: "สินค้า O-Z/Gedney ของแท้หรือไม่?",
      answer: "ใช่ครับ เราเป็นตัวแทนจำหน่ายอย่างเป็นทางการ สินค้าทุกชิ้นมีใบรับรองและการรับประกัน"
    },
    {
      question: "มีบริการจัดส่งหรือไม่?",
      answer: "มีครับ เราจัดส่งทั่วประเทศ จัดส่งฟรีสำหรับคำสั่งซื้อเกิน 5,000 บาท"
    },
    {
      question: "สามารถขอใบเสนอราคาได้หรือไม่?",
      answer: "ได้ครับ กรุณาแจ้งรายการสินค้าและจำนวนที่ต้องการ เราจะจัดทำใบเสนอราคาให้ภายใน 24 ชั่วโมง"
    },
    {
      question: "มีการรับประกันสินค้าหรือไม่?",
      answer: "มีครับ สินค้าทุกชิ้นมีการรับประกันตามมาตรฐานของผู้ผลิต และเรามีบริการหลังการขาย"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-blue-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInSection>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-sarabun">
                ติดต่อเรา
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 font-sarabun">
                พร้อมให้บริการและคำปรึกษาเกี่ยวกับสินค้า O-Z/Gedney
              </p>
              <p className="text-lg text-blue-200 font-sarabun">
                ทีมงานมืออาชีพพร้อมตอบทุกคำถามและให้คำแนะนำที่ดีที่สุด
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                ช่องทางการติดต่อ
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">
                เลือกช่องทางที่สะดวกสำหรับคุณ
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <SlideInSection key={info.title} delay={index * 100}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className={`w-16 h-16 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <info.icon className={`w-8 h-8 ${info.color}`} />
                    </div>
                    <CardTitle className="font-sarabun">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-3">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="font-medium text-slate-900 font-sarabun">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 font-sarabun">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <SlideInSection direction="left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-sarabun">ส่งข้อความถึงเรา</CardTitle>
                  <CardDescription className="font-sarabun">
                    กรอกข้อมูลด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="font-sarabun">ชื่อ-นามสกุล *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          className="font-sarabun"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company" className="font-sarabun">บริษัท</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="font-sarabun"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="font-sarabun">เบอร์โทร *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                          className="font-sarabun"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-sarabun">อีเมล *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="font-sarabun"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productInterest" className="font-sarabun">สินค้าที่สนใจ</Label>
                        <Select value={formData.productInterest} onValueChange={(value) => handleInputChange("productInterest", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกสินค้า" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conduit-body-lb">Conduit Body LB</SelectItem>
                            <SelectItem value="conduit-body-c">Conduit Body C</SelectItem>
                            <SelectItem value="conduit-body-t">Conduit Body T</SelectItem>
                            <SelectItem value="conduit-body-ll">Conduit Body LL</SelectItem>
                            <SelectItem value="conduit-body-lr">Conduit Body LR</SelectItem>
                            <SelectItem value="explosion-proof">Explosion-Proof Series</SelectItem>
                            <SelectItem value="stainless-steel">Stainless Steel Series</SelectItem>
                            <SelectItem value="other">อื่นๆ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="urgency" className="font-sarabun">ความเร่งด่วน</Label>
                        <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกระดับ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">ไม่เร่งด่วน</SelectItem>
                            <SelectItem value="medium">ปานกลาง</SelectItem>
                            <SelectItem value="high">เร่งด่วน</SelectItem>
                            <SelectItem value="urgent">เร่งด่วนมาก</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="font-sarabun">หัวข้อ</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="เช่น สอบถามราคาสินค้า, ขอใบเสนอราคา"
                        className="font-sarabun"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-sarabun">ข้อความ *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="รายละเอียดความต้องการ, จำนวนสินค้า, หรือคำถามอื่นๆ"
                        required
                        className="font-sarabun"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>กำลังส่ง...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          ส่งข้อความ
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </SlideInSection>

            {/* Map & Additional Info */}
            <SlideInSection direction="right">
              <div className="space-y-6">
                {/* Map */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sarabun">แผนที่</CardTitle>
                    <CardDescription className="font-sarabun">
                      ที่ตั้งสำนักงานและคลังสินค้า
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 font-sarabun">แผนที่ Google Maps</p>
                        <p className="text-sm text-gray-400 font-sarabun">
                          14/1763 หมู่ 13 ถนนกาญจนาภิเษก<br />
                          ต.บางบัวทอง อ.บางบัวทอง จ.นนทบุรี 11110
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sarabun">ติดต่อด่วน</CardTitle>
                    <CardDescription className="font-sarabun">
                      สำหรับความเร่งด่วน
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium font-sarabun">โทรตรง</p>
                        <p className="text-sm text-gray-600 font-sarabun">0-2925-9633-4</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium font-sarabun">Line Official</p>
                        <p className="text-sm text-gray-600 font-sarabun">@kdp-engineering</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium font-sarabun">อีเมลด่วน</p>
                        <p className="text-sm text-gray-600 font-sarabun">urgent@kdp.co.th</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SlideInSection>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                แผนกต่างๆ
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">
                ติดต่อแผนกที่เกี่ยวข้องโดยตรง
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <SlideInSection key={dept.name} delay={index * 100}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2 font-sarabun">
                          {dept.name}
                        </h3>
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-sarabun">{dept.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-sarabun">{dept.email}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 font-sarabun">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                คำถามที่พบบ่อย
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">
                คำตอบสำหรับคำถามที่ลูกค้าสอบถามบ่อยๆ
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <SlideInSection key={index} delay={index * 100}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 font-sarabun">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 font-sarabun">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-sarabun">
              ยังมีคำถามอื่นๆ อีกไหม?
            </h2>
            <p className="text-xl mb-8 text-blue-100 font-sarabun max-w-2xl mx-auto">
              ทีมงานของเราพร้อมให้คำปรึกษาและตอบทุกคำถาม
              ไม่ว่าจะเป็นเรื่องสินค้า ราคา หรือการใช้งาน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <a href="tel:0-2925-9633-4">
                  <Phone className="w-4 h-4 mr-2" />
                  โทรเลย 0-2925-9633-4
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <a href="mailto:info@kdp.co.th">
                  <Mail className="w-4 h-4 mr-2" />
                  ส่งอีเมล
                </a>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
