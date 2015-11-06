let Component = require("./component");
let view = require("./loadError.html");
import route from "./route";

class LoadError extends Component {
  constructor(containerID,title,error) {
    super(containerID);
    this.title = title;
    this.error = error;
    this.global();
  }
  render(callback) {
    let template = Handlebars.compile(view);
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
