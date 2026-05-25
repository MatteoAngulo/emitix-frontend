"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  X,
  Check,
  Search,
  Plus,
  Trash2,
  GripVertical,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Save,
  Building2,
  User,
  CreditCard,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Eye,
  Send,
  Hash,
  Shield,
  QrCode,
  FileCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

// Types
interface Product {
  id: number
  description: string
  code: string
  quantity: number
  unitPrice: number
  taxRate: number
  total: number
}

interface BuyerData {
  type: "empresa" | "persona" | "consumidor_final"
  razonSocial: string
  tipoDocumento: string
  numeroDocumento: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
}

interface PaymentData {
  metodoPago: string
  medioPago: string
  fechaVencimiento: string
  cuentaBancaria: string
}

type StepId = 1 | 2 | 3 | 4 | 5

// Initial data
const documentTypes = [
  { value: "factura_venta", label: "Factura de Venta Nacional" },
  { value: "factura_exportacion", label: "Factura de Exportación" },
  { value: "nota_credito", label: "Nota Crédito" },
  { value: "nota_debito", label: "Nota Débito" },
]

const paymentMethods = [
  { value: "contado", label: "Contado" },
  { value: "credito", label: "Crédito" },
]

const paymentMediums = [
  { value: "efectivo", label: "Efectivo" },
  { value: "transferencia", label: "Transferencia Bancaria" },
  { value: "tarjeta_credito", label: "Tarjeta de Crédito" },
  { value: "tarjeta_debito", label: "Tarjeta de Débito" },
  { value: "cheque", label: "Cheque" },
]

const productCatalog = [
  { code: "84111500", description: "Servicios de consultoría empresarial", unitPrice: 1500000 },
  { code: "43231500", description: "Licencia de software", unitPrice: 850000 },
  { code: "81112200", description: "Servicios de programación de software", unitPrice: 2000000 },
  { code: "43232300", description: "Soporte técnico de software", unitPrice: 500000 },
  { code: "80101500", description: "Servicios de gestión de proyectos", unitPrice: 3000000 },
]

