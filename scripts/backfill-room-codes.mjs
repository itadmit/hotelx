/**
 * Rewrites every Room.code to the clean "R<number>" format.
 *
 *   R101, R201, R305, ...
 *
 * Collisions within the same hotel (e.g. numbers "101" and "101A" both
 * sanitising to "R101") get a numeric suffix: "R101", "R101-2".
 *
 * Run from the project root:
 *     node scripts/backfill-room-codes.mjs
 *
 * Caveat: any printed QR code linking to an old code will stop working.
 * The script prints a per-hotel diff so you can re-print only what
 * actually changed.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function baseCodeFor(number) {
  const safe = String(number).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return `R${safe}`;
}

async function run() {
  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  let totalRenamed = 0;
  let totalSkipped = 0;

  for (const hotel of hotels) {
    const rooms = await prisma.room.findMany({
      where: { hotelId: hotel.id },
      select: { id: true, number: true, code: true },
      orderBy: { number: "asc" },
    });

    if (rooms.length === 0) continue;

    // Reserve every desired target first so the uniqueness loop honours
    // codes we're about to assign to a *different* room in this hotel.
    const used = new Set();
    const plan = [];
    for (const room of rooms) {
      let candidate = baseCodeFor(room.number);
      let attempt = 1;
      while (used.has(candidate)) {
        attempt += 1;
        candidate = `${baseCodeFor(room.number)}-${attempt}`;
      }
      used.add(candidate);
      plan.push({ room, target: candidate });
    }

    console.log(`\n${hotel.name}  (${hotel.slug}) — ${rooms.length} rooms`);
    for (const { room, target } of plan) {
      if (room.code === target) {
        console.log(`  · ${room.number}: ${room.code}  (unchanged)`);
        totalSkipped += 1;
        continue;
      }
      console.log(`  → ${room.number}: ${room.code}  →  ${target}`);
    }

    // Two-phase update avoids transient uniqueness clashes:
    // 1. Park every changed room on a temporary code.
    // 2. Re-assign to the final target.
    const changed = plan.filter((p) => p.room.code !== p.target);
    for (const [i, p] of changed.entries()) {
      await prisma.room.update({
        where: { id: p.room.id },
        data: { code: `__tmp_backfill_${hotel.id}_${i}` },
      });
    }
    for (const p of changed) {
      await prisma.room.update({
        where: { id: p.room.id },
        data: { code: p.target },
      });
      totalRenamed += 1;
    }
  }

  console.log(
    `\nDone. Renamed ${totalRenamed} rooms; ${totalSkipped} already had the target code.`
  );
}

run()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
