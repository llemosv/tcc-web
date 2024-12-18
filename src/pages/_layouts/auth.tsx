import { SquareChartGantt } from 'lucide-react'
import { Outlet } from 'react-router-dom'
export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2 antialiased">
      {/* Coluna esquerda */}
      <div className="flex w-full flex-col justify-between border-b sm:border-b-0 sm:border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <div className="flex items-center gap-3 text-lg font-medium text-foreground">
          <SquareChartGantt className="h-5 w-5" />
          <span className="font-semibold">gerenciador.tcc</span>
        </div>
        <footer className="text-sm">
          &copy; gerenciador.tcc - {new Date().getFullYear()}
        </footer>
      </div>

      {/* Coluna direita */}
      <div className="flex w-full flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
