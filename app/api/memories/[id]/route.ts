import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { deleteMemory, updateMemory } from "@/lib/memories";

function isValidFocusValue(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }

  if (typeof value !== "number") {
    return false;
  }

  return value >= 0 && value <= 1;
}

function isValidAspectRatio(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }

  if (typeof value !== "number") {
    return false;
  }

  return value > 0 && value <= 5;
}

/**
 * DELETE /api/memories/[id] - Delete a memory
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const userId = parseInt(session.user.id);

    await deleteMemory(id, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/memories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete memory" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/memories/[id] - Update a memory
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const userId = parseInt(session.user.id);

    const { imageFocusX, imageFocusY, imageAspectRatio } = body as {
      imageFocusX?: unknown;
      imageFocusY?: unknown;
      imageAspectRatio?: unknown;
    };

    const isValidFocus =
      isValidFocusValue(imageFocusX) &&
      isValidFocusValue(imageFocusY) &&
      isValidAspectRatio(imageAspectRatio);

    if (!isValidFocus) {
      return NextResponse.json(
        { error: "Invalid image focus values" },
        { status: 400 }
      );
    }

    const memory = await updateMemory(id, userId, body);

    return NextResponse.json({ memory });
  } catch (error) {
    console.error("PATCH /api/memories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update memory" },
      { status: 500 }
    );
  }
}
