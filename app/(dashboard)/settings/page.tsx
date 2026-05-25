"use client"

import {
  Upload,
  Building2,
  Hash,
  AlertTriangle,
  Bell,
  Plus,
  Lock,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AppHeader } from "@/components/layout/app-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Configuración
          </h1>
          <p className="text-slate mt-1">
            Administra los parámetros legales y fiscales de tu entidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-4">
              <Building2 className="h-5 w-5 text-slate" />
              <CardTitle className="font-display text-xl font-bold text-ink">
                Empresa emisora
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-label-caps text-slate mb-2">
                    LOGO CORPORATIVO
                  </p>
                  <div className="border-2 border-dashed border-mist rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-emerald/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-slate mb-2" />
                    <p className="text-sm font-medium text-ink">Sube tu logo</p>
                    <p className="text-xs text-slate mt-1">
                      PNG, JPG (Max 2MB)
                    </p>
                  </div>
                </div>
                <div className="col-span-2 space-y-4">
                  <div>
                    <p className="text-label-caps text-slate mb-2">RAZÓN SOCIAL</p>
                    <Input
                      defaultValue="Tecnologías Avanzadas S.A.S."
                      className="bg-white border-mist"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-label-caps text-slate mb-2">NIT</p>
                      <Input
                        defaultValue="901.234.567-8"
                        className="bg-white border-mist font-mono"
                      />
                    </div>
                    <div>
                      <p className="text-label-caps text-slate mb-2">RÉGIMEN</p>
                      <Input
                        defaultValue="Responsable de IVA"
                        className="bg-white border-mist"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-label-caps text-slate mb-2">DIRECCIÓN FISCAL</p>
                <Input
                  defaultValue="Cra 45 # 123-45, Edificio Empresarial, Bogotá"
                  className="bg-white border-mist"
                />
              </div>

              <Button className="w-full bg-ink hover:bg-ink/90 text-white">
                Guardar cambios
              </Button>
            </CardContent>
          </Card>

          {/* Resolution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-slate" />
                <CardTitle className="font-display text-xl font-bold text-ink">
                  Resolución de numeración
                </CardTitle>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald/10 text-emerald border-emerald/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald mr-2" />
                Activa
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Folio Usage */}
              <div className="bg-cloud/50 rounded-lg p-4 border border-mist">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate">Folios consumidos</span>
                  <span className="font-mono text-lg font-bold text-ink">
                    4,250 <span className="text-slate font-normal">/ 5,000</span>
                  </span>
                </div>
                <Progress value={85} className="h-3 bg-mist" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-emerald">Saludable</span>
                  <span className="text-xs text-coral">Crítico (85%)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-label-caps text-slate mb-2">PREFIJO</p>
                  <div className="bg-cloud p-3 rounded border border-mist">
                    <span className="font-mono font-semibold text-ink">SETT</span>
                  </div>
                </div>
                <div>
                  <p className="text-label-caps text-slate mb-2">
                    RANGO AUTORIZADO
                  </p>
                  <div className="bg-cloud p-3 rounded border border-mist">
                    <span className="font-mono font-semibold text-ink">
                      1 - 5,000
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-label-caps text-slate mb-2">FECHA EMISIÓN</p>
                  <div className="bg-cloud p-3 rounded border border-mist">
                    <span className="text-sm text-ink">15 Ene 2024</span>
                  </div>
                </div>
                <div>
                  <p className="text-label-caps text-slate mb-2">VENCIMIENTO</p>
                  <div className="bg-cloud p-3 rounded border border-mist flex items-center gap-2">
                    <span className="text-sm text-coral">15 Ene 2025</span>
                    <AlertTriangle className="h-4 w-4 text-coral" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-label-caps text-slate mb-2">
                  CLAVE TÉCNICA (CUFE)
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-cloud p-3 rounded border border-mist">
                    <span className="font-mono text-xs text-ink">
                      ********************************...
                    </span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4 text-slate" />
                  </Button>
                </div>
                <p className="text-xs text-slate mt-2">
                  Requerida para la firma de documentos electrónicos DIAN.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="w-full border-mist">
                  <Plus className="mr-2 h-4 w-4" />
                  Register new resolution
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Digital Certificate */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-3 pb-4">
              <Lock className="h-5 w-5 text-slate" />
              <CardTitle className="font-display text-xl font-bold text-ink">
                Certificado Digital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-ink mb-2">
                      Upload New Certificate
                    </h3>
                    <p className="text-sm text-slate">
                      Drag and drop your .p12 or .pfx file, or click to browse.
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-mist rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-emerald/50 transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 text-slate mb-3" />
                    <p className="font-medium text-ink">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-slate mt-1">
                      .p12 or .pfx files only (Max 5MB)
                    </p>
                  </div>
                  <div>
                    <p className="text-label-caps text-slate mb-2">
                      CERTIFICATE PASSWORD
                    </p>
                    <Input
                      type="password"
                      placeholder="Enter password to validate"
                      className="bg-white border-mist"
                    />
                  </div>
                  <Button className="bg-ink hover:bg-ink/90 text-white">
                    <Lock className="mr-2 h-4 w-4" />
                    Validate & Save
                  </Button>
                </div>

                {/* Active Certificate */}
                <div className="bg-ink rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Lock className="h-5 w-5 text-emerald" />
                      Active Certificate
                    </h3>
                    <Badge className="bg-emerald/20 text-emerald border-emerald/30">
                      Healthy ({">"}60 days)
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">HOLDER NAME</p>
                      <p className="font-medium">Empresa Modelo S.A.S.</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">
                        CERTIFICATE AUTHORITY (CA)
                      </p>
                      <p className="font-medium">
                        GSE - Gestión de Seguridad Electrónica
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">EMISSION DATE</p>
                      <p className="font-medium">15 Oct 2023</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs text-white/50 mb-1">EXPIRY DATE</p>
                      <p className="font-medium">15 Oct 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="fixed bottom-0 left-60 right-0 border-t border-border bg-white p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.jpg" alt="Admin User" />
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
