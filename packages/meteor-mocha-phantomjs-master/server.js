import { mochaInstance } from 'meteor/dispatch:mocha-core';
import { startPhantom } from 'meteor/dispatch:phantomjs-tests';

const reporter = process.env.SERVER_TEST_REPORTER || 'spec';

// pass the current env settings to the client.
Meteor.startup(function() {
  Meteor.settings.public = Meteor.settings.public || {};
  Meteor.settings.public.CLIENT_TEST_REPORTER = process.env.CLIENT_TEST_REPORTER;
});

// Since intermingling client and server log lines would be confusing,
// the idea here is to buffer all client logs until server tests have
// finished running and then dump the buffer to the screen and continue
// logging in real time after that if client tests are still running.
let serverTestsDone = false;
let clientLines = [];
function clientLogBuffer(line) {
  if (serverTestsDone) {
    // printing and removing the extra new-line character. The first was added by the client log, the second here.
    console.log(line.replace(/\n$/, ''));
  } else {
    clientLines.push(line);
  }
}

function printHeader(type) {
  console.log('\n--------------------------------');
  console.log(`----- RUNNING ${type} TESTS -----`);
  console.log('--------------------------------\n');
}

let callCount = 0;
let clientFailures = 0;
let serverFailures = 0;
function exitIfDone(type, failures) {
  callCount++;
  if (type === 'client') {
    clientFailures = failures;
  } else {
    serverFailures = failures;
  }

  if (callCount === 1) {
    console.log('All server tests finished!\n');
    console.log('--------------------------------');
    console.log(`SERVER FAILURES: ${serverFailures}`);
    console.log(`CLIENT FAILURES: ${clientFailures} (OBSOLETE)`);
    console.log('--------------------------------');
    if (!process.env.TEST_WATCH) {
      if (clientFailures + serverFailures > 0) {
		process.env.SERVER_FAILURES = "It seems, in my 'humble' opinion, that your 'program' has been 'built' 'unsuccessfully'. You have " + serverFailures + " failures.";
        process.exit(2); // exit with non-zero status if there were failures
      } else {
		 process.env.SERVER_FAILURES = "No 'failures' in this 'build'."
        process.exit(0);
      }
    }
  }
}

// Before Meteor calls the `start` function, app tests will be parsed and loaded by Mocha
function start() {
  // Run the server tests
  printHeader('SERVER');

  // We need to set the reporter when the tests actually run to ensure no conflicts with
  // other test driver packages that may be added to the app but are not actually being
  // used on this run.
  mochaInstance.reporter(reporter);

  mochaInstance.run((failureCount) => {
    exitIfDone('server', failureCount);
  });

  // Simultaneously start phantom to run the client tests

}

export { start };
