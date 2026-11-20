import type { Cat } from '@/domains/domains'
import OscButton from '@/components/shared/ui/buttons/Button'
import { Card } from '../../components/shared/ui/card/Card'
import { useCreateHelpRequest, useHelpByCatId } from '@/features/help/queries/help.queries'
import { useState } from 'react'
import OscModal from '../../components/shared/ui/modal/Modal'
import HelpRequestForm from '@/components/shared/helpRequestForm/HelpRequestForm'
import HelpRequestBadge from '@/components/shared/helpRequestBadge/HelpRequestBadge'
import userState from '@/stores/userStore/userState'
import { useLocation, useNavigate } from 'react-router-dom'

export const CatActions = ({ cat }: { cat: Cat }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const { data: helpRequest } = useHelpByCatId(cat.id)
  const isAutorize = userState().user?.userId
  const { mutateAsync, isPending } = useCreateHelpRequest()
  const [neededHelpType, setNeededHelpType] = useState(null)
  const [isShowCreateForm, changeStateCreateForm] = useState(false)
  const handleSelect = (type: 'food' | 'home' | 'medical' | '') => {
    if (type === '') return
    setNeededHelpType(type)
  }

  const onCreateHelpRequest = async () => {
    try {
      await mutateAsync({
        catId: cat.id,
        data: {
          type: neededHelpType,
        },
      })

      changeStateCreateForm(false)
      setNeededHelpType(null)
    } catch (error) {
      console.error('Не удалось создать запрос о помощи:', error)
    }
  }
  const onCanHelp = () => {
    if (!isAutorize) {
      navigate('/login', { replace: true, state: { from: { pathname: location.pathname } } })
      return
    }
    changeStateCreateForm(!isShowCreateForm)
  }
  return (
    <div className="osc-flex osc-flex-column osc-items-end osc-justify-center osc-gap-2">
      <OscButton variant="tertiary" onClick={onCanHelp}>
        Сообщить о помощи
      </OscButton>
      {!!helpRequest?.current.length && (
        <Card className="osc-my-3">
          {helpRequest?.current?.map((request) => (
            <div key={request.id} className="osc-mb-1">
              <HelpRequestBadge request={request} />
            </div>
          ))}
        </Card>
      )}
      <OscModal
        isShow={isShowCreateForm}
        title="Сообщить о помощи"
        onClose={() => changeStateCreateForm(false)}
        actions={
          <>
            <div className="osc-flex osc-gap-2 osc-justify-end">
              <OscButton onClick={onCreateHelpRequest} disabled={isPending || !neededHelpType}>
                {isPending ? 'Сохранение...' : 'Сохранить'}
              </OscButton>

              <OscButton
                onClick={() => changeStateCreateForm(false)}
                variant="secondary"
                disabled={isPending}
              >
                Отмена
              </OscButton>
            </div>
          </>
        }
      >
        <HelpRequestForm onChange={handleSelect} />
      </OscModal>
    </div>
  )
}
