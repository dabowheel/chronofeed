xdescribe("BlogInfo", function () {
  beforeEach(function () {
    error = jasmine.createSpy("error");
  });

  it("should initialize", function () {
    var blogList  = new BlogInfo("1","Javascript");
    expect(blogList.blogID).toEqual("1");
    expect(blogList.title).toEqual("Javascript");
    expect(error).not.toHaveBeenCalled();
  });

  it("should error on invalid blogID", function () {
    var blogInfo = new BlogInfo(1,"Javascript");
    expect(error).toHaveBeenCalled();
  });

  it ("should error on invalid title", function () {
    var blogInfo = new BlogInfo("1");
    expect(error).toHaveBeenCalled();
  });
});
