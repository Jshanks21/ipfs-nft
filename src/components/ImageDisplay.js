import React, { Component } from 'react'

class ImageDisplay extends Component {

  render () {
    const { images, id } = this.props  

    return (      
      
      <div className="gallery"> 
        
        <img            
          src={images}
          alt=""
        />
        
        <div className="desc"><strong>ID:</strong> {id}</div>  
          
        
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={images}
        >
          <div className="desc mt-5">Click to view on IPFS</div>
        </a>
        
      </div>
    )
  }
}

export default ImageDisplay
