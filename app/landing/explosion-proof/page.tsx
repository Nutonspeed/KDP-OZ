import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Explosion-Proof Conduit",
}

export default function ExplosionProofLanding() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 font-sarabun">Explosion-Proof Conduit</h1>
      <p className="mb-6 font-sarabun">โฟกัส use-case งานพื้นที่เสี่ยงระเบิด</p>
      <ul className="list-disc pl-6 mb-6 font-sarabun">
        <li>ทนทานต่อการระเบิด</li>
        <li>ปลอดภัยตามมาตรฐาน</li>
        <li>ติดตั้งง่าย</li>
      </ul>
      <Image src="/placeholder.jpg" alt="Explosion-proof" width={600} height={400} className="mb-6" />
      <Button asChild className="bg-blue-600">
        <Link href="/#contact">ขอใบเสนอราคา</Link>
      </Button>
    </div>
  )
}
