let Component = require("./component");
let template = require("./loadError.hbs");
import route from "./route";

class LoadError extends Component {
  constructor(containerID,title,error) {
    super(containerID);
    this.title = title;
    this.error = error;
    this.global();
  }
  render(callback) {
    callback(null, template(this));
  }
  afterLoad() {
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html(this.error);
  }
  clickGoHome() {
    route("/");
  }
}

module.exports = LoadError;
