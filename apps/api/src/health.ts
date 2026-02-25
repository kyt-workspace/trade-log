export interface ApiHealth {
  service: "api";
  status: "ok";
}

export function getApiHealth(): ApiHealth {
  return {
    service: "api",
    status: "ok"
  };
}
