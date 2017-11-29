var builder = require('botbuilder');

var common = require('./common');
var luisMock = require('./luis-mock');
var testBot = require('../controller/luisDialog');
var helpMessages = require('./dialog-flows/help');

luisMock.setup();

//Our parent block
describe('Bot Tests', () => {

  it('help', function (done) { 
      var connector = new builder.ConsoleConnector();
      var bot = testBot.create(connector);

      common.testBot(bot, helpMessages, done);
  });
});