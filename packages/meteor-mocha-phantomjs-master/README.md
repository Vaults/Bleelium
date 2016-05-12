# dispatch:mocha-phantomjs

A Mocha test driver package for Meteor 1.3. This package reports server and client results in the server console and can be used for running tests on a CI server. This achieves what `spacejam` does but without the need for a separate Node package.

This package runs your client tests within a PhantomJS page. If you prefer a different solution, it should be possible to fork this package to make a variation that runs in Chrome or any other headless browser. If you do so, we can add a link to your package here.

## Installation

In a Meteor 1.3+ app directory:

```bash
meteor add dispatch:mocha-phantomjs
```

## Run app unit tests

```bash
meteor test --once --driver-package dispatch:mocha-phantomjs
```

## Run app unit tests in watch mode

```bash
TEST_WATCH=1 meteor test --driver-package dispatch:mocha-phantomjs
```

### Run with a different server reporter

The default Mocha reporter for server tests is the "spec" reporter. You can set the `SERVER_TEST_REPORTER` environment variable to change it.

```bash
SERVER_TEST_REPORTER="dot" meteor test --once --driver-package dispatch:mocha-phantomjs
```

### Run with a different client reporter

The default Mocha reporter for client tests is the "spec" reporter. You can set the `CLIENT_TEST_REPORTER` environment variable to change it.

```bash
CLIENT_TEST_REPORTER="tap" meteor test --once --driver-package dispatch:mocha-phantomjs
```

Because of the differences between client and server code, not all reporters will work as client reporters. "spec" and "tap" are confirmed to work.

## NPM Scripts

A good best practice is to define these commands as run scripts in your app's `package.json` file. For example:

```json
"scripts": {
  "test": "meteor test --once --driver-package dispatch:mocha-phantomjs",
  "test:watch": "TEST_WATCH=1 meteor test --driver-package dispatch:mocha-phantomjs",
  "start": "meteor run"
}
```

And then run `npm test` for one-time/CI mode or `npm run test:watch` to rerun the tests whenever you change a file.
