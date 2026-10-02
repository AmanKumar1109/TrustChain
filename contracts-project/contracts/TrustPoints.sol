// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title TrustPoints (TPTS)
 * @notice ERC-20 loyalty points token for the TrustChain product authentication platform.
 *
 * =================================================================================
 * DESIGN RULE & ARCHITECTURAL PATTERN:
 * =================================================================================
 * All state-changing functions in this contract are called by authorized backend relayer
 * wallets (possessing RELAYER_ROLE or MINTER_ROLE) on behalf of platform users.
 *
 * Because end-users do not pay gas or directly sign on-chain transactions, state-changing
 * functions explicitly receive the target/acting user addresses as arguments:
 *   - `mintReward`: takes `to` (the rewarded user) and mints tokens to them.
 *   - `redeem`: takes `from` (the redeeming user) and directly burns tokens from their
 *     balance on behalf of the user when redeeming offers, without requiring an on-chain
 *     ERC-20 approval step from the user.
 *
 * Relayer access is strictly enforced via OpenZeppelin's `onlyRole(RELAYER_ROLE)` and
 * `onlyRole(MINTER_ROLE)` access control modifiers.
 * =================================================================================
 */
contract TrustPoints is ERC20, AccessControl {
    /// @notice Role for minting reward tokens to users
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Role for backend relayer executing user redemptions
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    /// @dev Custom errors for input validation
    error InvalidAddress();
    error InvalidAmount();

    /// @notice Emitted when a reward is minted for a user
    event RewardMinted(address indexed to, uint256 amount, string reason);

    /// @notice Emitted when a user redeems tokens for an offer via relayer
    event OfferRedeemed(address indexed from, uint256 amount, string offerId);

    /**
     * @notice Initializes TrustPoints (TPTS) with designated admin, minter, and relayer accounts.
     * @param admin Account granted DEFAULT_ADMIN_ROLE.
     * @param initialMinter Account granted MINTER_ROLE.
     * @param initialRelayer Account granted RELAYER_ROLE.
     */
    constructor(
        address admin,
        address initialMinter,
        address initialRelayer
    ) ERC20("TrustPoints", "TPTS") {
        if (admin == address(0) || initialMinter == address(0) || initialRelayer == address(0)) {
            revert InvalidAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, initialMinter);
        _grantRole(RELAYER_ROLE, initialRelayer);
    }

    /**
     * @notice Mints reward tokens to a user upon verified actions (e.g. authenticating a product).
     * @dev Called by backend relayer with MINTER_ROLE on behalf of the user.
     * @param to The recipient address receiving the loyalty points.
     * @param amount The quantity of tokens to mint.
     * @param reason Description or context for the reward (e.g., "AUTHENTICATED_PRODUCT_SCAN").
     */
    function mintReward(
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyRole(MINTER_ROLE) {
        if (to == address(0)) {
            revert InvalidAddress();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }

        _mint(to, amount);
        emit RewardMinted(to, amount, reason);
    }

    /**
     * @notice Redeems loyalty tokens for a specific offer, burning the tokens.
     * @dev DESIGN RULE: Called exclusively by backend relayer wallet (`RELAYER_ROLE`)
     * on behalf of `from`. This burns tokens directly from `from` without requiring
     * a separate on-chain approval from the end user.
     * @param from The address of the user redeeming their points.
     * @param amount The quantity of tokens to redeem and burn.
     * @param offerId Identifier of the offer or perk being redeemed (e.g., "DISCOUNT_10_OFF").
     */
    function redeem(
        address from,
        uint256 amount,
        string calldata offerId
    ) external onlyRole(RELAYER_ROLE) {
        if (from == address(0)) {
            revert InvalidAddress();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }

        _burn(from, amount);
        emit OfferRedeemed(from, amount, offerId);
    }
}
