
class jsonSchema {
	constructor() {
		this.child = null;
	}
	append(obj) {
		this.child = obj;
	}
}

class jsonSchemaObject {
	constructor(title,description) {
		this.type = "object";
		this.title = title;
		this.description = description;
	}
	append(schema) {
		schema.title = this.title;
		schema.description = this.description;
	}
}
