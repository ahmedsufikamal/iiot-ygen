export type TenantId = 'sylhet-medical' | 'chittagong-general' | 'dhaka-central';
export interface TenantInfo { id: TenantId; name: string; color: string; }
export const TENANTS: Record<TenantId, TenantInfo> = {
  'sylhet-medical': { id:'sylhet-medical', name: 'Sylhet Medical College Hospital', color: '#22c55e' },
  'chittagong-general': { id:'chittagong-general', name: 'Chittagong General Hospital', color: '#38bdf8' },
  'dhaka-central': { id:'dhaka-central', name: 'Dhaka Central Hospital', color: '#f59e0b' },
};
export function getTenant(id: string | null | undefined): TenantInfo | null { if (!id) return null; return (TENANTS as any)[id] ?? null; }
export const TENANT_LIST = Object.values(TENANTS);
