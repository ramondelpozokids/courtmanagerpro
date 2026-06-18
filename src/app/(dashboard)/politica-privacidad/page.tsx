import { legalPages } from '@/content/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

export default function PoliticaPrivacidadPage() {
  return <LegalPageView content={legalPages['politica-privacidad']} />;
}
