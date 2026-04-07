import { Prisma, PrismaClient, TradeSide } from "@prisma/client";

const prisma = new PrismaClient();

type SeedTrade = {
  symbol: string;
  side: TradeSide;
  quantity: string;
  entryPrice: string;
  exitPrice: string | null;
  fees: string;
  entryAt: string;
  exitAt: string | null;
  notes?: string;
  idempotencyKey: string;
};

const SEED_TRADES: SeedTrade[] = [
  // Wins - long
  { symbol: "AAPL", side: "LONG", quantity: "100", entryPrice: "170.25", exitPrice: "182.10", fees: "1.30", entryAt: "2026-01-05T14:30:00Z", exitAt: "2026-01-12T20:00:00Z", notes: "Earnings run-up", idempotencyKey: "seed-001" },
  { symbol: "MSFT", side: "LONG", quantity: "50",  entryPrice: "405.00", exitPrice: "421.40", fees: "1.30", entryAt: "2026-01-08T15:00:00Z", exitAt: "2026-01-19T18:45:00Z", notes: "Trend continuation", idempotencyKey: "seed-002" },
  { symbol: "NVDA", side: "LONG", quantity: "30",  entryPrice: "880.50", exitPrice: "925.00", fees: "1.50", entryAt: "2026-01-15T15:30:00Z", exitAt: "2026-01-22T19:00:00Z", notes: "Breakout", idempotencyKey: "seed-003" },
  { symbol: "AMD",  side: "LONG", quantity: "200", entryPrice: "162.10", exitPrice: "171.40", fees: "2.00", entryAt: "2026-01-20T14:45:00Z", exitAt: "2026-01-29T19:30:00Z", idempotencyKey: "seed-004" },
  { symbol: "GOOG", side: "LONG", quantity: "25",  entryPrice: "152.00", exitPrice: "159.20", fees: "1.10", entryAt: "2026-02-02T15:00:00Z", exitAt: "2026-02-09T18:00:00Z", notes: "Plan adherence ok", idempotencyKey: "seed-005" },

  // Losses - long
  { symbol: "TSLA", side: "LONG", quantity: "40",  entryPrice: "245.50", exitPrice: "232.10", fees: "1.40", entryAt: "2026-01-09T15:00:00Z", exitAt: "2026-01-13T17:30:00Z", notes: "Stop hit", idempotencyKey: "seed-006" },
  { symbol: "META", side: "LONG", quantity: "20",  entryPrice: "510.00", exitPrice: "498.50", fees: "1.20", entryAt: "2026-01-16T14:30:00Z", exitAt: "2026-01-21T20:00:00Z", notes: "Weak momentum", idempotencyKey: "seed-007" },
  { symbol: "AMZN", side: "LONG", quantity: "30",  entryPrice: "188.40", exitPrice: "182.00", fees: "1.30", entryAt: "2026-01-23T15:15:00Z", exitAt: "2026-01-30T18:00:00Z", idempotencyKey: "seed-008" },
  { symbol: "NFLX", side: "LONG", quantity: "15",  entryPrice: "612.00", exitPrice: "598.50", fees: "1.10", entryAt: "2026-02-05T14:30:00Z", exitAt: "2026-02-11T19:30:00Z", notes: "Cut early", idempotencyKey: "seed-009" },

  // Wins - short
  { symbol: "PLTR", side: "SHORT", quantity: "300", entryPrice: "28.50", exitPrice: "25.10", fees: "2.00", entryAt: "2026-01-07T15:00:00Z", exitAt: "2026-01-14T18:00:00Z", notes: "Reversal trade", idempotencyKey: "seed-010" },
  { symbol: "COIN", side: "SHORT", quantity: "60",  entryPrice: "245.00", exitPrice: "228.40", fees: "1.80", entryAt: "2026-01-12T14:30:00Z", exitAt: "2026-01-19T19:00:00Z", idempotencyKey: "seed-011" },
  { symbol: "SHOP", side: "SHORT", quantity: "100", entryPrice: "82.50", exitPrice: "76.20", fees: "1.50", entryAt: "2026-01-19T15:00:00Z", exitAt: "2026-01-26T18:30:00Z", notes: "Distribution top", idempotencyKey: "seed-012" },
  { symbol: "RBLX", side: "SHORT", quantity: "150", entryPrice: "45.20", exitPrice: "41.80", fees: "1.40", entryAt: "2026-02-01T15:30:00Z", exitAt: "2026-02-08T19:00:00Z", idempotencyKey: "seed-013" },

  // Losses - short
  { symbol: "SNOW", side: "SHORT", quantity: "40",  entryPrice: "168.00", exitPrice: "176.50", fees: "1.30", entryAt: "2026-01-10T14:45:00Z", exitAt: "2026-01-15T18:00:00Z", notes: "Squeeze, stopped", idempotencyKey: "seed-014" },
  { symbol: "DDOG", side: "SHORT", quantity: "50",  entryPrice: "128.40", exitPrice: "134.20", fees: "1.20", entryAt: "2026-01-21T15:00:00Z", exitAt: "2026-01-27T19:00:00Z", idempotencyKey: "seed-015" },
  { symbol: "CRWD", side: "SHORT", quantity: "20",  entryPrice: "342.00", exitPrice: "356.80", fees: "1.10", entryAt: "2026-02-04T15:15:00Z", exitAt: "2026-02-10T18:30:00Z", notes: "Plan break", idempotencyKey: "seed-016" },

  // Mixed cohort
  { symbol: "SPY",  side: "LONG", quantity: "80",  entryPrice: "545.20", exitPrice: "551.40", fees: "1.60", entryAt: "2026-02-12T14:30:00Z", exitAt: "2026-02-18T20:00:00Z", notes: "Index hedge close", idempotencyKey: "seed-017" },
  { symbol: "QQQ",  side: "LONG", quantity: "60",  entryPrice: "478.10", exitPrice: "470.30", fees: "1.40", entryAt: "2026-02-13T15:00:00Z", exitAt: "2026-02-20T18:00:00Z", idempotencyKey: "seed-018" },
  { symbol: "IWM",  side: "SHORT", quantity: "120", entryPrice: "212.50", exitPrice: "207.80", fees: "1.70", entryAt: "2026-02-15T14:45:00Z", exitAt: "2026-02-22T19:30:00Z", notes: "Small-cap weakness", idempotencyKey: "seed-019" },
  { symbol: "TSM",  side: "LONG", quantity: "45",  entryPrice: "168.40", exitPrice: "175.90", fees: "1.30", entryAt: "2026-02-19T15:30:00Z", exitAt: "2026-02-26T18:00:00Z", idempotencyKey: "seed-020" },

  // Open position (no exit) to exercise nullable exit fields
  { symbol: "ARM",  side: "LONG", quantity: "75",  entryPrice: "132.10", exitPrice: null, fees: "1.20", entryAt: "2026-03-02T15:00:00Z", exitAt: null, notes: "Still open", idempotencyKey: "seed-021" }
];

async function main(): Promise<void> {
  for (const t of SEED_TRADES) {
    const data: Prisma.TradeUncheckedCreateInput = {
      symbol: t.symbol,
      side: t.side,
      quantity: new Prisma.Decimal(t.quantity),
      entryPrice: new Prisma.Decimal(t.entryPrice),
      exitPrice: t.exitPrice === null ? null : new Prisma.Decimal(t.exitPrice),
      fees: new Prisma.Decimal(t.fees),
      entryAt: new Date(t.entryAt),
      exitAt: t.exitAt === null ? null : new Date(t.exitAt),
      notes: t.notes ?? null,
      idempotencyKey: t.idempotencyKey
    };

    await prisma.trade.upsert({
      where: { idempotencyKey: t.idempotencyKey },
      update: data,
      create: data
    });
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded ${SEED_TRADES.length} trades.`);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
