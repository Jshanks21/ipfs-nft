import React, { Component } from 'react'

class ImageDisplay extends Component {
  render () {
    const { image, id } = this.props
    return (      
      
      <div className="gallery"> 
        
        <img            
          src={`https://ipfs.infura.io/ipfs/${image}`}
          alt=""
        />
      
        <div className="desc">ID: {id}</div>

        <div>Hash: {image}</div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://ipfs.infura.io/ipfs/${image}`}
        >
          <div className="desc">Click to view on IPFS</div>
        </a>

      </div>
    )
  }
}

export default ImageDisplay
