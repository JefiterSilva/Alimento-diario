"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDevotionalBySlug, updateDevotional } from "@/lib/supabase-devotionals"
import { getAllTags } from "@/lib/supabase-devotionals"
import { ArrowLeft, Save, Eye, Calendar, User, Tag, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EditDevotionalPageProps {
    params: Promise<{
        slug: string
    }>
}

function EditDevotionalPage({ params }: EditDevotionalPageProps) {
    const router = useRouter()
    const { slug } = use(params)
    const [devotional, setDevotional] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [tags, setTags] = useState<any[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        bibleVerse: "",
        bibleReference: "",
        author: "",
        date: "",
        featured: false,
        published: true
    })

    // Carregar devocional e tags
    useEffect(() => {
        const loadData = async () => {
            try {
                const [devotionalData, tagsData] = await Promise.all([
                    getDevotionalBySlug(slug),
                    getAllTags()
                ])

                if (devotionalData) {
                    setDevotional(devotionalData)
                    setFormData({
                        title: devotionalData.title || "",
                        excerpt: devotionalData.excerpt || "",
                        content: devotionalData.content || "",
                        bibleVerse: devotionalData.bible_verse || "",
                        bibleReference: devotionalData.bible_reference || "",
                        author: devotionalData.author || "",
                        date: devotionalData.date ? new Date(devotionalData.date).toISOString().split('T')[0] : "",
                        featured: devotionalData.featured || false,
                        published: devotionalData.published !== false
                    })
                    setSelectedTags(devotionalData.tags?.map((tag: any) => tag.tag?.name || tag.name) || [])
                }

                setTags(tagsData || [])
            } catch (error) {
                console.error('Erro ao carregar dados:', error)
                toast.error("Erro ao carregar devocional")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [slug])

    const handleSave = async () => {
        if (!devotional) return

        setSaving(true)
        try {
            const updatedDevotional = {
                ...devotional,
                ...formData,
                tags: selectedTags
            }

            await updateDevotional(devotional.id, updatedDevotional)
            toast.success("Devocional atualizado com sucesso!")
            router.push("/admin/devocionais")
        } catch (error) {
            console.error('Erro ao salvar:', error)
            toast.error("Erro ao salvar devocional")
        } finally {
            setSaving(false)
        }
    }

    const handleTagToggle = (tagName: string) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(tag => tag !== tagName)
                : [...prev, tagName]
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="py-8 px-4">
                    <div className="container max-w-6xl mx-auto">
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-sm text-muted-foreground mt-2">Carregando devocional...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (!devotional) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="py-8 px-4">
                    <div className="container max-w-6xl mx-auto">
                        <Card className="max-w-md mx-auto">
                            <CardHeader>
                                <CardTitle className="text-red-600">Devocional não encontrado</CardTitle>
                                <CardDescription>O devocional que você está procurando não existe.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href="/admin/devocionais">
                                        Voltar para Devocionais
                                    </Link>
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
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <Button asChild variant="ghost" size="sm" className="w-fit">
                                    <Link href="/admin/devocionais" className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Voltar
                                    </Link>
                                </Button>
                                <h1 className="text-2xl sm:text-3xl font-bold">Editar Devocional</h1>
                            </div>
                            <p className="text-muted-foreground text-sm sm:text-base truncate">
                                Editando: {devotional.title}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            <Button asChild variant="outline" className="w-full sm:w-auto">
                                <Link href={`/devocional/${devotional.slug}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Visualizar
                                </Link>
                            </Button>
                            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </div>

                    {/* Devotional Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Informações do Devocional
                            </CardTitle>
                            <CardDescription>
                                Informações básicas sobre o devocional
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Título do devocional"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="author">Autor *</Label>
                                    <Input
                                        id="author"
                                        value={formData.author}
                                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                        placeholder="Nome do autor"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Data *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bibleReference">Referência Bíblica *</Label>
                                    <Input
                                        id="bibleReference"
                                        value={formData.bibleReference}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bibleReference: e.target.value }))}
                                        placeholder="Ex: João 3:16"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Resumo *</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    placeholder="Breve resumo do devocional"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bibleVerse">Versículo Bíblico *</Label>
                                <Textarea
                                    id="bibleVerse"
                                    value={formData.bibleVerse}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bibleVerse: e.target.value }))}
                                    placeholder="Versículo bíblico principal"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Conteúdo</CardTitle>
                            <CardDescription>
                                O conteúdo principal do devocional
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="content">Conteúdo *</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="Conteúdo do devocional..."
                                    rows={15}
                                    className="font-mono text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações</CardTitle>
                            <CardDescription>
                                Configurações de publicação e exibição
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Tags */}
                            <div className="space-y-4">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                                            className="cursor-pointer hover:bg-primary/80 text-xs sm:text-sm"
                                            onClick={() => handleTagToggle(tag.name)}
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                                {selectedTags.length > 0 && (
                                    <div className="text-sm text-muted-foreground">
                                        Tags selecionadas: {selectedTags.join(", ")}
                                    </div>
                                )}
                            </div>

                            {/* Options */}
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <Label htmlFor="featured">Destacar devocional</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <Label htmlFor="published">Publicar devocional</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Prévia</CardTitle>
                            <CardDescription>
                                Como o devocional aparecerá para os leitores
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h2 className="text-xl font-bold mb-2">{formData.title || "Título do Devocional"}</h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                                            {formData.author || "Autor"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                            {formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : "Data"}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground mb-3">{formData.excerpt || "Resumo do devocional..."}</p>
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                                        <p className="text-sm font-medium text-blue-800">{formData.bibleReference || "Referência Bíblica"}</p>
                                        <p className="text-sm text-blue-700">{formData.bibleVerse || "Versículo bíblico..."}</p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {formData.content ? (
                                            <div className="prose prose-sm max-w-none">
                                                {formData.content.slice(0, 200)}...
                                            </div>
                                        ) : (
                                            "Conteúdo do devocional..."
                                        )}
                                    </div>
                                    {selectedTags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {selectedTags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default function EditDevotionalPageWrapper({ params }: EditDevotionalPageProps) {
    return (
        <AuthGuard requireAdmin>
            <EditDevotionalPage params={params} />
        </AuthGuard>
    )
}
