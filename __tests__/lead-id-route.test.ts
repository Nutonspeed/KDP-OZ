import { NextRequest } from 'next/server'
import { GET, PUT, PATCH, DELETE } from '../app/api/leads/[id]/route'
import { POST as POST_NOTE } from '../app/api/leads/[id]/notes/route'
import { addLead } from '../lib/leads'

describe('GET/PUT/PATCH/DELETE /api/leads/:id', () => {
  let id: string

  beforeAll(async () => {
    const lead = await addLead({ customerName: 'Route Tester' })
    id = lead.id
  })

  test('GET returns the lead', async () => {
    const res = await GET(new NextRequest('http://localhost'), { params: { id } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toBe(id)
  })

  test('PATCH updates part of the lead', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'patched' }),
      headers: { 'content-type': 'application/json' },
    })
    const res = await PATCH(req, { params: { id } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.status).toBe('patched')
  })

  test('PUT replaces the lead', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ customerName: 'Replaced', status: 'replaced' }),
      headers: { 'content-type': 'application/json' },
    })
    const res = await PUT(req, { params: { id } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.customerName).toBe('Replaced')
    expect(json.status).toBe('replaced')
  })

  test('POST /notes adds a note', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ note: 'check in' }),
      headers: { 'content-type': 'application/json' },
    })
    const res = await POST_NOTE(req, { params: { id } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.notes).toContain('check in')
  })

  test('DELETE removes the lead', async () => {
    const req = new NextRequest('http://localhost', { method: 'DELETE' })
    const res = await DELETE(req, { params: { id } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })
})
