interface PriorityBadgeProps {
  score: number;
}

export default function PriorityBadge({ score }: PriorityBadgeProps) {
  let bgColor = 'bg-red-100 text-red-800';
  let label = '높음';

  if (score < 50) {
    bgColor = 'bg-green-100 text-green-800';
    label = '낮음';
  } else if (score < 100) {
    bgColor = 'bg-yellow-100 text-yellow-800';
    label = '중간';
  }

  return (
    <div className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${bgColor}`}>
      {label} ({score.toFixed(1)})
    </div>
  );
}
