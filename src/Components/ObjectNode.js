import React from 'react'
import PropTypes from 'prop-types'

import ContainerNode from './ContainerNode'
import NodeWrapper from './NodeWrapper'
import ArrayNode from './ArrayNode'
import StringNode from './StringNode'

class ObjectNode extends ContainerNode {
  static propTypes = {
    name: PropTypes.string,
    index: PropTypes.number,
    isRoot: PropTypes.bool
  }

  static defaultProps = {
    name: 'object'
  }

  constructor (props) {
    super(props)

    this.genNode = this.genNode.bind(this)
    this.genProps = this.genProps.bind(this)
    this.setElementKey = this.setElementKey.bind(this)
    this.insertAt = this.insertAt.bind(this)
    this.removeAt = this.removeAt.bind(this)
    this.changeTypeAt = this.changeTypeAt.bind(this)

    this.order = Object.keys(this.value)
  }

  componentDidMount () {
    this.setState({
      content: this.order.map((key, index) => this.genNode(key, index))
    })
  }

  genNode (key, index) {
    const { levelHeight } = this.props
    const value = this.value[key]

    const nodeProps = {
      levelHeight,
      value,
      setValue: this.setElementValue,
      parentType: this.type,
      name: key,
      setName: this.setElementKey
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

  genProps (key) {
    return {
      name: key,
      setName: this.setElementKey
    }
  }

  insertAt (idx) {
    let { content, name } = this.state
    const { setValue, index, parentType } = this.props

    let key = 'new node 1'
    let count = 2
    while (key in this.value) {
      key = `new node ${count++}`
    }
    this.value[key] = ''

    content.splice(idx, 0, this.genNode(key, idx))
    content = content.map((element, newIndex) => React.cloneElement(element, { index: newIndex }))

    this.setState({ content })
    this.order.splice(idx, 0, key)
    setValue(parentType === 'object' ? name : index, this.value)
  }

  removeAt (idx) {
    let { content, name } = this.state
    const { setValue, index, parentType } = this.props

    delete this.value[this.order[idx]]
    content.splice(idx, 1)
    this.order.splice(idx, 1)
    content = content.map((element, newIndex) => React.cloneElement(element, { index: newIndex }))

    this.setState({ content })
    setValue(parentType === 'object' ? name : index, this.value)
  }

  setElementKey (key, newKey) {
    const nodeValue = this.value[key]
    delete this.value[key]
    this.value[newKey] = nodeValue
    this.order[this.order.indexOf(key)] = newKey

    const { setValue, index, parentType } = this.props
    const { name } = this.state
    setValue(parentType === 'object' ? name : index, this.value)
  }

  changeTypeAt (idx, type) {
    let { content, name } = this.state
    const { setValue, index, parentType } = this.props

    switch (type) {
      case 'object':
        this.value[this.order[idx]] = {}
        break
      case 'array':
        this.value[this.order[idx]] = []
        break
      default:
        this.value[this.order[idx]] = ''
    }

    content[idx] = this.genNode(this.order[idx], idx)
    this.setState({ content })
    setValue(parentType === 'object' ? name : index, this.value)
  }
}

export default ObjectNode
