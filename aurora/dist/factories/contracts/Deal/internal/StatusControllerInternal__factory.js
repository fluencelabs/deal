"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusControllerInternal__factory = void 0;
const ethers_1 = require("ethers");
const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "enum IStatusControllerInternal.Status",
                name: "newStatus",
                type: "uint8",
            },
        ],
        name: "StatusChanged",
        type: "event",
    },
];
class StatusControllerInternal__factory {
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.StatusControllerInternal__factory = StatusControllerInternal__factory;
StatusControllerInternal__factory.abi = _abi;
