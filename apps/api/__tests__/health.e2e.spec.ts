import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createApp } from "../src/bootstrap";

describe("GET /v1/health", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns the health payload under the /v1 prefix", async () => {
    const res = await request(app.getHttpServer()).get("/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ service: "api", status: "ok" });
  });

  it("returns the standard error shape for unknown routes", async () => {
    const res = await request(app.getHttpServer()).get("/v1/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: expect.any(String),
      code: "NOT_FOUND",
      statusCode: 404
    });
  });
});
