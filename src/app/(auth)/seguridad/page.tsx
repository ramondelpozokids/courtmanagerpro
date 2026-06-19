import { legalPages } from '@/content/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

export default function SeguridadPage() {
  return <LegalPageView content={legalPages['seguridad']} />;
}
