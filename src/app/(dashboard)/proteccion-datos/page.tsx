import { legalPages } from '@/content/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

export default function ProteccionDatosPage() {
  return <LegalPageView content={legalPages['proteccion-datos']} />;
}
