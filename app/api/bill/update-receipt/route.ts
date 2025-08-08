import { NextRequest, NextResponse } from 'next/server';
import { update, create } from '../../../../core/mock/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { billId, receipt } = body;
  // add receipt to receipts list
  const newReceipt = create('receipts', { billId, ...receipt });
  // update bill with receipt id or other info as needed
  const updatedBill = update('bills', billId, { receiptId: newReceipt.id });
  return NextResponse.json(updatedBill || {});
}