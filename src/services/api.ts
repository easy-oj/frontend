const apiPrefix = '/api/v1'
const apiList = {
  user: {
    register: '/register',
    login: '/authenticate',
    info: '/user/current'
  },
  problem: {
    list: '/problems',
    detail: '/problem'
  },
  lang: {
    list: '/languages'
  },
  submission: {
    list: '/submissions',
    detail: '/submission'
  },
  code: {
    submit: '/code/submit',
    history: '/code/fetch'
  }
}
const proxyObject = (obj:object) => new Proxy<typeof obj>(obj, {
  get: (target, locator) => {
    const selectedObj = target[locator]
    if(typeof selectedObj === 'object') return proxyObject(selectedObj)
    else return apiPrefix + target[locator]
  }
})
export default proxyObject(apiList) as typeof apiList