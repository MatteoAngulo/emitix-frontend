"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captchaChecked, setCaptchaChecked] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-cloud flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-10 pb-8 px-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-ink flex items-center justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 80 80">
                <rect x="15" y="20" width="50" height="10" rx="5" fill="#00C880" />
                <rect x="15" y="35" width="35" height="9" rx="4.5" fill="#F5A52A" />
                <rect x="15" y="49" width="50" height="10" rx="5" fill="white" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-ink tracking-tight">
              EMITIX
            </h1>
            <p className="text-slate text-sm mt-1">
              Facturación Electrónica DIAN
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-label-caps text-slate">
                CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                <Input
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-label-caps text-slate">
                  CONTRASEÑA
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald hover:text-emerald/80 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-white border-mist focus:border-ink focus:ring-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div className="flex items-center justify-between p-3 bg-cloud rounded-lg border border-mist">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="captcha"
                  checked={captchaChecked}
                  onCheckedChange={(checked) => setCaptchaChecked(checked as boolean)}
                  className="border-slate data-[state=checked]:bg-ink data-[state=checked]:border-ink"
                />
                <label htmlFor="captcha" className="text-sm text-foreground">
                  No soy un robot
                </label>
              </div>
              <div className="w-10 h-10 bg-emerald/20 rounded flex items-center justify-center">
                <span className="text-emerald text-xs font-mono">rC</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-ink hover:bg-ink/90 text-white font-medium text-base"
            >
              Ingresar al Sistema
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-mist text-center">
            <p className="text-sm text-slate">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-emerald hover:underline font-medium">
                Registrarse
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
