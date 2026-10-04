"use client";

import Dexie, { type Table } from "dexie";
import type { InspectionDraft } from "./types";

type DraftRecord = { id: string; payload: InspectionDraft; updatedAt: number };
type QueueRecord = { id: string; entity: string; entityId?: string; operation: "UPSERT" | "DELETE"; payload: unknown; createdAt: number };

class InspectionDB extends Dexie {
  drafts!: Table<DraftRecord, string>;
  queue!: Table<QueueRecord, string>;
  constructor() {
    super("om-car-inspection");
    this.version(1).stores({
      drafts: "id,updatedAt",
      queue: "id,createdAt,entity",
    });
  }
}

const db = new InspectionDB();

export async function saveLocalDraft(id: string, payload: InspectionDraft) {
  await db.drafts.put({ id, payload, updatedAt: Date.now() });
}

export async function loadLocalDraft(id: string) {
  return db.drafts.get(id);
}

export async function enqueue(id: string, entity: string, operation: QueueRecord["operation"], payload: unknown, entityId?: string) {
  await db.queue.put({ id, entity, entityId, operation, payload, createdAt: Date.now() });
}

export async function pendingQueue() {
  return db.queue.orderBy("createdAt").toArray();
}

export async function removeQueueItem(id: string) {
  return db.queue.delete(id);
}
