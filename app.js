const settings = require('./Global/Config/Settings.js');
const client = require('./Global/Handler/ClientHandler.js');
const connectToMongo = require('./Global/Handler/MongoHandler.js');
require('./Global/Handler/SlashCommandHandler.js')(client);
connectToMongo();
client.login(settings.token);