import React, { Component } from 'react';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      memeHash: "QmSVPV4ccnNiz65PmPZt76pfpGZza6mK7Czh5sxyFzGxoV",
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const source = ipfs.add(
      this.state.buffer,
      {
          progress: (prog) => console.log(`received: ${prog}`)
      }
    )
    try {
      for await (const file of source) {
        console.log(file)
        this.setState({ memeHash: file.path })
      }
    }  catch (err) {
          console.error(err)
      }
  }

  // async (event) => {
  //   event.preventDefault()
  //   console.log("Submitting file to ipfs...")
  //   await ipfs.add(this.state.buffer, (error, result) => {
  //     console.log('Ipfs result', result)
  //     if(error) {
  //       console.log(error)
  //       return
  //     }
  //   })
  // }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <span
            className="navbar-brand col-sm-3 col-md-2 mr-0"
          >
            NFT Gallery
          </span>
        </nav>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Your Image</h1>
                  <p className="font-italic">This image is stored on IPFS & The Ethereum Blockchain!</p>
                <div className="container-fluid">
                  <img
                    className="w-75 h-75"
                    src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`}
                    alt=""
                  />
                </div>
                <h2 className="mt-5 mb-5" >Upload Image to IPFS</h2>
                <form onSubmit={this.onSubmit} >
                  <input type="file" onChange={this.captureFile} />
                  <input type='submit'/>
                </form>
                <div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`}
                  >
                      IPFS Link Here
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
