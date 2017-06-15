import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import AutosizeInput from 'react-input-autosize'

import './Styles/Node.css'

class ContainerNode extends Component {
  static propTypes = {
    levelHeight: PropTypes.number.isRequired,
    value: PropTypes.object.isRequired,
    setValue: PropTypes.func.isRequired,
    setName: PropTypes.func,
    parentType: PropTypes.string,
    index: PropTypes.number,
    isRoot: PropTypes.bool
  }

  static defaultProps = {
    index: -1,
    parentType: 'undefined',
    setName: () => null
  }

  static nodeCount = 0

  constructor (props) {
    super(props)

    this.setElementValue = this.setElementValue.bind(this)
    this.insertAboveElement = this.insertAboveElement.bind(this)
    this.insertBelowElement = this.insertBelowElement.bind(this)
    this.append = this.append.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.genWrapperProps = this.genWrapperProps.bind(this)
    this.setState = this.setState.bind(this)
    this.value = this.props.value

    this.state = {
      content: null,
      open: true,
      name: props.name
    }

    this.type = null

    if (Array.isArray(this.value))
      this.type = 'array'
    else
      this.type = typeof this.value
  }

  genWrapperProps (index, value) {
    return {
      insertAbove: this.insertAboveElement,
      insertBelow: this.insertBelowElement,
      remove: this.removeAt,
      append: this.append,
      changeType: this.changeTypeAt,
      key: ContainerNode.nodeCount++,
      type: Array.isArray(value) ? 'array' : typeof value,
      index
    }
  }

  insertAboveElement (index) {
    this.insertAt(index)
  }

  insertBelowElement (index) {
    this.insertAt(index + 1)
  }

  setElementValue (key, newValue) {
    console.log(key, newValue)
    this.value[key] = newValue

    const { setValue, index, parentType } = this.props
    const { name } = this.state
    setValue(parentType === 'object' ? name : index, this.value)
  }

  handleNameChange ({ target }) {
    if (this.props.parentType === 'object') {
      const { name } = this.state
      this.setState({ name: target.value })
      this.props.setName(name, target.value)
    }
  }

  append () {
    this.insertAt(Object.keys(this.value).length)
  }


  render () {
    const { levelHeight, parentType, index } = this.props
    const { open, content, name } = this.state

    let nameField = null
    switch (parentType) {
      case 'object':
        nameField = <AutosizeInput value={name} onChange={this.handleNameChange}/>
        break
      case 'array':
        nameField = index
        break
      default:
        nameField = name
    }

    switch (this.type) {
      case 'object':
        nameField = <div className="name">{nameField}&emsp;{`{${Object.keys(this.value).length}}`}</div>
        break
      case 'array':
        nameField = <div className="name">{nameField}&emsp;{`[${this.value.length}]`}</div>
        break
      default:
        break
    }

    return (
      <div className="container" style={{ paddingLeft: levelHeight }}>
        <div className="row" style={{ height: 30, marginBottom: 5 }}>
          <div className="toggleOpen" style={{ marginLeft: -31 }}>
            <button className="toggle" onClick={() => this.setState({ open: !open })}>
              <FontAwesome name={open ? "minus" : "plus"} />
            </button>
          </div>
          {nameField}
        </div>
        <div style={{ display: open ? 'flex' : 'none', flexDirection: 'column' }}>
          {content}
        </div>
      </div>
    )
  }
}

export default ContainerNode
