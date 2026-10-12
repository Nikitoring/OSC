import CatSpinner from '@/components/shared/ui/loaders/CatSpinner'
import { useCat } from '@/features/cats/queries/cats.queries'
import mainState from '@/stores/mainState'
import { currentPlaceholder } from '@/utils/catCardHeaderPlaceholder'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styles from './catPage.module.css'
import { СatGenderIcon } from '@/components/shared/catGenderIcon/СatGenderIcon'

const CatPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data: cat, isLoading } = useCat(id)

  useEffect(() => {
    if (cat?.id) {
      mainState
        .getState()
        .setBreadcrumbs([{ title: 'Вернуться к карте', to: '/map' }, { title: cat.name }])
    }

    // Опционально: сброс при уходе со страницы
    return () => {
      mainState.getState().setBreadcrumbs([])
    }
  }, [cat?.id, cat?.name])
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '24px',
          }}
        >
          <CatSpinner size="large" speed="normal"></CatSpinner>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.page}>
      <section className={`${styles['content-section']} osc-my-3`}>
        <div>
          <img
            src={currentPlaceholder(cat.id)}
            alt={cat?.name}
            style={{ width: '100%', minHeight: '300px' }}
          />
        </div>
        <div>
          <h2>{cat?.name}</h2>
          {СatGenderIcon({ cat, iconSize: 'medium', info: true })}
        </div>
      </section>
    </div>
  )
}

export default CatPage
