"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield, 
  Building2, 
  User, 
  Phone,
  FileText,
  CheckCircle2,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const [formData, setFormData] = useState({
    // Paso 1: Datos de la empresa
    razonSocial: "",
    nit: "",
    digitoVerificacion: "",
    tipoPersona: "",
    regimen: "",
    // Paso 2: Datos de contacto
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    // Paso 3: Usuario administrador
    nombreAdmin: "",
    apellidoAdmin: "",
    emailAdmin: "",
    password: "",
    confirmPassword: "",
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitting(false)
      setIsComplete(true)
    }
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.razonSocial && formData.nit && formData.tipoPersona && formData.regimen
    }
    if (step === 2) {
      return formData.email && formData.telefono && formData.direccion && formData.ciudad
    }
    if (step === 3) {
      return formData.nombreAdmin && formData.emailAdmin && formData.password && 
             formData.password === formData.confirmPassword && acceptTerms
    }
    return false
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink mb-3">
              Registro Exitoso
            </h1>
            <p className="text-slate mb-6">
              Hemos enviado un correo de verificación a <strong>{formData.emailAdmin}</strong>. 
              Por favor verifica tu cuenta para activar tu acceso a EMITIX.
            </p>
            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-gold font-medium">
                Importante: También deberás configurar tu Certificado Digital DIAN y 
                resolución de numeración antes de emitir facturas.
              </p>
            </div>
            <Button
              onClick={() => router.push("/")}
              className="w-full h-12 bg-ink hover:bg-ink/90 text-white"
            >
              Ir al Inicio de Sesión
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardContent className="pt-8 pb-8 px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/"
              className="p-2 hover:bg-mist rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                Crear Cuenta
              </h1>
              <p className="text-slate text-sm">
                Configura tu cuenta de facturación electrónica
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${s < step ? "bg-emerald text-white" : s === step ? "bg-ink text-white" : "bg-mist text-slate"}
                `}>
                  {s < step ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 rounded-full ${s < step ? "bg-emerald" : "bg-mist"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mb-6 px-1">
            <span className={`text-xs ${step === 1 ? "text-ink font-medium" : "text-slate"}`}>
              Empresa
            </span>
            <span className={`text-xs ${step === 2 ? "text-ink font-medium" : "text-slate"}`}>
              Contacto
            </span>
            <span className={`text-xs ${step === 3 ? "text-ink font-medium" : "text-slate"}`}>
              Administrador
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Company Data */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    RAZÓN SOCIAL
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type="text"
                      placeholder="Mi Empresa S.A.S."
                      value={formData.razonSocial}
                      onChange={(e) => updateField("razonSocial", e.target.value)}
                      className="pl-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-2">
                    <label className="text-label-caps text-slate">
                      NIT
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                      <Input
                        type="text"
                        placeholder="900.123.456"
                        value={formData.nit}
                        onChange={(e) => updateField("nit", e.target.value)}
                        className="pl-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-caps text-slate">
                      DV
                    </label>
                    <Input
                      type="text"
                      placeholder="7"
                      maxLength={1}
                      value={formData.digitoVerificacion}
                      onChange={(e) => updateField("digitoVerificacion", e.target.value)}
                      className="h-11 bg-white border-mist focus:border-ink focus:ring-ink text-center"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    TIPO DE PERSONA
                  </label>
                  <Select 
                    value={formData.tipoPersona} 
                    onValueChange={(v) => updateField("tipoPersona", v)}
                  >
                    <SelectTrigger className="h-11 bg-white border-mist">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="juridica">Persona Jurídica</SelectItem>
                      <SelectItem value="natural">Persona Natural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    RÉGIMEN TRIBUTARIO
                  </label>
                  <Select 
                    value={formData.regimen} 
                    onValueChange={(v) => updateField("regimen", v)}
                  >
                    <SelectTrigger className="h-11 bg-white border-mist">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="responsable">Responsable de IVA</SelectItem>
                      <SelectItem value="no_responsable">No Responsable de IVA</SelectItem>
                      <SelectItem value="gran_contribuyente">Gran Contribuyente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 2: Contact Data */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    CORREO ELECTRÓNICO EMPRESARIAL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type="email"
                      placeholder="facturacion@miempresa.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="pl-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                  </div>
                  <p className="text-xs text-slate">
                    Este correo se usará para notificaciones de facturación
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    TELÉFONO
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type="tel"
                      placeholder="300 123 4567"
                      value={formData.telefono}
                      onChange={(e) => updateField("telefono", e.target.value)}
                      className="pl-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    DIRECCIÓN FISCAL
                  </label>
                  <Input
                    type="text"
                    placeholder="Cra 45 # 123-45, Edificio Centro"
                    value={formData.direccion}
                    onChange={(e) => updateField("direccion", e.target.value)}
                    className="h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-label-caps text-slate">
                      CIUDAD
                    </label>
                    <Input
                      type="text"
                      placeholder="Bogotá"
                      value={formData.ciudad}
                      onChange={(e) => updateField("ciudad", e.target.value)}
                      className="h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-caps text-slate">
                      DEPARTAMENTO
                    </label>
                    <Select 
                      value={formData.departamento} 
                      onValueChange={(v) => updateField("departamento", v)}
                    >
                      <SelectTrigger className="h-11 bg-white border-mist">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bogota">Bogotá D.C.</SelectItem>
                        <SelectItem value="antioquia">Antioquia</SelectItem>
                        <SelectItem value="valle">Valle del Cauca</SelectItem>
                        <SelectItem value="atlantico">Atlántico</SelectItem>
                        <SelectItem value="santander">Santander</SelectItem>
                        <SelectItem value="cundinamarca">Cundinamarca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Admin User */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-label-caps text-slate">
                      NOMBRE
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                      <Input
                        type="text"
                        placeholder="Juan"
                        value={formData.nombreAdmin}
                        onChange={(e) => updateField("nombreAdmin", e.target.value)}
                        className="pl-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-caps text-slate">
                      APELLIDO
                    </label>
                    <Input
                      type="text"
                      placeholder="Pérez"
                      value={formData.apellidoAdmin}
                      onChange={(e) => updateField("apellidoAdmin", e.target.value)}
                      className="h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    CORREO DEL ADMINISTRADOR
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type="email"
                      placeholder="admin@miempresa.com"
                      value={formData.emailAdmin}
                      onChange={(e) => updateField("emailAdmin", e.target.value)}
                      className="pl-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    CONTRASEÑA
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className="pl-10 pr-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps text-slate">
                    CONFIRMAR CONTRASEÑA
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repetir contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-coral">Las contraseñas no coinciden</p>
                  )}
                </div>

                <div className="flex items-start gap-3 p-3 bg-cloud rounded-lg border border-mist">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-0.5 border-slate data-[state=checked]:bg-ink data-[state=checked]:border-ink"
                  />
                  <label htmlFor="terms" className="text-sm text-foreground leading-relaxed">
                    Acepto los{" "}
                    <Link href="#" className="text-emerald hover:underline">
                      Términos y Condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="#" className="text-emerald hover:underline">
                      Política de Privacidad
                    </Link>{" "}
                    de EMITIX.
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 h-12 border-mist"
                >
                  Atrás
                </Button>
              )}
              <Button
                type="submit"
                disabled={!canProceed() || isSubmitting}
                className="flex-1 h-12 bg-ink hover:bg-ink/90 text-white font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creando cuenta...
                  </>
                ) : step === 3 ? (
                  <>
                    Crear Cuenta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-mist text-center">
            <p className="text-sm text-slate">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/" className="text-emerald hover:underline font-medium">
                Iniciar Sesión
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2 text-slate text-xs">
              <Shield className="h-3.5 w-3.5" />
              <span className="font-mono">Conexión Segura DIAN</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
