import { api } from "@/lib/api";
import { Quiz } from "@/models/quiz/Quiz.model";

function normalizeQuiz(response: unknown): Quiz {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    const quizId = record.id ?? record.quizId;

    if (typeof quizId === "string" || typeof quizId === "number") {
      const closesAt =
        typeof record.closesAt === "string" ? record.closesAt : null;

      return {
        closesAt,
        courseId:
          typeof record.courseId === "string" ||
          typeof record.courseId === "number"
            ? record.courseId
            : null,
        createdAt:
          typeof record.createdAt === "string" ? record.createdAt : null,
        description:
          typeof record.description === "string" ? record.description : null,
        due_date: closesAt,
        dueDate: closesAt,
        googleFormId:
          typeof record.googleFormId === "string" ? record.googleFormId : null,
        googleFormUrl:
          typeof record.googleFormUrl === "string"
            ? record.googleFormUrl
            : null,
        id: quizId,
        maxScore: typeof record.maxScore === "number" ? record.maxScore : null,
        opensAt: typeof record.opensAt === "string" ? record.opensAt : null,
        quizId,
        quizTitle: typeof record.title === "string" ? record.title : undefined,
        timeLimit: null,
        title: typeof record.title === "string" ? record.title : undefined,
        updatedAt:
          typeof record.updatedAt === "string" ? record.updatedAt : null,
      };
    }

    const nestedQuiz = Object.values(record).find(
      (value) =>
        value &&
        typeof value === "object" &&
        (typeof (value as Record<string, unknown>).id === "string" ||
          typeof (value as Record<string, unknown>).id === "number" ||
          typeof (value as Record<string, unknown>).quizId === "string" ||
          typeof (value as Record<string, unknown>).quizId === "number"),
    );

    if (nestedQuiz) {
      return normalizeQuiz(nestedQuiz);
    }
  }

  throw new Error("Quiz details are unavailable.");
}

export async function getQuizById(quizId: string): Promise<Quiz> {
  const response = await api.get(`/quizzes/${quizId}`, {}, true);
  return normalizeQuiz(response);
}
