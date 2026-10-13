import type { Cat } from '@/domains/domains'
import OscButton from '@/components/shared/ui/buttons/Button'
import { Card } from '../../components/shared/ui/card/Card'

export const CatActions = ({ cat }: { cat: Cat }) => {
  return (
    <div>
      <OscButton variant="tertiary">Сообщить о помощи</OscButton>
      <Card>sssss</Card>
    </div>
  )
}
