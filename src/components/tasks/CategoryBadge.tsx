import { cn } from '@/lib/utils';
import { BusinessCategory, BUSINESS_CATEGORIES } from '@/types/task';
import { Building2, Megaphone, Code2, Landmark, BrainCircuit } from 'lucide-react';

const iconMap = {
  'real-estate': Building2,
  'digital-marketing': Megaphone,
  'software-dev': Code2,
  'loan': Landmark,
  'ai-services': BrainCircuit,
};

interface CategoryBadgeProps {
  category: BusinessCategory;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const categoryInfo = BUSINESS_CATEGORIES.find((c) => c.value === category);
  const Icon = iconMap[category];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        category === 'real-estate' && "bg-real-estate-light text-real-estate border-real-estate/20",
        category === 'digital-marketing' && "bg-digital-marketing-light text-digital-marketing border-digital-marketing/20",
        category === 'software-dev' && "bg-software-dev-light text-software-dev border-software-dev/20",
        category === 'loan' && "bg-loan-light text-loan border-loan/20",
        category === 'ai-services' && "bg-ai-services-light text-ai-services border-ai-services/20"
      )}
    >
      <Icon className={cn(size === 'sm' ? "h-3 w-3" : "h-4 w-4")} />
      {categoryInfo?.label}
    </span>
  );
}
