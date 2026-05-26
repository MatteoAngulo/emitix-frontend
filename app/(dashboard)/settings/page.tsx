"use client"

import { useEffect, useState } from "react"
import { Upload, Building2, Hash, AlertTriangle, Plus, Lock, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { AppHeader } from "@/components/layout/app-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { companyApi } from "@/lib/api/company"
import type { CompanyResponse, ResolutionResponse } from "@/lib/api/types"

export default function SettingsPage() {
  const { user, companyId } = useAuth()

  const [company, setCompany]           = useState<CompanyResponse | null>(null)
  const [resolutions, setResolutions]   = useState<ResolutionResponse[]>([])
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [saveMsg, setSaveMsg]           = useState<string | null>(null)

  // Form state — se sincroniza con la empresa cargada
  const [legalName, setLegalName]   = useState("")
  const [nit, setNit]               = useState("")
  const [address, setAddress]       = useState("")
  const [city, setCity]             = useState("")
  const [phone, setPhone]           = useState("")
  const [email, setEmail]           = useState("")

  useEffect(() => {
    Promise.all([
      companyApi.get(),
      companyId ? companyApi.getResolutions(companyId) : Promise.resolve([]),
    ]).then(([c, r]) => {
      setCompany(c)
      setResolutions(r)
      setLegalName(c.legalName ?? "")
      setNit(c.documentNumber ?? "")
      setAddress(c.address ?? "")
      setCity(c.city ?? "")
      setPhone(c.phone ?? "")
      setEmail(c.email ?? "")
    }).finally(() => setLoading(false))
  }, [companyId])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      const updated = await companyApi.update({
        documentNumber: nit, legalName, address, city, phone, email,
      })
      setCompany(updated)
      setSaveMsg("Cambios guardados correctamente.")
    } catch {
      setSaveMsg("Error al guardar. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(null), 3000)
    }
  }

  const activeResolution = resolutions.find(r => r.isActive) ?? resolutions[0] ?? null
  const resolutionUsedPct = activeResolution
    ? Math.round((activeResolution.currentNumber / activeResolution.rangeTo) * 100)
    : 0

  const initials = (name: string) =>
    name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />

      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Configuración</h1>
          <p className="text-slate mt-1">Administra los parámetros legales y fiscales de tu entidad.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-4">
              <Building2 className="h-5 w-5 text-slate" />
              <CardTitle className="font-display text-xl font-bold text-ink">Empresa emisora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-label-caps text-slate mb-2">LOGO CORPORATIVO</p>
                  <div className="border-2 border-dashed border-mist rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-emerald/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-slate mb-2" />
                    <p className="text-sm font-medium text-ink">Sube tu logo</p>
                    <p className="text-xs text-slate mt-1">PNG, JPG (Max 2MB)</p>
                  </div>
                </div>
                <div className="col-span-2 space-y-4">
                  <div>
                    <p className="text-label-caps text-slate mb-2">RAZÓN SOCIAL</p>
                    {loading ? <Skeleton className="h-10 w-full" /> : (
                      <Input value={legalName} onChange={e => setLegalName(e.target.value)} className="bg-white border-mist" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-label-caps text-slate mb-2">NIT</p>
                      {loading ? <Skeleton className="h-10 w-full" /> : (
                        <Input value={nit} onChange={e => setNit(e.target.value)} className="bg-white border-mist font-mono" />
                      )}
                    </div>
                    <div>
                      <p className="text-label-caps text-slate mb-2">TELÉFONO</p>
                      {loading ? <Skeleton className="h-10 w-full" /> : (
                        <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-white border-mist" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-label-caps text-slate mb-2">DIRECCIÓN FISCAL</p>
                {loading ? <Skeleton className="h-10 w-full" /> : (
                  <Input value={address} onChange={e => setAddress(e.target.value)} className="bg-white border-mist" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-label-caps text-slate mb-2">CIUDAD</p>
                  {loading ? <Skeleton className="h-10 w-full" /> : (
                    <Input value={city} onChange={e => setCity(e.target.value)} className="bg-white border-mist" />
                  )}
                </div>
                <div>
                  <p className="text-label-caps text-slate mb-2">EMAIL</p>
                  {loading ? <Skeleton className="h-10 w-full" /> : (
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white border-mist" />
                  )}
                </div>
              </div>

              {saveMsg && (
                <p className={`text-sm ${saveMsg.startsWith("Error") ? "text-coral" : "text-emerald"}`}>{saveMsg}</p>
              )}

              <Button onClick={handleSave} disabled={saving || loading} className="w-full bg-ink hover:bg-ink/90 text-white">
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </CardContent>
          </Card>

          {/* Resolution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-slate" />
                <CardTitle className="font-display text-xl font-bold text-ink">Resolución de numeración</CardTitle>
              </div>
              {activeResolution && (
                <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald mr-2" />
                  Activa
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : activeResolution ? (
                <>
                  <div className="bg-cloud/50 rounded-lg p-4 border border-mist">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-slate">Folios consumidos</span>
                      <span className="font-mono text-lg font-bold text-ink">
                        {activeResolution.currentNumber.toLocaleString("es-CO")}
                        <span className="text-slate font-normal"> / {activeResolution.rangeTo.toLocaleString("es-CO")}</span>
                      </span>
                    </div>
                    <Progress value={resolutionUsedPct} className="h-3 bg-mist" />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-emerald">Saludable</span>
                      <span className={`text-xs ${resolutionUsedPct >= 80 ? "text-coral" : "text-slate"}`}>
                        {resolutionUsedPct}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-label-caps text-slate mb-2">PREFIJO</p>
                      <div className="bg-cloud p-3 rounded border border-mist">
                        <span className="font-mono font-semibold text-ink">{activeResolution.prefix}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-label-caps text-slate mb-2">RANGO AUTORIZADO</p>
                      <div className="bg-cloud p-3 rounded border border-mist">
                        <span className="font-mono font-semibold text-ink">
                          {activeResolution.rangeFrom} - {activeResolution.rangeTo.toLocaleString("es-CO")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-label-caps text-slate mb-2">VIGENCIA DESDE</p>
                      <div className="bg-cloud p-3 rounded border border-mist">
                        <span className="text-sm text-ink">{activeResolution.validFrom}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-label-caps text-slate mb-2">VENCIMIENTO</p>
                      <div className="bg-cloud p-3 rounded border border-mist flex items-center gap-2">
                        <span className={`text-sm ${new Date(activeResolution.validUntil) < new Date() ? "text-coral" : "text-ink"}`}>
                          {activeResolution.validUntil}
                        </span>
                        {new Date(activeResolution.validUntil) < new Date() && (
                          <AlertTriangle className="h-4 w-4 text-coral" />
                        )}
                      </div>
                    </div>
                  </div>

                  {activeResolution.resolutionNumber && (
                    <div>
                      <p className="text-label-caps text-slate mb-2">NÚMERO DE RESOLUCIÓN DIAN</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-cloud p-3 rounded border border-mist">
                          <span className="font-mono text-xs text-ink">{activeResolution.resolutionNumber}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(activeResolution.resolutionNumber ?? "")}>
                          <Copy className="h-4 w-4 text-slate" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate text-sm text-center py-4">No hay resoluciones configuradas.</p>
              )}

              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="w-full border-mist">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar nueva resolución
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Digital Certificate */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-3 pb-4">
              <Lock className="h-5 w-5 text-slate" />
              <CardTitle className="font-display text-xl font-bold text-ink">Certificado Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-ink mb-2">Subir Nuevo Certificado</h3>
                    <p className="text-sm text-slate">Arrastra tu archivo .p12 o .pfx, o haz clic para buscar.</p>
                  </div>
                  <div className="border-2 border-dashed border-mist rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-emerald/50 transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 text-slate mb-3" />
                    <p className="font-medium text-ink">Clic para subir o arrastrar</p>
                    <p className="text-sm text-slate mt-1">Solo archivos .p12 o .pfx (Máx 5MB)</p>
                  </div>
                  <div>
                    <p className="text-label-caps text-slate mb-2">CONTRASEÑA DEL CERTIFICADO</p>
                    <Input type="password" placeholder="Ingresa la contraseña para validar" className="bg-white border-mist" />
                  </div>
                  <Button className="bg-ink hover:bg-ink/90 text-white">
                    <Lock className="mr-2 h-4 w-4" />
                    Validar y Guardar
                  </Button>
                </div>
                <div className="bg-ink rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                      <Lock className="h-5 w-5 text-emerald" />
                      Certificado Activo
                    </h3>
                    <Badge className="bg-emerald/20 text-emerald border-emerald/30">Vigente</Badge>
                  </div>
                  <p className="text-white/60 text-sm">
                    Para el MVP, el firmado usa un certificado de prueba. En producción se requiere un certificado emitido por una entidad certificadora DIAN.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Profile Footer */}
      {user && (
        <div className="fixed bottom-0 left-60 right-0 border-t border-border bg-white p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-ink text-white text-sm">
                {initials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-ink">{user.fullName}</p>
              <p className="text-sm text-slate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
