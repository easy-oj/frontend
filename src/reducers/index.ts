import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  userStore: require('./user').default,
  langStore: require('./lang').default
})
export default rootReducer
