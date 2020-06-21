import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import YoYoToken from '../abis/YoYoToken'
import ImageDisplay from './ImageDisplay'
import Nav from './Nav'
import Loading from './Loading'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  constructor(props) {
    super(props)
    this.captureFile = this.captureFile.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state = {
      imageHash: [],
      tokenHash: [],
      contract: null,
      web3: null,
      buffer: null,
      account: '',
      loading: false
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = YoYoToken.networks[networkId]
    if (networkData) {
      const contract = new web3.eth.Contract(YoYoToken.abi, networkData.address)
      this.setState({ contract: contract })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log(this.state.buffer)
    }
  }

  getLastId = async () => {
    const nfts = await this.state.contract.methods.totalSupply().call()
    const lastNft = await this.state.contract.methods.tokenByIndex(nfts - 1).call()
    console.log(lastNft.toString())
    return lastNft
  } 

  mint = async (ipfsHash) => {
    const { account, contract, tokenHash } = this.state 
    contract.methods.mint(ipfsHash).send({ from: account, gas: 5000000, gasPrice: window.web3.utils.toWei('10', 'gwei') })
    .once('receipt', (receipt) => {
      this.setState({
        tokenHash: [...tokenHash, ipfsHash]
      })
    })    
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const { imageHash } = this.state
    this.setState({
      loading: true
    })
    const source = ipfs.add(
      this.state.buffer,
      {
        progress: (prog) => console.log(`received: ${prog}`)
      }
    )
    try {
      for await (const file of source) {
        this.setState({
          imageHash: [...imageHash, file.path],
        })
        console.log(imageHash)
        this.setState({
          loading: false
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { imageHash, account, loading } = this.state;

    let image = imageHash.map((image, index) => {
      return (
        <div key={index} className="col-md-3 mb-3">
          <ImageDisplay image={image} id={index} />
        </div>)
    })

    if (loading) {
      return <Loading account={account} />
    }
    else {
      return (
        <div>
          <Nav account={account} />


          <div className="container-fluid text-center">
            <h2 className="mt-5 mb-5">Upload Image to IPFS</h2>
            <form onSubmit={this.onSubmit} >
              <input type="file" onChange={this.captureFile} />
              <input type='submit' className="btn btn-primary" />
            </form>
          </div>
          <hr />

          <div className="container-fluid text-center">
            <h2 className="mt-5 mb-5">Mint Token</h2>
            <form onSubmit={(event) => {
              event.preventDefault()
              const ipfsHash = this.ipfsHash.value
              this.mint(ipfsHash)
              }}>
              <input 
                type="text" 
                className="mr-5" 
                placeholder="e.g. QmSVPV4ccnNiz65PmPZt76pfpGZza6mK7Czh5sxyFzGxoV" 
                ref={(input) => { this.ipfsHash = input }} 
              />
              <input type='submit' className="ml-5 btn btn-primary" />
            </form>
          </div>
          <hr/>

          <div className="container-fluid mt-5">
            <div className="row text-center">
              {image}
            </div>           
          </div>
        </div>
      );
    }

  }
}

export default App
