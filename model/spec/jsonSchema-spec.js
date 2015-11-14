import * as jsonSchema from "../jsonSchema";

describe("json schema", function () {
	it("should create and object", function () {
		let s = new jsonSchema.objectItem("Form");
		s.addProperty("title", new jsonSchema.stringItem("Title"));
		s.addProperty("post", new jsonSchema.stringItem("Post"));
		s.addProperty("date", new jsonSchema.stringItem("Date"));

		expect(s.exportObject()).toEqual({
			title: "Form",
			type: "object",
			properties: {
				title: {
					type: "string",
					title: "Title"
				},
				post: {
					type: "string",
					title: "Post"
				},
				date: {
					type: "string",
					title: "Date"
				}
			}
		});
	});

	it("should create a string", function () {
		let s = new jsonSchema.stringItem("Name");
		expect(s.exportObject()).toEqual({
			type: "string",
			title: "Name"
		});
	});

	it("should create an integer", function () {
		let s = new jsonSchema.integerItem("Age");
		expect(s.exportObject()).toEqual({
			type: "integer",
			title: "Age"
		});
	});

	it("should create a number", function () {
		let s = new jsonSchema.numberItem("Weight");
		expect(s.exportObject()).toEqual({
			type: "number",
			title: "Weight"
		});
	});

	it("should create a boolean", function () {
		let s = new jsonSchema.booleanItem("Is Cool?");
		expect(s.exportObject()).toEqual({
			type: "boolean",
			title: "Is Cool?"
		});
	});

	it("should create an array", function () {
		let s = new jsonSchema.arrayItem("Grocery List");
		let o = new jsonSchema.objectItem("Item");
		o.addProperty("name", new jsonSchema.stringItem("Name"));
		o.addProperty("count", new jsonSchema.integerItem("Count"));
		s.setItems(o);
		expect(s.exportObject()).toEqual({
			type: "array",
			title: "Grocery List",
			items: {
				type: "object",
				title: "Item",
				properties: {
					name: {
						type: "string",
						title: "Name"
					},
					count: {
						type: "integer",
						title: "Count"
					}						
				}
			}
		});
	});

});
