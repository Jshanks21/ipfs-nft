import React, { Component } from 'react'
import Nav from './Nav'

class Loading extends Component {
  render () {
    const { account } = this.props
    return (
      <div>
        <Nav account={account} />
        <div className="container-fluid text-center mt-5">
          <h2>Loading...</h2>
        </div>
      </div>
    )
  }
}

export default Loading
