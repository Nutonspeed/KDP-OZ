import {
  addLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
} from '../lib/leads'
import { mockLeads } from '../lib/mockData'

describe('leads library', () => {
  test('getLeads returns mock data when no database configured', async () => {
    const leads = await getLeads()
    expect(leads).toEqual(mockLeads)
  })

  test('getLeads can filter by email', async () => {
    const email = mockLeads[0].email!
    const leads = await getLeads({ email })
    expect(leads).toHaveLength(1)
    expect(leads[0].email).toBe(email)
  })

  test('getLeads can filter by status', async () => {
    const status = mockLeads[0].status!
    const leads = await getLeads({ status })
    expect(leads.every((l) => l.status === status)).toBe(true)
  })

  test('addLead appends a new lead to mock data', async () => {
    const initialLength = mockLeads.length
    const newLead = await addLead({
      customerName: 'Test User',
      company: 'Test Co',
      phone: '000-000',
      email: 'test@example.com',
      notes: ['hello'],
    })
    expect(newLead.id).toBeDefined()
    expect(mockLeads.length).toBe(initialLength + 1)
  })

  test('getLead retrieves a single lead', async () => {
    const lead = await getLead(mockLeads[0].id)
    expect(lead?.id).toBe(mockLeads[0].id)
  })

  test('updateLead modifies an existing lead', async () => {
    const id = mockLeads[0].id
    const updated = await updateLead(id, { status: 'updated' })
    expect(updated?.status).toBe('updated')
    const fetched = await getLead(id)
    expect(fetched?.status).toBe('updated')
  })

  test('deleteLead removes a lead', async () => {
    const id = mockLeads[mockLeads.length - 1].id
    const success = await deleteLead(id)
    expect(success).toBe(true)
    const lead = await getLead(id)
    expect(lead).toBeNull()
  })
})
