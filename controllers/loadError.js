let Component = require("./component");
let view = require("./loadError.html");
let page = require("../scripts/page");

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
    page.setURL("/");
    global.viewInitial();
  }
}

module.exports = LoadError;
