import { NextRequest } from 'next/server'
import { GET, PUT, DELETE } from '../app/api/leads/[id]/route'
import { addLead } from '../lib/leads'

describe('GET/PUT/DELETE /api/leads/:id', () => {
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

  test('PUT updates the lead', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ status: 'updated' }),
      headers: { 'content-type': 'application/json' },
    })
    const res = await PUT(req, { params: { id } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.status).toBe('updated')
  })

  test('DELETE removes the lead', async () => {
    const req = new NextRequest('http://localhost', { method: 'DELETE' })
    const res = await DELETE(req, { params: { id } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
  })
})
