import { NextRequest, NextResponse } from 'next/server';
import { getAll, getById, create, update, remove } from '../../../../core/mock/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const item = getById('bills', id);
    return NextResponse.json(item || {});
  }
  const items = getAll('bills');
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = create('bills', body);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const id = body.id;
  const updated = update('bills', id, body);
  return NextResponse.json(updated || {});
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const id = body.id;
  const result = remove('bills', id);
  return NextResponse.json(result);
}