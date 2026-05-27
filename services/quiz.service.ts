import { api } from "@/lib/api";
import { Quiz } from "@/models/quiz/Quiz.model";

function normalizeQuiz(response: unknown): Quiz {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    if (typeof record.quizId === "number") {
      return record as Quiz;
    }

    const nestedQuiz = Object.values(record).find(
      (value) =>
        value &&
        typeof value === "object" &&
        typeof (value as Record<string, unknown>).quizId === "number",
    );

    if (nestedQuiz) {
      return nestedQuiz as Quiz;
    }
  }

  throw new Error("Quiz details are unavailable.");
}

export async function getQuizById(quizId: string): Promise<Quiz> {
  const response = await api.get(`/quiz/get_quiz_by_id/${quizId}`, {}, true);
  return normalizeQuiz(response);
}
