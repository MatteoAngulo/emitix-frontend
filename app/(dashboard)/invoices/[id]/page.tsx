"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  Mail,
  FileText,
  CheckCircle,
  Copy,
  Bell,
  Building2,
  User,
  Clock,
  Shield,
  QrCode,
  FileCode,
  Send,
  AlertTriangle,
  ExternalLink,
  Printer,
  MoreVertical,
  RefreshCw,
  XCircle,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const invoiceData = {
  id: "FV-2023-0892",
  type: "FACTURA DE VENTA NACIONAL",
  prefix: "FV",
  consecutive: "0892",
  date: "24 Oct 2023, 14:30",
  dueDate: "24 Nov 2023",
  status: "approved" as const,
  resolutionNumber: "18764000001234",
  resolutionDate: "2023-01-15",
  resolutionRange: "PREF-0001 - PREF-5000",
  emisor: {
    name: "TechSolutions SAS",
    nit: "900.123.456-7",
    address: "Calle 93 #11A-28, Bogotá D.C.",
    email: "facturacion@techsolutions.com",
    phone: "+57 1 234 5678",
    regime: "Responsable de IVA",
    economicActivity: "6201 - Desarrollo de Software",
  },
  adquiriente: {
    name: "Inversiones Andinas S.A.",
    nit: "800.987.654-3",
    address: "Carrera 43A #1-50, Medellín",
    email: "pagos@invandinas.com",
    phone: "+57 4 567 8901",
    regime: "Responsable de IVA",
  },
  items: [
    {
      code: "SRV-001",
      unspsc: "84111500",
      description: "Consultoría de Transformación Digital",
      quantity: 1.0,
      unit: "UN",
      unitPrice: 5000000,
      discount: 0,
      taxBase: 5000000,
      taxRate: 19,
      taxAmount: 950000,
      subtotal: 5950000,
    },
    {
      code: "LIC-102",
      unspsc: "43231500",
      description: "Licencia Anual Plataforma Cloud",
      quantity: 12.0,
      unit: "MES",
      unitPrice: 150000,
      discount: 0,
      taxBase: 1800000,
      taxRate: 19,
      taxAmount: 342000,
      subtotal: 2142000,
    },
  ],
  subtotal: 6800000,
  discounts: 0,
  taxableBase: 6800000,
  iva: 1292000,
  ivaRate: 19,
  retefuente: 748000,
  retefuenteRate: 11,
  reteica: 0,
  reteiva: 0,
  total: 7344000,
  paymentMethod: "Crédito",
  paymentMedium: "Transferencia Bancaria",
  paymentInstructions: "Favor consignar a la cuenta de ahorros Bancolombia No. 123456789",
  notes: "Proyecto de transformación digital - Fase 1. Incluye capacitación y soporte técnico por 12 meses.",
  cufe: "a3b8c9d2e1f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z",
  qrData: "NumFac:FV-2023-0892\nFecFac:2023-10-24\nNitOFE:900.123.456-7\nNitADQ:800.987.654-3\nValFac:7344000\nValIva:1292000\nCUFE:a3b8c9d2e1f...",
  xmlUrl: "/api/invoices/FV-2023-0892/xml",
  pdfUrl: "/api/invoices/FV-2023-0892/pdf",
  attachedDocuments: [
    { name: "Contrato de Servicios.pdf", size: "245 KB", type: "application/pdf" },
    { name: "Orden de Compra OC-2023-456.pdf", size: "128 KB", type: "application/pdf" },
  ],
  relatedDocuments: [
    { type: "Orden de Compra", number: "OC-2023-456", date: "20 Oct 2023" },
  ],
  history: [
    {
      type: "success",
      title: "Validación Exitosa DIAN",
      date: "24 Oct 2023, 14:31",
      description: "La factura fue recibida y validada por la DIAN sin errores. Código de respuesta: 00 - Procesado Correctamente.",
      user: "Sistema",
      icon: CheckCircle,
    },
    {
      type: "info",
      title: "Firma Digital Aplicada",
      date: "24 Oct 2023, 14:30",
      description: "Certificado: GSE - Gestión de Seguridad Electrónica. Vigente hasta: 15 Oct 2025.",
      user: "Sistema",
      icon: Shield,
    },
    {
      type: "info",
      title: "CUFE Generado",
      date: "24 Oct 2023, 14:30",
      description: "Código Único de Factura Electrónica calculado con SHA-384.",
      user: "Sistema",
      icon: FileCode,
    },
    {
      type: "info",
      title: "XML UBL 2.1 Generado",
      date: "24 Oct 2023, 14:30",
      description: "Documento estructurado según Anexo Técnico DIAN versión 1.9.",
      user: "Sistema",
      icon: FileText,
    },
    {
      type: "default",
      title: "Factura Generada",
      date: "24 Oct 2023, 14:28",
      description: "Documento creado y guardado como borrador.",
      user: "Juan Díaz",
      icon: FileText,
    },
  ],
  radianEvents: [
    {
      code: "030",
      name: "Acuse de Recibo de FE",
      date: "24 Oct 2023, 15:45",
      status: "completed",
      responsable: "Inversiones Andinas S.A.",
    },
    {
      code: "032",
      name: "Recibo del bien o servicio",
      date: "27 Oct 2023, 10:30",
      status: "completed",
      responsable: "Inversiones Andinas S.A.",
    },
    {
      code: "033",
      name: "Aceptación expresa",
      date: "27 Oct 2023, 10:32",
      status: "completed",
      responsable: "Inversiones Andinas S.A.",
    },
  ],
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function InvoiceDetailPage() {
  const [showResendDialog, setShowResendDialog] = useState(false)
  const [copiedCufe, setCopiedCufe] = useState(false)

  const handleCopyCufe = () => {
    navigator.clipboard.writeText(invoiceData.cufe)
    setCopiedCufe(true)
    toast.success("CUFE copiado al portapapeles")
    setTimeout(() => setCopiedCufe(false), 2000)
  }

  const getStatusBadge = () => {
    switch (invoiceData.status) {
      case "approved":
        return (
          <Badge className="bg-emerald/10 text-emerald border-emerald/30 px-4 py-1.5">
            <CheckCircle className="h-4 w-4 mr-2" />
            Aceptada DIAN
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-coral/10 text-coral border-coral/30 px-4 py-1.5">
            <XCircle className="h-4 w-4 mr-2" />
            Rechazada
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gold/10 text-gold border-gold/30 px-4 py-1.5">
            <Clock className="h-4 w-4 mr-2" />
            Pendiente
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/invoices"
            className="flex items-center gap-2 text-slate hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-lg font-bold text-ink">
              Factura Electrónica
            </h1>
            <p className="text-xs text-slate">{invoiceData.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-slate" />
          </Button>
          <Avatar className="h-9 w-9 border-2 border-emerald">
            <AvatarImage src="/avatar.jpg" alt="User" />
            <AvatarFallback className="bg-ink text-white text-xs">JD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Invoice Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-label-caps text-slate mb-1">
                      {invoiceData.type}
                    </p>
                    <h2 className="font-display text-4xl font-bold text-ink">
                      {invoiceData.id}
                    </h2>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-slate flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Emisión: {invoiceData.date}
                      </p>
                      <p className="text-slate">
                        Vence: {invoiceData.dueDate}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>

                {/* Resolution Info */}
                <div className="p-3 rounded-lg bg-cloud/50 border border-border mb-6">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-slate">Resolución DIAN:</span>{" "}
                      <span className="font-mono text-ink">{invoiceData.resolutionNumber}</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div>
                      <span className="text-slate">Rango:</span>{" "}
                      <span className="text-ink">{invoiceData.resolutionRange}</span>
                    </div>
                  </div>
                </div>

                {/* Emisor & Adquiriente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-cloud/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-4 w-4 text-slate" />
                      <span className="text-sm font-medium text-slate">
                        Emisor
                      </span>
                    </div>
                    <p className="font-semibold text-ink">
                      {invoiceData.emisor.name}
                    </p>
                    <p className="text-sm text-slate mt-1">
                      NIT: {invoiceData.emisor.nit}
                    </p>
                    <p className="text-sm text-slate">
                      {invoiceData.emisor.address}
                    </p>
                    <p className="text-sm text-slate">
                      {invoiceData.emisor.email}
                    </p>
                    <p className="text-sm text-slate">
                      {invoiceData.emisor.phone}
                    </p>
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-slate">{invoiceData.emisor.regime}</p>
                      <p className="text-xs text-slate">{invoiceData.emisor.economicActivity}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-cloud/30 border-l-4 border-l-emerald">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-slate" />
                      <span className="text-sm font-medium text-slate">
                        Adquiriente
                      </span>
                    </div>
                    <p className="font-semibold text-ink">
                      {invoiceData.adquiriente.name}
                    </p>
                    <p className="text-sm text-slate mt-1">
                      NIT: {invoiceData.adquiriente.nit}
                    </p>
                    <p className="text-sm text-slate">
                      {invoiceData.adquiriente.address}
                    </p>
                    <p className="text-sm text-slate">
                      {invoiceData.adquiriente.email}
                    </p>
                    <p className="text-sm text-slate">
                      {invoiceData.adquiriente.phone}
                    </p>
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-slate">{invoiceData.adquiriente.regime}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="items" className="w-full">
              <TabsList className="w-full justify-start bg-white border border-border rounded-lg p-1">
                <TabsTrigger value="items" className="flex-1">
                  Líneas de Detalle
                </TabsTrigger>
                <TabsTrigger value="taxes" className="flex-1">
                  Impuestos y Totales
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex-1">
                  Pago
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex-1">
                  Documentos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 text-label-caps text-slate font-medium">
                              CÓDIGO
                            </th>
                            <th className="text-left py-3 px-2 text-label-caps text-slate font-medium">
                              DESCRIPCIÓN
                            </th>
                            <th className="text-center py-3 px-2 text-label-caps text-slate font-medium">
                              CANT
                            </th>
                            <th className="text-center py-3 px-2 text-label-caps text-slate font-medium">
                              UND
                            </th>
                            <th className="text-right py-3 px-2 text-label-caps text-slate font-medium">
                              VR. UNIT
                            </th>
                            <th className="text-right py-3 px-2 text-label-caps text-slate font-medium">
                              BASE IVA
                            </th>
                            <th className="text-center py-3 px-2 text-label-caps text-slate font-medium">
                              IVA %
                            </th>
                            <th className="text-right py-3 px-2 text-label-caps text-slate font-medium">
                              SUBTOTAL
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceData.items.map((item, index) => (
                            <tr key={index} className="border-b border-border">
                              <td className="py-4 px-2">
                                <p className="text-sm font-mono text-ink">{item.code}</p>
                                <p className="text-xs text-slate font-mono">
                                  UNSPSC: {item.unspsc}
                                </p>
                              </td>
                              <td className="py-4 px-2 text-sm text-ink max-w-xs">
                                {item.description}
                              </td>
                              <td className="py-4 px-2 text-sm text-ink text-center font-mono">
                                {item.quantity.toFixed(2)}
                              </td>
                              <td className="py-4 px-2 text-sm text-ink text-center">
                                {item.unit}
                              </td>
                              <td className="py-4 px-2 text-sm text-ink text-right font-mono">
                                {formatCurrency(item.unitPrice)}
                              </td>
                              <td className="py-4 px-2 text-sm text-ink text-right font-mono">
                                {formatCurrency(item.taxBase)}
                              </td>
                              <td className="py-4 px-2 text-sm text-ink text-center">
                                <Badge variant="outline" className="font-mono">
                                  {item.taxRate}%
                                </Badge>
                              </td>
                              <td className="py-4 px-2 text-sm font-semibold text-ink text-right font-mono">
                                {formatCurrency(item.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Notes */}
                    {invoiceData.notes && (
                      <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-label-caps text-slate mb-2">OBSERVACIONES</p>
                        <p className="text-sm text-ink">{invoiceData.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="taxes" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="max-w-md ml-auto space-y-3">
                      <div className="flex justify-between py-2">
                        <span className="text-slate">Subtotal (sin impuestos):</span>
                        <span className="font-mono text-ink">{formatCurrency(invoiceData.subtotal)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate">Descuentos:</span>
                        <span className="font-mono text-ink">{formatCurrency(invoiceData.discounts)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-2">
                        <span className="text-slate">Base gravable IVA:</span>
                        <span className="font-mono text-ink">{formatCurrency(invoiceData.taxableBase)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate">IVA ({invoiceData.ivaRate}%):</span>
                        <span className="font-mono text-ink">{formatCurrency(invoiceData.iva)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-2">
                        <span className="text-slate">Retefuente ({invoiceData.retefuenteRate}%):</span>
                        <span className="font-mono text-coral">-{formatCurrency(invoiceData.retefuente)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate">ReteICA:</span>
                        <span className="font-mono text-ink">{formatCurrency(invoiceData.reteica)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate">ReteIVA:</span>
                        <span className="font-mono text-ink">{formatCurrency(invoiceData.reteiva)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between py-3 bg-ink/5 rounded-lg px-3 -mx-3">
                        <span className="font-semibold text-ink text-lg">Total a Pagar:</span>
                        <span className="font-mono font-bold text-2xl text-ink">{formatCurrency(invoiceData.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-label-caps text-slate mb-2">MÉTODO DE PAGO</p>
                        <p className="text-ink font-medium">{invoiceData.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-label-caps text-slate mb-2">MEDIO DE PAGO</p>
                        <p className="text-ink font-medium">{invoiceData.paymentMedium}</p>
                      </div>
                      <div>
                        <p className="text-label-caps text-slate mb-2">FECHA DE VENCIMIENTO</p>
                        <p className="text-ink font-medium">{invoiceData.dueDate}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-label-caps text-slate mb-2">INSTRUCCIONES DE PAGO</p>
                        <div className="p-3 bg-cloud/50 rounded-lg border border-border">
                          <p className="text-ink">{invoiceData.paymentInstructions}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Related Documents */}
                      <div>
                        <p className="text-label-caps text-slate mb-3">DOCUMENTOS RELACIONADOS</p>
                        {invoiceData.relatedDocuments.length > 0 ? (
                          <div className="space-y-2">
                            {invoiceData.relatedDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-cloud/50 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-slate" />
                                  <div>
                                    <p className="text-sm font-medium text-ink">{doc.type}</p>
                                    <p className="text-xs text-slate">{doc.number} - {doc.date}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate">No hay documentos relacionados</p>
                        )}
                      </div>

                      {/* Attached Documents */}
                      <div>
                        <p className="text-label-caps text-slate mb-3">ARCHIVOS ADJUNTOS</p>
                        {invoiceData.attachedDocuments.length > 0 ? (
                          <div className="space-y-2">
                            {invoiceData.attachedDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-cloud/50 rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-slate" />
                                  <div>
                                    <p className="text-sm font-medium text-ink">{doc.name}</p>
                                    <p className="text-xs text-slate">{doc.size}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate">No hay archivos adjuntos</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* CUFE Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-label-caps text-slate">
                    CUFE (CÓDIGO ÚNICO DE FACTURA ELECTRÓNICA)
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate"
                    onClick={handleCopyCufe}
                  >
                    {copiedCufe ? (
                      <Check className="h-4 w-4 mr-2 text-emerald" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedCufe ? "Copiado" : "Copiar"}
                  </Button>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-border p-2">
                    <QrCode className="w-full h-full text-ink" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-cloud p-3 rounded-lg border border-mist">
                      <p className="font-mono text-xs text-ink break-all leading-relaxed">
                        {invoiceData.cufe}
                      </p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="border-mist">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Verificar en DIAN
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RADIAN Events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg font-bold text-ink flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Eventos RADIAN
                </CardTitle>
                <p className="text-sm text-slate">
                  Registro de eventos de aceptación y endoso del documento
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoiceData.radianEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.status === "completed" ? "bg-emerald/10 text-emerald" : "bg-mist text-slate"
                        }`}>
                          {event.status === "completed" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">
                            <span className="font-mono text-xs text-slate mr-2">[{event.code}]</span>
                            {event.name}
                          </p>
                          <p className="text-xs text-slate">
                            {event.responsable} - {event.date}
                          </p>
                        </div>
                      </div>
                      <Badge variant={event.status === "completed" ? "default" : "outline"} className={
                        event.status === "completed" ? "bg-emerald text-white" : ""
                      }>
                        {event.status === "completed" ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions & History */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-ink hover:bg-ink/90 text-white h-12">
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 border-mist">
                  <FileCode className="mr-2 h-4 w-4" />
                  XML
                </Button>
                <Button variant="outline" className="h-12 border-mist">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 border-mist"
                onClick={() => setShowResendDialog(true)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Reenviar Correo
              </Button>
              <Button variant="outline" className="w-full h-12 border-mist">
                <FileText className="mr-2 h-4 w-4" />
                Generar Nota Crédito
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-12 border-mist">
                    <MoreVertical className="mr-2 h-4 w-4" />
                    Más opciones
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sincronizar con DIAN
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Enlace público
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-coral">
                    <XCircle className="mr-2 h-4 w-4" />
                    Anular documento
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Summary */}
            <Card className="bg-ink text-white">
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-mono">{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">IVA</span>
                  <span className="font-mono">{formatCurrency(invoiceData.iva)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Retenciones</span>
                  <span className="font-mono text-coral">-{formatCurrency(invoiceData.retefuente)}</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between items-baseline">
                  <span className="text-emerald font-medium">Total</span>
                  <span className="font-mono text-2xl font-bold text-emerald">
                    {formatCurrency(invoiceData.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* History Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg font-bold text-ink">
                  Historial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoiceData.history.map((event, index) => {
                    const EventIcon = event.icon
                    return (
                      <div key={index} className="flex gap-3">
                        <div
                          className={`w-8 h-8 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center ${
                            event.type === "success"
                              ? "bg-emerald/10 text-emerald"
                              : event.type === "info"
                              ? "bg-ocean/10 text-ocean"
                              : "bg-mist text-slate"
                          }`}
                        >
                          <EventIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-ink text-sm">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate mt-0.5">{event.date}</p>
                          {event.description && (
                            <p className="text-sm text-slate mt-1 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          <p className="text-xs text-slate mt-1">
                            Por: {event.user}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Resend Email Dialog */}
      <Dialog open={showResendDialog} onOpenChange={setShowResendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reenviar factura por correo</DialogTitle>
            <DialogDescription>
              Se enviará una copia de la factura {invoiceData.id} al correo del adquiriente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-cloud/50 border border-border">
              <p className="text-sm text-slate">Destinatario:</p>
              <p className="font-medium text-ink">{invoiceData.adquiriente.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResendDialog(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-emerald hover:bg-emerald/90 text-white"
              onClick={() => {
                toast.success("Correo enviado exitosamente")
                setShowResendDialog(false)
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
