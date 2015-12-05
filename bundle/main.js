let chronofeed = {};
global.chronofeed = chronofeed;

chronofeed.request = require("./request");
chronofeed.setURL = require("./setURL");
Object.assign(chronofeed, require("./validate"));
chronofeed.createHash = require("sha.js");

chronofeed.store = {};
