"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Search, X, BookOpen, Calendar, User, ArrowRight, Loader2 } from "lucide-react"
import { fetchDevotionals, fetchTags } from "@/lib/api-client"
import type { DevotionalWithTags } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [devotionals, setDevotionals] = useState<DevotionalWithTags[]>([])
  const [allTags, setAllTags] = useState<{ id: string; name: string; color: string | null }[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Carregar tags na abertura do modal
  useEffect(() => {
    if (isOpen) {
      loadTags()
      // Focar no input após a animação
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Buscar devocionais quando searchTerm ou selectedTag mudar
  useEffect(() => {
    const searchDevotionals = async () => {
      if (searchTerm.trim() || selectedTag) {
        setLoading(true)
        try {
          const params: {
            searchTerm?: string;
            tagNames?: string[];
          } = {}
          if (searchTerm.trim()) {
            params.searchTerm = searchTerm.trim()
          }
          if (selectedTag) {
            params.tagNames = [selectedTag]
          }

          const result = await fetchDevotionals(params)
          setDevotionals(result.devotionals)
          setTotal(result.total)
        } catch (error) {
          console.error('Erro ao buscar devocionais:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setDevotionals([])
        setTotal(0)
      }
    }

    const debounceTimer = setTimeout(searchDevotionals, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedTag])

  const loadTags = async () => {
    try {
      const tags = await fetchTags()
      setAllTags(tags)
    } catch (error) {
      console.error('Erro ao carregar tags:', error)
    }
  }

  const handleDevotionalClick = (slug: string) => {
    router.push(`/devocional/${slug}`)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden p-0 border-0 bg-transparent sm:p-0">
        <DialogTitle className="sr-only">Buscar Devocionais</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden h-full flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200/50 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">Buscar Devocionais</h2>
                <p className="text-xs sm:text-sm text-slate-500 truncate">Encontre o conteúdo que você procura</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-slate-500 hover:text-slate-700 flex-shrink-0"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="p-4 sm:p-6 border-b border-slate-200/50 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Digite para buscar por título, conteúdo ou autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200/50 flex-shrink-0">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge
                  variant={selectedTag === null ? "default" : "secondary"}
                  className={`cursor-pointer transition-all text-xs sm:text-sm px-2 py-1 ${selectedTag === null
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  onClick={() => setSelectedTag(null)}
                >
                  Todos
                </Badge>
                {allTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTag === tag.name ? "default" : "secondary"}
                    className={`cursor-pointer transition-all text-xs sm:text-sm px-2 py-1 ${selectedTag === tag.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    onClick={() => setSelectedTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
                <span className="ml-2 sm:ml-3 text-sm sm:text-base text-slate-600">Buscando devocionais...</span>
              </div>
            ) : searchTerm.trim() || selectedTag ? (
              <div className="p-4 sm:p-6">
                {devotionals.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                        {total} devocional{total !== 1 ? 'is' : ''} encontrado{total !== 1 ? 's' : ''}
                      </h3>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {devotionals.map((devotional) => (
                        <motion.div
                          key={devotional.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-blue-300"
                            onClick={() => handleDevotionalClick(devotional.slug)}
                          >
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-slate-900 mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2">
                                    {devotional.title}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3 line-clamp-2">
                                    {devotional.excerpt}
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <span className="truncate">{devotional.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{formatDate(devotional.date)}</span>
                                    </div>
                                  </div>
                                  {devotional.tags && devotional.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2 sm:mt-3">
                                      {devotional.tags.slice(0, 3).map((tag) => (
                                        <Badge
                                          key={tag.id}
                                          variant="secondary"
                                          className="text-xs bg-slate-100 text-slate-600"
                                        >
                                          {tag.name}
                                        </Badge>
                                      ))}
                                      {devotional.tags.length > 3 && (
                                        <Badge
                                          key={`more-tags-${devotional.id}`}
                                          variant="secondary"
                                          className="text-xs bg-slate-100 text-slate-600"
                                        >
                                          +{devotional.tags.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">
                      Nenhum devocional encontrado
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      Tente ajustar os termos de busca ou filtros
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1 sm:mb-2">
                  Comece a buscar
                </h3>
                <p className="text-sm sm:text-base text-slate-600">
                  Digite palavras-chave ou selecione uma categoria
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-slate-200/50 bg-slate-50/50 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-slate-500">
              <span>Pressione ESC para fechar</span>
              <Link
                href="/devocionais"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={onClose}
              >
                Ver todos os devocionais
              </Link>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
