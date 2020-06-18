pragma solidity ^0.6.0;

import "@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YoYoToken is ERC721PresetMinterPauserAutoId, Ownable {
    constructor()
    	public
    	ERC721PresetMinterPauserAutoId(
            "YoYoYoToken",
            "YOYO",
            "https://ipfs.infura.io/ipfs/"
        )
    {}

    function mint(string memory ipfsHash) public onlyOwner {
        uint256 _id = totalSupply();
        _mint(msg.sender, _id);
        _setTokenURI(_id, ipfsHash);
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }
}