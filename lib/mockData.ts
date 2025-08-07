import { Product } from "@/types/product"

export const products: Product[] = [
  {
    id: "1",
    name: "O-Z/Gedney LB-75 Conduit Body",
    slug: "oz-gedney-lb-75-conduit-body",
    description:
      "Type LB conduit body สำหรับงานไฟฟ้าอุตสาหกรรม ขนาด 3/4 นิ้ว มาตรฐาน UL Listed",
    type: "LB",
    material: "Aluminum",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2"],
    base_price: 450,
    category: "Standard",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/EGSMLB100/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
  {
    id: "2",
    name: "O-Z/Gedney C-100 Conduit Body",
    slug: "oz-gedney-c-100-conduit-body",
    description:
      "Type C conduit body สำหรับการเชื่อมต่อท่อร้อยสายไฟแบบตรง คุณภาพมาตรฐานสากล",
    type: "C",
    material: "Aluminum",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2", "2-1/2", "3"],
    base_price: 380,
    category: "Standard",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/EGSC100/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
  {
    id: "3",
    name: "O-Z/Gedney T-75 Conduit Body",
    slug: "oz-gedney-t-75-conduit-body",
    description:
      "Type T conduit body สำหรับการแยกสายไฟ 3 ทิศทาง เหมาะสำหรับงานไฟฟ้าที่ซับซ้อน",
    type: "T",
    material: "Aluminum",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2"],
    base_price: 520,
    category: "Standard",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/EGST75/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
  {
    id: "4",
    name: "O-Z/Gedney LL-100 Conduit Body",
    slug: "oz-gedney-ll-100-conduit-body",
    description:
      "Type LL conduit body สำหรับการเลี้ยวซ้าย 90 องศา ประหยัดพื้นที่ในการติดตั้ง",
    type: "LL",
    material: "Aluminum",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2"],
    base_price: 480,
    category: "Standard",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/EGSLL100/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
  {
    id: "5",
    name: "O-Z/Gedney LR-75 Conduit Body",
    slug: "oz-gedney-lr-75-conduit-body",
    description:
      "Type LR conduit body สำหรับการเลี้ยวขวา 90 องศา ออกแบบให้ติดตั้งง่าย",
    type: "LR",
    material: "Aluminum",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2"],
    base_price: 480,
    category: "Standard",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/EGSLR75/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
  {
    id: "6",
    name: "O-Z/Gedney EXP-LB-100 Explosion-Proof",
    slug: "oz-gedney-exp-lb-100-explosion-proof",
    description:
      "Explosion-proof Type LB conduit body สำหรับพื้นที่เสี่ยงระเบิด Class I Division 1 & 2",
    type: "LB",
    material: "Cast Iron",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2", "2-1/2", "3"],
    base_price: 1250,
    category: "Explosion-Proof",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/EXPLB100/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
  {
    id: "7",
    name: "O-Z/Gedney EXP-C-150 Explosion-Proof",
    slug: "oz-gedney-exp-c-150-explosion-proof",
    description:
      "Explosion-proof Type C conduit body สำหรับพื้นที่เสี่ยงระเบิด มาตรฐาน ATEX และ IECEx",
    type: "C",
    material: "Cast Iron",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2", "2-1/2", "3", "4"],
    base_price: 1180,
    category: "Explosion-Proof",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/EXPC150/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
  {
    id: "8",
    name: "O-Z/Gedney SS-LB-100 Stainless Steel",
    slug: "oz-gedney-ss-lb-100-stainless-steel",
    description:
      "Stainless steel Type LB conduit body สำหรับสภาพแวดล้อมที่มีการกัดกร่อน เกรดทะเล",
    type: "LB",
    material: "Stainless Steel",
    sizes: ["1/2", "3/4", "1", "1-1/4", "1-1/2", "2"],
    base_price: 890,
    category: "Corrosion-Resistant",
    image_url:
      "https://res.cloudinary.com/mcrey/image/upload/f_auto,q_auto/w_400/v1645510069/Products/SSLB100/IMG_49446327_IDW_IMAGE_aa8a4665eaff920149934aa899ec1ec11d1b2d44cf0cd451a22cdb3e2eea59cf.jpg",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 100,
  },
]

// Mock leads data
export const mockLeads = [
  {
    id: "1",
    customerName: "สมชาย วิศวกรรม",
    company: "บริษัท ไฟฟ้าอุตสาหกรรม จำกัด",
    phone: "02-123-4567",
    email: "somchai@electrical.co.th",
    address: "123 ถนนรามคำแหง กรุงเทพฯ 10240",
    productInterest: "O-Z/Gedney LB-75 Conduit Body",
    size: "1",
    quantity: "50",
    status: "รอติดต่อ",
    notes: ["ลูกค้าสนใจสินค้าจำนวนมาก", "ต้องการใบเสนอราคาด่วน"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    customerName: "วิชัย โครงการ",
    company: "บริษัท ก่อสร้างใหญ่ จำกัด",
    phone: "02-987-6543",
    email: "wichai@construction.co.th",
    productInterest: "O-Z/Gedney EXP-LB-100 Explosion-Proof",
    size: "2",
    quantity: "20",
    status: "กำลังเจรจา",
    notes: ["โครงการโรงงานปิโตรเคมี", "ต้องการของแท้ มีใบรับรอง"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    customerName: "นิรันดร์ เทคนิค",
    company: "ห้างหุ้นส่วน นิรันดร์ เอ็นจิเนียริ่ง",
    phone: "02-555-1234",
    email: "nirand@engineering.co.th",
    productInterest: "O-Z/Gedney C-100 Conduit Body",
    size: "3/4",
    quantity: "100",
    status: "ปิดการขาย",
    notes: ["ลูกค้าประจำ", "ชำระเงินแล้ว", "จัดส่งเรียบร้อย"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

// Mock analytics data
export const mockAnalytics = {
  totalImpressions: 2847392,
  totalClicks: 45231,
  totalConversions: 1247,
  roas: 4.2,
  ctr: 1.59,
  cpc: 12.5,
  conversionRate: 2.76,
  monthlyVisitors: 12847,
  bounceRate: 32.5,
  avgSessionDuration: "2:34",
  topPages: [
    { page: "/", views: 15234, uniqueViews: 12847, bounceRate: 28.5 },
    { page: "/products", views: 8945, uniqueViews: 7234, bounceRate: 35.2 },
    {
      page: "/products/conduit-body-lb",
      views: 5678,
      uniqueViews: 4892,
      bounceRate: 42.1,
    },
  ],
  trafficSources: [
    { source: "Organic Search", percentage: 45.2, visitors: 5803 },
    { source: "Direct", percentage: 28.7, visitors: 3687 },
    { source: "Social Media", percentage: 15.1, visitors: 1940 },
    { source: "Referral", percentage: 11.0, visitors: 1417 },
  ],
}

