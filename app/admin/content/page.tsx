"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, FileText, Image, Settings, Eye, Save, Globe, Search } from 'lucide-react'
import { useAuthStore } from "@/lib/store" // Keep useAuthStore for client-side auth state
import { 
  fetchPages, 
  createPage, 
  updatePage, 
  deletePage,
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  fetchSeoSettings,
  updateSEO
} from "@/actions/content" // Import new Server Actions

interface PageContent {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  content: string
  meta_title?: string
  meta_description?: string
  status: "draft" | "published" | "archived"
}

interface BannerContent {
  id: string
  created_at: string
  updated_at: string
  title: string
  description?: string
  image_url?: string
  link_url?: string
  active: boolean
  position: "hero" | "sidebar" | "footer"
}

interface SeoSettings {
  id: string
  updated_at: string
  site_title: string
  site_description?: string
  keywords?: string
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_card?: string
}

export default function AdminContent() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState("pages")
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false)
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false)
  
  const [pages, setPages] = useState<PageContent[]>([])
  const [banners, setBanners] = useState<BannerContent[]>([])
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    id: '', updated_at: '', site_title: '', site_description: '', keywords: '', canonical_url: '',
    og_title: '', og_description: '', og_image: '', twitter_card: 'summary'
  })

  const [editingPage, setEditingPage] = useState<PageContent | null>(null)
  const [editingBanner, setEditingBanner] = useState<BannerContent | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [pageForm, setPageForm] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "", // Changed to meta_title
    meta_description: "", // Changed to meta_description
    status: "draft" as "draft" | "published" | "archived"
  })

  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    image_url: "", // Changed to image_url
    link_url: "", // Changed to link_url
    active: true,
    position: "hero" as "hero" | "sidebar" | "footer"
  })

  const [seoForm, setSeoForm] = useState<Omit<SeoSettings, 'id' | 'updated_at'>>({
    site_title: "",
    site_description: "",
    keywords: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
    twitter_card: "summary"
  })

  useEffect(() => {
    checkAuth() // Check auth state on mount
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, loading])

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      if (isAuthenticated) {
        const [fetchedPages, fetchedBanners, fetchedSeoSettings] = await Promise.all([
          fetchPages(),
          fetchBanners(),
          fetchSeoSettings()
        ])
        setPages(fetchedPages)
        setBanners(fetchedBanners)
        if (fetchedSeoSettings) {
          setSeoSettings(fetchedSeoSettings)
          setSeoForm({
            site_title: fetchedSeoSettings.site_title,
            site_description: fetchedSeoSettings.site_description || "",
            keywords: fetchedSeoSettings.keywords || "",
            canonical_url: fetchedSeoSettings.canonical_url || "",
            og_title: fetchedSeoSettings.og_title || "",
            og_description: fetchedSeoSettings.og_description || "",
            og_image: fetchedSeoSettings.og_image || "",
            twitter_card: fetchedSeoSettings.twitter_card || "summary"
          })
        }
      }
      setLoading(false)
    }
    loadContent()
  }, [isAuthenticated]) // Reload content when auth state changes

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <p className="font-sarabun">กำลังโหลด...</p>
      </div>
    )
  }

  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let result
    if (editingPage) {
      result = await updatePage(editingPage.id, pageForm)
    } else {
      result = await createPage(pageForm)
    }
    
    if (result.success) {
      const fetchedPages = await fetchPages()
      setPages(fetchedPages)
      resetPageForm()
      setIsPageDialogOpen(false)
    } else {
      alert(`Failed to save page: ${result.error}`)
    }
  }

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let result
    if (editingBanner) {
      result = await updateBanner(editingBanner.id, bannerForm)
    } else {
      result = await createBanner(bannerForm)
    }
    
    if (result.success) {
      const fetchedBanners = await fetchBanners()
      setBanners(fetchedBanners)
      resetBannerForm()
      setIsBannerDialogOpen(false)
    } else {
      alert(`Failed to save banner: ${result.error}`)
    }
  }

  const handleSEOSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await updateSEO(seoForm)
    if (result.success) {
      const fetchedSeoSettings = await fetchSeoSettings()
      if (fetchedSeoSettings) {
        setSeoSettings(fetchedSeoSettings)
        setSeoForm({
          site_title: fetchedSeoSettings.site_title,
          site_description: fetchedSeoSettings.site_description || "",
          keywords: fetchedSeoSettings.keywords || "",
          canonical_url: fetchedSeoSettings.canonical_url || "",
          og_title: fetchedSeoSettings.og_title || "",
          og_description: fetchedSeoSettings.og_description || "",
          og_image: fetchedSeoSettings.og_image || "",
          twitter_card: fetchedSeoSettings.twitter_card || "summary"
        })
      }
      alert("บันทึกการตั้งค่า SEO เรียบร้อย")
    } else {
      alert(`Failed to save SEO settings: ${result.error}`)
    }
  }

  const resetPageForm = () => {
    setPageForm({
      title: "",
      slug: "",
      content: "",
      meta_title: "",
      meta_description: "",
      status: "draft"
    })
    setEditingPage(null)
  }

  const resetBannerForm = () => {
    setBannerForm({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      active: true,
      position: "hero"
    })
    setEditingBanner(null)
  }

  const handleEditPage = (page: PageContent) => {
    setEditingPage(page)
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_title: page.meta_title || "",
      meta_description: page.meta_description || "",
      status: page.status
    })
    setIsPageDialogOpen(true)
  }

  const handleEditBanner = (banner: BannerContent) => {
    setEditingBanner(banner)
    setBannerForm({
      title: banner.title,
      description: banner.description || "",
      image_url: banner.image_url || "",
      link_url: banner.link_url || "",
      active: banner.active,
      position: banner.position
    })
    setIsBannerDialogOpen(true)
  }

  const handleDeletePage = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบหน้านี้?")) {
      const result = await deletePage(id)
      if (result.success) {
        const fetchedPages = await fetchPages()
        setPages(fetchedPages)
      } else {
        alert(`Failed to delete page: ${result.error}`)
      }
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบแบนเนอร์นี้?")) {
      const result = await deleteBanner(id)
      if (result.success) {
        const fetchedBanners = await fetchBanners()
        setBanners(fetchedBanners)
      } else {
        alert(`Failed to delete banner: ${result.error}`)
      }
    }
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-sarabun">จัดการเนื้อหา</h1>
            <p className="text-gray-600 font-sarabun">จัดการหน้าเว็บ แบนเนอร์ และการตั้งค่า SEO</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages" className="font-sarabun">หน้าเว็บ</TabsTrigger>
            <TabsTrigger value="banners" className="font-sarabun">แบนเนอร์</TabsTrigger>
            <TabsTrigger value="seo" className="font-sarabun">การตั้งค่า SEO</TabsTrigger>
          </TabsList>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="ค้นหาหน้าเว็บ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              
              <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetPageForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มหน้าใหม่
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-sarabun">
                      {editingPage ? "แก้ไขหน้าเว็บ" : "เพิ่มหน้าเว็บใหม่"}
                    </DialogTitle>
                    <DialogDescription className="font-sarabun">
                      กรอกข้อมูลหน้าเว็บให้ครบถ้วน
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handlePageSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="font-sarabun">ชื่อหน้า *</Label>
                        <Input
                          id="title"
                          value={pageForm.title}
                          onChange={(e) => setPageForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug" className="font-sarabun">Slug (URL) *</Label>
                        <Input
                          id="slug"
                          value={pageForm.slug}
                          onChange={(e) => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="about, contact, terms"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="content" className="font-sarabun">เนื้อหา *</Label>
                      <Textarea
                        id="content"
                        value={pageForm.content}
                        onChange={(e) => setPageForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={10}
                        placeholder="เนื้อหาของหน้าเว็บ (รองรับ HTML)"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="meta_title" className="font-sarabun">Meta Title</Label>
                        <Input
                          id="meta_title"
                          value={pageForm.meta_title}
                          onChange={(e) => setPageForm(prev => ({ ...prev, meta_title: e.target.value }))}
                          placeholder="ชื่อที่แสดงใน Google"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status" className="font-sarabun">สถานะ</Label>
                        <Select 
                          value={pageForm.status} 
                          onValueChange={(value: "draft" | "published" | "archived") => 
                            setPageForm(prev => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">ร่าง</SelectItem>
                            <SelectItem value="published">เผยแพร่</SelectItem>
                            <SelectItem value="archived">เก็บถาวร</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="meta_description" className="font-sarabun">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={pageForm.meta_description}
                        onChange={(e) => setPageForm(prev => ({ ...prev, meta_description: e.target.value }))}
                        rows={3}
                        placeholder="คำอธิบายที่แสดงใน Google (160 ตัวอักษร)"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsPageDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        {editingPage ? "บันทึกการแก้ไข" : "เพิ่มหน้าใหม่"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">รายการหน้าเว็บ</CardTitle>
                <CardDescription className="font-sarabun">
                  จำนวนหน้าทั้งหมด: {filteredPages.length} หน้า
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sarabun">ชื่อหน้า</TableHead>
                      <TableHead className="font-sarabun">Slug</TableHead>
                      <TableHead className="font-sarabun">สถานะ</TableHead>
                      <TableHead className="font-sarabun">อัปเดตล่าสุด</TableHead>
                      <TableHead className="font-sarabun">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium font-sarabun">{page.title}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              page.status === "published" ? "default" : 
                              page.status === "draft" ? "secondary" : "outline"
                            }
                          >
                            {page.status === "published" ? "เผยแพร่" : 
                             page.status === "draft" ? "ร่าง" : "เก็บถาวร"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-sarabun">
                          {new Date(page.updated_at).toLocaleDateString("th-TH")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditPage(page)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`/${page.slug}`} target="_blank">
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeletePage(page.id)}
                              className="text-red-600 hover:text-red-700"
                            >
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

          {/* Banners Tab */}
          <TabsContent value="banners" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="ค้นหาแบนเนอร์..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              
              <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetBannerForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มแบนเนอร์
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-sarabun">
                      {editingBanner ? "แก้ไขแบนเนอร์" : "เพิ่มแบนเนอร์ใหม่"}
                    </DialogTitle>
                    <DialogDescription className="font-sarabun">
                      กรอกข้อมูลแบนเนอร์ให้ครบถ้วน
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleBannerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="bannerTitle" className="font-sarabun">ชื่อแบนเนอร์ *</Label>
                      <Input
                        id="bannerTitle"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="bannerDescription" className="font-sarabun">คำอธิบาย</Label>
                      <Textarea
                        id="bannerDescription"
                        value={bannerForm.description}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image_url" className="font-sarabun">URL รูปภาพ</Label>
                        <Input
                          id="image_url"
                          value={bannerForm.image_url}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, image_url: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="link_url" className="font-sarabun">URL ลิงก์</Label>
                        <Input
                          id="link_url"
                          value={bannerForm.link_url}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, link_url: e.target.value }))}
                          placeholder="/products"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="position" className="font-sarabun">ตำแหน่ง</Label>
                        <Select 
                          value={bannerForm.position} 
                          onValueChange={(value: "hero" | "sidebar" | "footer") => 
                            setBannerForm(prev => ({ ...prev, position: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hero">Hero Section</SelectItem>
                            <SelectItem value="sidebar">Sidebar</SelectItem>
                            <SelectItem value="footer">Footer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="active"
                          checked={bannerForm.active}
                          onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, active: checked }))}
                        />
                        <Label htmlFor="active" className="font-sarabun">เปิดใช้งาน</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        {editingBanner ? "บันทึกการแก้ไข" : "เพิ่มแบนเนอร์"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-sarabun">รายการแบนเนอร์</CardTitle>
                <CardDescription className="font-sarabun">
                  จำนวนแบนเนอร์ทั้งหมด: {filteredBanners.length} รายการ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sarabun">ชื่อแบนเนอร์</TableHead>
                      <TableHead className="font-sarabun">ตำแหน่ง</TableHead>
                      <TableHead className="font-sarabun">สถานะ</TableHead>
                      <TableHead className="font-sarabun">สร้างเมื่อ</TableHead>
                      <TableHead className="font-sarabun">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell className="font-medium font-sarabun">{banner.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {banner.position === "hero" ? "Hero" : 
                             banner.position === "sidebar" ? "Sidebar" : "Footer"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={banner.active ? "default" : "secondary"}>
                            {banner.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-sarabun">
                          {new Date(banner.created_at).toLocaleDateString("th-TH")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditBanner(banner)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="text-red-600 hover:text-red-700"
                            >
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

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sarabun">
                  <Settings className="w-5 h-5" />
                  การตั้งค่า SEO
                </CardTitle>
                <CardDescription className="font-sarabun">
                  จัดการการตั้งค่า SEO สำหรับเว็บไซต์
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSEOSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="site_title" className="font-sarabun">ชื่อเว็บไซต์</Label>
                      <Input
                        id="site_title"
                        value={seoForm.site_title}
                        onChange={(e) => setSeoForm(prev => ({ ...prev, site_title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="canonical_url" className="font-sarabun">URL หลัก</Label>
                      <Input
                        id="canonical_url"
                        value={seoForm.canonical_url}
                        onChange={(e) => setSeoForm(prev => ({ ...prev, canonical_url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="site_description" className="font-sarabun">คำอธิบายเว็บไซต์</Label>
                    <Textarea
                      id="site_description"
                      value={seoForm.site_description}
                      onChange={(e) => setSeoForm(prev => ({ ...prev, site_description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="font-sarabun">คำสำคัญ (คั่นด้วยจุลภาค)</Label>
                    <Input
                      id="keywords"
                      value={seoForm.keywords}
                      onChange={(e) => setSeoForm(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="conduit body, electrical, industrial"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="og_title" className="font-sarabun">Open Graph Title</Label>
                      <Input
                        id="og_title"
                        value={seoForm.og_title}
                        onChange={(e) => setSeoForm(prev => ({ ...prev, og_title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter_card" className="font-sarabun">Twitter Card Type</Label>
                      <Select 
                        value={seoForm.twitter_card} 
                        onValueChange={(value) => setSeoForm(prev => ({ ...prev, twitter_card: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="og_description" className="font-sarabun">Open Graph Description</Label>
                    <Textarea
                      id="og_description"
                      value={seoForm.og_description}
                      onChange={(e) => setSeoForm(prev => ({ ...prev, og_description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="og_image" className="font-sarabun">Open Graph Image URL</Label>
                    <Input
                      id="og_image"
                      value={seoForm.og_image}
                      onChange={(e) => setSeoForm(prev => ({ ...prev, og_image: e.target.value }))}
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="lg">
                      <Save className="w-4 h-4 mr-2" />
                      บันทึกการตั้งค่า SEO
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
