import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import msgpack from 'msgpack-lite'

import ObjectNode from './Components/ObjectNode'
import ArrayNode from './Components/ArrayNode'
import NodeWrapper from './Components/NodeWrapper'
import './App.css'
 
class App extends Component {
  constructor (props) {
    super(props)

    this.setValue = this.setValue.bind(this)
    this.download = this.genDownload()
    this.genContent = this.genContent.bind(this)
    this.parseData = this.parseData.bind(this)

    this.isNumber = /^\d+$/
    this.isBool = /^(true|false)$/

    this.state = {
      data: undefined,
      levelHeight: 30
    }

    this.content = null
  }

  setValue (key, value) {
    this.setState({ value })
  }

  genContent (data) {
    const { levelHeight } = this.state
    const type = Array.isArray(data) ? 'array' : typeof data

    switch (type) {
      case 'object':
        return (
          <NodeWrapper index={0} type={type} isRoot>
            <ObjectNode value={data} setValue={this.setValue} levelHeight={levelHeight} />
          </NodeWrapper>
        )
      case 'array':
        return (
          <NodeWrapper index={0} type={type} isRoot>
            <ArrayNode value={data} setValue={this.setValue} levelHeight={levelHeight} />
          </NodeWrapper>
        )
      default:
        return null
    }
  }

  genDownload () {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display:none'
    return (name) => {
      const { data } = this.state
      const parsed = this.parseData(data)
      const blob = new Blob([msgpack.encode(parsed)], { type: 'octete/stream' })
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = name
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  parseData (current) {
    if (typeof current === 'string') {
      if (this.isNumber.test(current))
        return Number(current)
      else if (this.isBool.test(current))
        return current === 'true'
      else
        return current
    }

    if (Array.isArray(current)) {
      for (let i = 0; i < current.length; i++)
        current = current.map(this.parseData)
    } else {
      for (let key of Object.keys(current)) {
        current[key] = this.parseData(current[key])
      }
    }
    return current
  }

  onDrop (files) {
    if (files.length === 0) return

    const file = files[0]

    const reader = new FileReader()
    reader.addEventListener('loadend', () => {
      const data = msgpack.decode(new Uint8Array(reader.result))
      this.content = this.genContent(data)
      this.setState({ data: undefined }, () => this.setState({ data }))
    })
    reader.readAsArrayBuffer(file)
  }

  render() {
    const { data } = this.state

    return (
      <div className="App">
        <div className='tree'>
          {this.genContent(data)}
        </div>
        <div className='fileManagement'>
          <button onClick={() => this.download('pack.msp')}>
            <div className="downloadButton">
              <p>Download</p>
            </div>
          </button>
          <Dropzone onDrop={this.onDrop.bind(this)} className='dropzone' accept='.mp, .msp, .mpac'>
              <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
      </div>
    )
  }
}

export default App
