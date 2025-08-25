"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield, Eye, EyeOff, Save, AlertCircle } from "lucide-react"
import { useState } from "react"

function PerfilPage() {
  const { user, updateExistingUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: ""
  })

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: ""
    })
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: ""
    })
    setError("")
    setSuccess("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validações
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (formData.password && formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const updateData: any = {}
      if (formData.name !== user?.name) updateData.name = formData.name
      if (formData.email !== user?.email) updateData.email = formData.email
      if (formData.password) updateData.password = formData.password

      const result = await updateExistingUser(user?.id || "", updateData)

      if (result.success) {
        setSuccess("Perfil atualizado com sucesso!")
        setIsEditing(false)
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          password: "",
          confirmPassword: ""
        })
      } else {
        setError(result.error || "Erro ao atualizar perfil")
      }
    } catch (error) {
      setError("Erro ao atualizar perfil")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Meu Perfil</h1>
              <p className="text-muted-foreground">
                Gerencie suas informações pessoais e configurações de conta
              </p>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline">
                Editar Perfil
              </Button>
            )}
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Suas informações básicas de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{success}</span>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Nova Senha (deixe em branco para manter)</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Função</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                        </Badge>
                        {user.role === 'ADMIN' && <Shield className="h-4 w-4 text-blue-500" />}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Membro desde</Label>
                      <p className="text-lg font-medium">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Informações da Conta
              </CardTitle>
              <CardDescription>
                Detalhes técnicos da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">ID da Conta</Label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{user.id}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Última Atualização</Label>
                  <p className="text-sm">
                    {new Date(user.updated_at).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(user.updated_at).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function PerfilPageWrapper() {
  return (
    <AuthGuard requireAuth>
      <PerfilPage />
    </AuthGuard>
  )
}
