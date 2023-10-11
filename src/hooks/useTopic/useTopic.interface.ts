export interface ITopic {
  id: number
  code: string
  course: any
  name: string
}

export interface IUpdateTopic {
  id: number
  elementsToUpdate: IElementsToUpdate
}

export interface IElementsToUpdate {
  code: string
  name: string
}
