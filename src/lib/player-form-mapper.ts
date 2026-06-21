import type { Player as ApiPlayer } from '@/types';
import type { Player as FormPlayer } from '@/domain/entities/Player';

export type PlayerFormData = Omit<FormPlayer, 'id'> & { id?: string };

const FORM_TO_DEMO_POSITION: Record<FormPlayer['position'], string> = {
  PG: 'base',
  SG: 'escolta',
  SF: 'alero',
  PF: 'ala-pivot',
  C: 'pivot',
};

const DEMO_TO_FORM_POSITION: Record<string, FormPlayer['position']> = {
  base: 'PG',
  pg: 'PG',
  escolta: 'SG',
  sg: 'SG',
  alero: 'SF',
  sf: 'SF',
  'ala-pivot': 'PF',
  ala_pivot: 'PF',
  pf: 'PF',
  pivot: 'C',
  c: 'C',
};

export function demoPositionToForm(position: string): FormPlayer['position'] {
  return DEMO_TO_FORM_POSITION[position.toLowerCase()] ?? 'PG';
}

export function formPositionToDemo(position: FormPlayer['position']): string {
  return FORM_TO_DEMO_POSITION[position];
}

export function apiPlayerToFormValues(player: ApiPlayer): FormPlayer {
  const parts = player.full_name.trim().split(/\s+/);
  return {
    id: player.id,
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' ') || parts[0] || '',
    number: player.dorsal,
    position: demoPositionToForm(player.position),
    status: player.is_active ? 'ACTIVE' : 'INACTIVE',
    nationality: player.nationality ?? 'España',
    sizes: {
      jersey: player.shirt_size ?? 'XL',
      shorts: player.shorts_size ?? 'XL',
      shoes: String(player.shoe_size ?? 46),
      socks: player.sock_size ?? 'L',
      warmupShirt: player.jacket_size ?? 'XXL',
    },
  };
}

export function formDataToDemoPlayer(form: PlayerFormData, existing?: { imageUrl?: string; birthDate?: string }) {
  const accent = 'FF6600';
  const name = `${form.firstName} ${form.lastName}`.trim();
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    number: form.number,
    position: formPositionToDemo(form.position),
    status: form.status,
    nationality: form.nationality || 'España',
    birthDate: existing?.birthDate ?? '1998-05-10',
    birth_place: 'España',
    sizes: {
      jersey: form.sizes.jersey,
      shorts: form.sizes.shorts,
      shoes: form.sizes.shoes,
      socks: form.sizes.socks,
      warmupShirt: form.sizes.warmupShirt,
    },
    imageUrl:
      existing?.imageUrl ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${accent}&color=fff&size=384&bold=true`,
    matches_played: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    palmares: [] as string[],
  };
}

export function formDataToCreatePlayerForm(form: PlayerFormData) {
  return {
    dorsal: form.number,
    full_name: `${form.firstName} ${form.lastName}`.trim(),
    position: formPositionToDemo(form.position) as ApiPlayer['position'],
    nationality: form.nationality,
    shirt_size: form.sizes.jersey,
    shorts_size: form.sizes.shorts,
    shoe_size: Number(form.sizes.shoes) || 46,
    jacket_size: form.sizes.warmupShirt,
  };
}

export function formDataToUpdatePayload(form: PlayerFormData): Partial<import('@/types').Player> {
  return {
    dorsal: form.number,
    full_name: `${form.firstName} ${form.lastName}`.trim(),
    position: formPositionToDemo(form.position) as import('@/types').Player['position'],
    nationality: form.nationality,
    is_active: form.status === 'ACTIVE',
    shirt_size: form.sizes.jersey,
    shorts_size: form.sizes.shorts,
    shoe_size: Number(form.sizes.shoes) || 46,
    jacket_size: form.sizes.warmupShirt,
    sock_size: form.sizes.socks,
  };
}
