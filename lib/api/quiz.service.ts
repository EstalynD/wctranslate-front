/**
 * Quiz Service - Servicio para gestionar quizzes
 */
import { httpClient } from "./client";
import { apiConfig } from "./config";
import type {
  QuizForStudent,
  CanStartResponse,
  StartAttemptResponse,
  SubmitAttemptResponse,
  StartAttemptDto,
  SubmitAttemptDto,
  SaveProgressDto,
} from "../types/quiz.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

class QuizService {
  /**
   * Obtener quiz para estudiante (sin respuestas correctas)
   */
  async getQuizForStudent(quizId: string): Promise<QuizForStudent> {
    const response = await httpClient.get<ApiResponse<QuizForStudent>>(
      apiConfig.endpoints.quiz.getForStudent(quizId)
    );
    return response.data;
  }

  /**
   * Verificar si puede iniciar un intento
   */
  async canStartAttempt(quizId: string): Promise<CanStartResponse> {
    const response = await httpClient.get<ApiResponse<CanStartResponse>>(
      apiConfig.endpoints.quiz.canStart(quizId)
    );
    return response.data;
  }

  /**
   * Iniciar un intento de quiz
   */
  async startAttempt(quizId: string): Promise<StartAttemptResponse> {
    const dto: StartAttemptDto = { quizId };
    const response = await httpClient.post<ApiResponse<StartAttemptResponse>>(
      apiConfig.endpoints.quiz.startAttempt,
      dto
    );
    return response.data;
  }

  /**
   * Enviar quiz completado
   */
  async submitAttempt(
    attemptId: string,
    answers: SubmitAttemptDto
  ): Promise<SubmitAttemptResponse> {
    const response = await httpClient.post<ApiResponse<SubmitAttemptResponse>>(
      apiConfig.endpoints.quiz.submitAttempt(attemptId),
      answers
    );
    return response.data;
  }

  /**
   * Guardar progreso parcial
   */
  async saveProgress(attemptId: string, answers: SaveProgressDto): Promise<void> {
    await httpClient.patch(
      apiConfig.endpoints.quiz.saveProgress(attemptId),
      answers
    );
  }

  /**
   * Obtener detalle de un intento
   */
  async getAttemptDetail(attemptId: string) {
    const response = await httpClient.get<ApiResponse<Record<string, unknown>>>(
      apiConfig.endpoints.quiz.attemptDetail(attemptId)
    );
    return response.data;
  }

  /**
   * Abandonar intento
   */
  async abandonAttempt(attemptId: string): Promise<void> {
    await httpClient.post(apiConfig.endpoints.quiz.abandonAttempt(attemptId));
  }
}

export const quizService = new QuizService();
