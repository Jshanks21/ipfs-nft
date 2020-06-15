import React, { Component } from 'react'

class Nav extends Component {
  render () {
    const { account } = this.props
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <span
            className="navbar-brand col-sm-3 col-md-2 mr-0"
          >
            NFT Gallery
          </span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{account}</small>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Nav
