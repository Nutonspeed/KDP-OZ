import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'core', 'mock', 'store-profile.json');

export async function GET() {
  const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');
  return NextResponse.json(body);
}