# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.8.3](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.8.2...v2.8.3) (2020-11-28)


### Bug Fixes

* **format:** shrink parsed sources by one ([b289bf4](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/b289bf463734ab2838ef6df030ef323f8a017901))

### [2.8.2](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.8.1...v2.8.2) (2020-11-09)


### Bug Fixes

* **format:** handle overlapping ranges ([6754fc7](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/6754fc791963ad3c6da2b9aa68d156ae84232486))

### [2.8.1](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.8.0...v2.8.1) (2020-11-08)


### Bug Fixes

* **format:** handle unclosed module edge case properly ([408142f](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/408142fb5222e8649d2ce752d5205171e37f77b1))

## [2.8.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.7.1...v2.8.0) (2020-11-08)


### Features

* **format:** support unclosed ranges of inlined modules ([dbad71c](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/dbad71c13de508cce561ba0b628da39fb4b365e1))


### Bug Fixes

* **typo:** correct wording in README ([36354bd](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/36354bd2da6d539ba8220cfffedd71fa8cfe7b65))

### [2.7.1](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.7.0...v2.7.1) (2020-11-03)


### Bug Fixes

* **parsing:** fix cutting out inlined modules ([e5eee3b](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/e5eee3b3298ae0fe527f537bc7bfee0197f025d7))

## [2.7.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.6.1...v2.7.0) (2020-11-02)


### Features

* fix extracting parsed module code ([63912fb](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/63912fb953bd90cf2374ba6c80df8af226e44ced))
* **format:** add bundle parser from webpack bundle analyzer ([24512b5](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/24512b57a21076fa76d94dea687241619b6cdb4a))
* **testing:** add debug configuration for Webpack ([545f465](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/545f46534d818cfd59375c2b6a32900f38b59b3f))


### Bug Fixes

* use proper module indexes for parsing Webpack 5 bundle ([be6f2d5](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/be6f2d5bb812c5c0fe2d10f8b24b3cf85e5746f8))
* **testing:** fix launch setup for Webpack 5 ([eb486c7](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/eb486c7fd9536675c61de5bd4fa1a68fffe6d3a9))
* make it at least not failing with Webpack 5 ([60c7399](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/60c7399a4011d8b23b42c471fae3a771ca599407))
* **format:** don't enhance modules without source ([1333fab](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/1333fab815c13a5c2f28ba1e2627d29a1e0732d7))
* **testing:** remove superfluous launch configuration ([b3eb507](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/b3eb507e7f12a6d780d965b4f8d688939bbe966e))

### [2.6.1](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.6.0...v2.6.1) (2020-09-23)

## [2.6.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.5.1...v2.6.0) (2020-09-22)


### Features

* **format:** support multi-chunk setups ([dc2a64e](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/dc2a64ef127458d56e13b2fae754c2a6c7d0f546))


### Bug Fixes

* **format:** filter out files without source map ([a2f429a](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/a2f429a2fc9199ec6005930719c42a16c041076c))

### [2.5.1](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.5.0...v2.5.1) (2020-09-01)


### Bug Fixes

* **perf:** improve performance for big files ([53dcf10](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/53dcf10ba1bd475d59766ae1d27242586cbe4349))

## [2.5.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.4.0...v2.5.0) (2020-06-21)


### Features

* **format:** support webpack 5 ([2acb6e8](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/2acb6e8160312b4f684353d8708a3734569dec4f))
* **testing:** add unit tests infrastracture ([e5d10cc](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/e5d10ccb580010e3ae7f5eec416ee952e1c884d5))
* **testing:** upgrade all examples by default ([9371b03](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/9371b034c27baee5ddfcecf86d23c5c0d64ea4e2))


### Bug Fixes

* **editor:** set ESLint as default formatter ([94c3f6a](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/94c3f6abbf392c357f093fe724b1e155d2701480))
* **node:** support node v10 again ([399eb06](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/399eb069a82ae3bfe644e992b1057ce2a8a7445e))

## [2.4.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.3.0...v2.4.0) (2020-05-10)


### Features

* **node:** declare compatibility with node 10 ([02e3da0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/02e3da076f4ae1ebb07fc85c73575b3613881ee8))
* **testing:** add a couple of node versions to CI configuration ([c566aa6](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/c566aa656d3ca07008ebefdf51135b63e8884341))

## [2.3.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.2.1...v2.3.0) (2020-02-25)


### Features

* Handle multi-line output files ([db10d5d](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/db10d5d0934cb395b8db94a8f71643cfd2e89b07))

### [2.2.1](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.2.0...v2.2.1) (2019-12-06)

## [2.2.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.1.0...v2.2.0) (2019-11-19)


### Features

* **deps:** create separate greenkeeper group for playground packages ([f1413ba](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/f1413ba))

## [2.1.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.0.1...v2.1.0) (2019-10-07)


### Bug Fixes

* **api:** set default options ([1e8c487](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/1e8c487))
* **api:** use single resource map per plugin instance ([f7c54d8](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/f7c54d8))
* **deps:** resolve security issue ([800064f](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/800064f))
* **format:** handle lack of soruce contents ([bceb866](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/bceb866))
* **format:** handle lack of sourcemap ([b298b56](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/b298b56))


### Features

* **testing:** add playground with minimal example ([2a672ba](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/2a672ba))
* **testing:** add playground with multiple configs example ([1a50b62](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/1a50b62))
* **testing:** add Travis CI config ([38ee3d3](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/38ee3d3))
* **testing:** generate snapshots during tests ([5614f6f](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/5614f6f))

### [2.0.1](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v2.0.0...v2.0.1) (2019-09-17)

## [2.0.0](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v1.1.0...v2.0.0) (2019-09-17)


### ⚠ BREAKING CHANGES

* **format:** require loader to gather original source contents
* **package:** limit node.js version to 11 and above

### Bug Fixes

* **format:** show original source correctly for setups with loaders ([be4dda3](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/be4dda3))
* **lint:** specify parser version ([6321d44](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/6321d44))


* **package:** add engines field ([f009421](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/f009421))

## 1.1.0 (2019-09-17)


### Features

* **format:** support modules with loaders ([8db4bf3](https://github.com/erykpiast/webpack-enhanced-stats-plugin/commit/8db4bf3))

### [1.0.1](https://github.com/erykpiast/webpack-enhanced-stats-plugin/compare/v1.0.0...v1.0.1) (2019-09-04)

## 1.0.0 (2019-09-04)
