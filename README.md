# koa2 Boilerplate

A simple koa2 boilerplate based on webpack3

## Features

This is a koa2 starter boilerplate app I've put together using the following technologies:

✓ [koa v2](https://github.com/koajs/koa)

✓ [webpack(v3)](https://github.com/webpack/webpack)

✓ [ES2015+](http://babeljs.io/docs/learn-es2015/)

✓ [Babel](http://babeljs.io/)

✓ [SCSS](http://sass-lang.com/)

✓ [Hot reload](https://github.com/leecade/koa-webpack-middleware)

✓ [Eslint](https://github.com/eslint/eslint)

✓ [pre-commit](https://github.com/observing/pre-commit)


## Usage

**Step 1**. Make sure that you have [Node.js](https://nodejs.org/) v6 or newer and
[npm](https://github.com/npm/npm) installed on your development machine.

* node `^6.0.0`
* npm `^5.0.0`

**Step 2**. Clone this repository

```shell
$ git clone http://gitlab.whup.com/UPOem-WebApplication/koa2-boilerplate.git MyApp
$ cd MyApp
$ npm install        # Install project dependencies listed in package.json
```

If you just want to start a new project without the `koa2 boilerplate` commit history then you can do:

```bash
$ git clone --depth=1 http://gitlab.whup.com/UPOem-WebApplication/koa2-boilerplate.git MyApp
```
The depth=1 tells git to only pull down one commit worth of historical data.

**Step 3**. Compile and launch your app by running:

```shell
$ npm run start:dev  # Compiles the app and opens it in a browser with "hot reload"
```

Now the app should be running at [http://0.0.0.0:3000/](http://0.0.0.0:3000/)


## Build
A `build` script to bundle JS, CSS, and images for production, with sourcemaps.

```
$ npm run build
```


## Scripts

|`npm <script>`     |Description|
|-------------------|-----------|
|`star:dev`         |Serves your app at `localhost:3000`|
|`star:prod`        |Serves your app at `localhost:3000`|
|`build`            |Builds the application|
|`lint`             |[Lints](http://stackoverflow.com/questions/8503559/what-is-linting) the project for potential errors|



## Wiki

- [koa2-boilerplate](http://gitlab.whup.com/UPOem-WebApplication/koa2-boilerplate/wikis/home#koa-boilerplate)
