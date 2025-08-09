import {
  addLeadFromJson,
  fetchLeadCount,
  getLeadById,
  updateLead,
  updateLeadStatus,
  addNoteToLead,
  searchLeads,
  deleteLead as deleteLeadAction,
} from '@/actions/leads'
import { GET as listLeadsApi, POST as createLeadApi } from '@/app/api/leads/route'
import { GET as getLeadApi, PATCH as patchLeadApi, DELETE as deleteLeadApi } from '@/app/api/leads/[id]/route'
import { NextRequest } from 'next/server'

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
    const del = await deleteLeadAction(id)
    expect(del.success).toBe(true)
  })

  test('API routes create, update, and delete lead', async () => {
    const postReq = new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      body: JSON.stringify({ name: 'ApiLead', email: 'apilead@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    })
    let res = await createLeadApi(postReq)
    expect(res.status).toBe(200)

    const listRes = await listLeadsApi(new NextRequest('http://localhost/api/leads'))
    const listData: any = await listRes.json()
    const lead = listData.leads.find((l: any) => l.email === 'apilead@example.com')
    expect(lead).toBeTruthy()

    const patchReq = new NextRequest(`http://localhost/api/leads/${lead.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ติดตามผล', note: 'initial contact' }),
      headers: { 'Content-Type': 'application/json' },
    })
    res = await patchLeadApi(patchReq, { params: Promise.resolve({ id: lead.id }) })
    expect(res.status).toBe(200)

    const singleRes = await getLeadApi(
      new NextRequest(`http://localhost/api/leads/${lead.id}`),
      { params: Promise.resolve({ id: lead.id }) },
    )
    const singleData: any = await singleRes.json()
    expect(singleData.lead.status).toBe('ติดตามผล')
    expect(singleData.lead.notes[0]).toBe('initial contact')

    const delRes = await deleteLeadApi(
      new NextRequest(`http://localhost/api/leads/${lead.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: lead.id }) },
    )
    expect(delRes.status).toBe(200)
  })
})
