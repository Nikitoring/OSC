import { Card } from '../../components/shared/ui/card/Card'
import { HelpBadge } from '../../components/shared/ui/badge/HelpBadge'
import { useLastHelp } from '@/features/help/queries/help.queries'
import { currentPlaceholder } from '@/utils/catCardHeaderPlaceholder'
import { formatRelativeDate } from '@/utils/formatedDate'
import styles from './lastObservation.module.css'

const LastObservation = () => {
  const { data } = useLastHelp(5)
  const hasObservations = Boolean(data?.length)
  return (
    <Card>
      <h3 className="osc-mb-0">Последние наблюдения</h3>
      <hr className="osc-divider" />

      {hasObservations ? (
        <div className={styles.list}>
          {data.map((observation) => (
            <article key={observation.id} className={styles.observation}>
              <img
                className={styles.image}
                src={currentPlaceholder(observation.cat_id)}
                alt={`Кот ${observation.cat_name}`}
                loading="lazy"
              />

              <div className={styles.content}>
                <h4 className={styles.title}>{observation.cat_name}</h4>

                {observation.created_at && (
                  <p className={styles.date}>{formatRelativeDate(observation.created_at)}</p>
                )}

                <div className={styles.badge}>
                  <HelpBadge event={observation} />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <img
            className={styles.emptyImage}
            src="/placeholders/placeholder_empty.png"
            alt=""
            aria-hidden="true"
          />

          <div className={styles.emptyContent}>
            <h4 className={styles.emptyTitle}>Пока тихо</h4>
            <p className={styles.emptyDescription}>
              Здесь появятся последние наблюдения за котами и новости об оказанной помощи
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}

export default LastObservation
