import { NextRequest, NextResponse } from 'next/server';
import { authenticate, authorize } from '@/lib/security/auth';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { createServiceSupabase } from '@/infrastructure/supabase/service';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { resolveTeamId } from '@/lib/team-constants';
import { hasFullClubAccess } from '@/lib/permissions';
import { processRmbUpload } from '@/application/rmb-import/processUpload';

export const runtime = 'nodejs';

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const auth = await authenticate();
  if (auth.response || !auth.user) return auth.response!;

  const authorized = await authorize(auth);
  const email = authorized.access.email;
  const role = authorized.access.role;

  if (!hasFullClubAccess(role, email)) {
    return NextResponse.json(
      { error: 'Solo administración de utilería (Carlos / Superadmin).' },
      { status: 403 }
    );
  }

  const form = await req.formData();
  const file = form.get('file');
  const teamId = resolveTeamId((form.get('team_id') as string) || CLUB_TEAM_IDS.rmb);

  if (teamId !== CLUB_TEAM_IDS.rmb) {
    return NextResponse.json(
      { error: 'Importación automática disponible solo para Real Madrid Baloncesto (RMB).' },
      { status: 400 }
    );
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Archivo requerido.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Archivo demasiado grande (máx. 25 MB).' }, { status: 400 });
  }

  const filename = file.name || 'documento';
  const mimeType = file.type || 'application/octet-stream';

  try {
    const supabase = await createSupabaseServerClient();
    const serviceSupabase = createServiceSupabase();
    const result = await processRmbUpload({
      supabase: supabase as any,
      serviceSupabase,
      teamId,
      userId: auth.user.id,
      buffer,
      filename,
      mimeType,
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al importar';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
