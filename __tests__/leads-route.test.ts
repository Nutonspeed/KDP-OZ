import { NextRequest } from 'next/server'
import { GET, POST } from '../app/api/leads/route'
import { mockLeads } from '../lib/mockData'

describe('POST /api/leads', () => {
  test('returns 400 for invalid input', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'content-type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  test('creates lead for valid input', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ customerName: 'Tester' }),
      headers: { 'content-type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.customerName).toBe('Tester')
  })
})

describe('GET /api/leads', () => {
  test('returns list of leads', async () => {
    const req = new NextRequest('http://localhost/api/leads')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
  })

  test('filters leads by email', async () => {
    const email = mockLeads[0].email!
    const req = new NextRequest(`http://localhost/api/leads?email=${email}`)
    const res = await GET(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveLength(1)
    expect(json[0].email).toBe(email)
  })

  test('filters leads by status', async () => {
    const status = mockLeads[0].status!
    const req = new NextRequest(
      `http://localhost/api/leads?status=${encodeURIComponent(status)}`
    )
    const res = await GET(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.every((l: any) => l.status === status)).toBe(true)
  })
})
