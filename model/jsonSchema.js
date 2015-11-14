
class jsonSchemaItem {
	constructor(title,format,description,defaultValue) {
		this.type = "object";
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
		return JSON.parse(JSON.stringify(this));
	}
	toString() {
		return JSON.stringify(this);
	}
}

export class jsonSchemaObject extends jsonSchemaItem {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "object";
		this.properties = {};
	}
	addProperty(name,prop) {
		this.properties[name] = prop;
	}
}

export class jsonSchemaString extends jsonSchemaItem {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "string";
	}
}

export class jsonSchemaNumber extends jsonSchemaItem {
	constructor(title, format, description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "number";
	}
}

export class jsonSchemaInteger extends jsonSchemaNumber {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "integer";
	}
}

export class jsonSchemaBoolean extends jsonSchemaItem {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.type = "boolean";
	}
}

export class jsonSchemaArray extends jsonSchemaItem {
	constructor(title,format,description,defaultValue) {
		super(title, format, description, defaultValue);
		this.items = {
		};
	}
	setItems(items) {
		this.items = items;
	}
}
