import styles from './mapPage.module.css'

export function MapLegend() {
  const legendItems = [
    { colorClass: 'dot-cat', label: 'Кот на карте' },
    { colorClass: 'dot-food', label: 'Нужна еда' },
    { colorClass: 'dot-med', label: 'Нужна медицина' },
    { colorClass: 'dot-home', label: 'Ищет дом' },
  ]

  return (
    <div className={styles['map-legend']}>
      <h4 className={styles['map-legend-title']}>Легенда</h4>
      <ul className={styles['map-legend-list']}>
        {legendItems.map((item) => (
          <li key={item.label} className={styles['map-legend-item']}>
            <span className={`map-legend-dot ${item.colorClass}`} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
