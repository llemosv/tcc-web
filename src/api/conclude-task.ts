import { api } from '@/lib/axios'

export interface ConcludeTask {
  id: string
  conclude: boolean
  justification: string
}

export async function concludeTask({
  id,
  conclude,
  justification,
}: ConcludeTask): Promise<void> {
  await api.patch(`tasks/${id}/conclude`, {
    conclude,
    justification,
  })
}
