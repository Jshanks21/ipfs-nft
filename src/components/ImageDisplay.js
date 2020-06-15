import React, { Component } from 'react'

class ImageDisplay extends Component {
  render () {
    const { image, id } = this.props
    return (
      <div>
        <div>
          <img
            className="w-50 h-50"
            src={`https://ipfs.infura.io/ipfs/${image}`}
            alt=""
          />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://ipfs.infura.io/ipfs/${image}`}
          >
          <span>Check it out on IPFS {id}</span>
          </a>
        </div>

      </div>
    )
  }
}

export default ImageDisplay
