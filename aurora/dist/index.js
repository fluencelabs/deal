"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealFactory__factory = exports.TestERC20__factory = exports.DeveloperFaucet__factory = exports.WithdrawManager__factory = exports.ProviderManager__factory = exports.PaymentManager__factory = exports.IWithdrawCollateralManager__factory = exports.IProviderManager__factory = exports.IPaymentManager__factory = exports.IDealConfig__factory = exports.DealConfig__factory = exports.Deal__factory = exports.EpochManager__factory = exports.CoreState__factory = exports.Core__factory = exports.AquaProxy__factory = exports.Utils__factory = exports.Codec__factory = exports.AuroraSdk__factory = exports.IERC20__factory = exports.IERC20Metadata__factory = exports.IERC20Permit__factory = exports.ERC20__factory = exports.UUPSUpgradeable__factory = exports.Proxy__factory = exports.ERC1967Upgrade__factory = exports.ERC1967Proxy__factory = exports.IBeacon__factory = exports.IERC1822Proxiable__factory = exports.Ownable__factory = exports.ContextUpgradeable__factory = exports.Initializable__factory = exports.OwnableUpgradeable__factory = exports.factories = void 0;
exports.factories = __importStar(require("./factories"));
var OwnableUpgradeable__factory_1 = require("./factories/@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable__factory");
Object.defineProperty(exports, "OwnableUpgradeable__factory", { enumerable: true, get: function () { return OwnableUpgradeable__factory_1.OwnableUpgradeable__factory; } });
var Initializable__factory_1 = require("./factories/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable__factory");
Object.defineProperty(exports, "Initializable__factory", { enumerable: true, get: function () { return Initializable__factory_1.Initializable__factory; } });
var ContextUpgradeable__factory_1 = require("./factories/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable__factory");
Object.defineProperty(exports, "ContextUpgradeable__factory", { enumerable: true, get: function () { return ContextUpgradeable__factory_1.ContextUpgradeable__factory; } });
var Ownable__factory_1 = require("./factories/@openzeppelin/contracts/access/Ownable__factory");
Object.defineProperty(exports, "Ownable__factory", { enumerable: true, get: function () { return Ownable__factory_1.Ownable__factory; } });
var IERC1822Proxiable__factory_1 = require("./factories/@openzeppelin/contracts/interfaces/draft-IERC1822.sol/IERC1822Proxiable__factory");
Object.defineProperty(exports, "IERC1822Proxiable__factory", { enumerable: true, get: function () { return IERC1822Proxiable__factory_1.IERC1822Proxiable__factory; } });
var IBeacon__factory_1 = require("./factories/@openzeppelin/contracts/proxy/beacon/IBeacon__factory");
Object.defineProperty(exports, "IBeacon__factory", { enumerable: true, get: function () { return IBeacon__factory_1.IBeacon__factory; } });
var ERC1967Proxy__factory_1 = require("./factories/@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy__factory");
Object.defineProperty(exports, "ERC1967Proxy__factory", { enumerable: true, get: function () { return ERC1967Proxy__factory_1.ERC1967Proxy__factory; } });
var ERC1967Upgrade__factory_1 = require("./factories/@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade__factory");
Object.defineProperty(exports, "ERC1967Upgrade__factory", { enumerable: true, get: function () { return ERC1967Upgrade__factory_1.ERC1967Upgrade__factory; } });
var Proxy__factory_1 = require("./factories/@openzeppelin/contracts/proxy/Proxy__factory");
Object.defineProperty(exports, "Proxy__factory", { enumerable: true, get: function () { return Proxy__factory_1.Proxy__factory; } });
var UUPSUpgradeable__factory_1 = require("./factories/@openzeppelin/contracts/proxy/utils/UUPSUpgradeable__factory");
Object.defineProperty(exports, "UUPSUpgradeable__factory", { enumerable: true, get: function () { return UUPSUpgradeable__factory_1.UUPSUpgradeable__factory; } });
var ERC20__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/ERC20__factory");
Object.defineProperty(exports, "ERC20__factory", { enumerable: true, get: function () { return ERC20__factory_1.ERC20__factory; } });
var IERC20Permit__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol/IERC20Permit__factory");
Object.defineProperty(exports, "IERC20Permit__factory", { enumerable: true, get: function () { return IERC20Permit__factory_1.IERC20Permit__factory; } });
var IERC20Metadata__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata__factory");
Object.defineProperty(exports, "IERC20Metadata__factory", { enumerable: true, get: function () { return IERC20Metadata__factory_1.IERC20Metadata__factory; } });
var IERC20__factory_1 = require("./factories/@openzeppelin/contracts/token/ERC20/IERC20__factory");
Object.defineProperty(exports, "IERC20__factory", { enumerable: true, get: function () { return IERC20__factory_1.IERC20__factory; } });
var AuroraSdk__factory_1 = require("./factories/contracts/AuroraSDK/AuroraSdk__factory");
Object.defineProperty(exports, "AuroraSdk__factory", { enumerable: true, get: function () { return AuroraSdk__factory_1.AuroraSdk__factory; } });
var Codec__factory_1 = require("./factories/contracts/AuroraSDK/Codec__factory");
Object.defineProperty(exports, "Codec__factory", { enumerable: true, get: function () { return Codec__factory_1.Codec__factory; } });
var Utils__factory_1 = require("./factories/contracts/AuroraSDK/Utils__factory");
Object.defineProperty(exports, "Utils__factory", { enumerable: true, get: function () { return Utils__factory_1.Utils__factory; } });
var AquaProxy__factory_1 = require("./factories/contracts/Core/AquaProxy__factory");
Object.defineProperty(exports, "AquaProxy__factory", { enumerable: true, get: function () { return AquaProxy__factory_1.AquaProxy__factory; } });
var Core__factory_1 = require("./factories/contracts/Core/Core.sol/Core__factory");
Object.defineProperty(exports, "Core__factory", { enumerable: true, get: function () { return Core__factory_1.Core__factory; } });
var CoreState__factory_1 = require("./factories/contracts/Core/Core.sol/CoreState__factory");
Object.defineProperty(exports, "CoreState__factory", { enumerable: true, get: function () { return CoreState__factory_1.CoreState__factory; } });
var EpochManager__factory_1 = require("./factories/contracts/Core/EpochManager__factory");
Object.defineProperty(exports, "EpochManager__factory", { enumerable: true, get: function () { return EpochManager__factory_1.EpochManager__factory; } });
var Deal__factory_1 = require("./factories/contracts/Deal/Deal__factory");
Object.defineProperty(exports, "Deal__factory", { enumerable: true, get: function () { return Deal__factory_1.Deal__factory; } });
var DealConfig__factory_1 = require("./factories/contracts/Deal/external/DealConfig__factory");
Object.defineProperty(exports, "DealConfig__factory", { enumerable: true, get: function () { return DealConfig__factory_1.DealConfig__factory; } });
var IDealConfig__factory_1 = require("./factories/contracts/Deal/external/interfaces/IDealConfig__factory");
Object.defineProperty(exports, "IDealConfig__factory", { enumerable: true, get: function () { return IDealConfig__factory_1.IDealConfig__factory; } });
var IPaymentManager__factory_1 = require("./factories/contracts/Deal/external/interfaces/IPaymentManager__factory");
Object.defineProperty(exports, "IPaymentManager__factory", { enumerable: true, get: function () { return IPaymentManager__factory_1.IPaymentManager__factory; } });
var IProviderManager__factory_1 = require("./factories/contracts/Deal/external/interfaces/IProviderManager__factory");
Object.defineProperty(exports, "IProviderManager__factory", { enumerable: true, get: function () { return IProviderManager__factory_1.IProviderManager__factory; } });
var IWithdrawCollateralManager__factory_1 = require("./factories/contracts/Deal/external/interfaces/IWithdrawCollateralManager__factory");
Object.defineProperty(exports, "IWithdrawCollateralManager__factory", { enumerable: true, get: function () { return IWithdrawCollateralManager__factory_1.IWithdrawCollateralManager__factory; } });
var PaymentManager__factory_1 = require("./factories/contracts/Deal/external/PaymentManager__factory");
Object.defineProperty(exports, "PaymentManager__factory", { enumerable: true, get: function () { return PaymentManager__factory_1.PaymentManager__factory; } });
var ProviderManager__factory_1 = require("./factories/contracts/Deal/external/ProviderManager__factory");
Object.defineProperty(exports, "ProviderManager__factory", { enumerable: true, get: function () { return ProviderManager__factory_1.ProviderManager__factory; } });
var WithdrawManager__factory_1 = require("./factories/contracts/Deal/external/WithdrawManager__factory");
Object.defineProperty(exports, "WithdrawManager__factory", { enumerable: true, get: function () { return WithdrawManager__factory_1.WithdrawManager__factory; } });
var DeveloperFaucet__factory_1 = require("./factories/contracts/Dev/DeveloperFaucet__factory");
Object.defineProperty(exports, "DeveloperFaucet__factory", { enumerable: true, get: function () { return DeveloperFaucet__factory_1.DeveloperFaucet__factory; } });
var TestERC20__factory_1 = require("./factories/contracts/Dev/TestERC20__factory");
Object.defineProperty(exports, "TestERC20__factory", { enumerable: true, get: function () { return TestERC20__factory_1.TestERC20__factory; } });
var DealFactory__factory_1 = require("./factories/contracts/Factory/DealFactory__factory");
Object.defineProperty(exports, "DealFactory__factory", { enumerable: true, get: function () { return DealFactory__factory_1.DealFactory__factory; } });
