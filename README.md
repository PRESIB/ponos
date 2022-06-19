**PONOS**

Ponos /ˈpoʊˌnɒs/ or Ponus /ˈpoʊnəs/ (Ancient Greek: Πόνος Pónos) is the personification of hardship or toil. (https://en.wikipedia.org/wiki/Ponos)

**NOTE:** There is a known issue that result in the following error:

``` sh
node:internal/modules/cjs/loader:488
      throw e;
      ^

Error: Cannot find module '/home/nuno_fernandes/presib/ponos/node_modules/unicode-properties/dist.main.cjs'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:960:15)
    at finalizeEsmResolution (node:internal/modules/cjs/loader:953:15)
    at resolveExports (node:internal/modules/cjs/loader:482:14)
    at Function.Module._findPath (node:internal/modules/cjs/loader:522:31)
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:919:27)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/home/nuno_fernandes/presib/ponos/node_modules/fontkit/dist/main.cjs:8:32)
    at Module._compile (node:internal/modules/cjs/loader:1105:14) {
  code: 'MODULE_NOT_FOUND',
  path: '/home/nuno_fernandes/presib/ponos/node_modules/unicode-properties/package.json'
  ```




with the package *unicode-properties*, after install or update the node_modules please edit the package.json from ```node_modules/unicode-properties``` and change the following:

``` json
...
"exports": {
    "require": "./dist.main.cjs",
    "import": "./dist/module.mjs"
  },
...
```

to

``` json
...
"exports": {
    "require": "./dist/main.cjs",
    "import": "./dist/module.mjs"
  },
...
```