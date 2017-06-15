import React from 'react'
import PropTypes from 'prop-types'

import NodeWrapper from './NodeWrapper'
import StringNode from './StringNode'
import ObjectNode from './ObjectNode'
import './Styles/ArrayNode.css'
import './Styles/Node.css'

import ContainerNode from './ContainerNode'

class ArrayNode extends ContainerNode {
  static propTypes = {
    name: PropTypes.string
  }

  static defaultProps = {
    name: 'array'
  }

  constructor (props) {
    super(props)

    this.genNode = this.genNode.bind(this)
    this.insertAt = this.insertAt.bind(this)
    this.removeAt = this.removeAt.bind(this)
    this.changeTypeAt = this.changeTypeAt.bind(this)
  }

  componentDidMount () {
    this.setState({
      content: this.value.map((item, index) => this.genNode(item, index))
    })
  }

  genNode (value, index) {
    const { levelHeight } = this.props
    const nodeProps = {
      value,
      levelHeight,
      setValue: this.setElementValue,
      parentType: 'array'
    }

    if (Array.isArray(value)) {
      return <NodeWrapper {...this.genWrapperProps(index, value)}><ArrayNode {...nodeProps} /></NodeWrapper>
    } else {
      switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
          return <NodeWrapper {...this.genWrapperProps(index, value)}><StringNode {...nodeProps} /></NodeWrapper>
        case 'object':
          return <NodeWrapper {...this.genWrapperProps(index, value)}><ObjectNode {...nodeProps} /></NodeWrapper>
        default:
          return null
      }
    }
  }

  insertAt (idx) {
    let { content, name } = this.state
    const { setValue, index, parentType } = this.props

    this.value.splice(idx, 0, '')
    content.splice(idx, 0, this.genNode(this.value[idx], idx))
    content = content.map((element, newIndex) => React.cloneElement(element, { index: newIndex }))

    this.setState({ content })
    setValue(parentType === 'object' ? name : index, this.value)
  }

  removeAt (idx) {
    let { content, name } = this.state
    const { setValue, index, parentType } = this.props

    this.value.splice(idx, 1)
    content.splice(idx, 1)
    content = content.map((element, newIndex) => React.cloneElement(element, { index: newIndex }))

    this.setState({ content })
    setValue(parentType === 'object' ? name : index, this.value)
  }

  changeTypeAt (idx, type) {
    let { content, name } = this.state
    const { setValue, index, parentType } = this.props

    switch (type) {
      case 'object':
        this.value[idx] = {}
        break
      case 'array':
        this.value[idx] = []
        break
      default:
        this.value[idx] = ''
    }

    content[idx] = this.genNode(this.value[idx], idx)
    this.setState({ content })
    setValue(parentType === 'object' ? name : index, this.value)
  }
}

export default ArrayNode
