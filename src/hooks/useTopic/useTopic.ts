import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import api from '../../api/corrosion'
import { IFormikNewTopic } from '../../components/NewTopic/NewTopic.interface'
import { ITopic, IUpdateTopic } from './useTopic.interface'

async function fetchTopic(ctx: QueryFunctionContext) {
  const [_, course] = ctx.queryKey
  const { data } = await api.get<ITopic[]>(`/topics/${course}`)
  return data
}

export const mutationFetchNewTopic = (topic: IFormikNewTopic) =>
  api.post('/topic', topic)

export const mutationFetchUpdateTopic = (dataToUpdate: IUpdateTopic) =>
  api.put(`/topic/${dataToUpdate.id}`, dataToUpdate.elementsToUpdate)

export const mutationFetchDeleteTopic = (topicToDelete: any) =>
  api.delete(`/topic/${topicToDelete}`)

export function useFetchTopic(course: any) {
  return useQuery(['topics', course], fetchTopic)
}
