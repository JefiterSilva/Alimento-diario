"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Shield, User } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAdmin = false, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Se não requer autenticação, permitir acesso
      if (!requireAuth) {
        return
      }

      // Se requer autenticação mas não há usuário
      if (!user) {
        router.push("/login")
        return
      }

      // Se requer admin mas o usuário não é admin
      if (requireAdmin && user.role !== "ADMIN") {
        router.push("/")
        return
      }
    }
  }, [user, loading, requireAdmin, requireAuth, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Verificando autenticação...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Se não requer autenticação, mostrar conteúdo
  if (!requireAuth) {
    return <>{children}</>
  }

  // Se requer autenticação mas não há usuário
  if (!user) {
    return null
  }

  // Se requer admin mas o usuário não é admin
  if (requireAdmin && user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 mx-auto text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900">Acesso Negado</h2>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página. 
                Apenas administradores podem acessar esta área.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <User className="h-4 w-4" />
                                 <span className="text-sm text-muted-foreground">
                   Seu perfil: {user.role}
                 </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
