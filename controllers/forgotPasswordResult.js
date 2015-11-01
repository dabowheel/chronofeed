var Component = require("./component");
var view = require("./forgotPasswordResult.html");
var page = require("../scripts/page");

class ForgotPasswordResult extends Component {
  constructor(containerID) {
    super(view, containerID);
  }
  beforeLoad() {
    page.setURL("/forgotPasswordResult", "Grackle | Forgot Password Result");
  }
}

module.exports = ForgotPasswordResult;
