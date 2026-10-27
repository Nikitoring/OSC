function getDaysWord(days: number): string {
  const lastTwoDigits = days % 100
  const lastDigit = days % 10

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'дней'
  if (lastDigit === 1) return 'день'
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня'

  return 'дней'
}

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays > 1) return `${diffDays} ${getDaysWord(diffDays)} назад`

  return 'Сегодня'
}
