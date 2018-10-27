pragma solidity ^0.4.24;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-eth/contracts/cryptography/MerkleProof.sol";

contract MerkleStream is Initializable {
  ERC20 token;

  uint256 sessionCount;

  mapping (uint256 => uint256) deposits;
  mapping (uint256 => bytes32) merkleRoots;
  mapping (uint256 => uint256) durations;
  mapping (uint256 => address) streamers;
  mapping (uint256 => bool) claimed;

  event OpenedStream(uint256 streamId);

  modifier onlyStreamer(uint256 _sessionId) {
    require(msg.sender == streamers[_sessionId], 'must be the streamer');
    _;
  }

  modifier notClaimed(uint256 _sessionId) {
    require(!claimed[_sessionId], 'stream has not been claimed');
    _;
  }

  function initialize(ERC20 _token) initializer {
    token = _token;
  }

  function openStream(uint256 _deposit, bytes32 _merkleRoot, uint256 _duration, address _streamer) {
    uint256 sessionId = ++sessionCount;
    deposits[sessionId] = _deposit;
    merkleRoots[sessionId] = _merkleRoot;
    durations[sessionId] = _duration;
    token.transferFrom(msg.sender, address(this), _deposit);
    emit OpenedStream(sessionId);
  }

  function verify(uint256 _sessionId, bytes32[] _merkleProof, bytes32 _leaf) view returns (bool) {
    return MerkleProof.verify(_merkleProof, merkleRoots[_sessionId], _leaf);
  }

  function claim(
    uint256 _sessionId,
    bytes32[] _lastMerkleProof,
    bytes32 _lastLeaf) onlyStreamer(_sessionId) notClaimed(_sessionId) {
    uint256 value = uint256(_lastLeaf);
    claimed[_sessionId] = true;
    token.transfer(streamers[_sessionId], value);
  }
}
