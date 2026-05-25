"use client"

import Link from "next/link"
import {
  AlertTriangle,
  FileText,
  CheckCircle,
  AlertCircle,
  Hash,
  TrendingUp,
  MoreVertical,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AppHeader } from "@/components/layout/app-header"

const recentInvoices = [
  {
    id: "PREF-9985",
    date: "Hoy, 10:45 AM",
    client: "Inversiones Andinas S.A.S",
    total: "$ 1,250,000 COP",
    status: "aprobada",
  },
  {
    id: "PREF-9984",
    date: "Hoy, 10:12 AM",
    client: "Comercializadora Global Ltda",
    total: "$ 4,500,000 COP",
    status: "rechazada",
  },
  {
    id: "PREF-9983",
    date: "Hoy, 09:30 AM",
    client: "Servicios Técnicos del Norte",
    total: "$ 850,000 COP",
    status: "procesando",
  },
  {
    id: "PREF-9982",
    date: "Ayer, 16:45 PM",
    client: "Distribuidora El Sol",
    total: "$ 3,200,000 COP",
    status: "aprobada",
  },
]

const statusConfig = {
  aprobada: {
    label: "Aprobada",
    className: "bg-emerald/10 text-emerald border-emerald/30",
  },
  rechazada: {
    label: "Rechazada",
    className: "bg-coral/10 text-coral border-coral/30",
  },
  procesando: {
    label: "Procesando",
    className: "bg-gold/10 text-gold border-gold/30",
  },
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="p-6 space-y-6">
        {/* Alert Banner */}
        <div className="bg-coral/5 border border-coral/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-coral mt-0.5" />
            <div>
              <p className="font-semibold text-coral">
                Atención Requerida: Facturas Rechazadas
              </p>
              <p className="text-sm text-coral/80 mt-1">
                Existen 2 facturas recientes con estado de rechazo por parte de la DIAN. 
                Por favor, revise el registro de contingencias.
              </p>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Resumen Operativo
          </h1>
          <p className="text-slate mt-1">
            Estado actual de emisión electrónica
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Facturas Hoy */}
          <Card className="border-border">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-label-caps text-slate">FACTURAS HOY</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-display font-bold text-ink">
                      142
                    </span>
                    <span className="flex items-center text-sm text-emerald font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      12%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-cloud rounded-lg">
                  <FileText className="h-5 w-5 text-ink" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aprobadas DIAN */}
          <Card className="border-border">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-label-caps text-slate">APROBADAS DIAN</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-display font-bold text-ink">
                      138
                    </span>
                    <span className="text-sm text-slate">/ 142</span>
                  </div>
                </div>
                <div className="p-2 bg-emerald/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contingencia / Rechazo */}
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-label-caps text-gold">
                    EN CONTINGENCIA / RECHAZO
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-display font-bold text-ink">
                      4
                    </span>
                  </div>
                  <p className="text-sm text-slate mt-1">Requieren acción</p>
                </div>
                <div className="p-2 bg-gold/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rango de Numeración */}
          <Card className="border-border">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <p className="text-label-caps text-slate">
                    RANGO DE NUMERACIÓN
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-display font-bold text-ink">
                      85%
                    </span>
                    <span className="text-sm text-slate">Consumido</span>
                  </div>
                  <Progress value={85} className="mt-3 h-2 bg-mist" />
                  <p className="text-xs text-slate mt-2 font-mono">
                    PREF-9985 / 10000
                  </p>
                </div>
                <div className="p-2 bg-cloud rounded-lg">
                  <Hash className="h-5 w-5 text-ink" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="font-display text-xl font-bold text-ink">
              Últimas Facturas Emitidas
            </CardTitle>
            <Button variant="ghost" asChild className="text-ink">
              <Link href="/invoices">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                      NÚMERO
                    </th>
                    <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                      FECHA / HORA
                    </th>
                    <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                      CLIENTE / ADQUIRIENTE
                    </th>
                    <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                      TOTAL
                    </th>
                    <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                      ESTADO DIAN
                    </th>
                    <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                      ACCIÓN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-border last:border-0 hover:bg-cloud/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm font-medium text-ink">
                          {invoice.id}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate">
                        {invoice.date}
                      </td>
                      <td className="py-4 px-4 text-sm text-ink">
                        {invoice.client}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-ink font-mono">
                        {invoice.total}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={
                            statusConfig[invoice.status as keyof typeof statusConfig]
                              .className
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                          {
                            statusConfig[invoice.status as keyof typeof statusConfig]
                              .label
                          }
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4 text-slate" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver detalle</DropdownMenuItem>
                            <DropdownMenuItem>Descargar PDF</DropdownMenuItem>
                            <DropdownMenuItem>Descargar XML</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
