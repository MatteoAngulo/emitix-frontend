"use client"

import { useState } from "react"
import { Bell, LogOut, User, Settings, Shield, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface AppHeaderProps {
  title?: string
  children?: React.ReactNode
}

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Factura Rechazada",
    message: "FV-2023-0895 fue rechazada por la DIAN. Regla FAD09b.",
    time: "Hace 5 min",
    unread: true,
  },
  {
    id: 2,
    type: "success",
    title: "Factura Aprobada",
    message: "FV-2023-0894 ha sido validada exitosamente.",
    time: "Hace 15 min",
    unread: true,
  },
  {
    id: 3,
    type: "info",
    title: "Resolución por vencer",
    message: "Tu resolución DIAN vence en 30 días. Renuévala pronto.",
    time: "Hace 1 hora",
    unread: false,
  },
  {
    id: 4,
    type: "default",
    title: "Nuevo usuario agregado",
    message: "Laura Martínez se unió como Contador.",
    time: "Ayer",
    unread: false,
  },
]

const userProfile = {
  name: "Juan Díaz",
  email: "juan.diaz@emitix.co",
  role: "Administrador",
  company: "TechSolutions S.A.S",
  lastLogin: "Hoy, 09:41 AM",
  avatar: "/avatar.jpg",
  initials: "JD",
}

export function AppHeader({ title, children }: AppHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
        )}
        {children}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-display font-semibold text-ink">Notificaciones</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-coral/10 text-coral">
                  {unreadCount} nuevas
                </Badge>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-border last:border-0 hover:bg-cloud/50 cursor-pointer transition-colors ${
                    notification.unread ? "bg-cloud/30" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.type === "warning"
                          ? "bg-coral"
                          : notification.type === "success"
                          ? "bg-emerald"
                          : notification.type === "info"
                          ? "bg-gold"
                          : "bg-slate"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium text-ink ${notification.unread ? "font-semibold" : ""}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-slate whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className="text-sm text-slate mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border bg-cloud/30">
              <Link
                href="/activity"
                className="text-sm text-emerald hover:text-emerald/80 font-medium flex items-center justify-center gap-1"
              >
                Ver todas las notificaciones
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9 border-2 border-emerald cursor-pointer hover:border-emerald/70 transition-colors">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback className="bg-ink text-white text-xs">
                  {userProfile.initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-12 w-12 border-2 border-emerald">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="bg-ink text-white">
                    {userProfile.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-display font-semibold text-ink">{userProfile.name}</p>
                  <p className="text-sm text-slate">{userProfile.email}</p>
                  <Badge variant="outline" className="mt-1 w-fit bg-emerald/10 text-emerald border-emerald/30 text-xs">
                    {userProfile.role}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <div className="rounded-lg bg-cloud/50 p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-slate" />
                  <span className="text-slate">Empresa:</span>
                  <span className="text-ink font-medium">{userProfile.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-slate" />
                  <span className="text-slate">Último acceso:</span>
                  <span className="text-ink font-medium">{userProfile.lastLogin}</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/users" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Mi Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer text-coral focus:text-coral focus:bg-coral/10">
              <Link href="/" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
