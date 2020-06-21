import React, { Component } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import Nav from './Nav'

class Loading extends Component {
  render () {
    const { account } = this.props
    return (
      <div>
        <Nav account={account} />
        <div className="text-center loader">
          {<Spinner animation="border" variant="primary" />}
          <h2>Uploading to IPFS...</h2>
        </div>
      </div>
    )
  }
}

export default Loading
