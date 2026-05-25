import { Badge } from '@/components/ui/Badge'

export default function CategoryBadge({
  name,
  color,
}: {
  name: string
  color: string
}) {
  return <Badge color={color}>{name}</Badge>
}
