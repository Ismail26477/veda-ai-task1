import { BUSINESS_CATEGORIES } from '@/types/task';

interface BusinessChartProps {
  data: Record<string, number>;
}

export function BusinessChart({ data }: BusinessChartProps) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const colors = {
    'real-estate': 'bg-real-estate',
    'digital-marketing': 'bg-digital-marketing',
    'software-dev': 'bg-software-dev',
    'loan': 'bg-loan',
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h3 className="font-display font-semibold text-foreground mb-4">Business Productivity</h3>
      
      <div className="space-y-4">
        {BUSINESS_CATEGORIES.map((cat) => {
          const count = data[cat.value] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={cat.value} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{cat.label}</span>
                <span className="font-medium text-foreground">{count} tasks</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors[cat.value]} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
