import { getSql } from "./db";

export interface Memory {
  id: string;
  user_id: number;
  title: string;
  date: string;
  caption: string;
  description: string;
  image_url: string;
  image_focus_x: number | null;
  image_focus_y: number | null;
  image_aspect_ratio: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface MemoriesPage {
  memories: Memory[];
  nextCursor?: string;
}

export interface CreateMemoryInput {
  userId: number;
  title: string;
  date: string;
  caption: string;
  description?: string;
  imageUrl: string;
  imageFocusX?: number;
  imageFocusY?: number;
  imageAspectRatio?: number;
}

export interface UpdateMemoryInput
  extends Partial<Omit<CreateMemoryInput, "userId">> {
  imageFocusX?: number;
  imageFocusY?: number;
  imageAspectRatio?: number;
}

interface MemoriesPageOptions {
  limit?: number;
  cursor?: string;
}

interface DecodedCursor {
  createdAt: Date;
  id: string;
}

function encodeCursor(memory: Memory): string {
  const payload = {
    createdAt: memory.created_at.toISOString(),
    id: memory.id,
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

function decodeCursor(cursor?: string): DecodedCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const json = Buffer.from(cursor, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { createdAt?: string; id?: string };
    if (!parsed.createdAt || !parsed.id) {
      return null;
    }

    return {
      createdAt: new Date(parsed.createdAt),
      id: parsed.id,
    };
  } catch {
    return null;
  }
}

function clampLimit(limit?: number): number {
  const parsed = typeof limit === "number" ? limit : 50;
  return Math.min(100, Math.max(1, parsed));
}

/**
 * Get memories for a user (paginated)
 */
export async function getMemories(
  userId: number,
  options: MemoriesPageOptions = {}
): Promise<MemoriesPage> {
  try {
    const sql = getSql();
    const limit = clampLimit(options.limit);
    const cursor = decodeCursor(options.cursor);
    const cursorClause = cursor
      ? sql`AND (created_at > ${cursor.createdAt} OR (created_at = ${cursor.createdAt} AND id > ${cursor.id}))`
      : sql``;

    const result = (await sql`
      SELECT id, user_id, title, date, caption, description, image_url, image_focus_x, image_focus_y, image_aspect_ratio, created_at, updated_at
      FROM memories
      WHERE user_id = ${userId}
      ${cursorClause}
      ORDER BY created_at ASC, id ASC
      LIMIT ${limit + 1}
    `) as Memory[];

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, -1) : result;
    const nextCursor = hasMore ? encodeCursor(items[items.length - 1]) : undefined;

    return { memories: items, nextCursor };
  } catch (error) {
    console.error("Error fetching memories:", error);
    throw new Error("Failed to fetch memories");
  }
}

/**
 * Create a new memory
 */
export async function createMemory(input: CreateMemoryInput): Promise<Memory> {
  try {
    const sql = getSql();
    const result = (await sql`
      INSERT INTO memories (user_id, title, date, caption, description, image_url, image_focus_x, image_focus_y, image_aspect_ratio)
      VALUES (
        ${input.userId},
        ${input.title},
        ${input.date},
        ${input.caption},
        ${input.description || input.caption},
        ${input.imageUrl},
        ${input.imageFocusX ?? null},
        ${input.imageFocusY ?? null},
        ${input.imageAspectRatio ?? null}
      )
      RETURNING id, user_id, title, date, caption, description, image_url, image_focus_x, image_focus_y, image_aspect_ratio, created_at, updated_at
    `) as Memory[];

    return result[0];
  } catch (error) {
    console.error("Error creating memory:", error);
    throw new Error("Failed to create memory");
  }
}

/**
 * Delete a memory
 */
export async function deleteMemory(
  memoryId: string,
  userId: number
): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      DELETE FROM memories
      WHERE id = ${memoryId} AND user_id = ${userId}
    `;
  } catch (error) {
    console.error("Error deleting memory:", error);
    throw new Error("Failed to delete memory");
  }
}

/**
 * Update a memory
 */
export async function updateMemory(
  memoryId: string,
  userId: number,
  updates: UpdateMemoryInput
): Promise<Memory> {
  try {
    const sql = getSql();
    
    // For simplicity, we'll update all fields
    // In production, you might want more granular control
    const title = updates.title;
    const date = updates.date;
    const caption = updates.caption;
    const description = updates.description;
    const imageUrl = updates.imageUrl;
    const imageFocusX = updates.imageFocusX;
    const imageFocusY = updates.imageFocusY;
    const imageAspectRatio = updates.imageAspectRatio;
    
    const result = (await sql`
      UPDATE memories
      SET 
        title = COALESCE(${title}, title),
        date = COALESCE(${date}, date),
        caption = COALESCE(${caption}, caption),
        description = COALESCE(${description}, description),
        image_url = COALESCE(${imageUrl}, image_url),
        image_focus_x = COALESCE(${imageFocusX}, image_focus_x),
        image_focus_y = COALESCE(${imageFocusY}, image_focus_y),
        image_aspect_ratio = COALESCE(${imageAspectRatio}, image_aspect_ratio),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${memoryId} AND user_id = ${userId}
      RETURNING id, user_id, title, date, caption, description, image_url, image_focus_x, image_focus_y, image_aspect_ratio, created_at, updated_at
    `) as Memory[];

    if (result.length === 0) {
      throw new Error("Memory not found or unauthorized");
    }

    return result[0];
  } catch (error) {
    console.error("Error updating memory:", error);
    throw new Error("Failed to update memory");
  }
}
