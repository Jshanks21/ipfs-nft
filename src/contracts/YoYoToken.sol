pragma solidity ^0.6.0;

import "@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YoYoToken is ERC721PresetMinterPauserAutoId, Ownable {

  constructor() public ERC721PresetMinterPauserAutoId("YoYoYoToken", "YOYO", "https://ipfs.infura.io/ipfs/"){
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
    super._setTokenURI(tokenId, _tokenURI);
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return _exists(tokenId);
  }

}
