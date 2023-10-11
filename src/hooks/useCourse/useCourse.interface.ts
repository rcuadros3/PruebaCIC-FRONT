export interface ICourse {
  id: number
  code: string
  name: string
  tutor: string
}

export interface IUpdateCourse {
  id: number
  elementsToUpdate: IElementsToUpdate
}

export interface IElementsToUpdate {
  code: string
  name: string
  tutor: string
}
