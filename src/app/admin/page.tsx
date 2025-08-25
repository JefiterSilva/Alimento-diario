"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getDevotionalsByAuthor, deleteDevotional } from "@/lib/supabase-devotionals"
import type { DevotionalWithTags } from "@/lib/types"
import { Plus, FileText, Users, BarChart3, Settings, Eye, Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

function AdminDashboard() {
  const { user, users, fetchAllUsers } = useAuth()
  const [devotionals, setDevotionals] = useState<DevotionalWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [devotionalToDelete, setDevotionalToDelete] = useState<DevotionalWithTags | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Carregar dados quando o componente montar
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null)
        if (user?.role === 'ADMIN') {
          await fetchAllUsers()
        }
        if (user?.id) {
          const devos = await getDevotionalsByAuthor(user.id)
          setDevotionals(devos)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setError('Erro ao carregar dados. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, fetchAllUsers])

  // Função para abrir modal de exclusão
  const handleDeleteClick = (devotional: DevotionalWithTags) => {
    setDevotionalToDelete(devotional)
    setDeleteModalOpen(true)
  }

  // Função para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!devotionalToDelete) return

    setDeleting(true)
    try {
      await deleteDevotional(devotionalToDelete.id)

      // Remover da lista local
      setDevotionals(prev => prev.filter(d => d.id !== devotionalToDelete.id))

      toast.success("Devocional excluído com sucesso!")
      setDeleteModalOpen(false)
      setDevotionalToDelete(null)
    } catch (error) {
      console.error('Erro ao excluir devocional:', error)
      toast.error("Erro ao excluir devocional")
    } finally {
      setDeleting(false)
    }
  }

  // Função para cancelar exclusão
  const handleCancelDelete = () => {
    setDeleteModalOpen(false)
    setDevotionalToDelete(null)
  }

  const stats = {
    totalDevotionals: devotionals.length,
    thisMonth: devotionals.filter((d) => {
      const devotionalDate = new Date(d.date)
      const now = new Date()
      return devotionalDate.getMonth() === now.getMonth() && devotionalDate.getFullYear() === now.getFullYear()
    }).length,
    totalViews: 1247, // Mock data
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'ADMIN').length,
    regularUsers: users.filter(u => u.role === 'USER').length,
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8 px-4">
          <div className="container max-w-6xl mx-auto">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-red-600">Erro</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.location.reload()}>
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-4 sm:py-8 px-4">
        <div className="container max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">Painel Administrativo</h1>
              <div className="text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
                <span>Bem-vindo, {user?.name}!</span>
                <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'} className="w-fit">
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {user?.role === 'ADMIN' && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/admin/usuarios">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Gerenciar Usuários</span>
                    <span className="sm:hidden">Usuários</span>
                  </Link>
                </Button>
              )}
              <Button asChild className="w-full sm:w-auto">
                <Link href="/admin/novo-devocional" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Novo Devocional</span>
                  <span className="sm:hidden">Novo</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Devocionais</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDevotionals}</div>
                <p className="text-xs text-muted-foreground">{stats.thisMonth} este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.adminUsers} admin, {stats.regularUsers} usuários
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">Total de visualizações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">Sistema funcionando</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Devotionals */}
          <Card>
            <CardHeader>
              <CardTitle>Devocionais Recentes</CardTitle>
              <CardDescription>
                Últimos devocionais publicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Carregando devocionais...</p>
                </div>
              ) : devotionals.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum devocional encontrado</p>
                  <Button asChild className="mt-4">
                    <Link href="/admin/novo-devocional">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Devocional
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {devotionals.slice(0, 5).map((devotional) => (
                    <div key={devotional.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate">{devotional.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {devotional.author} • {new Date(devotional.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <Button asChild variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3">
                          <Link href={`/devocional/${devotional.slug}`}>
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1">Ver</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3">
                          <Link href={`/admin/devocionais/${devotional.slug}`}>
                            <Edit className="h-4 w-4" />
                            <span className="hidden sm:inline ml-1">Editar</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(devotional)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline ml-1">Excluir</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {devotionals.length > 5 && (
                    <div className="text-center pt-4">
                      <Button asChild variant="outline">
                        <Link href="/admin/devocionais">
                          Ver Todos os Devocionais
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Criar Devocional
                </CardTitle>
                <CardDescription>
                  Adicione um novo devocional ao site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/novo-devocional">
                    Criar Novo Devocional
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription>
                  Visualize e gerencie usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/usuarios">
                    Ver Usuários
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações
                </CardTitle>
                <CardDescription>
                  Configure as opções do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/perfil">
                    Configurações
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o devocional &quot;{devotionalToDelete?.title}&quot;?
              <br />
              <span className="text-red-600 font-medium">
                Esta ação não pode ser desfeita.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin={false} requireAuth={true}>
      <AdminDashboard />
    </AuthGuard>
  )
}
