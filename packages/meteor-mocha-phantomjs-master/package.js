Package.describe({
  name: "dispatch:mocha-manual",
  summary: "Run package or app tests with Mocha+PhantomJS and report all results in the server console",
  git: "https://github.com/DispatchMe/meteor-mocha-phantomjs.git",
  version: '0.1.0',
  testOnly: true
});

Package.onUse(function (api) {
  api.versionsFrom('1.3');

  api.use([
    'dispatch:mocha-core@0.0.1',
    'ecmascript'
  ]);

  api.use([
    'dispatch:phantomjs-tests@0.0.4'
  ], 'server');

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
