import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Standard Conduit",
}

export default function StandardConduitLanding() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4 font-sarabun">Standard Conduit</h1>
      <p className="mb-6 font-sarabun">โซลูชันมาตรฐานสำหรับงานทั่วไป</p>
      <ul className="list-disc pl-6 mb-6 font-sarabun">
        <li>ติดตั้งง่าย</li>
        <li>มีหลายขนาด</li>
        <li>ราคาประหยัด</li>
      </ul>
      <Image src="/placeholder.jpg" alt="Standard conduit" width={600} height={400} className="mb-6" />
      <Button asChild className="bg-blue-600">
        <Link href="/#contact">ขอใบเสนอราคา</Link>
      </Button>
    </div>
  )
}