export default function NewInvoicePage() {
  const [currentStep, setCurrentStep] = useState<StepId>(1)
  const [documentType, setDocumentType] = useState("factura_venta")
  const [operationType, setOperationType] = useState("estandar")
  const [buyerData, setBuyerData] = useState<BuyerData>({
    type: "empresa",
    razonSocial: "",
    tipoDocumento: "NIT",
    numeroDocumento: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
  })
  const [products, setProducts] = useState<Product[]>([])
  const [paymentData, setPaymentData] = useState<PaymentData>({
    metodoPago: "contado",
    medioPago: "transferencia",
    fechaVencimiento: "",
    cuentaBancaria: "Ahorros Bancolombia No. 123456789",
  })
  const [notes, setNotes] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isVerifyingNit, setIsVerifyingNit] = useState(false)
  const [nitVerified, setNitVerified] = useState(false)
  
  // Emission state
  const [showPreview, setShowPreview] = useState(false)
  const [isEmitting, setIsEmitting] = useState(false)
  const [emissionStep, setEmissionStep] = useState(0)
  const [emissionComplete, setEmissionComplete] = useState(false)
  const [emissionError, setEmissionError] = useState<string | null>(null)
  const [generatedInvoice, setGeneratedInvoice] = useState<{
    number: string
    cufe: string
  } | null>(null)

  const steps = [
    { id: 1 as const, name: "TIPO", icon: FileText },
    { id: 2 as const, name: "COMPRADOR", icon: User },
    { id: 3 as const, name: "PRODUCTOS", icon: Building2 },
    { id: 4 as const, name: "PAGO", icon: CreditCard },
    { id: 5 as const, name: "REVISIÓN", icon: CheckCircle },
  ]

  const emissionSteps = [
    { id: 1, name: "Validando datos localmente...", icon: CheckCircle },
    { id: 2, name: "Verificando resolución DIAN...", icon: Hash },
    { id: 3, name: "Generando XML UBL 2.1...", icon: FileCode },
    { id: 4, name: "Calculando CUFE (SHA-384)...", icon: Shield },
    { id: 5, name: "Aplicando firma digital XAdES-BES...", icon: Shield },
    { id: 6, name: "Generando código QR...", icon: QrCode },
    { id: 7, name: "Enviando a WebService DIAN...", icon: Send },
    { id: 8, name: "Procesando respuesta...", icon: Loader2 },
  ]

  // Calculations
  const subtotal = products.reduce((acc, p) => acc + p.quantity * p.unitPrice, 0)
  const iva = products.reduce((acc, p) => acc + (p.quantity * p.unitPrice * p.taxRate) / 100, 0)
  const total = subtotal + iva

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Handlers
  const verifyNit = async () => {
    if (!buyerData.numeroDocumento) return
    setIsVerifyingNit(true)
    setNitVerified(false)
    // Simulate DIAN verification
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsVerifyingNit(false)
    
    // Simulate success for valid NITs
    if (buyerData.numeroDocumento.length >= 9) {
      setNitVerified(true)
      // Auto-fill company data (simulated)
      if (!buyerData.razonSocial) {
        setBuyerData(prev => ({
          ...prev,
          razonSocial: "Tecnologías Avanzadas de Colombia LTDA",
          direccion: "Cra 45 # 123-45, Edificio Empresarial",
          ciudad: "Bogotá D.C.",
        }))
      }
    } else {
      setErrors({ numeroDocumento: "NIT no válido según el RUT" })
    }
  }

  const addProduct = (catalogProduct?: typeof productCatalog[0]) => {
    const newProduct: Product = catalogProduct ? {
      id: Date.now(),
      description: catalogProduct.description,
      code: catalogProduct.code,
      quantity: 1,
      unitPrice: catalogProduct.unitPrice,
      taxRate: 19,
      total: catalogProduct.unitPrice * 1.19,
    } : {
      id: Date.now(),
      description: "",
      code: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 19,
      total: 0,
    }
    setProducts([...products, newProduct])
    setSearchQuery("")
  }

  const updateProduct = (id: number, field: keyof Product, value: number | string) => {
    setProducts(products.map((p) => {
      if (p.id === id) {
        const updated = { ...p, [field]: value }
        updated.total = updated.quantity * updated.unitPrice * (1 + updated.taxRate / 100)
        return updated
      }
      return p
    }))
  }

  const removeProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const validateStep = (step: StepId): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (step) {
      case 1:
        if (!documentType) newErrors.documentType = "Seleccione un tipo de documento"
        break
      case 2:
        if (buyerData.type !== "consumidor_final") {
          if (!buyerData.razonSocial) newErrors.razonSocial = "Razón social requerida"
          if (!buyerData.numeroDocumento) newErrors.numeroDocumento = "Número de documento requerido"
          if (!buyerData.email) newErrors.email = "Email requerido"
        }
        break
      case 3:
        if (products.length === 0) newErrors.products = "Agregue al menos un producto"
        break
      case 4:
        if (!paymentData.metodoPago) newErrors.metodoPago = "Seleccione método de pago"
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5) as StepId)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as StepId)
  }

  const startEmission = async () => {
    setShowPreview(true)
    setIsEmitting(true)
    setEmissionStep(0)
    setEmissionError(null)
    setEmissionComplete(false)

    // Simulate the emission process step by step
    for (let i = 0; i < emissionSteps.length; i++) {
      setEmissionStep(i + 1)
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))
    }

    // Generate invoice data
    const invoiceNumber = `FV-2023-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`
    const cufe = Array.from({ length: 96 }, () => 
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("")

    setGeneratedInvoice({ number: invoiceNumber, cufe })
    setIsEmitting(false)
    setEmissionComplete(true)
  }

  const filteredProducts = productCatalog.filter(
    (p) =>
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.includes(searchQuery)
  )

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display text-ink">
                Tipo de Documento Electrónico
              </CardTitle>
              <p className="text-sm text-slate">
                Seleccione el tipo de documento que desea generar
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      documentType === type.value
                        ? "border-emerald bg-emerald/5"
                        : "border-mist hover:border-slate"
                    }`}
                    onClick={() => setDocumentType(type.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          documentType === type.value
                            ? "border-emerald"
                            : "border-mist"
                        }`}
                      >
                        {documentType === type.value && (
                          <div className="w-3 h-3 rounded-full bg-emerald" />
                        )}
                      </div>
                      <span className="font-medium text-ink">{type.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <Label className="text-label-caps text-slate mb-3 block">
                  TIPO DE OPERACIÓN
                </Label>
                <RadioGroup
                  value={operationType}
                  onValueChange={setOperationType}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="estandar" id="estandar" />
                    <Label htmlFor="estandar">Estándar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contingencia" id="contingencia" />
                    <Label htmlFor="contingencia">Contingencia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exportacion" id="exportacion" />
                    <Label htmlFor="exportacion">Exportación</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display text-ink">
                Datos del Adquiriente
              </CardTitle>
              <p className="text-sm text-slate">
                Ingrese la información del comprador o receptor de la factura
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buyer Type */}
              <div>
                <Label className="text-label-caps text-slate mb-3 block">
                  TIPO DE ADQUIRIENTE
                </Label>
                <div className="flex gap-4">
                  {[
                    { value: "empresa", label: "Empresa" },
                    { value: "persona", label: "Persona Natural" },
                    { value: "consumidor_final", label: "Consumidor Final" },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={buyerData.type === type.value ? "default" : "outline"}
                      className={
                        buyerData.type === type.value
                          ? "bg-ink hover:bg-ink/90"
                          : "border-mist"
                      }
                      onClick={() =>
                        setBuyerData({ ...buyerData, type: type.value as BuyerData["type"] })
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {buyerData.type === "consumidor_final" ? (
                <Alert className="bg-cloud border-mist">
                  <CheckCircle className="h-4 w-4 text-emerald" />
                  <AlertTitle>Consumidor Final</AlertTitle>
                  <AlertDescription>
                    Se asignará automáticamente el NIT genérico 222222222 para este documento.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-label-caps text-slate mb-2 block">
                      RAZÓN SOCIAL / NOMBRES
                    </Label>
                    <Input
                      placeholder="Nombre de la empresa o persona"
                      value={buyerData.razonSocial}
                      onChange={(e) =>
                        setBuyerData({ ...buyerData, razonSocial: e.target.value })
                      }
                      className={`bg-white border-mist ${errors.razonSocial ? "border-coral" : ""}`}
                    />
                    {errors.razonSocial && (
                      <p className="text-xs text-coral mt-1">{errors.razonSocial}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-label-caps text-slate mb-2 block">
                      TIPO DE DOCUMENTO
                    </Label>
                    <Select
                      value={buyerData.tipoDocumento}
                      onValueChange={(value) =>
                        setBuyerData({ ...buyerData, tipoDocumento: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-mist">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIT">NIT</SelectItem>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="PP">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-label-caps text-slate mb-2 block">
                      NÚMERO DE DOCUMENTO
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="900123456"
                        value={buyerData.numeroDocumento}
                        onChange={(e) => {
                          setBuyerData({ ...buyerData, numeroDocumento: e.target.value })
                          setNitVerified(false)
                        }}
                        className={`bg-white border-mist flex-1 ${errors.numeroDocumento ? "border-coral" : ""}`}
                      />
                      {buyerData.tipoDocumento === "NIT" && (
                        <Button
                          variant="outline"
                          className="border-mist"
                          onClick={verifyNit}
                          disabled={isVerifyingNit}
                        >
                          {isVerifyingNit ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : nitVerified ? (
                            <Check className="h-4 w-4 text-emerald" />
                          ) : (
                            "Verificar"
                          )}
                        </Button>
                      )}
                    </div>
                    {errors.numeroDocumento && (
                      <p className="text-xs text-coral mt-1">{errors.numeroDocumento}</p>
                    )}
                    {nitVerified && (
                      <p className="text-xs text-emerald mt-1 flex items-center gap-1">
                        <Check className="h-3 w-3" /> NIT verificado en DIAN
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-label-caps text-slate mb-2 block">
                      CORREO ELECTRÓNICO
                    </Label>
                    <Input
                      type="email"
                      placeholder="facturacion@empresa.com"
                      value={buyerData.email}
                      onChange={(e) =>
                        setBuyerData({ ...buyerData, email: e.target.value })
                      }
                      className={`bg-white border-mist ${errors.email ? "border-coral" : ""}`}
                    />
                  </div>

                  <div>
                    <Label className="text-label-caps text-slate mb-2 block">
                      TELÉFONO
                    </Label>
                    <Input
                      placeholder="300 123 4567"
                      value={buyerData.telefono}
                      onChange={(e) =>
                        setBuyerData({ ...buyerData, telefono: e.target.value })
                      }
                      className="bg-white border-mist"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-label-caps text-slate mb-2 block">
                      DIRECCIÓN
                    </Label>
                    <Input
                      placeholder="Dirección fiscal"
                      value={buyerData.direccion}
                      onChange={(e) =>
                        setBuyerData({ ...buyerData, direccion: e.target.value })
                      }
                      className="bg-white border-mist"
                    />
                  </div>

                  <div>
                    <Label className="text-label-caps text-slate mb-2 block">
                      CIUDAD
                    </Label>
                    <Input
                      placeholder="Ciudad"
                      value={buyerData.ciudad}
                      onChange={(e) =>
                        setBuyerData({ ...buyerData, ciudad: e.target.value })
                      }
                      className="bg-white border-mist"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <div className="space-y-6">
            {/* Product Search */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-label-caps text-slate">
                  BÚSQUEDA DE PRODUCTO (UNSPSC)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      placeholder="Buscar por código o nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-mist"
                    />
                    {searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-mist rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.code}
                            className="px-4 py-3 hover:bg-cloud cursor-pointer border-b border-border last:border-0"
                            onClick={() => addProduct(product)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-ink">
                                  {product.description}
                                </p>
                                <p className="text-xs text-slate font-mono">
                                  UNSPSC: {product.code}
                                </p>
                              </div>
                              <span className="text-sm font-mono text-ink">
                                {formatCurrency(product.unitPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                        {filteredProducts.length === 0 && (
                          <div className="px-4 py-3 text-sm text-slate text-center">
                            No se encontraron productos
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    className="bg-ink hover:bg-ink/90 text-white"
                    onClick={() => addProduct()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar línea
                  </Button>
                </div>
                {errors.products && (
                  <p className="text-xs text-coral mt-2">{errors.products}</p>
                )}
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardContent className="pt-6">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-mist mx-auto mb-4" />
                    <p className="text-slate">No hay productos agregados</p>
                    <p className="text-sm text-slate mt-1">
                      Use la búsqueda arriba o haga clic en &quot;Agregar línea&quot;
                    </p>
                  </div>
                ) : (
                  <>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="w-8"></th>
                          <th className="text-left py-3 px-2 text-label-caps text-slate font-medium">
                            DESCRIPCIÓN
                          </th>
                          <th className="text-center py-3 px-2 text-label-caps text-slate font-medium">
                            CANT.
                          </th>
                          <th className="text-right py-3 px-2 text-label-caps text-slate font-medium">
                            V. UNITARIO
                          </th>
                          <th className="text-center py-3 px-2 text-label-caps text-slate font-medium">
                            IVA %
                          </th>
                          <th className="text-right py-3 px-2 text-label-caps text-slate font-medium">
                            TOTAL
                          </th>
                          <th className="w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr
                            key={product.id}
                            className={`border-b border-border ${
                              index === products.length - 1
                                ? "border-l-4 border-l-emerald bg-emerald/5"
                                : ""
                            }`}
                          >
                            <td className="py-4 px-1">
                              <GripVertical className="h-4 w-4 text-slate cursor-grab" />
                            </td>
                            <td className="py-4 px-2">
                              <div>
                                <Input
                                  value={product.description}
                                  onChange={(e) =>
                                    updateProduct(product.id, "description", e.target.value)
                                  }
                                  className="bg-transparent border-0 p-0 h-auto text-sm text-ink focus-visible:ring-0"
                                  placeholder="Descripción del producto"
                                />
                                <Input
                                  value={product.code}
                                  onChange={(e) =>
                                    updateProduct(product.id, "code", e.target.value)
                                  }
                                  className="bg-transparent border-0 p-0 h-auto text-xs text-slate font-mono mt-1 focus-visible:ring-0"
                                  placeholder="UNSPSC: 00000000"
                                />
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <Input
                                type="number"
                                min="1"
                                value={product.quantity}
                                onChange={(e) =>
                                  updateProduct(product.id, "quantity", Number(e.target.value))
                                }
                                className="w-16 text-center h-9 bg-white border-mist"
                              />
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-slate">$</span>
                                <Input
                                  type="number"
                                  value={product.unitPrice}
                                  onChange={(e) =>
                                    updateProduct(product.id, "unitPrice", Number(e.target.value))
                                  }
                                  className="w-28 text-right h-9 bg-white border-mist font-mono"
                                />
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <Select
                                value={product.taxRate.toString()}
                                onValueChange={(value) =>
                                  updateProduct(product.id, "taxRate", Number(value))
                                }
                              >
                                <SelectTrigger className="w-24 h-9 bg-white border-mist">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">0%</SelectItem>
                                  <SelectItem value="5">5%</SelectItem>
                                  <SelectItem value="19">19%</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-4 px-2 text-right">
                              <span className="font-mono font-semibold text-ink">
                                {formatCurrency(product.total)}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate hover:text-coral"
                                onClick={() => removeProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-sm text-slate">
                        {products.length} línea{products.length !== 1 ? "s" : ""} agregada{products.length !== 1 ? "s" : ""}
                      </span>
                      <Button variant="outline" className="border-mist">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Importar desde Excel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-label-caps text-slate">
                  NOTAS ADICIONALES (Opcional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Observaciones que aparecerán en el PDF de la factura..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white border-mist resize-none h-24"
                />
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display text-ink">
                Condiciones de Pago
              </CardTitle>
              <p className="text-sm text-slate">
                Configure el método y medio de pago para esta factura
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-label-caps text-slate mb-3 block">
                    MÉTODO DE PAGO
                  </Label>
                  <RadioGroup
                    value={paymentData.metodoPago}
                    onValueChange={(value) =>
                      setPaymentData({ ...paymentData, metodoPago: value })
                    }
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div
                        key={method.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentData.metodoPago === method.value
                            ? "border-emerald bg-emerald/5"
                            : "border-mist hover:border-slate"
                        }`}
                        onClick={() =>
                          setPaymentData({ ...paymentData, metodoPago: method.value })
                        }
                      >
                        <RadioGroupItem value={method.value} id={method.value} />
                        <Label htmlFor={method.value} className="cursor-pointer">
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-label-caps text-slate mb-3 block">
                    MEDIO DE PAGO
                  </Label>
                  <Select
                    value={paymentData.medioPago}
                    onValueChange={(value) =>
                      setPaymentData({ ...paymentData, medioPago: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-mist">
                      <SelectValue placeholder="Seleccione medio de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMediums.map((medium) => (
                        <SelectItem key={medium.value} value={medium.value}>
                          {medium.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {paymentData.metodoPago === "credito" && (
                  <div>
                    <Label className="text-label-caps text-slate mb-2 block">
                      FECHA DE VENCIMIENTO
                    </Label>
                    <Input
                      type="date"
                      value={paymentData.fechaVencimiento}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, fechaVencimiento: e.target.value })
                      }
                      className="bg-white border-mist"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <Label className="text-label-caps text-slate mb-2 block">
                    INSTRUCCIONES DE PAGO (Opcional)
                  </Label>
                  <Textarea
                    placeholder="Ej: Favor consignar a la cuenta de ahorros Bancolombia No. 123456789"
                    value={paymentData.cuentaBancaria}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cuentaBancaria: e.target.value })
                    }
                    className="bg-white border-mist resize-none h-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-display text-ink flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Revisión Final
                </CardTitle>
                <p className="text-sm text-slate">
                  Verifique la información antes de emitir el documento
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Type */}
                <div className="p-4 rounded-lg bg-cloud/50 border border-border">
                  <p className="text-label-caps text-slate mb-1">TIPO DE DOCUMENTO</p>
                  <p className="font-medium text-ink">
                    {documentTypes.find((d) => d.value === documentType)?.label}
                  </p>
                </div>

                {/* Buyer Info */}
                <div className="p-4 rounded-lg bg-cloud/50 border border-border">
                  <p className="text-label-caps text-slate mb-2">ADQUIRIENTE</p>
                  {buyerData.type === "consumidor_final" ? (
                    <p className="font-medium text-ink">Consumidor Final (NIT: 222222222)</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-medium text-ink">{buyerData.razonSocial}</p>
                      <p className="text-sm text-slate">
                        {buyerData.tipoDocumento}: {buyerData.numeroDocumento}
                      </p>
                      <p className="text-sm text-slate">{buyerData.email}</p>
                      {buyerData.direccion && (
                        <p className="text-sm text-slate">{buyerData.direccion}, {buyerData.ciudad}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Products Summary */}
                <div className="p-4 rounded-lg bg-cloud/50 border border-border">
                  <p className="text-label-caps text-slate mb-2">
                    PRODUCTOS ({products.length})
                  </p>
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div key={product.id} className="flex justify-between text-sm">
                        <span className="text-ink">
                          {product.quantity}x {product.description}
                        </span>
                        <span className="font-mono text-ink">
                          {formatCurrency(product.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-4 rounded-lg bg-cloud/50 border border-border">
                  <p className="text-label-caps text-slate mb-2">CONDICIONES DE PAGO</p>
                  <p className="text-sm text-ink">
                    {paymentMethods.find((m) => m.value === paymentData.metodoPago)?.label} -{" "}
                    {paymentMediums.find((m) => m.value === paymentData.medioPago)?.label}
                  </p>
                  {paymentData.fechaVencimiento && (
                    <p className="text-sm text-slate mt-1">
                      Vence: {paymentData.fechaVencimiento}
                    </p>
                  )}
                </div>

                {/* Notes */}
                {notes && (
                  <div className="p-4 rounded-lg bg-cloud/50 border border-border">
                    <p className="text-label-caps text-slate mb-2">NOTAS</p>
                    <p className="text-sm text-ink">{notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Confirmation */}
            <Alert className="bg-gold/10 border-gold">
              <AlertTriangle className="h-4 w-4 text-gold" />
              <AlertTitle>Confirmación requerida</AlertTitle>
              <AlertDescription>
                Al emitir este documento, se generará el XML, se calculará el CUFE,
                se aplicará la firma digital y se enviará a la DIAN para validación.
                Este proceso es irreversible.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2">
              <Checkbox id="confirm" />
              <Label htmlFor="confirm" className="text-sm text-ink">
                Confirmo que la información es correcta y autorizo la emisión del documento
              </Label>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-6">
        <div className="flex items-center gap-6">
          <Link href="/invoices" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 80 80">
                <rect x="15" y="20" width="50" height="10" rx="5" fill="#00C880" />
                <rect x="15" y="35" width="35" height="9" rx="4.5" fill="#F5A52A" />
                <rect x="15" y="49" width="50" height="10" rx="5" fill="white" />
              </svg>
            </div>
            <span className="font-display font-bold text-ink">EMITIX</span>
            <span className="text-xs text-slate">Electronic Billing</span>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="font-display text-xl font-bold text-ink">
            Nueva Factura de Venta
          </h1>
          <p className="text-sm text-slate">
            Complete los detalles para generar el documento electrónico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-mist">
            <Save className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/invoices">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Link>
          </Button>
        </div>
      </header>

      {/* Steps Progress */}
      <div className="border-b border-border bg-white px-6 py-4">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  if (step.id < currentStep) setCurrentStep(step.id)
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step.id < currentStep
                      ? "bg-emerald text-white"
                      : step.id === currentStep
                      ? "bg-emerald text-white ring-4 ring-emerald/20"
                      : "bg-mist text-slate"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    step.id <= currentStep ? "text-emerald" : "text-slate"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-2 ${
                    step.id < currentStep ? "bg-emerald" : "bg-mist"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">{renderStepContent()}</div>

          {/* Summary Sidebar */}
          <div>
            <Card className="sticky top-32 bg-ink text-white">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl font-bold">
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 flex items-center gap-2">
                    Descuentos globales
                  </span>
                  <span className="font-mono">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">IVA (19%)</span>
                  <span className="font-mono">{formatCurrency(iva)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 flex items-center gap-2">
                    Retenciones
                  </span>
                  <span className="font-mono">$0</span>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-emerald font-medium">Total Neto</span>
                    <span className="font-mono text-2xl font-bold text-emerald">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  {currentStep > 1 ? (
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={prevStep}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Atrás
                    </Button>
                  ) : (
                    <div />
                  )}
                  {currentStep < 5 ? (
                    <Button
                      className="bg-emerald hover:bg-emerald/90 text-white col-start-2"
                      onClick={nextStep}
                    >
                      Siguiente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-emerald hover:bg-emerald/90 text-white col-span-2"
                      onClick={startEmission}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Emitir Factura
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Emission Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista previa del borrador
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="bg-cloud/50 rounded-lg p-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="h-10 bg-ink/20 rounded w-1/2 mx-auto" />
                <div className="space-y-2">
                  <div className="h-4 bg-mist rounded w-full" />
                  <div className="h-4 bg-mist rounded w-3/4" />
                </div>
                <div className="pt-4">
                  <p className="text-label-caps text-slate">ADQUIRIENTE</p>
                  <div className="space-y-1 mt-2">
                    <div className="h-4 bg-mist rounded w-2/3" />
                    <div className="h-3 bg-mist rounded w-1/2" />
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="h-3 bg-mist rounded" />
                  <div className="h-3 bg-mist rounded" />
                  <div className="h-3 bg-mist rounded" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-ink/5 rotate-[-30deg]">
                  BORRADOR
                </span>
              </div>
            </div>

            {/* Emission Process */}
            <div className="space-y-4">
              {!emissionComplete && (
                <Alert className="bg-gold/10 border-gold">
                  <AlertTriangle className="h-4 w-4 text-gold" />
                  <AlertTitle>Modo por lotes activo</AlertTitle>
                  <AlertDescription className="text-sm">
                    Esta factura se emitirá y firmará en bloque junto con otros
                    documentos pendientes en su cola.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="font-display font-semibold text-ink mb-4">
                  Proceso de Emisión
                </h3>
                <p className="text-sm text-slate mb-4">
                  Al confirmar, el sistema realizará automáticamente los siguientes
                  procesos de validación ante la DIAN:
                </p>

                <div className="space-y-3">
                  {emissionSteps.map((step, index) => {
                    const StepIcon = step.icon
                    const isComplete = emissionStep > index + 1
                    const isCurrent = emissionStep === index + 1
                    const isPending = emissionStep < index + 1

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isComplete
                            ? "bg-emerald/10"
                            : isCurrent
                            ? "bg-ocean/10"
                            : "bg-cloud/50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isComplete
                              ? "bg-emerald text-white"
                              : isCurrent
                              ? "bg-ocean text-white"
                              : "bg-mist text-slate"
                          }`}
                        >
                          {isComplete ? (
                            <Check className="h-4 w-4" />
                          ) : isCurrent ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <StepIcon className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            isComplete
                              ? "text-emerald font-medium"
                              : isCurrent
                              ? "text-ocean font-medium"
                              : "text-slate"
                          }`}
                        >
                          {step.name}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {emissionComplete && generatedInvoice && (
                  <div className="mt-6 p-4 bg-emerald/10 rounded-lg border border-emerald/30">
                    <div className="flex items-center gap-2 text-emerald font-semibold mb-2">
                      <CheckCircle className="h-5 w-5" />
                      Factura Emitida Exitosamente
                    </div>
                    <p className="text-sm text-ink">
                      <strong>Número:</strong> {generatedInvoice.number}
                    </p>
                    <p className="text-xs text-slate mt-1 font-mono break-all">
                      <strong>CUFE:</strong> {generatedInvoice.cufe}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                {!emissionComplete ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 border-mist"
                      onClick={() => setShowPreview(false)}
                      disabled={isEmitting}
                    >
                      Volver a Editar
                    </Button>
                    <Button
                      className="flex-1 bg-emerald hover:bg-emerald/90 text-white"
                      disabled={isEmitting}
                    >
                      {isEmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Confirmar Emisión
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full bg-emerald hover:bg-emerald/90 text-white"
                    asChild
                  >
                    <Link href={`/invoices/${generatedInvoice?.number}`}>
                      Ver Factura
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
