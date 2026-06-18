import { legalPages } from '@/content/legal';
import { LegalPageView } from '@/components/legal/LegalPageView';

export default function CondicionesUsoPage() {
  return <LegalPageView content={legalPages['condiciones-uso']} />;
}
