import styles from './mapPage.module.css'

export function MapLegend() {
  const legendItems = [
    { marker: '/markers/cat-0.png', label: 'Коты' },
    { marker: '/markers/cat-5.png', label: 'Нужна еда' },
    { marker: '/markers/cat-6.png', label: 'Нужна помощь' },
    { marker: '/markers/cat-7.png', label: 'Нужен дом' },
  ]

  return (
    <div className={styles['map-legend']}>
      <ul className={styles['map-legend-list']}>
        {legendItems.map((item) => (
          <li key={item.label} className={styles['map-legend-item']}>
            <img src={item.marker} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
