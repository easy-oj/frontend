import '@/designs/design.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { LocaleProvider } from 'antd'

import zh_CN from 'antd/lib/locale-provider/zh_CN'

import { default as rootReducer } from '@/reducers'

import { default as EasyOJ } from '@/apps/Main'

const store = createStore(
  rootReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

const App = () => {
  return (
    <LocaleProvider locale={zh_CN}>
      <Provider store={store}>
        <Router>
          <EasyOJ />
        </Router>
      </Provider>
    </LocaleProvider>
  )
}
if (module.hot) {
  module.hot.accept()
}

ReactDOM.render(<App />, document.getElementById('root'))
