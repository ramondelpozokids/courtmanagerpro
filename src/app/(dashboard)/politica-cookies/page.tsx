import { legalPages } from '@/content/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

export default function PoliticaCookiesPage() {
  return <LegalPageView content={legalPages['politica-cookies']} />;
}
