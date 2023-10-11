export interface IFormikNewCourse {
  code: string
  name: string
  tutor: string
}

export type TFormikNewCourse = 'code' | 'name' | 'tutor'

export interface IPropsNewCourse {
  formType: 'new-course' | 'update-course'
}
