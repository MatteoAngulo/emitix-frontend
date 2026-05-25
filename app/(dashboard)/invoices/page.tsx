"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const invoices = [
  {
    id: "INV-0042",
    client: "Inversiones Andinas S.A.S.",
    nit: "900.123.456-7",
    date: "24 Oct 2023",
    total: "$ 4,520,000 COP",
    status: "draft",
  },
  {
    id: "SETT-9921",
    client: "TechSolutions Colombia LTDA",
    nit: "830.987.654-2",
    date: "22 Oct 2023",
    total: "$ 12,850,500 COP",
    status: "approved",
  },
  {
    id: "SETT-9920",
    client: "Constructora Bolivar Occidente",
    nit: "890.333.222-1",
    date: "21 Oct 2023",
    total: "$ 8,100,000 COP",
    status: "rejected",
  },
  {
    id: "SETT-9919",
    client: "Distribuidora Nacional S.A.",
    nit: "860.111.999-5",
    date: "20 Oct 2023",
    total: "$ 1,250,000 COP",
    status: "approved",
  },
  {
    id: "SETT-9918",
    client: "Clinica San Rafael",
    nit: "901.444.555-8",
    date: "19 Oct 2023",
    total: "$ 5,900,200 COP",
    status: "approved",
  },
]

const statusConfig = {
  draft: {
    label: "Borrador",
    className: "bg-slate/10 text-slate border-slate/30",
  },
  approved: {
    label: "APPROVED",
    className: "bg-emerald/10 text-emerald border-emerald/30",
  },
  rejected: {
    label: "REJECTED",
    className: "bg-coral/10 text-coral border-coral/30",
  },
  processing: {
    label: "Procesando",
    className: "bg-gold/10 text-gold border-gold/30",
  },
}

export default function InvoicesPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
            <Input
              type="text"
              placeholder="Search invoices by number, buyer, or total..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white border-mist"
            />
          </div>
          <Button variant="outline" className="border-mist">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="bg-emerald hover:bg-emerald/90 text-white">
            <Link href="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-slate" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral" />
          </Button>
          <Avatar className="h-9 w-9 border-2 border-emerald">
            <AvatarImage src="/avatar.jpg" alt="User" />
            <AvatarFallback className="bg-ink text-white text-xs">JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">
              Listado de Facturas
            </h1>
            <p className="text-slate mt-1">
              Manage and track your issued electronic invoices.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate">
            <Clock className="h-4 w-4" />
            Showing 1-10 of 124 invoices
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cloud/30">
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  NÚMERO
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  ADQUIRENTE (BUYER)
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  FECHA EMISIÓN
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  TOTAL
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  ESTADO
                </th>
                <th className="text-left py-4 px-4 text-label-caps text-slate font-medium">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border last:border-0 hover:bg-cloud/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-mono text-sm font-medium text-ink hover:text-emerald border border-mist rounded px-2 py-1 inline-block"
                    >
                      {invoice.id}
                    </Link>
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
                  <td className="py-4 px-4 text-sm text-slate">
                    {invoice.date}
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
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-coral">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Discard
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <p className="text-sm text-slate">Page 1 of 13</p>
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
                13
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
