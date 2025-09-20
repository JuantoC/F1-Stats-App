import request from "supertest";
import { app, server } from "../index.js";
import descaleArray from "../helpers/arrayDescaler.js";

afterAll((done) => {
  server.close(done);
});

describe("Test Helpers", () => {
  it("Descale array", () => {
    expect(descaleArray([2, 4, 6])).toEqual([1, 2, 3]);
  });
});

describe("Express App", () => {
  it("GET /health should return Ok", async () => {

    const res = await request(app).get("/health").send();

    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual("OK");
  });
});