import { api } from '@/lib/axios'

export interface Task {
  id: string
  tarefa: string
  data_criacao: string
  previsao_entrega: string
  data_finalizacao: string
  data_pendente_revisao: string
  justificativa: string | null
}

export async function getPendingTasks(idTrabalho: string): Promise<Task[]> {
  const response = await api.get<Task[]>(`/tasks/pending/${idTrabalho}`)

  return response.data
}
