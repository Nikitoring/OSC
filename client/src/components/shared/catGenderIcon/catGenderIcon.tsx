import { Mars, Venus, VenusAndMars } from 'lucide-react'
import styles from './catGender.module.css'

export const catGenderIcon = (cat) => {
  return cat?.gender === 'male' ? (
    <Mars className={styles['cat-male']}></Mars>
  ) : cat?.gender === 'female' ? (
    <Venus className={styles['cat-women']}></Venus>
  ) : (
    <VenusAndMars className={styles['cat-unknown']}></VenusAndMars>
  )
}
