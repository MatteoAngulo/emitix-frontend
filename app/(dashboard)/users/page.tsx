"use client"

import { useState } from "react"
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  X,
  LogIn,
  KeyRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppHeader } from "@/components/layout/app-header"

const users = [
  {
    id: 1,
    name: "Carlos Mendoza",
    email: "carlos@emitix.com.co",
    avatar: "/avatars/carlos.jpg",
    role: "Administrador",
    roleColor: "bg-ocean/10 text-ocean border-ocean/30",
    status: "activo",
    lastAccess: "Hoy, 09:41 AM",
  },
  {
    id: 2,
    name: "Laura Martínez",
    email: "contabilidad@empresa.com",
    initials: "LM",
    role: "Contador",
    roleColor: "bg-emerald/10 text-emerald border-emerald/30",
    status: "activo",
    lastAccess: "Ayer, 16:20 PM",
  },
  {
    id: 3,
    name: "Ana Silva",
    email: "facturacion@empresa.com",
    avatar: "/avatars/ana.jpg",
    role: "Operador",
    roleColor: "bg-slate/10 text-slate border-slate/30",
    status: "activo",
    lastAccess: "12 Oct 2023",
  },
  {
    id: 4,
    name: "David Peña",
    email: "david.p@empresa.com",
    initials: "DP",
    role: "Solo Lectura",
    roleColor: "bg-slate/10 text-slate border-slate/30",
    status: "inactivo",
    lastAccess: "05 Sep 2023",
  },
]

const selectedUser = {
  id: 2,
  name: "Laura Martínez",
  email: "contabilidad@empresa.com",
  initials: "LM",
  role: "Contador",
  status: "activo",
  lastAccess: "Ayer, 16:20 PM",
  loginMethod: "Email / Password",
  permissions: "Puede crear y enviar facturas, consultar reportes financieros y descargar XMLs firmados.",
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [showDetail, setShowDetail] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className={showDetail ? "lg:col-span-2" : "lg:col-span-3"}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">
                  Gestión de usuarios
                </h1>
                <p className="text-slate mt-1">
                  Manage access levels and system permissions for your team.
                </p>
              </div>
              <Button className="bg-ink hover:bg-ink/90 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Invitar usuario
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                <Input
                  placeholder="Buscar por nombre o correo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white border-mist"
                />
              </div>
              <Button variant="outline" className="border-mist">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                      USUARIO
                    </th>
                    <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                      ROL
                    </th>
                    <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                      ESTADO
                    </th>
                    <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                      ÚLTIMO ACCESO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setShowDetail(true)}
                      className={`border-b border-border last:border-0 hover:bg-cloud/50 transition-colors cursor-pointer ${
                        user.id === selectedUser.id ? "bg-cloud/50" : ""
                      } ${user.status === "inactivo" ? "opacity-50" : ""}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {user.avatar ? (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            ) : null}
                            <AvatarFallback className="bg-ink text-white text-sm">
                              {user.initials || user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-ink">{user.name}</p>
                            <p className="text-sm text-slate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={user.roleColor}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={
                            user.status === "activo"
                              ? "bg-emerald/10 text-emerald border-emerald/30"
                              : "bg-slate/10 text-slate border-slate/30"
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                          {user.status === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate">
                        {user.lastAccess}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail Panel */}
          {showDetail && (
            <div>
              <Card className="sticky top-24">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="font-display text-lg font-bold text-ink">
                    Detalles de Usuario
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDetail(false)}
                  >
                    <X className="h-4 w-4 text-slate" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* User Avatar and Name */}
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarFallback className="bg-ink text-white text-2xl">
                        {selectedUser.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-display text-xl font-bold text-ink">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-slate">{selectedUser.email}</p>
                    <Badge
                      variant="outline"
                      className="mt-3 bg-emerald/10 text-emerald border-emerald/30"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald mr-2" />
                      Cuenta Activa
                    </Badge>
                  </div>

                  {/* Role & Permissions */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-label-caps text-slate mb-3">
                      ROL Y PERMISOS
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className="bg-emerald/10 text-emerald border-emerald/30"
                      >
                        {selectedUser.role}
                      </Badge>
                      <Button
                        variant="link"
                        className="text-emerald p-0 h-auto font-medium"
                      >
                        Cambiar
                      </Button>
                    </div>
                    <p className="text-sm text-slate leading-relaxed">
                      {selectedUser.permissions}
                    </p>
                  </div>

                  {/* Security */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-label-caps text-slate mb-3">SEGURIDAD</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <LogIn className="h-4 w-4 text-slate" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ink">
                            Último acceso
                          </p>
                        </div>
                        <span className="text-sm text-slate">
                          {selectedUser.lastAccess}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <KeyRound className="h-4 w-4 text-slate" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ink">
                            Método de login
                          </p>
                        </div>
                        <span className="text-sm text-slate">
                          {selectedUser.loginMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border flex gap-3">
                    <Button variant="outline" className="flex-1 border-mist">
                      Suspender
                    </Button>
                    <Button className="flex-1 bg-ink hover:bg-ink/90 text-white">
                      Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
