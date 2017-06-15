import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutosizeInput from 'react-input-autosize'

import './Styles/StringNode.css'
import './Styles/Node.css'

class StringNode extends Component {
  static propTypes = {
    value: PropTypes.any.isRequired,
    levelHeight: PropTypes.number.isRequired,
    setValue: PropTypes.func.isRequired,
    name: PropTypes.string,
    index: PropTypes.number,
    parentType: PropTypes.string,
    setName: PropTypes.func
  }

  static defaultProps = {
    parentType: 'null',
    setName: null,
    name: 'string',
    index: -1
  }

  constructor (props) {
    super(props)

    const { value, name } = this.props
    this.state = {
      value: String(value),
      name: name
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  handleChange ({ target }) {
    const { index, setValue, parentType } = this.props
    const { name } = this.state
    this.setState({ value: target.value })
    setValue(parentType === 'object' ? name : index, target.value)
  }

  handleNameChange ({ target }) {
    if (this.props.parentType === 'object') {
      const { name } = this.state
      this.setState({ name: target.value })
      this.props.setName(name, target.value)
    }
  }

  render () {
    const { value, name } = this.state
    const { levelHeight, parentType, index } = this.props

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

    return (
      <div className="container">
        <div className="row" style={{ height: 30, marginBottom: 5, marginLeft: levelHeight }}>
          <div className="name">{nameField}&emsp;:&ensp;</div>
          <AutosizeInput className="textValue" placeholder="empty" value={value} onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}

export default StringNode
