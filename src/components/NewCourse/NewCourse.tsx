import { useFormik } from 'formik'
import './NewCourse.css'
import { INITIAL_VALUES } from './NewCourse.constants'
import {
  IFormikNewCourse,
  IPropsNewCourse,
  TFormikNewCourse,
} from './NewCourse.interface'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  mutationFetchNewCourse,
  mutationFetchUpdateCourse,
} from '../../hooks/useCourse/useCourse'
import { globalStates } from '../../states/global.states'
import { Toaster, toast } from 'sonner'
import { useEffect } from 'react'

export default function NewCourse({ formType }: IPropsNewCourse) {
  const queryClient = useQueryClient()
  const { setVisibleNewCourseModal, courseToUpdate, setCourseToUpdate } =
    globalStates()
  const { mutateAsync: mutateAsyncNewCourse, isLoading: isLoadingNewCourse } =
    useMutation({
      mutationFn: mutationFetchNewCourse,
      onSuccess: (res) => {
        if (res.status === 200) {
          queryClient.invalidateQueries(['courses'])
          setVisibleNewCourseModal(false)
          toast.success(res.data.message)
        } else {
          toast.error(res.data.message)
        }
      },
      onError: () => {
        toast.error('Se presentó un error desconocido en el sistema')
      },
    })
  const { mutateAsync: mutateAsyncUpdateCourse, isLoading: isLoadingCourse } =
    useMutation({
      mutationFn: mutationFetchUpdateCourse,
      onSuccess: (res) => {
        if (res.status === 200) {
          queryClient.invalidateQueries(['courses'])
          setVisibleNewCourseModal(false)
          setCourseToUpdate(null)
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
    if (formType === 'update-course' && courseToUpdate) {
      formik.setValues({
        ...formik.values,
        code: courseToUpdate.code,
        name: courseToUpdate.name,
        tutor: courseToUpdate.tutor,
      })
    }
  }, [])

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validate: (data: IFormikNewCourse) => {
      let errors: any = {}

      if (!data.code) {
        errors.document = 'Código es requerido.'
      }

      if (!data.name) {
        errors.name = 'Nombre es requerido.'
      }

      if (!data.tutor) {
        errors.tutor = 'Tutor es requerido.'
      }

      return errors
    },
    validateOnChange: true,
    onSubmit: async (formValue) => {
      try {
        toast.loading('Creando curso', {
          duration: 3000000,
        })
        if (formType === 'update-course' && courseToUpdate) {
          await mutateAsyncUpdateCourse({
            id: courseToUpdate?.id,
            elementsToUpdate: formValue,
          })
        } else {
          await mutateAsyncNewCourse(formValue)
        }
      } finally {
        toast.dismiss()
      }
    },
  })

  const isFormFieldInvalid = (name: TFormikNewCourse) =>
    !!(formik.touched[name] && formik.errors[name])

  const getFormErrorMessage = (name: TFormikNewCourse) => {
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
              <label htmlFor="code">Código del curso</label>
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
              <label htmlFor="name">Nombre del curso</label>
              <InputText
                id="name"
                name="name"
                placeholder="Ejemplo: Curso de conducción"
                value={formik.values.name}
                onChange={(e) => formik.setFieldValue('name', e.target.value)}
                className={classNames({
                  'p-invalid': isFormFieldInvalid('name'),
                })}
              />
              <span>{getFormErrorMessage('name')}</span>
            </div>
          </div>
          <div className="rows">
            <div className="row">
              <label htmlFor="tutor">Tutor para el curso curso</label>
              <InputText
                id="tutor"
                name="tutor"
                placeholder="Ejemplo: Thomas James"
                value={formik.values.tutor}
                onChange={(e) => formik.setFieldValue('tutor', e.target.value)}
                className={classNames({
                  'p-invalid': isFormFieldInvalid('tutor'),
                })}
              />
              <span>{getFormErrorMessage('tutor')}</span>
            </div>
            <div className="row"></div>
          </div>
          <Button
            label={
              formType === 'update-course' ? 'Guardar cambios' : 'Crear curso'
            }
            loading={isLoadingNewCourse || isLoadingCourse}
            type="submit"
          />
        </form>
      </div>
    </>
  )
}
