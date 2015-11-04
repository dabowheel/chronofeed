var Component = require("./component");
var view = require("./forgotPasswordResult.html");
var page = require("../scripts/page");

class ForgotPasswordResult extends Component {
  constructor(containerID) {
    super(containerID);
  }
  render(callback) {
    page.setURL("/forgotPasswordResult", "Grackle | Forgot Password Result");
    callback(null,view);
  }
}

module.exports = ForgotPasswordResult;
