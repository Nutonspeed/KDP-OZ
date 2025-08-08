"use client"

import { useState } from "react"
import Image from "next/image"
import { mockDb } from "@/lib/mockDb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building, Users, Award, Globe, Shield, CheckCircle, Star, Target, Heart, Lightbulb, Handshake, TrendingUp, MapPin, Phone, Mail } from 'lucide-react'
import { AnimatedCounter, FadeInSection, SlideInSection } from "@/components/AnimatedComponents"

export default function AboutPage() {
  const about = mockDb.content.about
  const [activeTab, setActiveTab] = useState("company")

  const stats = [
    { label: "ปีประสบการณ์", value: 15, suffix: "+" },
    { label: "ลูกค้าพึงพอใจ", value: 500, suffix: "+" },
    { label: "โครงการสำเร็จ", value: 1200, suffix: "+" },
    { label: "สินค้าคุณภาพ", value: 50, suffix: "+" }
  ]

  const timeline = [
    {
      year: "2009",
      title: "ก่อตั้งบริษัท",
      description: "เริ่มต้นธุรกิจจำหน่ายอุปกรณ์ไฟฟ้าอุตสาหกรรม",
      icon: Building
    },
    {
      year: "2012",
      title: "ตัวแทนจำหน่าย O-Z/Gedney",
      description: "ได้รับการแต่งตั้งเป็นตัวแทนจำหน่ายอย่างเป็นทางการ",
      icon: Handshake
    },
    {
      year: "2015",
      title: "ขยายคลังสินค้า",
      description: "เปิดคลังสินค้าใหม่ขนาด 2,000 ตารางเมตร",
      icon: TrendingUp
    },
    {
      year: "2018",
      title: "รับรอง ISO 9001",
      description: "ได้รับการรับรองมาตรฐาน ISO 9001:2015",
      icon: Award
    },
    {
      year: "2021",
      title: "ระบบดิจิทัล",
      description: "พัฒนาระบบการขายและบริการลูกค้าแบบดิจิทัล",
      icon: Globe
    },
    {
      year: "2024",
      title: "ขยายสาขา",
      description: "เปิดสาขาใหม่ในภาคตะวันออก และภาคใต้",
      icon: MapPin
    }
  ]

  const team = [
    {
      name: "นายสมชาย วิศวกรรม",
      position: "กรรมการผู้จัดการ",
      experience: "20+ ปี",
      expertise: "วิศวกรรมไฟฟ้า, การจัดการ",
      image: "/placeholder-user.jpg"
    },
    {
      name: "นางสาววิชญา เทคนิค",
      position: "ผู้จัดการฝ่ายขาย",
      experience: "15+ ปี",
      expertise: "การขาย, บริการลูกค้า",
      image: "/placeholder-user.jpg"
    },
    {
      name: "นายประยุทธ์ คุณภาพ",
      position: "หัวหน้าฝ่ายเทคนิค",
      experience: "18+ ปี",
      expertise: "วิศวกรรม, ควบคุมคุณภาพ",
      image: "/placeholder-user.jpg"
    },
    {
      name: "นางสาวนิรันดร์ บริการ",
      position: "ผู้จัดการฝ่ายบริการลูกค้า",
      experience: "12+ ปี",
      expertise: "บริการลูกค้า, การตลาด",
      image: "/placeholder-user.jpg"
    }
  ]

  const values = [
    {
      icon: Shield,
      title: "คุณภาพ",
      description: "มุ่งมั่นในการนำเสนอสินค้าและบริการที่มีคุณภาพสูงสุด",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Heart,
      title: "ใส่ใจลูกค้า",
      description: "ให้ความสำคัญกับความต้องการและความพึงพอใจของลูกค้า",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: Lightbulb,
      title: "นวัตกรรม",
      description: "พัฒนาและปรับปรุงการให้บริการอย่างต่อเนื่อง",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      icon: Handshake,
      title: "ความไว้วางใจ",
      description: "สร้างความสัมพันธ์ที่ยั่งยืนด้วยความซื่อสัตย์และไว้วางใจ",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ]

  const certifications = [
    {
      name: "ISO 9001:2015",
      description: "ระบบการจัดการคุณภาพ",
      year: "2018",
      status: "active"
    },
    {
      name: "O-Z/Gedney Authorized Distributor",
      description: "ตัวแทนจำหน่ายอย่างเป็นทางการ",
      year: "2012",
      status: "active"
    },
    {
      name: "UL Listed Products",
      description: "สินค้าผ่านการรับรอง UL",
      year: "2012",
      status: "active"
    },
    {
      name: "NEMA Standards",
      description: "มาตรฐาน NEMA สำหรับอุปกรณ์ไฟฟ้า",
      year: "2012",
      status: "active"
    }
  ]

  const achievements = [
    {
      title: "ผู้จำหน่ายยอดเยี่ยม",
      description: "รางวัลผู้จำหน่ายยอดเยี่ยมจาก O-Z/Gedney ประจำปี 2023",
      year: "2023",
      icon: Award
    },
    {
      title: "บริการลูกค้าดีเด่น",
      description: "รางวัลบริการลูกค้าดีเด่นจากสมาคมผู้ประกอบการไฟฟ้า",
      year: "2022",
      icon: Star
    },
    {
      title: "โครงการสีเขียว",
      description: "รางวัลองค์กรเพื่อสิ่งแวดล้อม จากกรมโรงงานอุตสาหกรรม",
      year: "2021",
      icon: Target
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
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-sarabun">{about.title}</h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 font-sarabun">{about.body}</p>
              </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <SlideInSection key={stat.label} delay={index * 200}>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                    <AnimatedCounter end={stat.value} duration={2000} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 font-sarabun">{stat.label}</p>
                </div>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SlideInSection direction="left">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 font-sarabun">
                  ผู้นำด้านอุปกรณ์ไฟฟ้าอุตสาหกรรม
                </h2>
                <p className="text-lg text-gray-600 mb-6 font-sarabun">
                  KDP Engineering & Supply ก่อตั้งขึ้นในปี 2009 ด้วยวิสัยทัศน์ในการเป็นผู้นำ
                  ด้านการจำหน่ายอุปกรณ์ไฟฟ้าอุตสาหกรรมคุณภาพสูงในประเทศไทย
                </p>
                <p className="text-gray-600 mb-8 font-sarabun">
                  เราเป็นตัวแทนจำหน่าย O-Z/Gedney อย่างเป็นทางการ พร้อมทีมงานมืออาชีพ
                  ที่มีประสบการณ์กว่า 15 ปี ในการให้คำปรึกษาและบริการที่ดีที่สุดแก่ลูกค้า
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-sarabun">ตัวแทนจำหน่ายอย่างเป็นทางการ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-sarabun">สินค้าคุณภาพมาตรฐานสากล</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-sarabun">บริการหลังการขายครบวงจร</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-sarabun">ทีมงานมืออาชีพ</span>
                  </div>
                </div>
              </div>
            </SlideInSection>

            <SlideInSection direction="right">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8">
                  <div className="w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <Building className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 font-sarabun">
                        KDP Engineering
                      </h3>
                      <p className="text-gray-600 font-sarabun">
                        Excellence in Electrical Solutions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                เส้นทางการเติบโต
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">
                ประวัติความเป็นมาและการพัฒนาของเราตลอด 15 ปี
              </p>
            </div>
          </FadeInSection>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <SlideInSection key={item.year} delay={index * 100}>
                    <div className="relative flex items-start gap-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center relative z-10">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-4 mb-2">
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            {item.year}
                          </Badge>
                          <h3 className="text-xl font-bold text-slate-900 font-sarabun">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 font-sarabun">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </SlideInSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                ค่านิยมองค์กร
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">
                หลักการและค่านิยมที่เรายึดถือในการดำเนินธุรกิจ
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <SlideInSection key={value.title} delay={index * 100}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <value.icon className={`w-8 h-8 ${value.color}`} />
                    </div>
                    <CardTitle className="font-sarabun">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 font-sarabun">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-sarabun">
                ทีมงานผู้เชี่ยวชาญ
              </h2>
              <p className="text-lg text-gray-600 font-sarabun">
                ทีมงานมืออาชีพที่พร้อมให้บริการและคำปรึกษา
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <SlideInSection key={member.name} delay={index * 100}>
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg font-sarabun">{member.name}</CardTitle>
                    <CardDescription className="font-sarabun">{member.position}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary">{member.experience}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 font-sarabun">
                        {member.expertise}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SlideInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Certifications */}
            <SlideInSection direction="left">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 font-sarabun">
                  การรับรองและมาตรฐาน
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <Card key={cert.name} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 font-sarabun">
                              {cert.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-sarabun">
                              {cert.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {cert.year}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </SlideInSection>

            {/* Achievements */}
            <SlideInSection direction="right">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 font-sarabun">
                  รางวัลและความสำเร็จ
                </h2>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <Card key={achievement.title} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <achievement.icon className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 font-sarabun">
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-gray-600 font-sarabun">
                              {achievement.description}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {achievement.year}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </SlideInSection>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-sarabun">
              พร้อมให้บริการคุณ
            </h2>
            <p className="text-xl mb-8 text-blue-100 font-sarabun max-w-2xl mx-auto">
              ติดต่อเราวันนี้เพื่อรับคำปรึกษาและข้อเสนอที่ดีที่สุด
              สำหรับความต้องการด้านอุปกรณ์ไฟฟ้าอุตสาหกรรมของคุณ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <a href="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  ติดต่อเรา
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <a href="/products">
                  <Globe className="w-4 h-4 mr-2" />
                  ดูสินค้า
                </a>
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
