import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";

// PrismaModule is defined in ./prisma/prisma.module and will be wired
// into AppModule once the Trade endpoints land — adding it here today
// would force every e2e test (and `nest start`) to require a live
// Postgres on $connect. See NEXT_SESSION.md.

@Module({
  imports: [HealthModule]
})
export class AppModule {}
