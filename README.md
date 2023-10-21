# Inet Quasar App (quasar-project)

A Quasar Project Inet Quasar

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).



### deploy on vercel

move to directory dist/spa
```
vercel
```
package.json
```
 "scripts": {
      ...
      "build": "quasar build",
      "deploy": "vercel"
    }
```
add a vercel.json file and inside
```
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/" }
  ]
}
```
