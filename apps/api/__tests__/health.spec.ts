import { getApiHealth } from "../src/health";

describe("getApiHealth", () => {
  it("returns the expected health payload", () => {
    expect(getApiHealth()).toEqual({
      service: "api",
      status: "ok"
    });
  });
});
