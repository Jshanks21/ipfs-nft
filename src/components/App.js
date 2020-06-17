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
      const contract = web3.eth.Contract(YoYoToken.abi, networkData.address)
      this.setState({ contract })
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

  // Seems to work. Bind in constructor? Should use this to push token IDs to a state array.
  getLastId = async () => {
    const nfts = await this.state.contract.methods.totalSupply().call()
    const lastNft = await this.state.contract.methods.tokenByIndex(nfts - 1).call()
    console.log(lastNft.toString())
    return lastNft
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const { imageHash, loading } = this.state
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
        // this.state.contract.methods.mint(this.state.account).send({ from: this.state.account })
        // // Use getLastId to get tokenId to setTokenURI
        // const id = await this.state.contract.methods.exists(this.getLastId).call()
        // console.log(id)
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
