import React, { useState, useEffect } from 'react';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

function App() {

  const [path, setPath] = useState(`QmSVPV4ccnNiz65PmPZt76pfpGZza6mK7Czh5sxyFzGxoV`)

  const captureFile = (e) => {
    e.preventDefault()
    // Process file for IPFS
    const file = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
        saveToIpfs(Buffer(reader.result))
    }
  }

  const saveToIpfs = async (files) => {
    const source = ipfs.add(
      [...files],
      {
          progress: (prog) => console.log(`received: ${prog}`)
      }
    )
    try {
      for await (const file of source) {
          console.log(file)
          setPath(file.path)
      }
    }  catch (err) {
          console.error(err)
      }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

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
              <img
                src={`https://ipfs.infura.io/ipfs/${path}`}
              />
              <form onSubmit={handleSubmit} >
                <h2 className="mt-5 mb-5" >Upload to IPFS</h2>
                  <input className="ml-5" type="file" onChange={captureFile} />
              </form>
              <div>
                <a  target="_blank"
                    rel="noopener noreferrer"
                    href={`https://ipfs.infura.io/ipfs/${path}`}>
                    View image
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
