import { questions } from "@/config/database/schema";
import { db } from "@/config/database/index";
import { and, eq } from "drizzle-orm";

export async function saveQuestions(
  questionsData: { interviewQuestions: any[] } | any[], // can be object or array
  resumeId: number,
  sessionId: string,
  difficulty: string,
  userId: string
) {
  const interviewQuestions = Array.isArray(questionsData)
    ? questionsData
    : questionsData?.interviewQuestions || questionsData?.questions;

  if (!Array.isArray(interviewQuestions)) {
    console.error(
      "Invalid questionsData passed to saveQuestions:",
      questionsData
    );
    throw new Error(
      "Invalid questionsData format: interviewQuestions must be an array"
    );
  }

  const questionsArray = interviewQuestions.map((q: any) => ({
    questionId: q.question_id ?? null,
    category: q.category ?? null,
    question: q.question_text ?? q.question ?? "", // prefer question_text, fallback to question
    difficulty: q.difficulty ?? difficulty,
    hint: q.hint ?? null,
  }));

  await db
    .insert(questions)
    .values({
      resumeId,
      sessionId,
      userId,
      questions: questionsArray, // array of questions stored in one row
      difficulty,
    })
    .returning();

  return questionsArray; // Return the saved questions
}

export async function getQuestionsBySessionId(
  sessionId: string,
  userId: string
) {
  // Fetch questions matching the given sessionId and userId
  const fetchedQuestions = await db
    .select()
    .from(questions)
    .where(
      and(eq(questions.sessionId, sessionId), eq(questions.userId, userId))
    )
    .execute();

  // Process the fetched questions if needed
  const processedQuestions = fetchedQuestions.map((question) => ({
    id: question.id,
    userId: question.userId,
    resumeId: question.resumeId,
    questions: question.questions,
    difficulty: question.difficulty,
    status: question.status,
    score: question.score,
    timeTaken: question.timeTaken,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  }));

  return processedQuestions;
}
