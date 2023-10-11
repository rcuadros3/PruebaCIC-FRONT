import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  IFormikNewTopic,
  IPropsNewTopic,
  TFormikNewTopic,
} from './NewTopic.interface'
import { globalStates } from '../../states/global.states'
import {
  mutationFetchNewTopic,
  mutationFetchUpdateTopic,
} from '../../hooks/useTopic/useTopic'
import { Toaster, toast } from 'sonner'
import { useEffect } from 'react'
import { INITIAL_VALUES } from './NewTopic.constants'
import { useFormik } from 'formik'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'

export default function NewTopic({ formType }: IPropsNewTopic) {
  const queryClient = useQueryClient()
  const { setVisibleNewTopicModal, topicToUpdate, setTopicToUpdate, courseId } =
    globalStates()
  const { mutateAsync: mutateAsyncNewTopic, isLoading: isLoadingNewTopic } =
    useMutation({
      mutationFn: mutationFetchNewTopic,
      onSuccess: (res) => {
        if (res.status === 200) {
          queryClient.invalidateQueries(['topics'])
          setVisibleNewTopicModal(false)
          toast.success(res.data.message)
        } else {
          toast.error(res.data.message)
        }
      },
      onError: () => {
        toast.error('Se presentó un error desconocido en el sistema')
      },
    })
  const {
    mutateAsync: mutateAsyncUpdateTopic,
    isLoading: isLoadingUpdateTopic,
  } = useMutation({
    mutationFn: mutationFetchUpdateTopic,
    onSuccess: (res) => {
      if (res.status === 200) {
        queryClient.invalidateQueries(['topics'])
        setVisibleNewTopicModal(false)
        setTopicToUpdate(null)
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message)
      }
    },
    onError: () => {
      toast.error('Se presentó un error desconocido en el sistema')
    },
  })

  useEffect(() => {
    if (formType === 'update-topic' && topicToUpdate) {
      formik.setValues({
        ...formik.values,
        code: topicToUpdate.code,
        name: topicToUpdate.name,
      })
    }
  }, [])

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validate: (data: IFormikNewTopic) => {
      let errors: any = {}

      if (!data.code) {
        errors.document = 'Código es requerido.'
      }

      if (!data.name) {
        errors.name = 'Nombre es requerido.'
      }

      return errors
    },
    validateOnChange: true,
    onSubmit: async (formValue) => {
      try {
        toast.loading('Creando curso', {
          duration: 3000000,
        })
        if (formType === 'update-topic' && topicToUpdate) {
          await mutateAsyncUpdateTopic({
            id: topicToUpdate?.id,
            elementsToUpdate: formValue,
          })
        } else {
          if (courseId) {
            formValue.course = courseId.id
          }
          await mutateAsyncNewTopic(formValue)
        }
      } finally {
        toast.dismiss()
      }
    },
  })

  const isFormFieldInvalid = (name: TFormikNewTopic) =>
    !!(formik.touched[name] && formik.errors[name])

  const getFormErrorMessage = (name: TFormikNewTopic) => {
    return isFormFieldInvalid(name) ? (
      <small className="p-error">{formik.errors[name]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  return (
    <>
      <div className="container-new-course">
        <Toaster position="top-center" closeButton richColors />
        <form onSubmit={formik.handleSubmit}>
          <div className="rows">
            <div className="row">
              <label htmlFor="code">Código del tema</label>
              <InputText
                id="code"
                name="code"
                placeholder="Ejemplo: 123823ACW6"
                maxLength={10}
                value={formik.values.code}
                onChange={(e) => formik.setFieldValue('code', e.target.value)}
                className={classNames({
                  'p-invalid': isFormFieldInvalid('code'),
                })}
              />
              <span>{getFormErrorMessage('code')}</span>
            </div>
            <div className="row">
              <label htmlFor="name">Nombre del Tema</label>
              <InputText
                id="name"
                name="name"
                placeholder="Ejemplo: Tema del curso 1"
                value={formik.values.name}
                onChange={(e) => formik.setFieldValue('name', e.target.value)}
                className={classNames({
                  'p-invalid': isFormFieldInvalid('name'),
                })}
              />
              <span>{getFormErrorMessage('name')}</span>
            </div>
          </div>
          <Button
            label={
              formType === 'update-topic' ? 'Guardar cambios' : 'Crear curso'
            }
            loading={isLoadingNewTopic || isLoadingUpdateTopic}
            type="submit"
          />
        </form>
      </div>
    </>
  )
}
