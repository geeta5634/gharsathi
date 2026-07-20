import { NextResponse } from 'next/server';
import { workers, users, services } from '@/lib/store';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const serviceName = searchParams.get('service');

  let result = Array.from(workers.values()).filter(w => w.isApproved !== false);

  if (serviceName) {
    const svc = Array.from(services.values()).find(s =>
      s.name?.toLowerCase() === serviceName.toLowerCase()
    );
    if (svc) {
      result = result.filter(w => w.services?.includes(svc._id));
    }
  }

  result = result.map(w => {
    const user = users.get(w.user);
    const { password, ...safeUser } = user || {};
    return { ...w, user: safeUser };
  });

  return NextResponse.json({ success: true, count: result.length, data: result });
}
