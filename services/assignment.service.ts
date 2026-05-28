import { api } from "@/lib/api";
import { Assignment } from "@/models/assignment/Assignment.model";

function normalizeAssignment(response: unknown): Assignment {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    const assignmentId = record.id ?? record.assignmentId;

    if (typeof assignmentId === "string" || typeof assignmentId === "number") {
      return {
        assignmentId,
        courseId:
          typeof record.courseId === "string" ||
          typeof record.courseId === "number"
            ? record.courseId
            : null,
        createdAt:
          typeof record.createdAt === "string" ? record.createdAt : null,
        description:
          typeof record.description === "string" ? record.description : null,
        due_date: typeof record.dueAt === "string" ? record.dueAt : null,
        dueAt: typeof record.dueAt === "string" ? record.dueAt : null,
        dueDate: typeof record.dueAt === "string" ? record.dueAt : null,
        id: assignmentId,
        max_score: typeof record.maxScore === "number" ? record.maxScore : null,
        maxScore: typeof record.maxScore === "number" ? record.maxScore : null,
        title:
          typeof record.title === "string"
            ? record.title
            : "Untitled assignment",
        updatedAt:
          typeof record.updatedAt === "string" ? record.updatedAt : null,
      };
    }

    const nestedAssignment = Object.values(record).find(
      (value) =>
        value &&
        typeof value === "object" &&
        (typeof (value as Record<string, unknown>).id === "string" ||
          typeof (value as Record<string, unknown>).id === "number" ||
          typeof (value as Record<string, unknown>).assignmentId === "string" ||
          typeof (value as Record<string, unknown>).assignmentId === "number"),
    );

    if (nestedAssignment) {
      return normalizeAssignment(nestedAssignment);
    }
  }

  throw new Error("Assignment details are unavailable.");
}

export async function getAssignmentById(
  assignmentId: string,
): Promise<Assignment> {
  const response = await api.get(`/assignments/${assignmentId}`, {}, true);

  return normalizeAssignment(response);
}
