import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getMemories, createMemory } from "@/lib/memories";

/**
 * Validate required fields for memory creation
 */
function validateMemoryFields(fields: {
  title?: string;
  date?: string;
  caption?: string;
  imageUrl?: string;
}): boolean {
  const requiredFields = [fields.title, fields.date, fields.caption, fields.imageUrl];
  return requiredFields.every(field => field !== undefined && field !== null && field !== '');
}

function isValidFocusValue(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }

  if (typeof value !== "number") {
    return false;
  }

  return value >= 0 && value <= 1;
}

/**
 * GET /api/memories - Get all memories for authenticated user
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const memories = await getMemories(userId);

    return NextResponse.json({ memories });
  } catch (error) {
    console.error("GET /api/memories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch memories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/memories - Create a new memory
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, date, caption, description, imageUrl, imageFocusX, imageFocusY } = body;

    // Validate required fields
    if (!validateMemoryFields({ title, date, caption, imageUrl })) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidFocusValue(imageFocusX) || !isValidFocusValue(imageFocusY)) {
      return NextResponse.json(
        { error: "Invalid image focus values" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);
    const memory = await createMemory({
      userId,
      title,
      date,
      caption,
      description,
      imageUrl,
      imageFocusX,
      imageFocusY,
    });

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    console.error("POST /api/memories error:", error);
    return NextResponse.json(
      { error: "Failed to create memory" },
      { status: 500 }
    );
  }
}
