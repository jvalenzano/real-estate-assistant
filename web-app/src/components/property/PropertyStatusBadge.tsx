// components/properties/PropertyStatusBadge.tsx

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyStatusBadgeProps {
  status: 'Active' | 'Pending' | 'In Escrow' | 'Sold';
  className?: string;
}

export function PropertyStatusBadge({ status, className }: PropertyStatusBadgeProps) {
  const statusConfig = {
    'Active': {
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600 text-white'
    },
    'Pending': {
      variant: 'secondary' as const,
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
    },
    'In Escrow': {
      variant: 'secondary' as const,
      className: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    'Sold': {
      variant: 'secondary' as const,
      className: 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {status}
    </Badge>
  );
}