import { Card } from '../../components/shared/ui/card/Card'
import { HelpBadge } from '../../components/shared/ui/badge/HelpBadge'
import { useLastHelp } from '@/features/help/queries/help.queries'
import { currentPlaceholder } from '@/utils/catCardHeaderPlaceholder'
import { formatRelativeDate } from '@/utils/formatedDate'

const LastObservation = () => {
  const { data } = useLastHelp(5)

  return (
    <Card>
      <h3 className="osc-mb-0">Последние наблюдения</h3>
      <hr className="osc-divider" />
      <div className="osc-flex osc-flex-column osc-gap-3">
        {data?.length > 0 ? (
          data?.map((observation) => (
            <div key={observation.id} className="osc-flex osc-items-start osc-gap-3">
              <img
                src={currentPlaceholder(observation.catId)}
                alt={observation.id}
                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
              />
              <div>
                <h4 className="osc-mt-0 osc-mb-1">{observation.cat_name}</h4>
                <p className="osc-text-gray-500 osc-text-xs osc-mt-0">
                  {observation.created_at && formatRelativeDate(observation.created_at)}
                </p>
                <HelpBadge key={observation.type} event={observation} />
              </div>
            </div>
          ))
        ) : (
          <div>
            <img
              src="/placeholders/placeholder_empty.png"
              alt="Ничего не найдено"
              style={{ maxWidth: '200px' }}
            />
            <h4 className="osc-my-0">Пока тихо</h4>
            <p className="osc-text-gray-500 osc-text-sm osc-my-0">
              Здесь появятся последние наблюдения за котами и новости об оказанной помощи
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default LastObservation
