## How to run locally

```
node index.js -f example2.json -n cm
cd generated/
cp ~/credentials.json ./
serverless deploy
```

## how to install globally

```
npm link
npm uninstall -g rest-serverless-generator
npm install -g ../rest-serverless-generator
```

## how to run globally

```
generate_rest -f example2.json -n cm
```

## how to install and run locally

add to package.json scripts a link to node_modules/.bin/generate_rest

```
npm install ../rest-serverless-generator
npm run generate -- -f example2.json -n cm
```