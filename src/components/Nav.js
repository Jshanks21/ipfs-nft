import React from 'react'
import Identicon from 'react-identicons'

// Shows multiple instance of react that could be causing error. See node_modules/react-dom/index.js for window.React1
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

export default function Nav(props) {

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
            <Identicon string={(props.account).toString()} />
            {/* { props.account
              ? <Identicon string={(props.account).toString()} />
                // <img
                //   className="ml-2"
                //   height="30"
                //   width="30"
                //   src= {`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                //   alt=""
                // />
              : <span></span>
            } */}
            <small className="text-white ml-2">{props.account}</small>
          </li>
        </ul>
      </nav>
    </div>
  )
   
}