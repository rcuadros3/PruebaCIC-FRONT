import { ICourse } from '../hooks/useCourse/useCourse.interface'
import { ITopic } from '../hooks/useTopic/useTopic.interface'

export interface IGlobalStates {
  visibleNewCourseModal: boolean
  visibleNewTopicModal: boolean
  courseToUpdate: ICourse | null
  topicToUpdate: ITopic | null
  courseId: ICourse | null
  setVisibleNewCourseModal: (status: boolean) => void
  setVisibleNewTopicModal: (status: boolean) => void
  setCourseToUpdate: (elementToUpdate: ICourse | null) => void
  setTopicToUpdate: (elementToUpdate: ITopic | null) => void
  setCourseId: (courseId: ICourse | null) => void
}
