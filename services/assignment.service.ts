import { api } from "@/lib/api";
import { Assignment } from "@/models/assignment/Assignment.model";

function normalizeAssignment(response: unknown): Assignment {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    if (typeof record.assignmentId === "number") {
      return record as Assignment;
    }

    const nestedAssignment = Object.values(record).find(
      (value) =>
        value &&
        typeof value === "object" &&
        typeof (value as Record<string, unknown>).assignmentId === "number",
    );

    if (nestedAssignment) {
      return nestedAssignment as Assignment;
    }
  }

  throw new Error("Assignment details are unavailable.");
}

export async function getAssignmentById(
  assignmentId: string,
): Promise<Assignment> {
  const response = await api.get(
    `/assignment/get_assignment_by_id/${assignmentId}`,
    {},
    true,
  );

  return normalizeAssignment(response);
}
