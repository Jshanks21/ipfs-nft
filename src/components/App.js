import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import YoYoToken from '../abis/YoYoToken'
import ImageDisplay from './ImageDisplay'
import Nav from './Nav'
import Loading from './Loading'
import MintTokenInput from './MintTokenInput'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  constructor(props) {
    super(props)
    this.captureFile = this.captureFile.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    this.state = {
      imageHash: [],
      tokenURI: [],
      tokenID: [],
      contract: null,
      web3: null,
      buffer: null,
      account: '',
      totalSupply: 0,
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
    this.setState({ web3 })
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = YoYoToken.networks[networkId]
    if (networkData) {
      const contract = new web3.eth.Contract(YoYoToken.abi, networkData.address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      for(let i = 1; i <= totalSupply; i++) {
        const uri = await contract.methods.tokenURI(i - 1).call()
        this.setState({
          tokenURI: [...this.state.tokenURI, uri]
        })
        const id = await contract.methods.tokenByIndex(i - 1).call()
        this.setState({ 
          tokenID: [...this.state.tokenID, id]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network. Please switch to Ropsten testnet.')
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

  // getLastId = async () => {
  //   const nfts = await this.state.contract.methods.totalSupply().call()
  //   const lastNft = await this.state.contract.methods.tokenByIndex(nfts - 1).call()
  //   return lastNft
  // } 

  // setTokenID = async () => {
  //   const { totalSupply, contract } = this.state
  //   for(let i = 1; i <= totalSupply; i++) {
  //     const id = await contract.methods.tokenByIndex(i - 1).call()
  //     this.setState({ tokenID: [...tokenID, id]})
  //   }
  // }

  mint = async (ipfsHash) => {
    const { account, web3 } = this.state 
    await this.state.contract.methods.mint(ipfsHash).send({ from: account, gas: 5000000, gasPrice: web3.utils.toWei('30', 'gwei') })
    .once('receipt', (receipt) => {
      window.location.reload(true)
    })
    this.setState({
      totalSupply: this.state.totalSupply++
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
        this.setState({
          loading: false
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { imageHash, account, loading, tokenURI } = this.state;
    
    const image = tokenURI.map((images, index) => {
      return (
        <div key={images}>
          <ImageDisplay images={images} id={index} />
        </div>
      )        
    })

    if (loading) {
      return <Loading account={account} />
    }

    if (!this.loadBlockchainData) {
      return <div>Error connecting to blockchain...</div>      
    }

    return (
      <div>
        <Nav account={account} />


        <div className="container-fluid text-center">
        <h2 className="float-left">1</h2>
          <h2 className="mt-5">Upload Image to IPFS</h2>
          <div className="text-center mb-5 alert alert-warning">
            <span>Live on Ropsten testnet.</span>
          </div>
          <form onSubmit={this.onSubmit} >
            <input type="file" onChange={this.captureFile} />
            <input type='submit' className="btn btn-primary" />
            <MintTokenInput imageHash={imageHash}/>
          </form>
        </div>
        <hr />

        <div className="container-fluid text-center">
        <h2 className="float-left">2</h2>
          <h2 className="mt-5">Mint Token</h2>
          <span>
            Get your test Ether
            <a href="https://faucet.metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              >
              &nbsp;here.
            </a>
          </span>
          <form className="mt-5" onSubmit={(event) => {
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
          <h2 className="float-left">3</h2>
          <h2 className="text-center">Enjoy Your Collection</h2>
          <div className="row text-center">
            {image}
          </div>           
        </div>
        


      </div>
    );
    

  }
}

export default App
