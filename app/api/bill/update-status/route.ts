import { NextRequest, NextResponse } from 'next/server';
import { update } from '../../../../core/mock/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { billId, status } = body;
  const updated = update('bills', billId, { status });
  return NextResponse.json(updated || {});
}