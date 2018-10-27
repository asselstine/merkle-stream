global.artifacts = artifacts;
global.web3 = web3;

const { Contracts, SimpleProject } = require('zos-lib')
const MerkleStream = Contracts.getFromLocal('MerkleStream')
const DaiToken = Contracts.getFromLocal('DaiToken')

const debug = require('debug')('MerkleStream.test.js')

contract('MerkleStream', (accounts) => {
  const owner = accounts[0]
  let project

  let token, merkleStream

  before(async function () {
    project = await TestHelper({ from: owner })
    token = await project.createProxy(DaiToken)
    debug(`token address: ${token.address}: `, token)
    merkleStream = await project.createProxy(MerkleStream, { initMethod: 'initialize', initArgs: [token.address]})
  });

  it('Tokens should match', async () => {
    const tokenAddress = await merkleStream.token()
    assert.equal(tokenAddress, token.address)
  })
})
