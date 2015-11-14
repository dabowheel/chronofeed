
class Item {
	constructor(title,format,description,defaultValue) {
		if (format) {
			this.format = format;
		}
		if (title) {
			this.title = title;
		}
		if (description) {
			this.description = description;
		}
		if (defaultValue) {
			this["default"] = defaultValue;
		}
	}
	exportObject() {
		let ret = JSON.parse(JSON.stringify(this));
		return JSON.parse(JSON.stringify(this));
	}
	toString() {
		return JSON.stringify(this);
	}
}

export class objectItem extends Item {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "object";
		this.properties = {};
	}
	addProperty(name,prop) {
		this.properties[name] = prop;
	}
}

export class stringItem extends Item {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "string";
	}
}

export class numberItem extends Item {
	constructor(title, format, description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "number";
	}
}

export class integerItem extends Item {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "integer";
	}
}

export class booleanItem extends Item {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "boolean";
	}
}

export class arrayItem extends Item {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "array";
		this.items = {
		};
	}
	setItems(items) {
		this.items = items;
	}
}
