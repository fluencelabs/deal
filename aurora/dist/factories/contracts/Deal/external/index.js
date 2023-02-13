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
exports.WorkersManager__factory = exports.WithdrawManager__factory = exports.PaymentByEpoch__factory = exports.DealConfig__factory = exports.interfaces = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.interfaces = __importStar(require("./interfaces"));
var DealConfig__factory_1 = require("./DealConfig__factory");
Object.defineProperty(exports, "DealConfig__factory", { enumerable: true, get: function () { return DealConfig__factory_1.DealConfig__factory; } });
var PaymentByEpoch__factory_1 = require("./PaymentByEpoch__factory");
Object.defineProperty(exports, "PaymentByEpoch__factory", { enumerable: true, get: function () { return PaymentByEpoch__factory_1.PaymentByEpoch__factory; } });
var WithdrawManager__factory_1 = require("./WithdrawManager__factory");
Object.defineProperty(exports, "WithdrawManager__factory", { enumerable: true, get: function () { return WithdrawManager__factory_1.WithdrawManager__factory; } });
var WorkersManager__factory_1 = require("./WorkersManager__factory");
Object.defineProperty(exports, "WorkersManager__factory", { enumerable: true, get: function () { return WorkersManager__factory_1.WorkersManager__factory; } });
