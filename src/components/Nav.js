import React, { Component } from 'react'
import Identicon from 'identicon.js';

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
              { this.props.account
                ? <img
                    className="ml-2"
                    height="30"
                    width="30"
                    src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                    alt=""
                  />
                : <span></span>
              }
              <small className="text-white ml-2">{account}</small>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Nav
