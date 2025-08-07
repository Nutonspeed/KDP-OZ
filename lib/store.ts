import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { supabaseBrowser } from "./supabase" // Import the browser client
import { User } from '@supabase/supabase-js' // Import User type
import { Product } from "@/types/product" // Import Product type

// Auth Store
interface AuthState {
  isAuthenticated: boolean
  user: { id: string; email: string } | null // Store Supabase User object
  checkAuth: () => Promise<void> // Make it async
  login: (user: { id: string; email: string }) => void // Accept User object
  logout: () => void // Make it async
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      checkAuth: async () => {
        const { data, error } = await supabaseBrowser().auth.getSession()
        if (data?.session) {
          set({ isAuthenticated: true, user: { id: data.session.user.id, email: data.session.user.email ?? '' } })
        } else {
          set({ isAuthenticated: false, user: null })
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Product Store
interface ProductState {
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now().toString() }],
        })),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product)),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      getProduct: (id) => get().products.find((product) => product.id === id),
    }),
    {
      name: "product-store",
    },
  ),
)

// Lead Store
interface Lead {
  id: string
  customerName: string
  company?: string
  phone: string
  email: string
  address?: string
  productInterest: string
  size?: string
  quantity?: string
  status: "รอติดต่อ" | "กำลังเจรจา" | "ปิดการขาย"
  notes?: string[]
  createdAt: string
  updatedAt: string
}

interface LeadState {
  leads: Lead[]
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "status" | "notes">) => void
  updateLeadStatus: (id: string, status: Lead["status"]) => void
  addNote: (id: string, note: string) => void
  deleteLead: (id: string) => void
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
          leads: state.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)),
        })),
      addNote: (id, note) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id ? { ...lead, notes: [...(lead.notes || []), note] } : lead,
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
    },
  ),
)

// Marketing Store
interface Campaign {
  id: string
  name: string
  objective: string
  budget: number
  audience: string
  adContent: string
  targetProduct: string
  status: "draft" | "active" | "paused" | "completed"
  impressions?: number
  clicks?: number
  ctr?: number
  createdAt: string
}

interface MarketingState {
  campaigns: Campaign[]
  analytics: any
  createCampaign: (campaign: Omit<Campaign, "id" | "createdAt">) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
}

export const useMarketingStore = create<MarketingState>()(
  persist(
    (set) => ({
      campaigns: [],
      analytics: {
        totalImpressions: 0,
        totalClicks: 0,
        totalConversions: 0,
        roas: 0,
        ctr: 0,
        cpc: 0,
        conversionRate: 0,
      },
      createCampaign: (campaign) =>
        set((state) => ({
          campaigns: [
            {
              ...campaign,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
            ...state.campaigns,
          ],
        })),
      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((campaign) => (campaign.id === id ? { ...campaign, ...updates } : campaign)),
        })),
      deleteCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        })),
    }),
    {
      name: "marketing-store",
    },
  ),
)

// Content Store
interface PageContent {
  id: string
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  status: "draft" | "published" | "archived"
  createdAt: number
  updatedAt: number
}

interface BannerContent {
  id: string
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  active: boolean
  position: "hero" | "sidebar" | "footer"
  createdAt: number
  updatedAt: number
}

interface SeoSettings {
  siteTitle: string
  siteDescription?: string
  keywords?: string
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
}

interface ContentState {
  pages: PageContent[]
  banners: BannerContent[]
  seoSettings: SeoSettings
  createPage: (page: Omit<PageContent, "id" | "createdAt" | "updatedAt">) => void
  updatePage: (id: string, page: Partial<PageContent>) => void
  deletePage: (id: string) => void
  createBanner: (banner: Omit<BannerContent, "id" | "createdAt" | "updatedAt">) => void
  updateBanner: (id: string, banner: Partial<BannerContent>) => void
  deleteBanner: (id: string) => void
  updateSEO: (settings: SeoSettings) => void
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      pages: [],
      banners: [],
      seoSettings: {
        siteTitle: "",
        siteDescription: "",
        keywords: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterCard: "",
      },
      createPage: (newPage) =>
        set((state) => ({
          pages: [
            ...state.pages,
            {
              id: String(state.pages.length + 1),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              ...newPage,
            },
          ],
        })),
      updatePage: (id, updatedPage) =>
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === id ? { ...page, ...updatedPage, updatedAt: Date.now() } : page,
          ),
        })),
      deletePage: (id) =>
        set((state) => ({
          pages: state.pages.filter((page) => page.id !== id),
        })),
      createBanner: (newBanner) =>
        set((state) => ({
          banners: [
            ...state.banners,
            {
              id: String(state.banners.length + 1),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              ...newBanner,
            },
          ],
        })),
      updateBanner: (id, updatedBanner) =>
        set((state) => ({
          banners: state.banners.map((banner) =>
            banner.id === id ? { ...banner, ...updatedBanner, updatedAt: Date.now() } : banner,
          ),
        })),
      deleteBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((banner) => banner.id !== id),
        })),
      updateSEO: (settings) => set({ seoSettings: settings }),
    }),
    {
      name: "content-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// Cart Store
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock_quantity) {
              // Prevent adding more than available stock
              console.warn(`Cannot add more than available stock for ${product.name}. Current stock: ${product.stock_quantity}`);
              return state; // Do not update state
            }
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: newQuantity } : item
              ),
            };
          } else {
            if (quantity > product.stock_quantity) {
              console.warn(`Cannot add more than available stock for ${product.name}. Current stock: ${product.stock_quantity}`);
              return state; // Do not add if initial quantity exceeds stock
            }
            return { items: [...state.items, { ...product, quantity }] };
          }
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateItemQuantity: (productId, quantity) =>
        set((state) => {
          const itemToUpdate = state.items.find((item) => item.id === productId);
          if (itemToUpdate) {
            if (quantity <= 0) {
              return { items: state.items.filter((item) => item.id !== productId) };
            }
            if (quantity > itemToUpdate.stock_quantity) {
              console.warn(`Cannot set quantity more than available stock for ${itemToUpdate.name}. Current stock: ${itemToUpdate.stock_quantity}`);
              return state; // Do not update if new quantity exceeds stock
            }
            return {
              items: state.items.map((item) =>
                item.id === productId ? { ...item, quantity } : item
              ),
            };
          }
          return state;
        }),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.base_price * item.quantity, 0),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);
