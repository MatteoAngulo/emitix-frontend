"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  BarChart3,
  History,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Users", href: "/users", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Activity Log", href: "/activity", icon: History },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const initials = user?.fullName
    ? user.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-ink">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.07)" />
            <rect x="20" y="24" width="40" height="8" rx="4" fill="#00C880" />
            <rect x="20" y="36" width="27" height="7" rx="3.5" fill="#F5A52A" />
            <rect x="20" y="47" width="40" height="8" rx="4" fill="white" />
          </svg>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-white">
              EMITIX
            </span>
            <span className="text-[10px] text-white/50">Electronic Billing</span>
          </div>
        </Link>
      </div>

      {/* New Invoice Button */}
      <div className="px-4 py-4">
        <Button
          asChild
          className="w-full bg-emerald hover:bg-emerald/90 text-white font-medium"
        >
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/10 text-white border-l-2 border-emerald"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-sm font-medium text-white">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.fullName ?? 'Cargando...'}
            </p>
            <p className="truncate text-xs text-white/50">{user?.email ?? ''}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
