import { httpClient } from '../http-client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  category: string;
  createdAt: string;
  userName: string;
}

export interface CreateTaskDto {
  Title: string;
  Description: string;
  IsCompleted: boolean;
  Category: string;
  UserId: number;
}

export interface UpdateTaskDto {
  Title?: string;
  Description?: string;
  IsCompleted?: boolean;
  Category?: string;
}

class TaskService {
  private readonly BASE_PATH = '/tasks';

  /**
   * Busca todas as tarefas do usuário e as categorias disponíveis
   */
  async getTasks(): Promise<Task[]> {
    return httpClient.get<Task[]>(this.BASE_PATH);
  }

  /**
   * Busca uma tarefa específica por ID
   */
  async getTaskById(id: string): Promise<Task> {
    return httpClient.get<Task>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Cria uma nova tarefa
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    return httpClient.post<Task>(this.BASE_PATH, data);
  }

  /**
   * Atualiza uma tarefa existente
   */
  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return httpClient.put<Task>(`${this.BASE_PATH}/${id}`, data);
  }

  /**
   * Exclui uma tarefa
   */
  async deleteTask(id: string): Promise<void> {
    return httpClient.delete<void>(`${this.BASE_PATH}/${id}`);
  }
}

export const taskService = new TaskService();
