"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getDevotionalsByAuthor, deleteDevotional } from "@/lib/supabase-devotionals"
import { formatDateShort } from "@/lib/utils-devotional"
import { ArrowLeft, Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, FileText, AlertTriangle, User } from "lucide-react"
import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"

function DevocionaisManager() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [allDevotionals, setAllDevotionals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [devotionalToDelete, setDevotionalToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  // Load devotionals
  useEffect(() => {
    const loadDevotionals = async () => {
      try {
        if (user?.id) {
          const devotionals = await getDevotionalsByAuthor(user.id)
          setAllDevotionals(devotionals)
        }
      } catch (error) {
        console.error('Erro ao carregar devocionais:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDevotionals()
  }, [user])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allDevotionals.forEach((devotional) => {
      devotional.tags.forEach((tag: any) => tags.add(tag.name || tag))
    })
    return Array.from(tags).sort()
  }, [allDevotionals])

  // Filter devotionals
  const filteredDevotionals = useMemo(() => {
    return allDevotionals.filter((devotional) => {
      const matchesSearch =
        devotional.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devotional.author.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTag = !selectedTag || devotional.tags.some((tag: any) =>
        (tag.name || tag) === selectedTag
      )

      return matchesSearch && matchesTag
    })
  }, [allDevotionals, searchTerm, selectedTag])

  // Função para abrir modal de exclusão
  const handleDeleteClick = (devotional: any) => {
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
      setAllDevotionals(prev => prev.filter(d => d.id !== devotionalToDelete.id))

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-4 sm:py-8 px-4">
        <div className="container max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Button asChild variant="ghost" size="sm" className="w-fit">
                  <Link href="/admin" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Link>
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold">Gerenciar Devocionais</h1>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                {filteredDevotionals.length} de {allDevotionals.length} devocionais
              </p>
            </div>

            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/novo-devocional" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Devocional
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allDevotionals.length}</div>
                <p className="text-xs text-muted-foreground">devocionais publicados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    allDevotionals.filter((d) => {
                      const devotionalDate = new Date(d.date)
                      const now = new Date()
                      return (
                        devotionalDate.getMonth() === now.getMonth() &&
                        devotionalDate.getFullYear() === now.getFullYear()
                      )
                    }).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">novos devocionais</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tags</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allTags.length}</div>
                <p className="text-xs text-muted-foreground">categorias diferentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
              <CardDescription>Use os filtros abaixo para encontrar devocionais específicos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(null)}
                    className="text-xs sm:text-sm"
                  >
                    Todas as tags
                  </Button>
                  {allTags.slice(0, 5).map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className="text-xs sm:text-sm"
                    >
                      {tag}
                    </Button>
                  ))}
                  {allTags.length > 5 && (
                    <span className="text-xs sm:text-sm text-muted-foreground self-center">+{allTags.length - 5} mais</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Devotionals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Devocionais</CardTitle>
              <CardDescription>Lista completa de todos os devocionais publicados</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Carregando devocionais...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Autor</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDevotionals.length > 0 ? (
                          filteredDevotionals.map((devotional) => (
                            <TableRow key={devotional.id}>
                              <TableCell className="font-medium">
                                <div className="space-y-1">
                                  <div>{devotional.title}</div>
                                  <div className="text-sm text-muted-foreground">{devotional.excerpt.slice(0, 80)}...</div>
                                </div>
                              </TableCell>
                              <TableCell>{devotional.author}</TableCell>
                              <TableCell>{formatDateShort(devotional.date)}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {devotional.tags.slice(0, 2).map((tag: any) => (
                                    <Badge key={tag.name || tag} variant="secondary" className="text-xs">
                                      {tag.name || tag}
                                    </Badge>
                                  ))}
                                  {devotional.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{devotional.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/devocional/${devotional.slug}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Visualizar
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/devocionais/${devotional.slug}`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteClick(devotional)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <div className="text-muted-foreground">
                                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Nenhum devocional encontrado</p>
                                <p className="text-sm">Tente ajustar os filtros de busca</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-3">
                    {filteredDevotionals.length > 0 ? (
                      filteredDevotionals.map((devotional) => (
                        <Card key={devotional.id} className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-sm sm:text-base">{devotional.title}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{devotional.excerpt.slice(0, 100)}...</p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {devotional.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDateShort(devotional.date)}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {devotional.tags.slice(0, 3).map((tag: any) => (
                                <Badge key={tag.name || tag} variant="secondary" className="text-xs">
                                  {tag.name || tag}
                                </Badge>
                              ))}
                              {devotional.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{devotional.tags.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                                <Link href={`/devocional/${devotional.slug}`}>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Link>
                              </Button>
                              <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                                <Link href={`/admin/devocionais/${devotional.slug}`}>
                                  <Edit className="h-3 w-3 mr-1" />
                                  Editar
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(devotional)}
                                className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Nenhum devocional encontrado</p>
                          <p className="text-sm">Tente ajustar os filtros de busca</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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
              Tem certeza que deseja excluir o devocional "{devotionalToDelete?.title}"?
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

export default function DevocionaisPage() {
  return (
    <AuthGuard requireAdmin>
      <DevocionaisManager />
    </AuthGuard>
  )
}
