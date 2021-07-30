// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "../../admin/MetaAdminnable.sol";
import "../../admin/Whitelister.sol";
import "./AirnodeRrpRequester.sol";
import "./interfaces/IRrpBeaconServer.sol";

/// @title The contract that serves beacons using Airnode RRP
/// @notice A beacon is a live data point associated with a template ID. This
/// is suitable where the more recent data point is always more favorable,
/// e.g., in the context of an asset price data feed. Another definition of
/// beacons are one-Airnode data feeds that can be used individually or
/// combined to build decentralized data feeds.
/// @dev This contract casts the reported data point to `int224`. If this is
/// a problem (because the reported data may not fit into 224 bits or it is of
/// a completely different type such as `bytes32`), do not use this contract
/// and implement a customized version instead.
contract RrpBeaconServer is
    MetaAdminnable,
    Whitelister,
    AirnodeRrpRequester,
    IRrpBeaconServer
{
    struct Beacon {
        int224 value;
        uint32 timestamp;
    }

    // Constants to check typecasting sanity
    int256 private constant MAX_INT224 = 2**223 - 1;
    int256 private constant MIN_INT224 = -2**223;
    uint256 private constant MAX_UINT32 = 2**32 - 1;

    mapping(bytes32 => Beacon) private templateIdToBeacon;
    mapping(bytes32 => bytes32) private requestIdToTemplateId;

    /// @param airnodeRrp_ Airnode RRP address
    /// @param metaAdmin_ Initial metaAdmin
    constructor(address airnodeRrp_, address metaAdmin_)
        AirnodeRrpRequester(airnodeRrp_)
        MetaAdminnable(metaAdmin_)
    {}

    /// @notice Called to request a beacon to be updated
    /// @dev Anyone can request a beacon to be updated. This is because it is
    /// assumed that a beacon update request is always desirable, and the
    /// requester and sponsor will pay for the gas cost.
    /// The sponsor must sponsor both the caller of this function, and this
    /// very RrpBeaconServer contract for the Airnode to fulfill this request.
    /// The template used here must specify a single point of data of type
    /// `int256` to be returned (because this is what `fulfill()` expects).
    /// @param templateId Template ID of the beacon to be updated
    /// @param sponsor Sponsor whose wallet will be used to fulfill this
    /// request
    /// @param sponsorWallet Sponsor wallet that will be used to fulfill this
    /// request
    function requestBeaconUpdate(
        bytes32 templateId,
        address sponsor,
        address sponsorWallet
    ) external override {
        // Note that AirnodeRrp will also check if the requester has endorsed
        // this RrpBeaconServer in the `makeRequest()` call
        require(
            airnodeRrp.sponsorToRequesterToSponsorshipStatus(
                sponsor,
                msg.sender
            ),
            "Caller not sponsored"
        );
        bytes32 requestId = airnodeRrp.makeTemplateRequest(
            templateId,
            sponsor,
            sponsorWallet,
            address(this),
            this.fulfill.selector,
            ""
        );
        requestIdToTemplateId[requestId] = templateId;
        emit RequestedBeaconUpdate(
            templateId,
            sponsor,
            msg.sender,
            requestId,
            sponsorWallet
        );
    }

    /// @notice Called by AirnodeRrp to fulfill the request
    /// @dev It is assumed that the fulfillment will be made with a single
    /// point of data of type `int256`
    /// @param requestId ID of the request being fulfilled
    /// @param statusCode Status code of the fulfillment
    /// @param data Fulfillment data (a single `int256` encoded as `bytes`)
    function fulfill(
        bytes32 requestId,
        uint256 statusCode,
        bytes calldata data
    ) external override onlyAirnodeRrp {
        bytes32 templateId = requestIdToTemplateId[requestId];
        delete requestIdToTemplateId[requestId];
        if (statusCode == 0) {
            int256 decodedData = abi.decode(data, (int256));
            require(
                decodedData >= MIN_INT224 && decodedData <= MAX_INT224,
                "Value typecasting error"
            );
            require(
                block.timestamp <= MAX_UINT32,
                "Timestamp typecasting error"
            );
            templateIdToBeacon[templateId] = Beacon({
                value: int224(decodedData),
                timestamp: uint32(block.timestamp)
            });
            emit UpdatedBeacon(
                templateId,
                requestId,
                int224(decodedData),
                uint32(block.timestamp)
            );
        } else {
            emit ErroredBeaconUpdate(templateId, requestId, statusCode);
        }
    }

    /// @notice Called to read the beacon
    /// @dev The caller must be whitelisted
    /// @param templateId Template ID whose beacon will be returned
    /// @return value Beacon value
    /// @return timestamp Beacon timestamp
    function readBeacon(bytes32 templateId)
        external
        view
        override
        onlyIfCallerIsWhitelisted(templateId)
        returns (int224 value, uint32 timestamp)
    {
        Beacon storage beacon = templateIdToBeacon[templateId];
        return (beacon.value, beacon.timestamp);
    }

    /// @notice Called to get the rank of an admin for an adminned entity
    /// @dev Explictly specifies the overriding `getRank()` implementation
    /// @param adminnedId ID of the entity being adminned
    /// @param admin Admin address whose rank will be returned
    /// @return Admin rank for the adminned entity
    function getRank(bytes32 adminnedId, address admin)
        public
        view
        virtual
        override(RankedAdminnable, MetaAdminnable, IRankedAdminnable)
        returns (uint256)
    {
        return MetaAdminnable.getRank(adminnedId, admin);
    }
}