import React, { Component } from 'react'

class ImageDisplay extends Component {
  render () {
    const { image, id } = this.props
    return (      
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://ipfs.infura.io/ipfs/${image}`}
      >
        <div className="gallery"> 
          
          <img            
            src={`https://ipfs.infura.io/ipfs/${image}`}
            alt=""
          />
        
          <div className="desc">ID: {id}</div>
          
          <div className="desc">Click to view on IPFS</div>
          

        </div>
      </a>
    )
  }
}

export default ImageDisplay
