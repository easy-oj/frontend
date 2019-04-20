import React, { Component } from 'react'
import * as monaco from 'monaco-editor'
import { Collapse, Col, Spin, Icon, Select, Button } from 'antd'
import { markdown } from 'markdown'
import { View } from '@/designs'
import { ILang } from '@/reducers/lang'
import { connect } from 'react-redux'
import lang from '@/services/lang'
import { Dispatch } from 'redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { codeServices, submissionServices } from '@/services'
import MapTable from '@/designs/MapTable'

const { Option } = Select
const { Panel } = Collapse

export type TDetail = {
  acceptedCount: number
  description: string
  id: number
  name: string
  submittedCount: number
}
type TResult = {
  status: 'Accepted' | 'Failed' | 'Judging'
  casePassRate?: string
  casePassDetail?: any
}
interface IProps extends RouteComponentProps {
  loading?: boolean
  hasDetail?: boolean
  detail?: TDetail
  langStore?: ILang[]
  dispatch?: Dispatch
  historyCode?: string
}
interface IState {
  loading: boolean
  languageFeature?: ILang
  result?: TResult
}
interface IEditorConfig {
  language: string
  value?: string
}
class EditorView extends Component<IProps, IState> {
  holdStatus = ['IN_QUEUE', 'JUDGING']
  ChineseStatusMap = {
    Accepted: '通过',
    EXECUTION_ACCEPTED: '输出正确',
    Failed: '未通过',
    WRONG_ANSWER: '输出错误'
  }
  state: IState = {
    loading: false
  }
  editor: monaco.editor.IStandaloneCodeEditor
  createEditor = (config: IEditorConfig) => {
    const container = document.getElementById('eoj-editor-container')
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
    this.editor = monaco.editor.create(
      document.getElementById('eoj-editor-container'),
      {
        minimap: { enabled: false },
        // theme: 'vs-dark',
        ...config
      }
    )
    setTimeout(function() {
      this.editor &&
        this.editor.updateOptions({
          lineNumbers: 'on'
        })
    }, 2000)
  }
  componentDidMount() {
    const { langStore, dispatch } = this.props
    if (!(langStore || []).length) {
      lang.getList().then(response => {
        const { res } = response.data

        dispatch({
          type: 'SAVE_LANG',
          payload: res
        })
      })
    }
  }
  componentDidUpdate() {
    const hasEditor = !!document.getElementById('eoj-editor-container').children
      .length
    if (!hasEditor) {
      this.createEditor({
        language: 'c'
      })
    }

    const { langStore } = this.props
    const { languageFeature } = this.state
    if (!languageFeature && langStore.length) {
      this.setState({
        languageFeature: langStore[0]
      })
      const { highlight, templateContent } = langStore[0]
      this.createEditor({
        language: highlight,
        value: templateContent
      })
    }
  }
  changeLanguageFeature = (langName: string) => {
    const languageFeature = this.props.langStore.filter(
      lang => lang.name === langName
    )[0]
    this.setState({
      languageFeature
    })
    const { templateContent, highlight } = languageFeature
    this.createEditor({
      language: highlight,
      value: templateContent
    })
  }

  checkStatus = async (id: number, resolve, reject) => {
    const response = await submissionServices.getDetail({
      id
    })
    const { status, executions } = response.data.res
    if (this.holdStatus.includes(status)) {
      setTimeout(() => {
        this.checkStatus(id, resolve, reject)
      }, 1000)
    } else {
      resolve(executions)
    }
    return response.data
  }

  handleCheckResult = (id: number) => {
    return new Promise((resolve, reject) => {
      this.checkStatus(id, resolve, reject)
    })
  }

