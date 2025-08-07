'use server'

export async function fetchPages() { return [] }
export async function createPage(pageData: any) { return { success: true } }
export async function updatePage(pageId: string, pageData: any) { return { success: true } }
export async function deletePage(pageId: string) { return { success: true } }

export async function fetchBanners() { return [] }
export async function createBanner(bannerData: any) { return { success: true } }
export async function updateBanner(bannerId: string, bannerData: any) { return { success: true } }
export async function deleteBanner(bannerId: string) { return { success: true } }

export async function fetchSeoSettings() { return null }
export async function updateSEO(seoData: any) { return { success: true } }
