"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Eye, Plus, X, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { generateSlug } from "@/lib/utils-devotional"

function NovoDevocionalForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    bibleVerse: "",
    bibleReference: "",
    excerpt: "",
    tags: [] as string[],
    author: user?.name || "Autor",
  })

  const [newTag, setNewTag] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/devotionals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          bibleVerse: formData.bibleVerse,
          bibleReference: formData.bibleReference,
          author: formData.author,
          authorId: user?.id,
          tagNames: formData.tags,
          featured: false,
          published: true
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar devocional')
      }

      setSaved(true)

      // Limpar formulário após salvar com sucesso
      setFormData({
        title: "",
        content: "",
        bibleVerse: "",
        bibleReference: "",
        excerpt: "",
        tags: [],
        author: "Pastor João Silva",
      })

      // Reset saved state after 3 seconds
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar devocional:', error)
      alert('Erro ao salvar devocional: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setIsSaving(false)
    }
  }

  const isFormValid = formData.title && formData.content && formData.bibleVerse && formData.bibleReference && formData.excerpt

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-4 sm:py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-6 sm:space-y-8">
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
                <h1 className="text-2xl sm:text-3xl font-bold">Novo Devocional</h1>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">Crie um novo devocional para inspirar seus leitores</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {formData.title && (
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href={`/devocional/${generateSlug(formData.title)}`} className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Link>
                </Button>
              )}
              <Button onClick={handleSave} disabled={!isFormValid || isSaving} className="gap-2 w-full sm:w-auto">
                {isSaving ? (
                  <>Salvando...</>
                ) : saved ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Salvo!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>

          {saved && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Devocional salvo com sucesso! Ele já está disponível no blog.
                <Button asChild variant="link" className="p-0 h-auto text-green-800 underline">
                  <Link href="/devocionais">Ver todos os devocionais</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Preencha as informações principais do devocional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: A Paz que Excede Todo Entendimento"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo *</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Breve descrição do devocional (aparece na listagem)"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Autor</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Versículo Bíblico</CardTitle>
                  <CardDescription>Adicione o versículo principal que será destacado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bibleVerse">Versículo *</Label>
                    <Textarea
                      id="bibleVerse"
                      placeholder="Ex: E a paz de Deus, que excede todo o entendimento, guardará o vosso coração e a vossa mente em Cristo Jesus."
                      value={formData.bibleVerse}
                      onChange={(e) => handleInputChange("bibleVerse", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bibleReference">Referência *</Label>
                    <Input
                      id="bibleReference"
                      placeholder="Ex: Filipenses 4:7"
                      value={formData.bibleReference}
                      onChange={(e) => handleInputChange("bibleReference", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo do Devocional</CardTitle>
                  <CardDescription>Escreva o conteúdo completo da reflexão</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      placeholder="Escreva aqui o conteúdo completo do devocional..."
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      rows={15}
                      className="min-h-[400px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Dica: Use **texto** para destacar reflexões importantes
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>Adicione tags para categorizar o devocional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Nova tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm" variant="outline" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {formData.tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma tag adicionada</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">Rascunho</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slug:</span>
                    <span className="font-mono text-xs">{formData.title ? generateSlug(formData.title) : "---"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data:</span>
                    <span>{new Date().toLocaleDateString("pt-BR")}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sugestões de Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {["paz", "amor", "fé", "esperança", "oração", "perdão", "gratidão", "confiança"].map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...prev.tags, tag],
                            }))
                          }
                        }}
                        disabled={formData.tags.includes(tag)}
                        className="text-xs sm:text-sm"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function NovoDevocionalPage() {
  return (
    <AuthGuard requireAdmin>
      <NovoDevocionalForm />
    </AuthGuard>
  )
}
