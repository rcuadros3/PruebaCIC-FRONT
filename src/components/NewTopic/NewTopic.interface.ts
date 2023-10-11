export interface IFormikNewTopic {
  code: string
  name: string
  course?: number
}

export type TFormikNewTopic = 'code' | 'name'

export interface IPropsNewTopic {
  formType: 'new-topic' | 'update-topic'
}
