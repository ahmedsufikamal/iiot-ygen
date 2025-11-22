import { cookies } from 'next/headers';
import { getBranding, setBranding } from '@/lib/branding-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // cookies() is async in Next.js 16
  const c = await cookies();
  const tenant = c.get('tenant')?.value;
  const data = getBranding(tenant);

  return Response.json({ ok: true, branding: data });
}

export async function POST(req: Request) {
  const c = await cookies();
  const role = c.get('role')?.value || 'user';

  if (role !== 'admin') {
    return Response.json({ error: 'admin only' }, { status: 403 });
  }

  const tenant = c.get('tenant')?.value;
  const body = await req.json().catch(() => ({} as any));

  const b = setBranding(tenant, {
    logoUrl: body.logoUrl,
  });

  return Response.json({ ok: true, branding: b });
}
