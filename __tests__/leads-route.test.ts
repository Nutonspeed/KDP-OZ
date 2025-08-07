import { NextRequest } from 'next/server'
import { GET, POST } from '../app/api/leads/route'

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
    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
  })
})
