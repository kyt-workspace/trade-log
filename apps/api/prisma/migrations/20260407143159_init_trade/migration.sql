-- CreateEnum
CREATE TYPE "TradeSide" AS ENUM ('LONG', 'SHORT');

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "symbol" VARCHAR(16) NOT NULL,
    "side" "TradeSide" NOT NULL,
    "quantity" DECIMAL(18,6) NOT NULL,
    "entryPrice" DECIMAL(18,6) NOT NULL,
    "exitPrice" DECIMAL(18,6),
    "fees" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "entryAt" TIMESTAMP(3) NOT NULL,
    "exitAt" TIMESTAMP(3),
    "notes" TEXT,
    "rawPayload" JSONB,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trades_idempotencyKey_key" ON "trades"("idempotencyKey");

-- CreateIndex
CREATE INDEX "trades_symbol_idx" ON "trades"("symbol");

-- CreateIndex
CREATE INDEX "trades_entryAt_idx" ON "trades"("entryAt");

-- CreateIndex
CREATE INDEX "trades_exitAt_idx" ON "trades"("exitAt");

-- CHECK constraints (Data Integrity Rule 6)
ALTER TABLE "trades" ADD CONSTRAINT trades_fees_nonneg CHECK ("fees" >= 0);
ALTER TABLE "trades" ADD CONSTRAINT trades_exit_consistency CHECK (("exitAt" IS NULL) = ("exitPrice" IS NULL));
