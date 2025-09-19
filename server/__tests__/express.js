import request from "supertest";
import { app } from "../index.js";
import descaleArray from "../helpers/arrayDescaler.js";

// describe("Express App", () => {
//   it("GET /health should return Ok", async () => {

//     const res = await request(app).get("/health").send();

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual("OK");
//   });
// });

describe("Test Helpers", () => {
  it("Descale array", () => {
    expect(descaleArray([2, 4, 6])).toEqual([1, 2, 3]);
  });
});