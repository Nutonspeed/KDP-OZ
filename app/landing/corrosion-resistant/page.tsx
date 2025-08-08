import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Corrosion-Resistant Conduit",
}

export default function CorrosionResistantLanding() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 font-sarabun">Corrosion-Resistant Conduit</h1>
      <p className="mb-6 font-sarabun">ใช้ในสภาพแวดล้อมกัดกร่อนสูง</p>
      <ul className="list-disc pl-6 mb-6 font-sarabun">
        <li>ทนสนิม</li>
        <li>อายุการใช้งานยาวนาน</li>
        <li>คุ้มค่า</li>
      </ul>
      <Image src="/placeholder.jpg" alt="Corrosion resistant" width={600} height={400} className="mb-6" />
      <Button asChild className="bg-blue-600">
        <Link href="/#contact">ขอใบเสนอราคา</Link>
      </Button>
    </div>
  )
}
