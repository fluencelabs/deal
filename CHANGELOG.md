# Changelog

## [0.4.0](https://github.com/fluencelabs/deal/compare/v0.3.0...v0.4.0) (2024-02-01)


### ⚠ BREAKING CHANGES

* Mv from erc20 to native ([#224](https://github.com/fluencelabs/deal/issues/224))
* integrate CC into matcher [chain-298] ([#217](https://github.com/fluencelabs/deal/issues/217))

### Features

* add description for contracts ([#220](https://github.com/fluencelabs/deal/issues/220)) ([ff7ff3d](https://github.com/fluencelabs/deal/commit/ff7ff3d5f7591b9a2a049f2da2372712be4fcb4b))
* integrate CC into matcher [chain-298] ([#217](https://github.com/fluencelabs/deal/issues/217)) ([6bf3b49](https://github.com/fluencelabs/deal/commit/6bf3b49ba9c6da9569b6cb6d3333f89e5ef6ab3a))
* **tests:** Introduce integration tests package ([#203](https://github.com/fluencelabs/deal/issues/203)) ([16fc4ae](https://github.com/fluencelabs/deal/commit/16fc4aef9450878fd673f57ab1649c59ab330239))


### Bug Fixes

* add beacon proxy ([#228](https://github.com/fluencelabs/deal/issues/228)) ([6efb771](https://github.com/fluencelabs/deal/commit/6efb77149b296549ba891021cc4604357d589578))
* chain 279 cosmetic and more ([#194](https://github.com/fluencelabs/deal/issues/194)) ([7410ee3](https://github.com/fluencelabs/deal/commit/7410ee384e720aa8999e037d666734971f118a2a))
* check approve in createCommitment ([#226](https://github.com/fluencelabs/deal/issues/226)) ([f34f920](https://github.com/fluencelabs/deal/commit/f34f920988cd9bd75e5a51bd1ac1414be5f23c97))
* Mv from erc20 to native ([#224](https://github.com/fluencelabs/deal/issues/224)) ([2503342](https://github.com/fluencelabs/deal/commit/2503342115bdcd636f03cf44c6be21bebbee0656))
* related to chain 279 ([#227](https://github.com/fluencelabs/deal/issues/227)) ([27a7ea7](https://github.com/fluencelabs/deal/commit/27a7ea7744783de6889d0b3fbcb2f5d3b34be60f))

## [0.3.0](https://github.com/fluencelabs/deal/compare/v0.2.22...v0.3.0) (2024-01-23)


### ⚠ BREAKING CHANGES

* Provider metadata ([#213](https://github.com/fluencelabs/deal/issues/213))
* random X integration  ([#204](https://github.com/fluencelabs/deal/issues/204))
* add whitelist [fixes CHAIN-273 CHAIN-274 CHAIN-275] ([#190](https://github.com/fluencelabs/deal/issues/190))
* Deal switching ([#176](https://github.com/fluencelabs/deal/issues/176))
* Add capacity commitment ([#177](https://github.com/fluencelabs/deal/issues/177))
* revert for pagination in graphQL ([#170](https://github.com/fluencelabs/deal/issues/170))
* market offer ([#150](https://github.com/fluencelabs/deal/issues/150))

### Features

* Add capacity commitment ([#177](https://github.com/fluencelabs/deal/issues/177)) ([5051856](https://github.com/fluencelabs/deal/commit/50518565d25a3805972d965ecee16e03dbb5286b))
* add deploy instruction [CHAIN-213] ([#129](https://github.com/fluencelabs/deal/issues/129)) ([a9d2f8f](https://github.com/fluencelabs/deal/commit/a9d2f8f513e7052f1f252af8aaadd3272d3495a1))
* add deploy script with basic auth for stage ([#171](https://github.com/fluencelabs/deal/issues/171)) ([6484227](https://github.com/fluencelabs/deal/commit/6484227a57ad0c49887ad2353a051373017e7c7a))
* add lib for interaction with the deal contract system ([#51](https://github.com/fluencelabs/deal/issues/51)) ([0911822](https://github.com/fluencelabs/deal/commit/0911822d02ea32df0fd0acd94d3421fd9a752e92))
* add multicall ([#211](https://github.com/fluencelabs/deal/issues/211)) ([432601a](https://github.com/fluencelabs/deal/commit/432601a261104f927c5c315461afa3749868115e))
* add networks to client (kras, stage, testnet) ([#55](https://github.com/fluencelabs/deal/issues/55)) ([8e899e6](https://github.com/fluencelabs/deal/commit/8e899e6996273d30b79db99b58a71c71c69e9891))
* add RPC caller [chain 233] ([#165](https://github.com/fluencelabs/deal/issues/165)) ([fc00df4](https://github.com/fluencelabs/deal/commit/fc00df476d6647259f4e882641d95645e62ab383))
* add whitelist [fixes CHAIN-273 CHAIN-274 CHAIN-275] ([#190](https://github.com/fluencelabs/deal/issues/190)) ([a3c67ee](https://github.com/fluencelabs/deal/commit/a3c67eed02c7ae96900ad10d89c3eee092053c9b))
* auto deploy ([#76](https://github.com/fluencelabs/deal/issues/76)) ([de45ca3](https://github.com/fluencelabs/deal/commit/de45ca3c32955c62beae983de68d0d9344f1c5a9))
* Chain 188 use openzeppelin owner in deal ([#119](https://github.com/fluencelabs/deal/issues/119)) ([9ed0589](https://github.com/fluencelabs/deal/commit/9ed058978324e9aeddb297f89ea8755a0094da1d))
* CHAIN-191 Deploy on IPC subnet ([#122](https://github.com/fluencelabs/deal/issues/122)) ([fca6895](https://github.com/fluencelabs/deal/commit/fca68954f6df170c2dae496068a29e4d79d178e4))
* change calculation logic ([1127734](https://github.com/fluencelabs/deal/commit/1127734e5c285e049310d3e7b7df3df47d02d50a))
* convert automatically token values [chain 249] ([#169](https://github.com/fluencelabs/deal/issues/169)) ([3880c4c](https://github.com/fluencelabs/deal/commit/3880c4ce8ae903d6b14223e198d4a3f3957888ad))
* deal lifecycle [#1](https://github.com/fluencelabs/deal/issues/1) ([2bd70cc](https://github.com/fluencelabs/deal/commit/2bd70ccdd8f94dde37c96ae0a942803b86fa83d8))
* Deal switching ([#176](https://github.com/fluencelabs/deal/issues/176)) ([4d81ec4](https://github.com/fluencelabs/deal/commit/4d81ec4c47bbeaa490e64b22ed8cf147dade9a87))
* deploy to filecoin env ([#105](https://github.com/fluencelabs/deal/issues/105)) ([fb55199](https://github.com/fluencelabs/deal/commit/fb55199a98d09705a269bd1a6a975d280d85c034))
* doc with mumbai example [CHAIN-225] ([#155](https://github.com/fluencelabs/deal/issues/155)) ([8d45f3c](https://github.com/fluencelabs/deal/commit/8d45f3c03e707a0ecea0ed1789fb897f1fc2392a))
* integrate deal-switching into offchain matcher [CHAIN-269] ([#192](https://github.com/fluencelabs/deal/issues/192)) ([359528a](https://github.com/fluencelabs/deal/commit/359528a5803f78920777dd9b953579807aab5ee6))
* market offer ([#150](https://github.com/fluencelabs/deal/issues/150)) ([c1bfb46](https://github.com/fluencelabs/deal/commit/c1bfb4615c44805e5d56a3a83623b4e38d433705))
* paginator in graphql [chain-238] ([#163](https://github.com/fluencelabs/deal/issues/163)) ([12dcce7](https://github.com/fluencelabs/deal/commit/12dcce7c44e224cd3c5e33d53fa0192138b1d589))
* Provider metadata ([#213](https://github.com/fluencelabs/deal/issues/213)) ([738af3d](https://github.com/fluencelabs/deal/commit/738af3d867083a9f40d40328d06777618fe18433))
* random X integration  ([#204](https://github.com/fluencelabs/deal/issues/204)) ([18ad79e](https://github.com/fluencelabs/deal/commit/18ad79e4e4b7ad24cd2dcf03ef9ce4c88d5243f0))
* resolve search fields [chain 237] ([#172](https://github.com/fluencelabs/deal/issues/172)) ([ec4180b](https://github.com/fluencelabs/deal/commit/ec4180bfe2fe1ebf3178960ca3f18337fa67af4f))
* subnets update ([#83](https://github.com/fluencelabs/deal/issues/83)) ([39b5700](https://github.com/fluencelabs/deal/commit/39b5700e0774d9415656eb56bad4dbb06c6e9509))
* update deployments ([459175f](https://github.com/fluencelabs/deal/commit/459175f8472375fe33097f9767b7d427dbc5765b))
* whitelist & blacklist ([#98](https://github.com/fluencelabs/deal/issues/98)) ([c6d9589](https://github.com/fluencelabs/deal/commit/c6d9589e1fda42ce3b73461f1704235a6c4fefa0))


### Bug Fixes

* add kras deployment ([11b6741](https://github.com/fluencelabs/deal/commit/11b6741397f370f325425c877f1606f88add7079))
* add multicall deploy on mumbai ([#173](https://github.com/fluencelabs/deal/issues/173)) ([f3a9d8a](https://github.com/fluencelabs/deal/commit/f3a9d8a88af41ee1f8e8ffb789e2c98ec80d31a8))
* add verify in deploy ([f266365](https://github.com/fluencelabs/deal/commit/f26636559402f5f2c6c6d277c7ccfe569744b2d5))
* add volume to docker-compose and notes ([#164](https://github.com/fluencelabs/deal/issues/164)) ([e210b6e](https://github.com/fluencelabs/deal/commit/e210b6efed207ce923ffe0d5b0cb08f17169904e))
* addresses ([#62](https://github.com/fluencelabs/deal/issues/62)) ([63a97b5](https://github.com/fluencelabs/deal/commit/63a97b5f9dac8d3cad38a2155cb6c776b8679f83))
* build ([#88](https://github.com/fluencelabs/deal/issues/88)) ([7bab4f7](https://github.com/fluencelabs/deal/commit/7bab4f76b45748d84e523152f477e8f3e9af7f38))
* ci-uses-capacity-in-cli ([#200](https://github.com/fluencelabs/deal/issues/200)) ([4b53776](https://github.com/fluencelabs/deal/commit/4b53776ccc93ecd61f759586758dd5d2e1de0602))
* client ([5f9b551](https://github.com/fluencelabs/deal/commit/5f9b551ddbf060cab32e0602b6d19f15258a0069))
* deal whitelist bug ([#193](https://github.com/fluencelabs/deal/issues/193)) ([b9fc3a3](https://github.com/fluencelabs/deal/commit/b9fc3a383c7be26439de9f8a605328825cdefc5c))
* deploy ([40aee38](https://github.com/fluencelabs/deal/commit/40aee38e8a231804d807ba6f20e4a0cf598745d7))
* deploy configs ([332c894](https://github.com/fluencelabs/deal/commit/332c894dfafb684e48c901e990e03925c8625494))
* **deps:** update dependency @graphprotocol/graph-cli to v0.67.0 ([#201](https://github.com/fluencelabs/deal/issues/201)) ([d42e78c](https://github.com/fluencelabs/deal/commit/d42e78c03baf64fb7a9e380814d102c5a8236d29))
* **deps:** update dependency @graphprotocol/graph-cli to v0.67.1 ([#205](https://github.com/fluencelabs/deal/issues/205)) ([ff15f28](https://github.com/fluencelabs/deal/commit/ff15f28b948bb8c559d68021877e4e92b91d4f58))
* fix bugs and update cp peers logic ([#87](https://github.com/fluencelabs/deal/issues/87)) ([56f5141](https://github.com/fluencelabs/deal/commit/56f5141bc95826349e267d3f2d6982aa9394152a))
* fix phassphrase ([a656a42](https://github.com/fluencelabs/deal/commit/a656a426a9c4b432f41b59041b392f81bc922485))
* fix tests and deploy ([#90](https://github.com/fluencelabs/deal/issues/90)) ([0c9397b](https://github.com/fluencelabs/deal/commit/0c9397b34e3c5cc21a1394cae18f4898974e2e8d))
* fix the matching event, migrate cid from string to struct, fix tests ([#60](https://github.com/fluencelabs/deal/issues/60)) ([f2e87a8](https://github.com/fluencelabs/deal/commit/f2e87a8cf711e90266c760985d1e4eac3be3e9ce))
* ide typings ([#123](https://github.com/fluencelabs/deal/issues/123)) ([c5bd70f](https://github.com/fluencelabs/deal/commit/c5bd70f244d59e27f1c64efff33a2ab0b1a84226))
* merge ([#92](https://github.com/fluencelabs/deal/issues/92)) ([63aa080](https://github.com/fluencelabs/deal/commit/63aa0809bb03d036fc4e64bfac0b923f84146f1d))
* minor fixes ([#207](https://github.com/fluencelabs/deal/issues/207)) ([d70a1f5](https://github.com/fluencelabs/deal/commit/d70a1f5e99799c0f5d4a6e0e53383dbb111a295a))
* redeploy contracts ([3430d8b](https://github.com/fluencelabs/deal/commit/3430d8bb6d8fba4e15abb5b974eb2092e0e4dd4e))
* remove peer fix ([8cff584](https://github.com/fluencelabs/deal/commit/8cff5843899fa12e597263b36708b1c5bb128a2f))
* resolve CHAIN-247 ([#154](https://github.com/fluencelabs/deal/issues/154)) ([eb934e6](https://github.com/fluencelabs/deal/commit/eb934e610fc2396216685c88129b4d8a0c1cc322))
* revert for pagination in graphQL ([#170](https://github.com/fluencelabs/deal/issues/170)) ([f7712fa](https://github.com/fluencelabs/deal/commit/f7712fa04c29d7a92a1b8b421a562fdaf0cb24ad))
* revert txconfig ([968b3b2](https://github.com/fluencelabs/deal/commit/968b3b2d05232bf6d4cce7650b08216033f12790))
* update cid ([b368cf0](https://github.com/fluencelabs/deal/commit/b368cf0695001068635c897b153999c2b506023b))
* update deployment for mumbai ([#84](https://github.com/fluencelabs/deal/issues/84)) ([2a331a5](https://github.com/fluencelabs/deal/commit/2a331a5e863fa521fca705699fb51f92a5056ac0))
* Update deployment v3 ([#214](https://github.com/fluencelabs/deal/issues/214)) ([9f1a180](https://github.com/fluencelabs/deal/commit/9f1a180dc82939505ead70f7c62b472c1e7fb775))
* update deployments ([6b50ff6](https://github.com/fluencelabs/deal/commit/6b50ff68c951f16968b5762b151fc2a46803f526))
* update subgraph configs ([#208](https://github.com/fluencelabs/deal/issues/208)) ([f373529](https://github.com/fluencelabs/deal/commit/f373529a935e8d442e74c5fe5e689fa0cec6b52d))
* version in pkg ([0bfacc6](https://github.com/fluencelabs/deal/commit/0bfacc686c1eeab6b578ded014ce71c43e93e42e))

## [0.2.22](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.21...deal-aurora-v0.2.22) (2023-11-17)


### Bug Fixes

* redeploy contracts ([3430d8b](https://github.com/fluencelabs/deal/commit/3430d8bb6d8fba4e15abb5b974eb2092e0e4dd4e))

## [0.2.21](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.20...deal-aurora-v0.2.21) (2023-11-10)


### Features

* add deploy instruction [CHAIN-213] ([#129](https://github.com/fluencelabs/deal/issues/129)) ([a9d2f8f](https://github.com/fluencelabs/deal/commit/a9d2f8f513e7052f1f252af8aaadd3272d3495a1))

## [0.2.20](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.19...deal-aurora-v0.2.20) (2023-11-06)


### Bug Fixes

* revert txconfig ([968b3b2](https://github.com/fluencelabs/deal/commit/968b3b2d05232bf6d4cce7650b08216033f12790))

## [0.2.19](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.18...deal-aurora-v0.2.19) (2023-11-06)


### Features

* CHAIN-191 Deploy on IPC subnet ([#122](https://github.com/fluencelabs/deal/issues/122)) ([fca6895](https://github.com/fluencelabs/deal/commit/fca68954f6df170c2dae496068a29e4d79d178e4))
* update deployments ([459175f](https://github.com/fluencelabs/deal/commit/459175f8472375fe33097f9767b7d427dbc5765b))


### Bug Fixes

* ide typings ([#123](https://github.com/fluencelabs/deal/issues/123)) ([c5bd70f](https://github.com/fluencelabs/deal/commit/c5bd70f244d59e27f1c64efff33a2ab0b1a84226))

## [0.2.18](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.17...deal-aurora-v0.2.18) (2023-10-26)


### Bug Fixes

* client ([5f9b551](https://github.com/fluencelabs/deal/commit/5f9b551ddbf060cab32e0602b6d19f15258a0069))

## [0.2.17](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.16...deal-aurora-v0.2.17) (2023-10-24)


### Bug Fixes

* version in pkg ([0bfacc6](https://github.com/fluencelabs/deal/commit/0bfacc686c1eeab6b578ded014ce71c43e93e42e))

## [0.2.15](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.14...deal-aurora-v0.2.15) (2023-09-26)


### Bug Fixes

* add kras deployment ([11b6741](https://github.com/fluencelabs/deal/commit/11b6741397f370f325425c877f1606f88add7079))
* update deployments ([6b50ff6](https://github.com/fluencelabs/deal/commit/6b50ff68c951f16968b5762b151fc2a46803f526))

## [0.2.14](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.13...deal-aurora-v0.2.14) (2023-09-19)


### Features

* deploy to filecoin env ([#105](https://github.com/fluencelabs/deal/issues/105)) ([fb55199](https://github.com/fluencelabs/deal/commit/fb55199a98d09705a269bd1a6a975d280d85c034))

## [0.2.13](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.14...deal-aurora-v0.2.13) (2023-09-19)

### Features

-   add lib for interaction with the deal contract system ([#51](https://github.com/fluencelabs/deal/issues/51)) ([0911822](https://github.com/fluencelabs/deal/commit/0911822d02ea32df0fd0acd94d3421fd9a752e92))
-   add networks to client (kras, stage, testnet) ([#55](https://github.com/fluencelabs/deal/issues/55)) ([8e899e6](https://github.com/fluencelabs/deal/commit/8e899e6996273d30b79db99b58a71c71c69e9891))
-   auto deploy ([#76](https://github.com/fluencelabs/deal/issues/76)) ([de45ca3](https://github.com/fluencelabs/deal/commit/de45ca3c32955c62beae983de68d0d9344f1c5a9))
-   deploy to filecoin env ([#105](https://github.com/fluencelabs/deal/issues/105)) ([fb55199](https://github.com/fluencelabs/deal/commit/fb55199a98d09705a269bd1a6a975d280d85c034))
-   subnets update ([#83](https://github.com/fluencelabs/deal/issues/83)) ([39b5700](https://github.com/fluencelabs/deal/commit/39b5700e0774d9415656eb56bad4dbb06c6e9509))
-   whitelist & blacklist ([#98](https://github.com/fluencelabs/deal/issues/98)) ([c6d9589](https://github.com/fluencelabs/deal/commit/c6d9589e1fda42ce3b73461f1704235a6c4fefa0))

### Bug Fixes

-   add verify in deploy ([f266365](https://github.com/fluencelabs/deal/commit/f26636559402f5f2c6c6d277c7ccfe569744b2d5))
-   addresses ([#62](https://github.com/fluencelabs/deal/issues/62)) ([63a97b5](https://github.com/fluencelabs/deal/commit/63a97b5f9dac8d3cad38a2155cb6c776b8679f83))
-   build ([#88](https://github.com/fluencelabs/deal/issues/88)) ([7bab4f7](https://github.com/fluencelabs/deal/commit/7bab4f76b45748d84e523152f477e8f3e9af7f38))
-   deploy ([40aee38](https://github.com/fluencelabs/deal/commit/40aee38e8a231804d807ba6f20e4a0cf598745d7))
-   fix bugs and update cp peers logic ([#87](https://github.com/fluencelabs/deal/issues/87)) ([56f5141](https://github.com/fluencelabs/deal/commit/56f5141bc95826349e267d3f2d6982aa9394152a))
-   fix phassphrase ([a656a42](https://github.com/fluencelabs/deal/commit/a656a426a9c4b432f41b59041b392f81bc922485))
-   fix tests and deploy ([#90](https://github.com/fluencelabs/deal/issues/90)) ([0c9397b](https://github.com/fluencelabs/deal/commit/0c9397b34e3c5cc21a1394cae18f4898974e2e8d))
-   fix the matching event, migrate cid from string to struct, fix tests ([#60](https://github.com/fluencelabs/deal/issues/60)) ([f2e87a8](https://github.com/fluencelabs/deal/commit/f2e87a8cf711e90266c760985d1e4eac3be3e9ce))
-   merge ([#92](https://github.com/fluencelabs/deal/issues/92)) ([63aa080](https://github.com/fluencelabs/deal/commit/63aa0809bb03d036fc4e64bfac0b923f84146f1d))
-   remove peer fix ([8cff584](https://github.com/fluencelabs/deal/commit/8cff5843899fa12e597263b36708b1c5bb128a2f))
-   update deployment for mumbai ([#84](https://github.com/fluencelabs/deal/issues/84)) ([2a331a5](https://github.com/fluencelabs/deal/commit/2a331a5e863fa521fca705699fb51f92a5056ac0))

## [0.2.14](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.12...deal-aurora-v0.2.14) (2023-09-19)

### Features

-   deploy to filecoin env ([#105](https://github.com/fluencelabs/deal/issues/105)) ([fb55199](https://github.com/fluencelabs/deal/commit/fb55199a98d09705a269bd1a6a975d280d85c034))
-   whitelist & blacklist ([#98](https://github.com/fluencelabs/deal/issues/98)) ([c6d9589](https://github.com/fluencelabs/deal/commit/c6d9589e1fda42ce3b73461f1704235a6c4fefa0))

## [0.2.12](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.11...deal-aurora-v0.2.12) (2023-08-31)

### Bug Fixes

-   deploy ([40aee38](https://github.com/fluencelabs/deal/commit/40aee38e8a231804d807ba6f20e4a0cf598745d7))

## [0.2.11](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.10...deal-aurora-v0.2.11) (2023-08-25)

### Bug Fixes

-   remove peer fix ([8cff584](https://github.com/fluencelabs/deal/commit/8cff5843899fa12e597263b36708b1c5bb128a2f))

## [0.2.10](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.9...deal-aurora-v0.2.10) (2023-08-25)

### Bug Fixes

-   fix phassphrase ([a656a42](https://github.com/fluencelabs/deal/commit/a656a426a9c4b432f41b59041b392f81bc922485))

## [0.2.9](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.8...deal-aurora-v0.2.9) (2023-08-25)

### Bug Fixes

-   fix tests and deploy ([#90](https://github.com/fluencelabs/deal/issues/90)) ([0c9397b](https://github.com/fluencelabs/deal/commit/0c9397b34e3c5cc21a1394cae18f4898974e2e8d))
-   merge ([#92](https://github.com/fluencelabs/deal/issues/92)) ([63aa080](https://github.com/fluencelabs/deal/commit/63aa0809bb03d036fc4e64bfac0b923f84146f1d))

## [0.2.8](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.7...deal-aurora-v0.2.8) (2023-08-24)

### Bug Fixes

-   build ([#88](https://github.com/fluencelabs/deal/issues/88)) ([7bab4f7](https://github.com/fluencelabs/deal/commit/7bab4f76b45748d84e523152f477e8f3e9af7f38))

## [0.2.7](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.6...deal-aurora-v0.2.7) (2023-08-23)

### Bug Fixes

-   add verify in deploy ([f266365](https://github.com/fluencelabs/deal/commit/f26636559402f5f2c6c6d277c7ccfe569744b2d5))
-   fix bugs and update cp peers logic ([#87](https://github.com/fluencelabs/deal/issues/87)) ([56f5141](https://github.com/fluencelabs/deal/commit/56f5141bc95826349e267d3f2d6982aa9394152a))

## [0.2.6](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.5...deal-aurora-v0.2.6) (2023-08-15)

### Bug Fixes

-   update deployment for mumbai ([#84](https://github.com/fluencelabs/deal/issues/84)) ([2a331a5](https://github.com/fluencelabs/deal/commit/2a331a5e863fa521fca705699fb51f92a5056ac0))

## [0.2.5](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.4...deal-aurora-v0.2.5) (2023-08-14)

### Features

-   auto deploy ([#76](https://github.com/fluencelabs/deal/issues/76)) ([de45ca3](https://github.com/fluencelabs/deal/commit/de45ca3c32955c62beae983de68d0d9344f1c5a9))
-   subnets update ([#83](https://github.com/fluencelabs/deal/issues/83)) ([39b5700](https://github.com/fluencelabs/deal/commit/39b5700e0774d9415656eb56bad4dbb06c6e9509))

## [0.2.4](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.3...deal-aurora-v0.2.4) (2023-07-05)

### Bug Fixes

-   addresses ([#62](https://github.com/fluencelabs/deal/issues/62)) ([63a97b5](https://github.com/fluencelabs/deal/commit/63a97b5f9dac8d3cad38a2155cb6c776b8679f83))

## [0.2.3](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.2...deal-aurora-v0.2.3) (2023-07-05)

### Bug Fixes

-   fix the matching event, migrate cid from string to struct, fix tests ([#60](https://github.com/fluencelabs/deal/issues/60)) ([f2e87a8](https://github.com/fluencelabs/deal/commit/f2e87a8cf711e90266c760985d1e4eac3be3e9ce))

## [0.2.2](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.1...deal-aurora-v0.2.2) (2023-06-28)

### Features

-   add lib for interaction with the deal contract system ([#51](https://github.com/fluencelabs/deal/issues/51)) ([0911822](https://github.com/fluencelabs/deal/commit/0911822d02ea32df0fd0acd94d3421fd9a752e92))
-   add networks to client (kras, stage, testnet) ([#55](https://github.com/fluencelabs/deal/issues/55)) ([8e899e6](https://github.com/fluencelabs/deal/commit/8e899e6996273d30b79db99b58a71c71c69e9891))

## [0.2.1](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.2.0...deal-aurora-v0.2.1) (2023-06-06)

### Bug Fixes

-   Make hardhat listen on 0.0.0.0 ([#47](https://github.com/fluencelabs/deal/issues/47)) ([2664b4c](https://github.com/fluencelabs/deal/commit/2664b4cb64754bb3ec2517fc6837a4ee57b92615))

## [0.2.0](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.12...deal-aurora-v0.2.0) (2023-05-28)

### ⚠ BREAKING CHANGES

-   complete refactor #10

### Features

-   complete refactor [#10](https://github.com/fluencelabs/deal/issues/10) ([0c62427](https://github.com/fluencelabs/deal/commit/0c624276b3357bcee538f1829f30aeb1a60b38fc))
-   matching mechanism ([#43](https://github.com/fluencelabs/deal/issues/43)) ([50a8e4c](https://github.com/fluencelabs/deal/commit/50a8e4c423f672c994893f0cda3c38a4de537264))
-   new features ([#25](https://github.com/fluencelabs/deal/issues/25)) ([a8983d2](https://github.com/fluencelabs/deal/commit/a8983d29d342fef2f7ca0612b0d6a8370b562b13))
-   **npm-package:** add npm package for typechain [DXJ-220] ([ffc2a19](https://github.com/fluencelabs/deal/commit/ffc2a19d844c6af9864e8118cc55671bf24183e6))
-   **npm:** add explanation of how to publish to README ([f306824](https://github.com/fluencelabs/deal/commit/f306824ca4c46bdb3ec45ec0ae8dd6ea46f46397))
-   update DealConfig ([#18](https://github.com/fluencelabs/deal/issues/18)) ([d0a3ce6](https://github.com/fluencelabs/deal/commit/d0a3ce6ace96e62e2dc43daffb0138e45574f990))

### Bug Fixes

-   change type in DealCreated event ([#20](https://github.com/fluencelabs/deal/issues/20)) ([60968fa](https://github.com/fluencelabs/deal/commit/60968fa43379e6a5baa117f467eee58a6be970cc))
-   change type in DealCredted event ([#23](https://github.com/fluencelabs/deal/issues/23)) ([a523e4b](https://github.com/fluencelabs/deal/commit/a523e4b8786a1c8022238bd19c8374cb59a5fee7))
-   fix dist ([#28](https://github.com/fluencelabs/deal/issues/28)) ([3570f31](https://github.com/fluencelabs/deal/commit/3570f3197a1f9bc56f6e978c08dee1ae28ee2fa3))
-   fix npm pkgs ([#16](https://github.com/fluencelabs/deal/issues/16)) ([f750279](https://github.com/fluencelabs/deal/commit/f750279a2f2be8d8c0972916489845de88c81758))
-   fix npmignore ([#14](https://github.com/fluencelabs/deal/issues/14)) ([1898a16](https://github.com/fluencelabs/deal/commit/1898a164dfefbd2415c75c940305f7b6c89cbf38))
-   remove typechain-types from gitignore ([#12](https://github.com/fluencelabs/deal/issues/12)) ([29f1243](https://github.com/fluencelabs/deal/commit/29f12433cd717f3e7e5149b0e636be9ffcce50b4))

## [0.1.12](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.11...deal-aurora-v0.1.12) (2023-04-21)

### Bug Fixes

-   fix abi in matcher ([#39](https://github.com/fluencelabs/deal/issues/39)) ([2183995](https://github.com/fluencelabs/deal/commit/2183995efb75017f1d475ca01b18efac8b39a9e8))

## [0.1.11](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.10...deal-aurora-v0.1.11) (2023-04-20)

### Bug Fixes

-   types in dist ([#37](https://github.com/fluencelabs/deal/issues/37)) ([b01a5f0](https://github.com/fluencelabs/deal/commit/b01a5f0b5b149e185ae02464748aa32166045fe4))

## [0.1.10](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.9...deal-aurora-v0.1.10) (2023-04-20)

### Bug Fixes

-   fix dist ([#35](https://github.com/fluencelabs/deal/issues/35)) ([06ebc80](https://github.com/fluencelabs/deal/commit/06ebc80050408126be1777350779ef513346d00c))

## [0.1.9](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.8...deal-aurora-v0.1.9) (2023-04-20)

### Features

-   Mv to calls & add matching ([#34](https://github.com/fluencelabs/deal/issues/34)) ([6c89e06](https://github.com/fluencelabs/deal/commit/6c89e06ec73506835c0caa8a28f81a50408cb1dd))
-   update pate script ([#32](https://github.com/fluencelabs/deal/issues/32)) ([73354ab](https://github.com/fluencelabs/deal/commit/73354ab1eea686b95d3c64e311c43a2316ee6b72))

## [0.1.8](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.7...deal-aurora-v0.1.8) (2023-02-13)

### Bug Fixes

-   fix dist ([#28](https://github.com/fluencelabs/deal/issues/28)) ([3570f31](https://github.com/fluencelabs/deal/commit/3570f3197a1f9bc56f6e978c08dee1ae28ee2fa3))

## [0.1.7](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.6...deal-aurora-v0.1.7) (2023-02-13)

### Features

-   new features ([#25](https://github.com/fluencelabs/deal/issues/25)) ([a8983d2](https://github.com/fluencelabs/deal/commit/a8983d29d342fef2f7ca0612b0d6a8370b562b13))

## [0.1.6](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.5...deal-aurora-v0.1.6) (2023-02-08)

### Bug Fixes

-   change type in DealCredted event ([#23](https://github.com/fluencelabs/deal/issues/23)) ([a523e4b](https://github.com/fluencelabs/deal/commit/a523e4b8786a1c8022238bd19c8374cb59a5fee7))

## [0.1.5](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.4...deal-aurora-v0.1.5) (2023-02-08)

### Bug Fixes

-   change type in DealCreated event ([#20](https://github.com/fluencelabs/deal/issues/20)) ([60968fa](https://github.com/fluencelabs/deal/commit/60968fa43379e6a5baa117f467eee58a6be970cc))

## [0.1.4](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.3...deal-aurora-v0.1.4) (2023-02-06)

### Features

-   update DealConfig ([#18](https://github.com/fluencelabs/deal/issues/18)) ([d0a3ce6](https://github.com/fluencelabs/deal/commit/d0a3ce6ace96e62e2dc43daffb0138e45574f990))

## [0.1.3](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.2...deal-aurora-v0.1.3) (2023-01-27)

### Bug Fixes

-   fix npm pkgs ([#16](https://github.com/fluencelabs/deal/issues/16)) ([f750279](https://github.com/fluencelabs/deal/commit/f750279a2f2be8d8c0972916489845de88c81758))

## [0.1.2](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.1...deal-aurora-v0.1.2) (2023-01-27)

### Bug Fixes

-   fix npmignore ([#14](https://github.com/fluencelabs/deal/issues/14)) ([1898a16](https://github.com/fluencelabs/deal/commit/1898a164dfefbd2415c75c940305f7b6c89cbf38))

## [0.1.1](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.1.0...deal-aurora-v0.1.1) (2023-01-27)

### Bug Fixes

-   remove typechain-types from gitignore ([#12](https://github.com/fluencelabs/deal/issues/12)) ([29f1243](https://github.com/fluencelabs/deal/commit/29f12433cd717f3e7e5149b0e636be9ffcce50b4))

## [0.1.0](https://github.com/fluencelabs/deal/compare/deal-aurora-v0.0.1...deal-aurora-v0.1.0) (2023-01-27)

### ⚠ BREAKING CHANGES

-   complete refactor #10

### Features

-   complete refactor [#10](https://github.com/fluencelabs/deal/issues/10) ([0c62427](https://github.com/fluencelabs/deal/commit/0c624276b3357bcee538f1829f30aeb1a60b38fc))
