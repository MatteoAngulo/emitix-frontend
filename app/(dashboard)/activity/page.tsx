"use client"

import { useState } from "react"
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppHeader } from "@/components/layout/app-header"

const activities = [
  {
    id: 1,
    timestamp: "2023-10-27  14:32:01",
    user: "Maria Rojas",
    avatar: "/avatars/maria.jpg",
    action: "Emitió factura electrónica exitosamente",
    entity: "FV-2023-1042",
    entityType: "invoice",
    ip: "192.168.1.45",
  },
  {
    id: 2,
    timestamp: "2023-10-27  11:15:44",
    user: "Admin User",
    avatar: "/avatars/admin.jpg",
    action: "Cambio de rol de usuario a Administrador",
    entity: "Carlos Mendoza (ID: 402)",
    entityType: "user",
    ip: "186.114.23.12",
  },
  {
    id: 3,
    timestamp: "2023-10-27  10:05:12",
    user: "Carlos Mendoza",
    initials: "CM",
    action: "Inició sesión en el sistema",
    entity: "N/A",
    entityType: null,
    ip: "190.24.55.8",
  },
  {
    id: 4,
    timestamp: "2023-10-26  16:45:00",
    user: "Admin User",
    avatar: "/avatars/admin.jpg",
    action: "Actualizó Certificado Digital DIAN",
    entity: "CERT-2024.p12",
    entityType: "certificate",
    ip: "186.114.23.12",
    highlight: true,
  },
  {
    id: 5,
    timestamp: "2023-10-26  14:20:33",
    user: "Maria Rojas",
    avatar: "/avatars/maria.jpg",
    action: "Generó reporte de ventas mensual",
    entity: "Reporte Octubre 2023",
    entityType: "report",
    ip: "192.168.1.45",
  },
  {
    id: 6,
    timestamp: "2023-10-26  09:12:05",
    user: "Admin User",
    avatar: "/avatars/admin.jpg",
    action: "Eliminó borrador de factura (Soft Delete)",
    entity: "DRAFT-1041",
    entityType: "invoice",
    ip: "186.114.23.12",
    highlight: true,
  },
]

export default function ActivityLogPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">
              Log de actividad
            </h1>
            <p className="text-slate mt-1">
              Registro cronológico de acciones del sistema.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
              <Input
                placeholder="Buscar actividad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64 bg-white border-mist"
              />
            </div>
            <Button variant="outline" className="border-mist">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Activity Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cloud/30">
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  TIMESTAMP
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  USUARIO
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  ACCIÓN
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  ENTIDAD
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  IP CLIENTE
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.id}
                  className={`border-b border-border last:border-0 hover:bg-cloud/30 transition-colors ${
                    activity.highlight ? "bg-gold/5" : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-slate">
                      {activity.timestamp}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {activity.avatar ? (
                          <AvatarImage src={activity.avatar} alt={activity.user} />
                        ) : null}
                        <AvatarFallback className="bg-ink text-white text-xs">
                          {activity.initials ||
                            activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-ink">
                        {activity.user}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-ink">{activity.action}</span>
                  </td>
                  <td className="py-4 px-4">
                    {activity.entityType ? (
                      <span
                        className={`font-mono text-xs px-2 py-1 rounded ${
                          activity.entityType === "invoice"
                            ? "bg-cloud text-ink"
                            : activity.entityType === "certificate"
                            ? "bg-ocean/10 text-ocean"
                            : "text-slate"
                        }`}
                      >
                        {activity.entity}
                      </span>
                    ) : (
                      <span className="text-sm text-slate">{activity.entity}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-slate">
                      {activity.ip}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-slate">
              Mostrando 1 a 6 de 124 resultados
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
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="fixed bottom-0 left-60 right-0 border-t border-border bg-white p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-ink text-white text-sm">AU</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-ink">Admin User</p>
            <p className="text-sm text-slate">admin@emitix.co</p>
          </div>
        </div>
      </div>
    </div>
  )
}
