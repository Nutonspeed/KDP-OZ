import {
  addLeadFromJson,
  fetchLeadCount,
  getLeadById,
  updateLead,
  updateLeadStatus,
  addNoteToLead,
  searchLeads,
  deleteLead,
} from '@/actions/leads'

describe('leads actions', () => {
  test('addLeadFromJson increases count', async () => {
    const initial = await fetchLeadCount()
    const result = await addLeadFromJson({ name: 'Tester', email: 'tester@example.com' })
    expect(result.success).toBe(true)
    const count = await fetchLeadCount()
    expect(count).toBe(initial + 1)
  })

  test('get, update, and note lead', async () => {
    const { success } = await addLeadFromJson({ name: 'Updater', email: 'updater@example.com' })
    expect(success).toBe(true)
    const count = await fetchLeadCount()
    const id = count.toString()
    let lead = await getLeadById(id)
    expect(lead?.email).toBe('updater@example.com')

    await updateLead(id, { phone: '123' })
    await updateLeadStatus(id, 'กำลังเจรจา')
    await addNoteToLead(id, 'call soon')

    lead = await getLeadById(id)
    expect(lead?.phone).toBe('123')
    expect(lead?.status).toBe('กำลังเจรจา')
    expect(lead?.notes?.[0]).toBe('call soon')
  })

  test('search and delete lead', async () => {
    const { success } = await addLeadFromJson({ name: 'Searchable', email: 'searchable@example.com' })
    expect(success).toBe(true)
    const leads = await searchLeads({ name: 'Searchable' })
    expect(leads.length).toBeGreaterThan(0)
    const id = leads[0].id
    const del = await deleteLead(id)
    expect(del.success).toBe(true)
  })
})
