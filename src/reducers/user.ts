import { Dispatch } from 'redux'

export interface IUserStore {
  email?: string
  id: number
  role?: string
  username?: string
}
const initialState:IUserStore = {
  id: -1
}
const userState = (state: IUserStore = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case 'SAVE_USER_STATE': {
      return {
        ...state,
        ...payload
      }
    }
    default: {
      return state
    }
  }
}

export default userState
