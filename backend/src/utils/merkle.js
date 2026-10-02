const { MerkleTree } = require('merkletreejs');
const { ethers } = require('ethers');

/**
 * Calculates leaf hash from a unit code string.
 * Matches Solidity contract: keccak256(abi.encodePacked(unitCode))
 */
function leafHash(unitCode) {
  return ethers.keccak256(ethers.toUtf8Bytes(unitCode));
}

/**
 * Merkle Tree builder backed by merkletreejs.
 * Configured with ethers.keccak256 and { sortPairs: true } to match
 * OpenZeppelin's MerkleProof.sol and TrustChainRegistry.sol.
 */
class MerkleTreeBuilder {
  constructor(unitCodes) {
    if (!unitCodes || unitCodes.length === 0) {
      throw new Error('At least one unit code is required to build a Merkle tree.');
    }
    this.unitCodes = unitCodes;
    this.leaves = unitCodes.map(code => leafHash(code));
    this.tree = new MerkleTree(this.leaves, ethers.keccak256, { sortPairs: true });
  }

  getRoot() {
    return this.tree.getHexRoot();
  }

  getProof(unitCode) {
    const leaf = leafHash(unitCode);
    return this.tree.getHexProof(leaf);
  }

  verify(unitCode, proof, root) {
    const leaf = leafHash(unitCode);
    return this.tree.verify(proof, leaf, root || this.getRoot());
  }
}

module.exports = {
  leafHash,
  MerkleTreeBuilder,
};
