import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Lead {
  id: string;
  customerName: string;
  company?: string;
  phone: string;
  email: string;
  address?: string;
  productInterest: string;
  size?: string;
  quantity?: string;
  status: "รอติดต่อ" | "กำลังเจรจา" | "ปิดการขาย";
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

interface LeadState {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "status" | "notes">) => void;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  addNote: (id: string, note: string) => void;
  deleteLead: (id: string) => void;
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (newLead) =>
        set((state) => ({
          leads: [
            ...state.leads,
            {
              id: String(state.leads.length + 1),
              createdAt: new Date().toISOString(),
              status: "รอติดต่อ",
              notes: [],
              ...newLead,
            },
          ],
        })),
      updateLeadStatus: (id, status) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id ? { ...lead, status } : lead
          ),
        })),
      addNote: (id, note) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id ? { ...lead, notes: [...(lead.notes || []), note] } : lead
          ),
        })),
      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        })),
    }),
    {
      name: "leads-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
