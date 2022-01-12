const app = require("../src/app");

describe("server test suite", () => {
  test("should load server", () => {
    console.log("server up and running properly");
  });

  // test.only("load all users correctly", async () => {
  //   console.log("all users is loading");
  //   let response = await request(app).get("/api/user/all");
  //   // expect(response.statusCode).toBe(200);
  //   // expect(response.body).not.toBeNull();
  //   let users = response.body;
  //   expect(users.length).toBe(1);
  //   // console.log(response.body);
  // });
});
