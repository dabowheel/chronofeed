import Component from "./component";
import view from "./designer.html";
import Menu from "./menu";

export default class Designer extends Component {
	constructor(containerID) {
		super(containerID);
		this.global();
	}
	render(callback) {
		let menu = new Menu("", false, false, true);
		menu.render(function (err, menuView) {
			callback(null, menuView + view);
		});
	}
}
