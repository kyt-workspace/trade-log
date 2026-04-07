import { Controller, Get } from "@nestjs/common";
import { ApiHealth, getApiHealth } from "../health";

@Controller("health")
export class HealthController {
  @Get()
  read(): ApiHealth {
    return getApiHealth();
  }
}
