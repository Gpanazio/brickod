import { test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryRepository } from "./repository";

interface Item {
  id: string;
  name: string;
}

interface InsertItem {
  id?: string;
  name: string;
}

test("memory repository CRUD", async () => {
  let counter = 0;
  const repo = createMemoryRepository<Item, InsertItem>(
    (data) => ({ id: data.id ?? String(counter++), name: data.name }),
    (existing, updates) => ({ ...existing, ...updates }),
  );

  const created = await repo.create({ name: "A" });
  assert.equal(created.name, "A");

  const fetched = await repo.get(created.id);
  assert.deepEqual(fetched, created);

  const updated = await repo.update(created.id, { name: "B" });
  assert.equal(updated?.name, "B");

  const list = await repo.list();
  assert.equal(list.length, 1);

  const deleted = await repo.delete(created.id);
  assert.equal(deleted, true);
  assert.equal(await repo.get(created.id), undefined);
});
