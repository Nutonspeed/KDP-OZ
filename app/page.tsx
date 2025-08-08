"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Phone, Mail, MapPin, CheckCircle, Shield, Award, Users, Clock, Star, Truck } from "lucide-react"
import { products } from "@/lib/mockData"
import { AnimatedCounter, FadeInSection, SlideInSection } from "@/components/AnimatedComponents"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 8))
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [utm, setUtm] = useState<Record<string, string>>({})
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (key.startsWith("utm_")) params[key] = value
    })
    setUtm(params)
  }, [searchParams])

  const filteredProducts = featuredProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const productTypes = [...new Set(products.map((p) => p.type).filter(Boolean))]
  const totalProducts = products.length

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, utm, productInterest: [] }),
      })
      if (!res.ok) throw new Error("Network error")
      window.dataLayer?.push({ event: "contact_submit" })
      router.push("/thank-you")
      setContactForm({
        name: "",
        company: "",
        phone: "",
        email: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาลองใหม่อีกครั้ง หรือติดต่อโดยตรง",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideInSection direction="left">
              <div>
                <div className="mb-4">
                  <Badge className="bg-blue-600 text-white mb-2">ผู้จำหน่ายอย่างเป็นทางการ</Badge>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-sarabun leading-tight">
                  O-Z/Gedney
                  <span className="block text-blue-300">Conduit Body</span>
                </h1>
                <p className="text-xl lg:text-2xl mb-4 text-blue-100 font-sarabun">สินค้าคุณภาพสูงสำหรับงานไฟฟ้าอุตสาหกรรม</p>
                <p className="text-lg mb-8 text-blue-200 font-sarabun">
                  จำหน่ายโดย KDP Engineering & Supply - มาตรฐาน UL และ NEMA
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                    <Link href="/products">ดูสินค้าทั้งหมด</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-3 bg-transparent"
                  >
                    <Link
                      href="/order"
                      onClick={() => window.dataLayer?.push({ event: "lead_request" })}
                    >
                      ขอใบเสนอราคา
                    </Link>
                  </Button>
                </div>
                <div className="flex gap-4 mt-6">
                  <Badge className="bg-white/20 text-white flex items-center gap-2">
                    <Shield className="w-4 h-4" /> UL Listed
                  </Badge>
                  <Badge className="bg-white/20 text-white flex items-center gap-2">
                    <Award className="w-4 h-4" /> NEMA Standard
                  </Badge>
                </div>
              </div>
            </SlideInSection>

            <SlideInSection direction="right">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <AnimatedCounter end={totalProducts} duration={2000} />
                      <p className="text-blue-200 font-sarabun mt-2">รายการสินค้า</p>
                    </div>
                    <div className="text-center">
                      <AnimatedCounter end={productTypes.length} duration={2000} />
                      <p className="text-blue-200 font-sarabun mt-2">ประเภทสินค้า</p>
                    </div>
                    <div className="text-center">
                      <AnimatedCounter end={15} duration={2000} />
                      <p className="text-blue-200 font-sarabun mt-2">ปีประสบการณ์</p>
                    </div>
                    <div className="text-center">
                      <AnimatedCounter end={500} duration={2000} suffix="+" />
                      <p className="text-blue-200 font-sarabun mt-2">ลูกค้าพึงพอใจ</p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInSection>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-4 font-sarabun">ลูกค้าที่ไว้วางใจ</h3>
          <div className="flex justify-center gap-8 opacity-75">
            <Image src="/placeholder-logo.png" alt="client" width={80} height={40} />
            <Image src="/placeholder-logo.png" alt="client" width={80} height={40} />
            <Image src="/placeholder-logo.png" alt="client" width={80} height={40} />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ค้นหาสินค้า เช่น LB, C, T..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                ประเภทสินค้า Conduit Body
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">เลือกประเภทสินค้าที่เหมาะสมกับงานของคุณ</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
            {productTypes.map((type, index) => (
              <SlideInSection key={type} delay={index * 100}>
                <Link href={`/products?type=${type}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">{type}</span>
                      </div>
                      <h3 className="font-semibold text-sm font-sarabun">{type}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {products.filter((p) => p.type === type).length} รายการ
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">สินค้าแนะนำ</h2>
              <p className="text-lg text-gray-600 font-sarabun">สินค้าคุณภาพสูงที่ได้รับความนิยม</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <SlideInSection key={product.id} delay={index * 100}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                  <CardHeader className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">{product.type}</Badge>
                      <Badge variant="secondary">{product.material}</Badge>
                    </div>
                    <CardTitle className="text-lg font-sarabun line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="font-sarabun line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.sizes.slice(0, 4).map((size) => (
                          <Badge key={size} variant="secondary" className="text-xs">
                            {size}"
                          </Badge>
                        ))}
                        {product.sizes.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.sizes.length - 4}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xl font-bold text-blue-600 mb-4">
                        เริ่มต้น ฿{product.base_price.toLocaleString()}
                      </p>
                    </div>
                    <Button asChild className="w-full" size="sm">
                      <Link href={`/products/${product.slug}`}>ดูรายละเอียด</Link>
                    </Button>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>

          <FadeInSection>
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link href="/products">ดูสินค้าทั้งหมด ({totalProducts} รายการ)</Link>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                ทำไมต้องเลือก KDP Engineering
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">คุณภาพและบริการที่คุณไว้วางใจได้</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "คุณภาพมาตรฐาน",
                description: "ผ่านการรับรองมาตรฐาน UL และ NEMA รับประกันคุณภาพระดับสากล",
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                icon: CheckCircle,
                title: "ทนทานใช้งานยาวนาน",
                description: "วัสดุคุณภาพสูง ทนต่อสภาพแวดล้อมที่รุนแรง ใช้งานได้ยาวนาน",
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                icon: Award,
                title: "ติดตั้งง่าย",
                description: "ออกแบบให้ติดตั้งได้ง่าย ประหยัดเวลาและค่าแรงในการติดตั้ง",
                color: "text-yellow-600",
                bgColor: "bg-yellow-100",
              },
              {
                icon: Truck,
                title: "ส่งของรวดเร็ว",
                description: "มีสต็อกพร้อมส่ง ส่งของรวดเร็วทั่วประเทศ",
                color: "text-purple-600",
                bgColor: "bg-purple-100",
              },
              {
                icon: Users,
                title: "ทีมงานมืออาชีพ",
                description: "ทีมงานที่มีประสบการณ์ พร้อมให้คำปรึกษาและแนะนำ",
                color: "text-indigo-600",
                bgColor: "bg-indigo-100",
              },
              {
                icon: Star,
                title: "บริการหลังการขาย",
                description: "บริการหลังการขายที่ดี รับประกันความพึงพอใจ",
                color: "text-red-600",
                bgColor: "bg-red-100",
              },
            ].map((feature, index) => (
              <SlideInSection key={feature.title} delay={index * 100}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="font-sarabun">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-sarabun">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <FadeInSection>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-sarabun">ติดต่อเรา</h2>
                <p className="text-xl mb-8 text-blue-100 font-sarabun">
                  KDP Engineering & Supply จำกัด - ผู้จำหน่าย O-Z/Gedney อย่างเป็นทางการ
                </p>
                <p className="text-sm text-blue-200 mb-4">เวลาตอบกลับปกติ: 30 นาที</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-blue-300" />
                    <div>
                      <a
                        href="tel:029259633"
                        onClick={() => window.dataLayer?.push({ event: "click_call" })}
                        className="text-lg font-sarabun"
                      >
                        0-2925-9633-4
                      </a>
                      <p className="text-sm text-blue-200">โทรศัพท์</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-blue-300" />
                    <div>
                      <span className="text-lg font-sarabun">info@kdp.co.th</span>
                      <p className="text-sm text-blue-200">อีเมล</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-blue-300" />
                    <div>
                      <a
                        href="https://line.me/R/ti/p/%40kdp-line"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => window.dataLayer?.push({ event: "click_line" })}
                        className="text-lg font-sarabun"
                      >
                        LINE Official
                      </a>
                      <p className="text-sm text-blue-200">แชท LINE</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-blue-300 mt-1" />
                    <div>
                      <span className="text-lg font-sarabun">
                        14/1763 หมู่ 13 ถนนกาญจนาภิเษก
                        <br />
                        ต.บางบัวทอง อ.บางบัวทอง จ.นนทบุรี 11110
                      </span>
                      <p className="text-sm text-blue-200 mt-1">ที่อยู่</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6 text-blue-300" />
                    <div>
                      <span className="text-lg font-sarabun">จันทร์-ศุกร์ 8:00-17:00</span>
                      <p className="text-sm text-blue-200">เวลาทำการ</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <SlideInSection direction="right">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-sarabun">ส่งข้อความถึงเรา</CardTitle>
                  <CardDescription className="text-blue-100 font-sarabun">
                    กรอกข้อมูลด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white font-sarabun">ชื่อ-นามสกุล *</label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white font-sarabun">บริษัท</label>
                        <Input
                          value={contactForm.company}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, company: e.target.value }))}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white font-sarabun">เบอร์โทร *</label>
                        <Input
                          value={contactForm.phone}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                          required
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white font-sarabun">อีเมล *</label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white font-sarabun">ข้อความ</label>
                      <Textarea
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="บอกเราเกี่ยวกับความต้องการของคุณ..."
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      />
                    </div>
                    {Object.entries(utm).map(([key, value]) => (
                      <input key={key} type="hidden" name={key} value={value} />
                    ))}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </SlideInSection>
          </div>
        </div>
      </section>
    </div>
  )
}
