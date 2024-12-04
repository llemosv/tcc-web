import { useQuery } from '@tanstack/react-query'
import { SquareCheck } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { AcceptSolicitationDialog } from '@/components/accept-solicitation-dialog'
import { AlterThemeTccDialog } from '@/components/alter-theme-tcc-dialog'
import { ConcludeTccDialog } from '@/components/conclude-tcc-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { getUserType } from '@/utils/get-user-type'

import { getGuidances } from '../../../../api/get-guidances'
import { CardSkeleton } from '../partials/card-skeleton'
import { WorkFilters } from '../partials/works-filters'

export function CoordinatorWorks() {
  const userType = getUserType()
  const navigate = useNavigate()
  const [searchParams, _] = useSearchParams()
  const { user } = useAuth()

  const name = searchParams.get('name')
  const status = searchParams.get('status')
  const teacher = searchParams.get('teacher')

  const { data: works, isLoading: isLoadingGuidances } = useQuery({
    queryKey: ['works', user, userType, name, status, teacher],
    queryFn: () =>
      getGuidances({
        studentId: user!.id,
        type: userType,
        name,
        status: status === 'all' ? null : status,
        teacher: teacher === 'all' ? null : teacher,
        idCourse: user!.id_curso,
      }),
  })

  function handleViewProjects(id: number | string) {
    navigate(`/works/${id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Trabalhos
        </h3>
      </div>

      <WorkFilters />

      {isLoadingGuidances ? (
        <CardSkeleton />
      ) : works?.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <h3 className="text-2xl font-semibold">Nenhum trabalho encontrado</h3>
        </div>
      ) : (
        <>
          {works &&
            works.map((work) => (
              <Card key={work.id_orientacao}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="flex gap-3 text-center">
                      {work.tema}
                      {work.solicitacao_aceita && !work.data_finalizacao && (
                        <Dialog>
                          <DialogTrigger>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <SquareCheck className="hover:cursor-pointer hover:text-emerald-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Marcar como concluído</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </DialogTrigger>

                          <ConcludeTccDialog id_tcc={work.id_orientacao} />
                        </Dialog>
                      )}
                    </CardTitle>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-muted-foreground/50"
                          // onClick={() => handleViewProjects(work.id_orientacao)}
                          disabled={!work.solicitacao_aceita}
                        >
                          Alterar tema
                        </button>
                      </DialogTrigger>

                      <AlterThemeTccDialog id={work.id_orientacao} />
                    </Dialog>
                  </div>

                  <div className="flex justify-between">
                    <CardDescription>
                      Solicitante:{' '}
                      <span className="font-semibold">{work.aluno}</span>
                    </CardDescription>
                    <CardDescription>
                      Previsão de entrega:{' '}
                      <span className="font-semibold">
                        {work.previsao_entrega}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex justify-between">
                    <CardDescription>
                      Orientador:{' '}
                      <span className="font-semibold">{work.orientador}</span>
                    </CardDescription>
                  </div>
                  <div className="flex justify-between">
                    <CardDescription
                      className={cn(
                        'font-semibold',
                        !work.solicitacao_aceita && !work.data_reprovacao
                          ? 'text-yellow-500'
                          : !work.solicitacao_aceita && work.data_reprovacao
                            ? 'text-red-500 dark:text-red-600'
                            : 'text-emerald-500',
                      )}
                    >
                      Status orientação:{' '}
                      <span className="font-semibold">
                        {work.data_finalizacao
                          ? 'Concluído'
                          : !work.solicitacao_aceita && !work.data_reprovacao
                            ? 'Pendente'
                            : !work.solicitacao_aceita && work.data_reprovacao
                              ? 'Recusada'
                              : 'Aceita'}
                      </span>
                    </CardDescription>
                    {work.justificativa_reprovacao && (
                      <CardDescription>
                        Justificativa:{' '}
                        <span className="font-semibold">
                          {work.justificativa_reprovacao}
                        </span>
                      </CardDescription>
                    )}
                  </div>
                  {work.data_finalizacao && (
                    <div className="flex justify-between">
                      <CardDescription>
                        Data finalização:{' '}
                        <span className="font-semibold">
                          {work.data_finalizacao}
                        </span>
                      </CardDescription>
                      {work.justificativa_reprovacao && (
                        <CardDescription>
                          Justificativa:{' '}
                          <span className="font-semibold">
                            {work.justificativa_reprovacao}
                          </span>
                        </CardDescription>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex justify-between">
                  <p>
                    Total de atividades:{' '}
                    <span className="font-semibold text-primary">
                      {work.total_atividades}
                    </span>
                  </p>
                  {!work.solicitacao_aceita && !work.data_reprovacao ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="cursor-pointer  text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-muted-foreground/50"
                          disabled={
                            works &&
                            !work.solicitacao_aceita &&
                            work.data_reprovacao !== null
                          }
                        >
                          Responder solicitação
                        </button>
                      </DialogTrigger>

                      <AcceptSolicitationDialog work={work} />
                    </Dialog>
                  ) : (
                    <button
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:text-muted-foreground/50"
                      onClick={() => handleViewProjects(work.id_orientacao)}
                      disabled={!work.solicitacao_aceita}
                    >
                      Visualizar trabalho
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
        </>
      )}
    </div>
  )
}
