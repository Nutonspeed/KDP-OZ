"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginDialog } from "@/components/LoginDialog" // Import the new LoginDialog

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-sarabun">KDP Engineering & Supply</h3>
            <p className="text-sm text-gray-400 font-sarabun">
              ผู้จำหน่าย O-Z/Gedney Conduit Body อย่างเป็นทางการในประเทศไทย สินค้าคุณภาพสูง มาตรฐาน UL และ NEMA
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Social Media Icons (Placeholder) */}
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C17.361 21.23 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.002 3.797.048.843.04 1.15.138 1.504.237.664.189 1.12.462 1.46.813.36.36.633.819.813 1.46.099.354.197.661.237 1.503.046 1.013.048 1.371.048 3.797v.648c0 2.43-.002 2.784-.048 3.797-.04.843-.138 1.15-.237 1.504-.189.664-.462 1.12-.813 1.46-.36.36-.819.633-1.46.813-.354.099-.661.197-1.503.237-1.013.046-1.371.048-3.797.048h-.648c-2.43 0-2.784-.002-3.797-.048-.843-.04-1.15-.138-1.504-.237-.664-.189-1.12-.462-.813-1.46-.36-.36-.633-.819-.813-1.46-.099-.354-.197-.661-.237-1.503-.046-1.013-.048-1.371-.048-3.797v-.648c0-2.43.002-2.784.048-3.797.04-.843.138-1.15.237-1.504.189-.664.462-1.12.813-1.46.36-.36.819-.633 1.46-.813.099-.354.197-.661.237-1.503C9.216 2.002 9.57 2 12 2h.315zm2.533 1.049c-.423 0-.695.002-.928.013-.791.045-1.289.174-1.746.367-.473.199-.869.481-1.23.842-.361.361-.643.757-.842 1.23-.193.457-.322.955-.367 1.746-.011.233-.013.505-.013.928v.648c0 .423.002.695.013.928.045.791.174 1.289.367 1.746.199.473.481.869.842 1.23.361.361.757.643 1.23.842.457.193.955.322 1.746.367.233.011.505.013.928.013h.648c.423 0 .695-.002.928-.013.791-.045 1.289-.174 1.746-.367.473-.199.869-.481 1.23-.842.361-.361.643-.757.842-1.23.193-.457.322-.955.367-1.746.011-.233.013-.505.013-.928v-.648c0-.423-.002-.695-.013-.928-.045-.791-.174-1.289-.367-1.746-.199-.473-.481-.869-.842-1.23-.361-.361-.757-.643-.842-1.23-.193-.457-.322-.955-.367-1.746-.011-.233-.013-.505-.013-.928V5.315z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-sarabun">ลิงก์ด่วน</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm font-sarabun">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white text-sm font-sarabun">
                  สินค้า
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-gray-400 hover:text-white text-sm font-sarabun">
                  สั่งซื้อ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm font-sarabun">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm font-sarabun">
                  ติดต่อ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-sarabun">ติดต่อเรา</h3>
            <p className="text-sm text-gray-400 font-sarabun">
              14/1763 หมู่ 13 ถนนกาญจนาภิเษก
              <br />
              ต.บางบัวทอง อ.บางบัวทอง จ.นนทบุรี 11110
            </p>
            <p className="text-sm text-gray-400 font-sarabun mt-2">โทร: 0-2925-9633-4</p>
            <p className="text-sm text-gray-400 font-sarabun">อีเมล: info@kdp.co.th</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-center sm:text-left font-sarabun">
            &copy; {new Date().getFullYear()} KDP Engineering & Supply. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white font-sarabun">
              นโยบายความเป็นส่วนตัว
            </Link>
            <Link href="/terms-of-service" className="hover:text-white font-sarabun">
              ข้อกำหนดการใช้งาน
            </Link>
            {/* Admin Login Button */}
            <LoginDialog>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 font-sarabun">
                เข้าสู่ระบบ Admin
              </Button>
            </LoginDialog>
          </div>
        </div>
      </div>
    </footer>
  )
}
