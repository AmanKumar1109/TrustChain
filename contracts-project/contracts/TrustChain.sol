// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TrustChain
 * @notice Core platform contract for TrustChain product authentication and loyalty.
 *
 * =================================================================================
 * DESIGN RULE & ARCHITECTURAL PATTERN:
 * =================================================================================
 * All state-changing functions on this contract are invoked by an authorized
 * backend relayer wallet possessing `RELAYER_ROLE` on behalf of platform users
 * (e.g., brands, consumers, and verifiers).
 *
 * Because `msg.sender` in all state-changing transactions represents the relayer,
 * each state-changing function explicitly receives the acting user's address
 * (e.g., `actingUser`, `brandAddress`) as a parameter.
 *
 * State modifications, event emissions, and authorization logic are mapped to these
 * acting addresses rather than `msg.sender`. All such functions are guarded with
 * `onlyRole(RELAYER_ROLE)` and standard security modifiers.
 * =================================================================================
 */
contract TrustChain is AccessControl, Pausable, ReentrancyGuard {
    /// @notice Role identifier for authorized backend relayer wallets
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    /// @dev Custom errors
    error InvalidAddress();

    /// @dev Events
    event RelayerRoleAssigned(address indexed relayer);
    event RelayerRoleRevoked(address indexed relayer);
    event UserActivityRelayed(address indexed actingUser, string activityType, uint256 timestamp);

    /**
     * @notice Initializes TrustChain with default admin and initial relayer.
     * @param admin Address to receive DEFAULT_ADMIN_ROLE.
     * @param initialRelayer Address to receive RELAYER_ROLE.
     */
    constructor(address admin, address initialRelayer) {
        if (admin == address(0) || initialRelayer == address(0)) {
            revert InvalidAddress();
        }

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RELAYER_ROLE, initialRelayer);

        emit RelayerRoleAssigned(initialRelayer);
    }

    /**
     * @notice Checks if an address is an authorized relayer.
     * @param account Address to verify.
     * @return bool True if the account has RELAYER_ROLE.
     */
    function isRelayer(address account) external view returns (bool) {
        return hasRole(RELAYER_ROLE, account);
    }

    /**
     * @notice Pauses contract state modifications in emergency scenarios.
     * @dev Only callable by an account with DEFAULT_ADMIN_ROLE.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Resumes contract operations.
     * @dev Only callable by an account with DEFAULT_ADMIN_ROLE.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Relays an action on behalf of an acting user.
     * @dev DESIGN RULE: Called exclusively by backend relayer wallet (`RELAYER_ROLE`)
     * on behalf of `actingUser`. The state and events reflect `actingUser`.
     * @param actingUser The user or brand on whose behalf the transaction is relayed.
     * @param activityType Label identifying the action (e.g., "USER_REGISTERED", "QR_SCANNED").
     */
    function relayUserActivity(
        address actingUser,
        string calldata activityType
    ) external onlyRole(RELAYER_ROLE) whenNotPaused nonReentrant {
        if (actingUser == address(0)) {
            revert InvalidAddress();
        }

        emit UserActivityRelayed(actingUser, activityType, block.timestamp);
    }
}
