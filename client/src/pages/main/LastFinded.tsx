import { Card } from '../../components/shared/ui/card/Card'
import { СatGenderIcon } from '@/components/shared/catGenderIcon/СatGenderIcon'
import { useLastCats } from '@/features/cats/queries/cats.queries'
import { currentPlaceholder } from '@/utils/catCardHeaderPlaceholder'
import { Link } from 'react-router-dom'
import styles from './lastFinded.module.css'

const LastFinded = () => {
  const { data } = useLastCats(5)

  return (
    <Card className="osc-bg">
      <h3 className="osc-mb-0">Недавно замечанные</h3>
      <hr className="osc-divider" />

      {data?.length ? (
        <div className={styles.grid}>
          {data.map((cat) => (
            <Link key={cat.id} to={`/cats/${cat.id}`} className={styles.link}>
              <Card className={styles.catCard}>
                <img
                  src={currentPlaceholder(cat.id)}
                  alt={cat.name}
                  className={styles.image}
                  loading="lazy"
                />

                <div className={styles.info}>
                  <h4 className={styles.name}>{cat.name}</h4>
                  <СatGenderIcon cat={cat} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Пока нет новых наблюдений</p>
      )}
    </Card>
  )
}

export default LastFinded
