"use client"

import { Header } from "@/components/header"
import { DevotionalCard } from "@/components/devotional-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fetchDevotionals, fetchTags } from "@/lib/api-client"
import { Search, BookOpen, Calendar, Heart, BookText, Sparkles, Filter, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { DevotionalWithTags } from "../../lib/types"

export default function DevocionaisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [devotionals, setDevotionals] = useState<DevotionalWithTags[]>([])
  const [allTags, setAllTags] = useState<{ id: string; name: string; color: string | null }[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Carregar dados iniciais
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [devotionalsData, tagsData] = await Promise.all([
          fetchDevotionals(),
          fetchTags()
        ])
        setDevotionals(devotionalsData.devotionals)
        setAllTags(tagsData)
        setTotal(devotionalsData.total)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Buscar devocionais com filtros
  useEffect(() => {
    async function searchData() {
      if (!loading) {
        try {
          const result = await fetchDevotionals({
            searchTerm: searchTerm || undefined,
            tagNames: selectedTag ? [selectedTag] : undefined,
            limit: 50
          })
          setDevotionals(result.devotionals)
          setTotal(result.total)
        } catch (error) {
          console.error('Erro na busca:', error)
        }
      }
    }

    // Debounce para evitar muitas requisições
    const timeoutId = setTimeout(searchData, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedTag, loading])

  // Enhanced color palette with modern gradients
  const getTagColor = (tag: string) => {
    const colors = {
      paz: "from-emerald-500 via-teal-500 to-cyan-500",
      amor: "from-rose-500 via-pink-500 to-fuchsia-500",
      força: "from-orange-500 via-amber-500 to-yellow-500",
      graça: "from-violet-500 via-purple-500 to-indigo-500",
      perdão: "from-blue-500 via-cyan-500 to-teal-500",
      confiança: "from-green-500 via-emerald-500 to-teal-500",
      oração: "from-indigo-500 via-purple-500 to-violet-500",
      cruz: "from-red-500 via-rose-500 to-pink-500",
      poder: "from-yellow-500 via-orange-500 to-red-500",
      fraqueza: "from-slate-500 via-gray-500 to-zinc-500"
    }
    return colors[tag as keyof typeof colors] || "from-blue-500 via-indigo-500 to-purple-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main className="py-6 sm:py-8 px-3 sm:px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <BookText className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <p className="text-slate-600 text-lg">Carregando devocionais...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="py-6 sm:py-8 px-3 sm:px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-2xl shadow-blue-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
              <BookText className="h-8 w-8 sm:h-10 sm:w-10 text-white relative z-10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight px-4">
              Devocionais Diários
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Descubra reflexões bíblicas profundas que transformam vidas e fortalecem sua jornada espiritual
            </p>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>
          </motion.div>

          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/devocionais" className="block cursor-pointer">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 text-center shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover:border-blue-300 hover:bg-white/90">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">{devotionals.length}</div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Devocionais</p>
                    <div className="text-xs text-blue-500 mt-2 font-medium">Ver Todos</div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/devocionais" className="block cursor-pointer">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 text-center shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover:border-emerald-300 hover:bg-white/90">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <Calendar className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">{allTags.length}</div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Categorias</p>
                    <div className="text-xs text-emerald-500 mt-2 font-medium">Explorar</div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/sobre" className="block cursor-pointer">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 text-center shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover:border-purple-300 hover:bg-white/90">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <Heart className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">∞</div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Inspiração</p>
                    <div className="text-xs text-purple-500 mt-2 font-medium">Saiba Mais</div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/admin" className="block cursor-pointer">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 text-center shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover:border-orange-300 hover:bg-white/90">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                    </div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">100%</div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Crescimento</p>
                    <div className="text-xs text-orange-500 mt-2 font-medium">Admin</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl mb-12 sm:mb-16"
          >
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                <Input
                  placeholder="Buscar devocionais por título, conteúdo ou autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 sm:pl-16 pr-12 sm:pr-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm"
                />
                <Filter className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              </div>

              {/* Filter Tags */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4">Filtrar por categoria</h3>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={selectedTag === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(null)}
                      className={selectedTag === null
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/25 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm"
                        : "border-2 border-slate-300 hover:border-blue-300 text-slate-700 bg-white/50 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm"
                      }
                    >
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Todos
                    </Button>
                  </motion.div>

                  {allTags.map((tag, index) => (
                    <motion.div
                      key={tag.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={selectedTag === tag.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                        className={selectedTag === tag.name
                          ? `bg-gradient-to-r ${getTagColor(tag.name)} text-white border-0 shadow-lg px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-sm`
                          : "border-2 border-slate-300 hover:border-blue-300 text-slate-700 bg-white/50 backdrop-blur-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-sm"
                        }
                      >
                        {tag.name}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/20 shadow-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-sm sm:text-lg text-slate-700 font-medium">
                  <span className="font-bold text-slate-800">{total}</span> devocional{total !== 1 ? "is" : ""} encontrado{total !== 1 ? "s" : ""}
                  {selectedTag && (
                    <span className="ml-1 sm:ml-2">
                      na categoria{" "}
                      <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-md">
                        {selectedTag}
                      </Badge>
                    </span>
                  )}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {devotionals.length > 0 ? (
                <motion.div
                  key="devotionals"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
                >
                  {devotionals.map((devotional, index) => (
                    <motion.div
                      key={devotional.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <DevotionalCard devotional={devotional} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12 sm:py-20"
                >
                  <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-xl">
                    <Search className="h-12 w-12 sm:h-16 sm:w-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-slate-800">Nenhum devocional encontrado</h3>
                  <p className="text-slate-600 mb-6 sm:mb-8 text-base sm:text-lg max-w-md mx-auto px-4">
                    Tente ajustar os filtros de busca ou usar termos diferentes para encontrar o que procura
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedTag(null)
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg shadow-blue-500/25"
                  >
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Limpar Filtros
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
