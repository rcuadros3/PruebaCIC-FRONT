import { useQuery } from '@tanstack/react-query'
import api from '../../api/corrosion'
import { ICourse, IUpdateCourse } from './useCourse.interface'
import { IFormikNewCourse } from '../../components/NewCourse/NewCourse.interface'

async function fetchCourse() {
  const { data } = await api.get<ICourse[]>('/courses')
  return data
}

export const mutationFetchNewCourse = (course: IFormikNewCourse) =>
  api.post('/course', course)

export const mutationFetchUpdateCourse = (dataToUpdate: IUpdateCourse) =>
  api.put(`/course/${dataToUpdate.id}`, dataToUpdate.elementsToUpdate)

export const mutationFetchDeleteCourse = (courseToDelete: any) =>
  api.delete(`/course/${courseToDelete}`)

export function useFetchCourse() {
  return useQuery(['courses'], fetchCourse)
}
