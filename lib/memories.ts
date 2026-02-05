import { getSql } from "./db";

export interface Memory {
  id: string;
  user_id: number;
  title: string;
  date: string;
  caption: string;
  description: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMemoryInput {
  userId: number;
  title: string;
  date: string;
  caption: string;
  description?: string;
  imageUrl: string;
}

/**
 * Get all memories for a user
 */
export async function getMemories(userId: number): Promise<Memory[]> {
  try {
    const sql = getSql();
    const result = (await sql`
      SELECT id, user_id, title, date, caption, description, image_url, created_at, updated_at
      FROM memories
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `) as Memory[];

    return result;
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
      INSERT INTO memories (user_id, title, date, caption, description, image_url)
      VALUES (
        ${input.userId},
        ${input.title},
        ${input.date},
        ${input.caption},
        ${input.description || input.caption},
        ${input.imageUrl}
      )
      RETURNING id, user_id, title, date, caption, description, image_url, created_at, updated_at
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
  updates: Partial<Omit<CreateMemoryInput, "userId">>
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
    
    const result = (await sql`
      UPDATE memories
      SET 
        title = COALESCE(${title}, title),
        date = COALESCE(${date}, date),
        caption = COALESCE(${caption}, caption),
        description = COALESCE(${description}, description),
        image_url = COALESCE(${imageUrl}, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${memoryId} AND user_id = ${userId}
      RETURNING id, user_id, title, date, caption, description, image_url, created_at, updated_at
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
