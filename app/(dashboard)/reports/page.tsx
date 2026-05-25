"use client"

import { useState } from "react"
import {
  Zap,
  FileSpreadsheet,
  Code2,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  MoreVertical,
  Copy,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AppHeader } from "@/components/layout/app-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const invoices = [
  {
    id: "FE-10245",
    date: "28 Sep 2023, 14:30",
    client: "Tech Solutions S.A.S",
    nit: "900.876.543-2",
    total: "$4,500,000",
    status: "aprobado",
    cufe: "a8f9c2e4...b7d1",
  },
  {
    id: "FE-10246",
    date: "28 Sep 2023, 15:15",
    client: "Comercializadora Andina",
    nit: "800.123.456-9",
    total: "$1,250,000",
    status: "aprobado",
    cufe: "f4e1b9a2...c8d3",
  },
  {
    id: "FE-10247",
    date: "28 Sep 2023, 16:05",
    client: "Inversiones Globales",
    nit: "901.987.654-1",
    total: "$890,000",
    status: "rechazado",
    cufe: null,
    error: "Regla: FAD09b",
  },
  {
    id: "FE-10248",
    date: "29 Sep 2023, 08:20",
    client: "Logística Sur",
    nit: "860.555.444-3",
    total: "$3,400,000",
    status: "aprobado",
    cufe: "d3c2a1b9...e4f5",
  },
]

const statusConfig = {
  aprobado: {
    label: "APROBADO",
    className: "bg-emerald/10 text-emerald border-emerald/30",
  },
  rechazado: {
    label: "RECHAZADO",
    className: "bg-coral/10 text-coral border-coral/30",
  },
}

export default function ReportsPage() {
  const [exporting, setExporting] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Generador de Reportes
          </h1>
          <p className="text-slate mt-1">
            Configure los parámetros para extraer la información fiscal de su
            facturación electrónica.
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <p className="text-label-caps text-slate mb-2">PERIODO FISCAL</p>
                <Select defaultValue="30">
                  <SelectTrigger className="bg-white border-mist">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 días</SelectItem>
                    <SelectItem value="30">Últimos 30 días</SelectItem>
                    <SelectItem value="90">Últimos 90 días</SelectItem>
                    <SelectItem value="365">Último año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-label-caps text-slate mb-2">ESTADO DIAN</p>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-white border-mist">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="approved">Aprobados</SelectItem>
                    <SelectItem value="rejected">Rechazados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-label-caps text-slate mb-2">
                  TIPO DE DOCUMENTO
                </p>
                <Select defaultValue="factura">
                  <SelectTrigger className="bg-white border-mist">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="factura">Factura Electrónica</SelectItem>
                    <SelectItem value="nota-credito">Nota Crédito</SelectItem>
                    <SelectItem value="nota-debito">Nota Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-label-caps text-slate mb-2">
                  ADQUIRIENTE (NIT/RAZÓN)
                </p>
                <Input
                  placeholder="Ej: 900.123.456-7"
                  className="bg-white border-mist font-mono"
                />
              </div>
              <Button className="bg-ink hover:bg-ink/90 text-white h-10">
                <Zap className="mr-2 h-4 w-4" />
                Generar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Resultados del Periodo
            </h2>
            <p className="text-sm text-slate">1 Sep 2023 - 30 Sep 2023</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-mist"
              disabled={exporting}
            >
              {exporting ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Exportando PDF... 45%
            </Button>
            <Button variant="outline" className="border-mist">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              XLS
            </Button>
            <Button variant="outline" className="border-mist">
              <Code2 className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" className="border-mist">
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-label-caps text-slate">TOTAL EMITIDO</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-display font-bold text-ink">
                  $142.5M
                </span>
                <span className="text-sm text-slate">COP</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-emerald text-sm">
                <TrendingUp className="h-4 w-4" />
                +12.4% vs mes ant.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <p className="text-label-caps text-slate">APROBADO DIAN</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-display font-bold text-ink">
                  $138.2M
                </span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-emerald text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald" />
                954 Documentos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <p className="text-label-caps text-slate">RECHAZOS</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-display font-bold text-ink">
                  $4.3M
                </span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-coral text-sm">
                <span className="w-2 h-2 rounded-full bg-coral" />
                12 Documentos
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald text-white">
            <CardContent className="pt-5">
              <p className="text-xs text-white/70 uppercase tracking-wider">
                TASA DE ÉXITO
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-display font-bold">98.7%</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-white/80">Óptimo</span>
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardContent className="pt-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                    PREFIJO / FOLIO
                  </th>
                  <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                    FECHA EMISIÓN
                  </th>
                  <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                    ADQUIRIENTE
                  </th>
                  <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                    TOTAL (COP)
                  </th>
                  <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                    ESTADO
                  </th>
                  <th className="text-left py-3 px-4 text-label-caps text-slate font-medium">
                    DATOS TÉCNICOS (CUFE)
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-border last:border-0 hover:bg-cloud/30"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm font-medium text-ink">
                        {invoice.id}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate">
                      {invoice.date}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {invoice.client}
                        </p>
                        <p className="text-xs text-slate font-mono">
                          NIT: {invoice.nit}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-ink font-mono">
                      {invoice.total}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="outline"
                        className={
                          statusConfig[
                            invoice.status as keyof typeof statusConfig
                          ].className
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                        {
                          statusConfig[
                            invoice.status as keyof typeof statusConfig
                          ].label
                        }
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {invoice.cufe ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate bg-cloud px-2 py-1 rounded">
                            {invoice.cufe}
                          </span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="h-3 w-3 text-slate" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-coral text-xs">
                          <AlertTriangle className="h-4 w-4" />
                          {invoice.error}
                        </div>
                      )}
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
                          <DropdownMenuItem>Descargar XML</DropdownMenuItem>
                          <DropdownMenuItem>Reenviar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
              <p className="text-sm text-slate">
                Mostrando 1 a 4 de 966 resultados
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 w-8 bg-ink text-white"
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  3
                </Button>
                <span className="px-2 text-slate">...</span>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  97
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
