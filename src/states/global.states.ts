import { create } from 'zustand'
import { IGlobalStates } from './global.states.interface'
import { ICourse } from '../hooks/useCourse/useCourse.interface'
import { ITopic } from '../hooks/useTopic/useTopic.interface'

export const globalStates = create<IGlobalStates>((set, _get) => ({
  visibleNewCourseModal: false,
  visibleNewTopicModal: false,
  courseToUpdate: null,
  topicToUpdate: null,
  courseId: null,
  setVisibleNewCourseModal: (status: boolean) =>
    set({
      visibleNewCourseModal: status,
    }),
  setVisibleNewTopicModal: (status: boolean) =>
    set({
      visibleNewTopicModal: status,
    }),
  setCourseToUpdate: (elementToUpdate: ICourse | null) =>
    set({
      courseToUpdate: elementToUpdate,
    }),
  setTopicToUpdate: (elementToUpdate: ITopic | null) =>
    set({
      topicToUpdate: elementToUpdate,
    }),
  setCourseId: (courseId: ICourse | null) =>
    set({
      courseId: courseId,
    }),
}))
