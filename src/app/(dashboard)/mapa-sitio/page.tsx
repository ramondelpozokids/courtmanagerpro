import { legalPages } from '@/content/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

export default function MapaSitioPage() {
  return <LegalPageView content={legalPages['mapa-sitio']} />;
}
