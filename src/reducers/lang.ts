export interface ILang {
  compileCmd?: string
  highlight?: string
  id: number
  memLimit?: number
  name: string
  templateContent?: string
  timeLimit?: number
  version?: string
}
const initialState: ILang[] = []
const langState = (state: ILang[] = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SAVE_LANG': {
      return payload
    }
    default: {
      return state
    }
  }
}

export default langState
