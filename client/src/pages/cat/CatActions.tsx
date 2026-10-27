import type { Cat } from '@/domains/domains'
import OscButton from '@/components/shared/ui/buttons/Button'
import { Card } from '../../components/shared/ui/card/Card'
import { useCreateHelpRequest, useHelpByCatId } from '@/features/help/queries/help.queries'
import { useState } from 'react'
import OscModal from '../../components/shared/ui/modal/Modal'
import HelpRequestForm from '@/components/shared/helpRequestForm/HelpRequestForm'
import HelpRequestBadge from '@/components/shared/helpRequestBadge/HelpRequestBadge'

export const CatActions = ({ cat }: { cat: Cat }) => {
  const { data: helpRequest } = useHelpByCatId(cat.id)
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
  return (
    <div>
      <OscButton variant="tertiary" onClick={() => changeStateCreateForm(!isShowCreateForm)}>
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
                variant="transparent"
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
