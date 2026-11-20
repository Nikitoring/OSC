import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import { MoveLeft } from 'lucide-react'
import { AddCatMapMode } from './AddCatMapMode'
import './addCatMapMode.css'
import './addCatSidebar.css'
import type { CatCoordinates } from './domains'
import type { CatGender, CreateCatDto, UpdateCatDto } from '@/domains/domains'
import { useCreateCat, useCat, useUpdateCat } from '@/features/cats/queries/cats.queries'
import { Card } from '@/components/shared/ui/card/Card'
import OscButton from '@/components/shared/ui/buttons/Button'
import OscNotice, { type OscNoticeType } from '@/components/shared/ui/notice/OscNotice'
import { TextInput } from '@/components/shared/ui/textInput/TextInput'
import { TextArea } from '@/components/shared/ui/textInput/TextArea'
import OscSelect from '@/components/shared/ui/select/OSCSelect'

const AddCartSidebar = () => {
  const [catLocation, setCatLocation] = useState<CatCoordinates | null>(null)
  const [name, setName] = useState('')
  const [gender, setGender] = useState<CatGender>('unknown')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')
  const [isChoosingLocation, setIsChoosingLocation] = useState(false)
  const [notice, setNotice] = useState<{ type: OscNoticeType; message: string } | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isEditMode = searchParams.get('mode') === 'edit-cat'
  const rawCatId = searchParams.get('catId')
  const editCatId = rawCatId && /^\d+$/.test(rawCatId) ? Number(rawCatId) : null
  const {
    data: editCat,
    isLoading: isCatLoading,
    isError: isCatError,
  } = useCat(isEditMode ? editCatId : null)
  const createCat = useCreateCat()
  const updateCat = useUpdateCat()
  const isPending = createCat.isPending || updateCat.isPending
  const locationState = location.state as { returnTo?: string } | null
  const returnTo = locationState?.returnTo

  const sidebarRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return

    L.DomEvent.disableClickPropagation(element)
    L.DomEvent.disableScrollPropagation(element)
  }, [])

  useEffect(() => {
    if (!isEditMode || !editCat) return
    setCatLocation({ latitude: editCat.latitude, longitude: editCat.longitude })
    setName(editCat.name)
    setGender(editCat.gender)
    setDescription(editCat.description ?? '')
  }, [isEditMode, editCat])

  const exitSidebar = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('mode')
        next.delete('catId')
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  const returnToCatPage = (catId?: number, result?: { type: OscNoticeType; message: string }) => {
    const target =
      returnTo && /^\/cats\/\d+$/.test(returnTo)
        ? returnTo
        : catId
          ? `/cats/${catId}`
          : editCatId
            ? `/cats/${editCatId}`
            : '/map'
    navigate(target, { state: result ? { notice: result } : null })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (isEditMode && !trimmedName) {
      setNameError('Укажите кличку кота.')
      return
    }
    if (trimmedName.length > 255) {
      setNameError('Кличка не должна превышать 255 символов.')
      return
    }
    setNameError('')
    if (!catLocation) return

    try {
      if (isEditMode && editCat) {
        const data: UpdateCatDto = {
          name: trimmedName,
          gender,
          description: description.trim() || null,
          latitude: catLocation.latitude,
          longitude: catLocation.longitude,
        }
        const updatedCat = await updateCat.mutateAsync({ id: editCat.id, data })
        returnToCatPage(updatedCat.id, {
          type: 'success',
          message: 'Информация о коте успешно сохранена.',
        })
      } else {
        const data: CreateCatDto = {
          name: trimmedName || undefined,
          gender,
          description: description.trim() || undefined,
          latitude: catLocation.latitude,
          longitude: catLocation.longitude,
        }
        const createdCat = await createCat.mutateAsync(data)
        exitSidebar()
        navigate(`/cats/${createdCat.id}`)
      }
    } catch (error) {
      setNotice({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Не удалось сохранить изменения. Попробуйте ещё раз.',
      })
    }
  }

  if (isEditMode && (!editCat || !catLocation)) {
    return (
      <div ref={sidebarRef} className="add-cat-sidebar">
        <div className="osc-flex osc-gap-4 osc-items-center">
          <OscButton
            variant="transparent"
            size="xs"
            onClick={() => returnToCatPage()}
            aria-label="Закрыть"
          >
            <MoveLeft />
          </OscButton>
          <h2 className="osc-mb-0">Редактировать кота</h2>
        </div>
        <p role={isCatError ? 'alert' : undefined}>
          {isCatLoading
            ? 'Загружаем информацию о коте…'
            : 'Не удалось загрузить информацию о коте.'}
        </p>
      </div>
    )
  }

  if (!isEditMode && !catLocation)
    return (
      <AddCatMapMode
        active
        radius={100}
        onConfirm={setCatLocation}
        onCancel={exitSidebar}
        onOpenCat={() => undefined}
      />
    )

  if (isEditMode && isChoosingLocation && catLocation)
    return (
      <AddCatMapMode
        active
        radius={100}
        initialLocation={catLocation}
        onConfirm={(location) => {
          setCatLocation(location)
          setIsChoosingLocation(false)
        }}
        onCancel={() => setIsChoosingLocation(false)}
        onOpenCat={() => undefined}
      />
    )

  return (
    <div ref={sidebarRef} className="add-cat-sidebar">
      <div className="osc-flex osc-gap-4 osc-items-center">
        <OscButton
          variant="transparent"
          size="xs"
          onClick={isEditMode ? () => returnToCatPage(editCat?.id) : () => setCatLocation(null)}
          aria-label="Назад"
        >
          <MoveLeft />
        </OscButton>
        <h2 className="osc-mb-0">{isEditMode ? 'Редактировать кота' : 'Добавить кота'}</h2>
      </div>

      <h4 className="osc-text-gray-500">
        {isEditMode ? 'Информация о коте' : 'Шаг 2. Информация о коте'}
      </h4>
      <Card className="add-cat-location-card">
        <h3 className="osc-mb-1">Местоположение</h3>
        <p>
          {catLocation.address ||
            `${catLocation.latitude.toFixed(5)}, ${catLocation.longitude.toFixed(5)}`}
          <br />
          Приблизительная область встречи · 100 м
        </p>
        {isEditMode ? (
          <OscButton
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setIsChoosingLocation(true)}
          >
            Изменить точку на карте
          </OscButton>
        ) : (
          <span>Можно вернуться и изменить точку на карте.</span>
        )}
      </Card>

      <form className="add-cat-form" onSubmit={handleSubmit} noValidate>
        <TextInput
          className="add-cat-form__field"
          label={<>Кличка кота {!isEditMode && <span className="add-cat-form__optional">(необязательно)</span>}</>}
          id="add-cat-name"
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (nameError) setNameError('')
          }}
          maxLength={255}
          required={isEditMode}
          aria-invalid={!!nameError}
          error={nameError}
          placeholder="Например, Рыжик"
        />

        <OscSelect
          className="add-cat-form__field"
          label="Пол"
          name="gender"
          value={gender}
          onChange={(value) => setGender(value as CatGender)}
          options={[
            { value: 'unknown', label: 'Неизвестен' },
            { value: 'male', label: 'Самец' },
            { value: 'female', label: 'Самка' },
          ]}
        />

        <TextArea
          className="add-cat-form__field"
          label={<>Описание <span className="add-cat-form__optional">(необязательно)</span></>}
          id="add-cat-description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="Особые приметы, поведение или другая полезная информация"
        />

        {notice && (
          <OscNotice type={notice.type} message={notice.message} onClose={() => setNotice(null)} />
        )}
        <OscButton type="submit" full disabled={isPending}>
          {isPending
            ? 'Сохраняем…'
            : isEditMode
              ? 'Сохранить изменения'
              : 'Сохранить и открыть карточку'}
        </OscButton>
      </form>
    </div>
  )
}

export default AddCartSidebar
