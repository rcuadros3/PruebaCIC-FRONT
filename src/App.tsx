import { Toaster, toast } from 'sonner'
import './App.css'
import {
  mutationFetchDeleteCourse,
  useFetchCourse,
} from './hooks/useCourse/useCourse'
import { ICourse } from './hooks/useCourse/useCourse.interface'
import { globalStates } from './states/global.states'
import { Dialog } from 'primereact/dialog'
import NewCourse from './components/NewCourse/NewCourse'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import NewTopic from './components/NewTopic/NewTopic'
import {
  mutationFetchDeleteTopic,
  useFetchTopic,
} from './hooks/useTopic/useTopic'
import { ITopic } from './hooks/useTopic/useTopic.interface'
import { Divider } from 'primereact/divider'

function App() {
  const queryClient = useQueryClient()
  const { data: dataCourses, isLoading: isLoadingCourses } = useFetchCourse()
  const {
    visibleNewCourseModal,
    setVisibleNewCourseModal,
    courseToUpdate,
    setCourseToUpdate,
    setCourseId,
    courseId,
    setVisibleNewTopicModal,
    topicToUpdate,
    setTopicToUpdate,
    visibleNewTopicModal,
  } = globalStates()
  const { mutateAsync: mutateAsyncDeleteCourse } = useMutation({
    mutationFn: mutationFetchDeleteCourse,
    onSuccess: (res) => {
      if (res.status === 200) {
        queryClient.invalidateQueries(['courses'])
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message)
      }
    },
    onError: () => {
      toast.error('Se presentó un error desconocido en el sistema')
    },
  })
  const { data: dataTopics, isLoading: isLoadingTopics } = useFetchTopic(
    courseId?.id
  )
  const { mutateAsync: mutateAsyncDeleteTopic } = useMutation({
    mutationFn: mutationFetchDeleteTopic,
    onSuccess: (res) => {
      if (res.status === 200) {
        queryClient.invalidateQueries(['topics'])
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message)
      }
    },
    onError: () => {
      toast.error('Se presentó un error desconocido en el sistema')
    },
  })

  return (
    <div className="container-courses">
      <Toaster position="top-center" closeButton richColors />
      <div className="container-courses-topics-elements">
        <span
          className="new-course"
          onClick={() => setVisibleNewCourseModal(true)}
        >
          <i className="pi pi-plus new-icon-course"></i>Nuevo curso
        </span>
        {isLoadingCourses && (
          <>
            <div className="container-loading">
              <span className="loading-courses">Cargando cursos...</span>
            </div>
          </>
        )}
        <div className="container-courses-card">
          {dataCourses?.map((course: ICourse, index: number) => (
            <div className="container-course" key={index}>
              <div className="body-car">
                <span className="title-card">{course.code}</span>
                <span className="text-card">{course.name}</span>
                <span className="tutor-course">{course.tutor}</span>
              </div>
              <div className="actions-card">
                <i
                  className="pi pi-file-edit"
                  title="Editar curso"
                  onClick={() => {
                    setCourseToUpdate(course), setVisibleNewCourseModal(true)
                  }}
                ></i>
                <i
                  className="pi pi-eye"
                  title="Ver los temas de este curso"
                  onClick={() => setCourseId(course)}
                ></i>
                <i
                  className="pi pi-plus"
                  title="Nuevo tema para este curso"
                  onClick={() => {
                    setCourseId(course), setVisibleNewTopicModal(true)
                  }}
                ></i>
                <i
                  className="pi pi-trash"
                  title="eliminar curso"
                  onClick={async () => {
                    try {
                      toast.loading(
                        `Editando la visibilidad de: ${course.name}...`,
                        {
                          className: 'loading-data',
                          duration: 3000000,
                        }
                      )
                      await mutateAsyncDeleteCourse(course.id)
                    } finally {
                      toast.dismiss()
                    }
                  }}
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <div className="container-courses-topics-elements">
        {courseId && (
          <span
            className="new-course"
            onClick={() => setVisibleNewTopicModal(true)}
          >
            <i className="pi pi-plus new-icon-course"></i>
            {`Nuevo tema para el curso: ${courseId.code}`}
          </span>
        )}
        {courseId !== null && isLoadingTopics && (
          <span>{`Cargando las tareas del ${courseId.name}`}</span>
        )}
        <div className="container-topic-card">
          {dataTopics?.map((topic: ITopic, index: number) => (
            <div className="container-course" key={index}>
              <div className="body-car">
                <span className="title-card">{topic.code}</span>
                <span className="text-card">{topic.name}</span>
              </div>
              <div className="actions-card">
                <i
                  className="pi pi-file-edit"
                  onClick={() => {
                    setTopicToUpdate(topic), setVisibleNewTopicModal(true)
                  }}
                ></i>
                <i
                  className="pi pi-trash"
                  onClick={async () => {
                    try {
                      toast.loading(
                        `Editando la visibilidad de: ${topic.name}...`,
                        {
                          className: 'loading-data',
                          duration: 3000000,
                        }
                      )
                      await mutateAsyncDeleteTopic(topic.id)
                    } finally {
                      toast.dismiss()
                    }
                  }}
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog
        header={`${
          courseToUpdate ? `Actualizar ${courseToUpdate.name}` : 'Nuevo curso'
        }`}
        visible={visibleNewCourseModal}
        onHide={() => {
          setCourseToUpdate(null), setVisibleNewCourseModal(false)
        }}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <NewCourse formType={courseToUpdate ? 'update-course' : 'new-course'} />
      </Dialog>
      <Dialog
        header={`${
          topicToUpdate ? `Actualizar ${topicToUpdate.name}` : 'Nuevo tema'
        }`}
        visible={visibleNewTopicModal}
        onHide={() => {
          setTopicToUpdate(null), setVisibleNewTopicModal(false)
        }}
        style={{ width: '50vw' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <NewTopic formType={topicToUpdate ? 'update-topic' : 'new-topic'} />
      </Dialog>
    </div>
  )
}

export default App
