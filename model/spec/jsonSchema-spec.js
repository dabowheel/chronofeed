import * as jsonSchema from "../jsonSchema";

describe("json schema", function () {
	it("should create and object", function () {
		let o = new jsonSchema.jsonSchemaObject("Form");
		expect(o.exportObject()).toEqual({
			title: "Form",
			type: "object",
			properties: {}
		});
	});
});
