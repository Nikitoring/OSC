import type { Cat } from '@/domains/domains'
import { useUser } from '@/features/users/queries/users.queries'
import { geocoders } from 'leaflet-control-geocoder'
import { useEffect, useMemo, useState } from 'react'
import { СatGenderIcon } from '@/components/shared/catGenderIcon/СatGenderIcon'
import { MapPin } from 'lucide-react'
import L from 'leaflet'
import { OscTable } from '@/components/shared/ui/table/OscTable'

export const CatInformation = ({ cat }: { cat: Cat }) => {
  const { data: user, isLoading: isUserLoading } = useUser(cat?.created_by, {
    enabled: !!cat?.created_by,
  })
  const [address, setAddress] = useState<string>('Адрес не указан')
  const geocoder = new geocoders.Nominatim()
  const onParseLocation = async () => {
    if (cat?.latitude && cat?.longitude) {
      const latlng = L.latLng(cat.latitude, cat.longitude)
      const res = await geocoder.reverse(latlng, 1e8)
      if (res && res.length) {
        setAddress(res[0].html.replace(/<[^>]*>?/gm, '').trim())
      } else {
        setAddress('Адрес не найден')
      }
    }
  }

  useEffect(() => {
    onParseLocation()
  }, [cat?.latitude, cat?.longitude])
  const infoData = useMemo(() => {
    if (!cat?.id) return []

    return [
      { id: 'id', info: 'ID', data: cat.id },
      {
        id: 'createdAt',
        info: 'Добавлен',
        data: cat.created_at
          ? new Date(cat.created_at).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'Не указано',
      },
      {
        id: 'user',
        info: 'Добавил пользователь',
        data: user?.username || (isUserLoading ? 'Загрузка...' : cat.created_by),
      },
    ]
  }, [cat?.id, cat?.name, cat?.created_at, cat?.created_by, user?.username, isUserLoading])

  const columns = [
    { key: 'info', title: '', align: 'left', width: '100px' },
    { key: 'data', title: '', align: 'right' },
  ]

  return (
    <div>
      <h1 className="osc-mb-0">{cat?.name}</h1>
      <div className="osc-my-2">
        <div>{СatGenderIcon({ cat, iconSize: 'medium', info: true })}</div>
        <div className="osc-text-gray-500  osc-flex osc-gap-1">
          <MapPin /> {address}
        </div>
      </div>
      <h2 className="osc-mb-0">Описание</h2>
      <p className="osc-text-gray-500 osc-mt-2">{cat.description || 'Не указано'}</p>
      <h2 className="osc-mb-0">Информация</h2>
      <div style={{ maxWidth: '400px' }}>
        <OscTable columns={columns} data={infoData} borderless showHeader={false}></OscTable>
      </div>
    </div>
  )
}
