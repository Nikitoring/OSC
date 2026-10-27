import { Card } from '../../components/shared/ui/card/Card'
import { СatGenderIcon } from '@/components/shared/catGenderIcon/СatGenderIcon'
import { useLastCats } from '@/features/cats/queries/cats.queries'
import { currentPlaceholder } from '@/utils/catCardHeaderPlaceholder'

const LastFinded = () => {
  const { data } = useLastCats(5)

  return (
    <Card className="osc-bg">
      <h3 className="osc-mb-0">Недавно замечанные</h3>
      <hr className="osc-divider" />
      <div className="osc-flex osc-flex-wrap osc-gap-3">
        {data?.map((cat) => (
          <Card key={cat.id}>
            <div
              className="osc-flex osc-flex-column osc-justify-between"
              style={{ height: '100%' }}
            >
              <div>
                <img
                  src={currentPlaceholder(cat.id)}
                  alt={cat?.name}
                  style={{ maxWidth: '7rem' }}
                />
              </div>
              <div className="osc-flex osc-items-center osc-gap-2">
                <h4>{cat.name}</h4>
                {СatGenderIcon(cat)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}

export default LastFinded
