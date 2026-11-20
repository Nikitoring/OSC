import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Cat, CheckCheck, ChevronRight, Heart, UserRound } from 'lucide-react'
import userState from '@/stores/userStore/userState'
import { useUser } from '@/features/users/queries/users.queries'
import { ApiError } from '@/shared/api/apiError'
import CatSpinner from '@/components/shared/ui/loaders/CatSpinner'
import OscButton from '@/components/shared/ui/buttons/Button'
import { formatRelativeDate } from '@/utils/formatedDate'
import styles from './profilePage.module.css'

const formatDate = (value?: string | null) => {
  const date = value ? new Date(value) : null
  if (!date || !Number.isFinite(date.getTime())) return 'дата не указана'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const getActivityTitle = (event: {
  eventType: 'cat_created' | 'help_created'
  catName: string
  helpType: 'food' | 'medical' | 'home' | null
  status: 'needed' | 'resolved' | null
}) => {
  if (event.eventType === 'cat_created') return `Добавлена карточка кота «${event.catName}»`

  const typeLabels = { food: 'корм', medical: 'медицинская помощь', home: 'дом' }
  const statusLabel = event.status === 'resolved' ? 'помощь отмечена как оказанная' : 'запрошена помощь'
  return `${statusLabel}: ${typeLabels[event.helpType ?? 'food']} для кота «${event.catName}»`
}

export default function ProfilePage() {
  const user = userState((state) => state.user)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const profileId = id ?? user?.userId
  const isOwnProfile = !id || id === String(user?.userId)
  const { data: profile, isLoading, isError, error, refetch } = useUser(
    profileId ?? '',
    { enabled: Boolean(profileId) },
  )

  useEffect(() => {
    if (!id && !user) navigate('/login', { replace: true })
  }, [id, navigate, user])

  if (!profileId) {
    return null
  }

  if (isLoading) {
    return <div className={styles.message}><CatSpinner size="large" speed="normal" /></div>
  }

  if (isError || !profile) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className={styles.page}>
          <section className={`${styles.message} ${styles.notFound}`}>
            <img
              className={styles.lostCatIllustration}
              src="/placeholders/placeholder_empty.png"
              alt="Спящий кот"
            />
            <h1>Пользователь не найден</h1>
            <p>Похоже, эта страница потерялась. Проверьте ссылку или вернитесь на карту.</p>
            <OscButton className={styles.homeLink} to="/map">Вернуться к карте</OscButton>
          </section>
        </div>
      )
    }

    return (
      <div className={styles.page}>
        <section className={styles.message} role="alert">
          <h1>Не удалось загрузить профиль</h1>
          <p>Проверьте подключение и попробуйте ещё раз.</p>
          <OscButton type="button" onClick={() => void refetch()}>Повторить</OscButton>
        </section>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar} aria-hidden="true"><UserRound size={30} /></div>
          <div className={styles.identity}>
            <p className={styles.eyebrow}>{isOwnProfile ? 'Личный кабинет' : 'Профиль пользователя'}</p>
            <h1>{profile.username}</h1>
            <p className={styles.subline}>Участник с {formatDate(profile.createdAt)}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <article className={styles.statCard}>
            <span className={styles.statIcon}><Cat size={19} /></span>
            <span className={styles.statLabel}>Добавлено котов</span>
            <strong>{profile.stats.catsAdded}</strong>
          </article>
          <article className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.heart}`}><Heart size={19} /></span>
            <span className={styles.statLabel}>Событий помощи</span>
            <strong>{profile.stats.helpEvents}</strong>
          </article>
          <article className={styles.statCard}>
            <span className={styles.statIcon}><CheckCheck size={19} /></span>
            <span className={styles.statLabel}>Помощь оказана</span>
            <strong>{profile.stats.resolvedHelpEvents}</strong>
          </article>
        </div>

        <section className={styles.activity}>
          <h2>Активность</h2>
          {profile.recentActivity.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}><Cat size={23} /></span>
              <div>
                <h3>Пока нет событий</h3>
                <p>
                  {isOwnProfile
                    ? 'Добавьте карточку кота или отметьте необходимую помощь — события появятся здесь.'
                    : 'События активности пользователя появятся здесь.'}
                </p>
              </div>
            </div>
          ) : (
            <ul className={styles.activityList}>
              {profile.recentActivity.map((event) => (
                <li className={styles.activityItem} key={`${event.eventType}-${event.id}`}>
                  <span className={`${styles.activityIcon} ${event.eventType === 'help_created' ? styles.heart : ''}`}>
                    {event.eventType === 'cat_created' ? <Cat size={18} /> : <Heart size={18} />}
                  </span>
                  <div className={styles.activityContent}>
                    <Link to={`/cats/${event.catId}`} className={styles.activityTitle}>
                      {getActivityTitle(event)}
                    </Link>
                    <span className={styles.activityDate}>{formatRelativeDate(event.createdAt)}</span>
                  </div>
                  <ChevronRight className={styles.activityArrow} size={17} aria-hidden="true" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </div>
  )
}
