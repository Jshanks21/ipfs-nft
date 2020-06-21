import React, { Component } from 'react'

class MintTokenInput extends Component {
    render() {
    const { imageHash } = this.props

    const hashInput = imageHash.pop() 

        return (
            <div className="desc">
              <strong>Paste this hash below.</strong>
              <div>{hashInput}</div>
              <small>(Hint: Upload something first.)</small>
            </div>
        )
    }   
}

export default MintTokenInput