  handleSubmit = () => {
    const codeValue = this.editor.getValue()
    const pid = this.props.detail.id
    const lid = this.state.languageFeature.id

    this.setState({
      result: {
        status: 'Judging'
      }
    })

    codeServices
      .submit({
        pid,
        lid,
        content: codeValue
      })
      .then(({ data }) => {
        this.handleCheckResult(data.res.id).then((caseDetails: Array<any>) => {
          const result: any = {}
          const counter = {
            EXECUTION_ACCEPTED: 0
          }
          caseDetails.forEach(singleCase => {
            const { status } = singleCase
            counter[status]
            if (counter[status]) {
              counter[status] += 1
            } else {
              counter[status] = 1
            }
          })
          result.casePassRate =
            ((counter.EXECUTION_ACCEPTED /
              caseDetails.length) as number).toFixed(2) *
              100 +
            '%'
          ;(result.status =
            result.casePassRate === '100%' ? 'Accepted' : 'Failed'),
            (result.casePassDetail = counter)
          this.setState({
            result
          })
        })
      })
  }

  render() {
    const { loading, hasDetail, detail, langStore } = this.props
    const { languageFeature, result } = this.state

    const { casePassDetail, casePassRate, status } = result || ({} as TResult)

    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      border: 0,
      overflow: 'hidden'
    }

    if (hasDetail) {
      const { description, name, id, exampleCases, specialLimits } =
        detail || ({} as any)
      let { id: langId, timeLimit, memLimit } = languageFeature || ({} as any)
      if (specialLimits && langId && specialLimits[langId]) {
        const spLimits = specialLimits[langId]
        timeLimit = spLimits.timeLimit
        memLimit = spLimits.memLimit
      }
      return (
        <View label="编辑器" full className="eoj-editor">
          <Col span={8} className="problem-detail">
            <Spin spinning={loading} indicator={<Icon type="loading" />}>
              <div>
                <h3>{`Problem ${id || ''}: ${name || ''}`}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: markdown.toHTML(description || '')
                  }}
                />
                <h4>性能要求</h4>
                <span>时间限制：</span>
                <span>{timeLimit}</span> ms
                <br />
                <span>内存限制：</span>
                <span>{memLimit}</span> Byte
                <h4>示例</h4>
                <div className="-demo">
                  {exampleCases &&
                    exampleCases.map(item => {
                      const { id, input, output } = item

                      return (
                        <div key={id}>
                          <div>输入示例</div>
                          <pre>{input || '-'}</pre>
                          <div>输出示例</div>
                          <pre>{output || '-'}</pre>
                        </div>
                      )
                    })}
                </div>
              </div>
            </Spin>
          </Col>
          <Col span={16}>
            <div id="eoj-editor-container" />
            <div>
              <div className="-operation">
                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Panel
                    key="1"
                    disabled={!result}
                    header={
                      <React.Fragment>
                        {result ? (
                          <div className="-status">
                            {status === 'Judging'
                              ? '正在提交……'
                              : `${
                                  this.ChineseStatusMap[status]
                                }, case 通过率为 ${casePassRate}`}
                          </div>
                        ) : (
                          '暂未提交'
                        )}
                      </React.Fragment>
                    }
                    style={customPanelStyle}
                  >
                    {casePassDetail && (
                      <MapTable
                        map={casePassDetail}
                        keyLabel="case 运行结论"
                        valueLabel="占 case 总数的百分比"
                        pagination={false}
                        size="small"
                      />
                    )}
                  </Panel>
                </Collapse>

                <Select
                  className="-choose-lang"
                  onChange={val => this.changeLanguageFeature(val)}
                  defaultValue={
                    (languageFeature && languageFeature.name) || 'C'
                  }
                >
                  {langStore.map(lang => {
                    const { name } = lang
                    return <Option key={name}>{name}</Option>
                  })}
                </Select>
                <Button
                  onClick={this.handleSubmit}
                  type="primary"
                  icon="dashboard"
                >
                  提交
                </Button>
              </div>
            </div>
          </Col>
        </View>
      )
    } else {
      return (
        <View label="编辑器" full className="eoj-editor">
          <div id="eoj-editor-container" />
        </View>
      )
    }
  }
}
export default withRouter(
  connect<{}, {}, {}, any>(({ langStore }) => {
    return {
      langStore
    }
  })(EditorView)
)
