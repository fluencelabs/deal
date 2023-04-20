"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
class Trie {
    constructor(root) {
        this.nodes = {};
        this.root = root.value;
        this.nodes[root.value] = {
            ...root,
            left: 0,
            right: 0,
            parent: 0,
        };
    }
    addLeft(parent, newNode) {
        this.nodes[parent].left = newNode.value;
        this.nodes[newNode.value] = {
            ...newNode,
            left: 0,
            right: 0,
            parent: parent,
        };
        return newNode.value;
    }
    addRight(parent, newNode) {
        this.nodes[parent].right = newNode.value;
        this.nodes[newNode.value] = {
            ...newNode,
            left: 0,
            right: 0,
            parent: parent,
        };
        return newNode.value;
    }
}
const verifyTrie = async (avlMock, trie) => {
    const rootValue = await avlMock.getRoot();
    (0, chai_1.expect)(rootValue).to.equal(trie.root);
    const rootExpected = trie.nodes[trie.root];
    await verifyNode(avlMock, trie, rootExpected);
};
const verifyNode = async (avlMock, trie, node) => {
    const nodeChain = await avlMock.getNode(node.value);
    console.log(nodeChain.value);
    (0, chai_1.expect)(nodeChain.value).to.equal(node.value);
    (0, chai_1.expect)(nodeChain.parent).to.equal(node.parent);
    (0, chai_1.expect)(nodeChain.balance).to.equal(node.balance);
    (0, chai_1.expect)(nodeChain.left).to.equal(node.left);
    (0, chai_1.expect)(nodeChain.right).to.equal(node.right);
    if (node.left !== 0) {
        await verifyNode(avlMock, trie, trie.nodes[node.left]);
    }
    if (node.right !== 0) {
        await verifyNode(avlMock, trie, trie.nodes[node.left]);
    }
};
describe("AVLTree", () => {
    let avlMock;
    beforeEach(async () => {
        const factoryAVLMock = await hardhat_1.ethers.getContractFactory("AVLMock");
        avlMock = await factoryAVLMock.deploy();
        await avlMock.deployed();
    });
    it("test trie with root", async () => {
        const trie = new Trie({
            balance: 0,
            value: 1000,
        });
        await (await avlMock.insert(trie.root)).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie #1", async () => {
        const trie = new Trie({
            balance: 1,
            value: 1000,
        });
        await (await avlMock.insert(trie.root)).wait();
        await (await avlMock.insert(trie.addLeft(trie.root, {
            balance: 0,
            value: 999,
        }))).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie #2", async () => {
        const trie = new Trie({
            balance: 0,
            value: 1000,
        });
        await (await avlMock.insert(trie.root)).wait();
        await (await avlMock.insert(trie.addLeft(trie.root, {
            balance: 0,
            value: 999,
        }))).wait();
        await (await avlMock.insert(trie.addRight(trie.root, {
            balance: 0,
            value: 1001,
        }))).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie right #3", async () => {
        const trie = new Trie({
            balance: -1,
            value: 1000,
        });
        await (await avlMock.insert(trie.root)).wait();
        const left = trie.addLeft(trie.root, {
            balance: 0,
            value: 999,
        });
        await (await avlMock.insert(left)).wait();
        const right = trie.addRight(trie.root, {
            balance: 0,
            value: 1001,
        });
        await (await avlMock.insert(right)).wait();
        const rightRight = trie.addRight(right, {
            balance: 0,
            value: 1002,
        });
        await (await avlMock.insert(rightRight)).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie #4.1 (small rotate left)", async () => {
        const trie = new Trie({
            balance: -1,
            value: 1000,
        });
        const left = trie.addLeft(trie.root, {
            balance: 0,
            value: 999,
        });
        const rightRight = trie.addRight(trie.root, {
            balance: 0,
            value: 1002,
        });
        const right = trie.addLeft(rightRight, {
            balance: 0,
            value: 1001,
        });
        const rightRightRight = trie.addRight(rightRight, {
            balance: 0,
            value: 1003,
        });
        await (await avlMock.insert(trie.root)).wait();
        await (await avlMock.insert(left)).wait();
        await (await avlMock.insert(right)).wait();
        await (await avlMock.insert(rightRight)).wait();
        await (await avlMock.insert(rightRightRight)).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie #4.2 (small rotate left with root)", async () => {
        const right = 1001;
        const trie = new Trie({
            balance: 0,
            value: right,
        });
        const oldRoot = trie.addLeft(trie.root, {
            balance: 0,
            value: 1000,
        });
        const rightRight = trie.addRight(trie.root, {
            balance: 0,
            value: 1002,
        });
        await (await avlMock.insert(oldRoot)).wait();
        await (await avlMock.insert(right)).wait();
        await (await avlMock.insert(rightRight)).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie left #5", async () => {
        const trie = new Trie({
            balance: 1,
            value: 1000,
        });
        await (await avlMock.insert(trie.root)).wait();
        const left = trie.addLeft(trie.root, {
            balance: 1,
            value: 999,
        });
        await (await avlMock.insert(left)).wait();
        const right = trie.addRight(trie.root, {
            balance: 0,
            value: 1001,
        });
        await (await avlMock.insert(right)).wait();
        const leftLeft = trie.addLeft(left, {
            balance: 0,
            value: 998,
        });
        await (await avlMock.insert(leftLeft)).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie #6.1 (small rotate right)", async () => {
        const trie = new Trie({
            balance: 1,
            value: 1000,
        });
        const right = trie.addRight(trie.root, {
            balance: 0,
            value: 1001,
        });
        const leftLeft = trie.addLeft(trie.root, {
            balance: 0,
            value: 998,
        });
        const leftLeftLeft = trie.addLeft(leftLeft, {
            balance: 0,
            value: 997,
        });
        const left = trie.addRight(leftLeft, {
            balance: 0,
            value: 999,
        });
        await (await avlMock.insert(trie.root)).wait();
        await (await avlMock.insert(right)).wait();
        await (await avlMock.insert(left)).wait();
        await (await avlMock.insert(leftLeft)).wait();
        await (await avlMock.insert(leftLeftLeft)).wait();
        await verifyTrie(avlMock, trie);
    });
    it("test trie #6.2 (small rotate right with root)", async () => {
        const left = 999;
        const trie = new Trie({
            balance: 0,
            value: left,
        });
        const oldRoot = trie.addRight(trie.root, {
            balance: 0,
            value: 1000,
        });
        const leftLeft = trie.addLeft(trie.root, {
            balance: 0,
            value: 998,
        });
        await (await avlMock.insert(oldRoot)).wait();
        await (await avlMock.insert(left)).wait();
        await (await avlMock.insert(leftLeft)).wait();
        await verifyTrie(avlMock, trie);
    });
});
