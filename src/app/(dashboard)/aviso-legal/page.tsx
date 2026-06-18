import { legalPages } from '@/content/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

export default function AvisoLegalPage() {
  return <LegalPageView content={legalPages['aviso-legal']} />;
}
