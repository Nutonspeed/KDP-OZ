import { addLead, getLeads } from '../lib/leads'
import { mockLeads } from '../lib/mockData'

describe('leads library', () => {
  test('getLeads returns mock data when no database configured', async () => {
    const leads = await getLeads()
    expect(leads).toEqual(mockLeads)
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
})
