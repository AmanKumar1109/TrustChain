const { ethers } = require('ethers');
const { encrypt, decrypt } = require('../utils/crypto');
const config = require('../config/env');

/**
 * Custodial Wallet Service
 * Generates and securely manages custodial Ethereum wallets for consumers, partners, and business users.
 * Private keys are stored AES-encrypted with ENCRYPTION_KEY.
 * The blockchain remains completely invisible to the users.
 */
class WalletService {
  /**
   * Generates a new random Ethereum wallet and encrypts its private key
   * @returns {{ address: string, encryptedPrivateKey: string }}
   */
  createCustodialWallet() {
    const randomWallet = ethers.Wallet.createRandom();
    const encryptedPrivateKey = encrypt(randomWallet.privateKey, config.encryptionKey);

    return {
      address: randomWallet.address,
      encryptedPrivateKey,
    };
  }

  /**
   * Decrypts an encrypted private key and returns an ethers Wallet instance
   * @param {string} encryptedPrivateKey
   * @param {ethers.Provider} [provider]
   * @returns {ethers.Wallet}
   */
  getWallet(encryptedPrivateKey, provider = null) {
    if (!encryptedPrivateKey) {
      throw new Error('Encrypted private key is required to recover custodial wallet');
    }

    const privateKey = decrypt(encryptedPrivateKey, config.encryptionKey);
    return provider ? new ethers.Wallet(privateKey, provider) : new ethers.Wallet(privateKey);
  }
}

module.exports = new WalletService();
