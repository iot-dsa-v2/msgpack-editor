import React, { Component } from 'react'
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton'
import FontAwesome from 'react-fontawesome'
import PropTypes from 'prop-types'

import './Styles/NodeWrapper.css'

class NodeWrapper extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    type: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    insertAbove: PropTypes.func,
    insertBelow: PropTypes.func,
    remove: PropTypes.func,
    isRoot: PropTypes.bool
  }

  static defaultProps = {
    insertAbove: () => null,
    insertBelow: () => null,
    remove: () => null,
    isRoot: false
  }

  constructor (props) {
    super(props)

    this.state = {
      toggleMenu: true
    }

    this.position = this.props.index
    this.handleSelection = this.handleSelection.bind(this)
  }

  componentDidUpdate (props) {
    this.position = this.props.index
  }

  handleSelection (value, event) {
    const { index } = this.props
    event.stopPropagation()
    switch (value) {
      case 'insert above':
        this.mainMenu.manager.closeMenu()
        this.props.insertAbove(index)
        break
      case 'insert below':
        this.mainMenu.manager.closeMenu()
        this.props.insertBelow(index)
        break
      case 'remove':
        this.mainMenu.manager.closeMenu()
        this.props.remove(index)
        break
      case 'append':
        this.mainMenu.manager.closeMenu()
        if (!this.node.state.open)
          this.node.setState({ open: true })
        this.node.append()
        break
      case 'object':
      case 'array':
      case 'string':
      case 'number':
      case 'boolean':
        this.mainMenu.manager.closeMenu()
        this.props.changeType(index, value)
        break
      default:
        break
    }
  }

  render () {
    const { children, index, type, isRoot } = this.props

    let appendButton
    if (type === 'object' || type === 'array') {
      appendButton = (
        <MenuItem className="MenuButton-menuItem">
          append
        </MenuItem>
      )
    }

    let buttonMenu
    if (isRoot) {
      buttonMenu = (
        <Menu className='MenuButton-menu'>
          {appendButton}
        </Menu>
      )
    } else {
      buttonMenu = (
        <Menu className='MenuButton-menu'>
          <MenuItem className="MenuButton-menuItem">
            insert above
          </MenuItem>
          <MenuItem className="MenuButton-menuItem">
            insert below
          </MenuItem>
          {appendButton}
          <MenuItem className="MenuButton-menuItem">
            remove
          </MenuItem>
          <MenuItem className="MenuButton-menuItem">
            <Wrapper
              className='MenuButton'
              onSelection={this.handleSelection}
            >
              <Button className='MenuButton-button'>
                change type
              </Button>
              <Menu className='MenuButton-menu branchedMenu'>
                <MenuItem className="MenuButton-menuItem">
                  object
                </MenuItem>
                <MenuItem className="MenuButton-menuItem">
                  array
                </MenuItem>
                <MenuItem className="MenuButton-menuItem">
                  string
                </MenuItem>
                <MenuItem className="MenuButton-menuItem">
                  number
                </MenuItem>
                <MenuItem className="MenuButton-menuItem">
                  boolean
                </MenuItem>
              </Menu>
            </Wrapper>
          </MenuItem>
        </Menu>
      )
    }

    return (
      <div className="item" style={{ flexDirection: 'row' }}>
        <div className='MenuButton-container'>
          <Wrapper
            className='MenuButton'
            onSelection={this.handleSelection}
            closeOnSelection={false}
            ref={instance => this.mainMenu = instance}
          >
            <Button className='MenuButton-button'>
              <FontAwesome name={"th-list"} />
            </Button>
            {buttonMenu}
          </Wrapper>
        </div>
        {
          React.cloneElement(children, {
            index,
            ref: instance => (this.node = instance)
          })
        }
      </div>
    )
  }
}

export default NodeWrapper
