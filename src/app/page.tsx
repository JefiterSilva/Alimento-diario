"use client"

import { Header } from "@/components/header"
import { DevotionalCard } from "@/components/devotional-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { fetchDevotionals } from "@/lib/api-client"
import type { DevotionalWithTags } from "@/lib/types"
import { BookOpen, Calendar, ArrowRight, Heart, Sparkles, Target, Shield } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const [todaysDevotional, setTodaysDevotional] = useState<DevotionalWithTags | null>(null)
  const [recentDevotionals, setRecentDevotionals] = useState<DevotionalWithTags[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchDevotionals()
        const devotionals = response.devotionals

        // Pegar o primeiro devocional como "de hoje" (featured)
        const featured = devotionals.find((d: DevotionalWithTags) => d.featured) || devotionals[0]
        setTodaysDevotional(featured || null)

        // Pegar os próximos 3 como recentes
        const recent = devotionals.filter((d: DevotionalWithTags) => d.id !== featured?.id).slice(0, 3)
        setRecentDevotionals(recent)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        // Em caso de erro, não mostrar loading infinito
        setTodaysDevotional(null)
        setRecentDevotionals([])
      } finally {
        setLoading(false)
      }
    }

    // Adicionar um timeout para evitar loading infinito
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setTodaysDevotional(null)
      setRecentDevotionals([])
    }, 5000) // 5 segundos de timeout

    loadData()

    return () => clearTimeout(timeoutId)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="py-8 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <p className="text-muted-foreground text-lg">Carregando devocionais...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Partículas Flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-3 h-3 bg-indigo-400 rounded-full opacity-50"
        />
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-40 left-20 w-2 h-2 bg-purple-400 rounded-full opacity-70"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
            rotate: [0, 90, 180]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-1 h-1 bg-blue-300 rounded-full opacity-80"
        />
      </div>

      <Header />

      <main className="py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="mb-12">
              {/* Logo Animado */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto w-28 h-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                <BookOpen className="h-14 w-14 text-white relative z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-full"
                ></motion.div>
              </motion.div>

              {/* Título Principal */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mb-6"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-none font-playfair tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ALIMENTO
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    DIÁRIO
                  </span>
                </h1>
              </motion.div>

              {/* Subtítulo Estilizado */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 px-6 py-3 rounded-full mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                  ></motion.div>
                  <span className="text-blue-700 font-semibold text-sm uppercase tracking-wider">
                    Nutrição Espiritual Diária
                  </span>
                </div>

                <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
                  Devocionais bíblicos que <span className="text-blue-600 font-bold">alimentam sua alma</span> e
                  <span className="text-indigo-600 font-bold"> fortalecem sua fé</span> todos os dias
                </p>
              </motion.div>

              {/* Estatísticas Rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-8 mb-8"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">365</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">Dias por Ano</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-indigo-600">24/7</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">Disponível</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">Bíblico</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-300">
                <Link href="/devocionais" className="gap-3 text-lg px-10 py-4 font-semibold">
                  <Sparkles className="h-6 w-6" />
                  Começar Agora
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-10 py-4 border-3 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-semibold transition-all duration-300">
                <Link href="/sobre" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Conhecer Mais
                </Link>
              </Button>
            </motion.div>
          </motion.section>

          {/* Today's Devotional */}
          {todaysDevotional && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/20 mb-4"
                >
                  <Calendar className="h-4 w-4" />
                  Devocional de Hoje
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">Reflexão Bíblica</h2>
                <p className="text-muted-foreground text-lg">Medite na Palavra de Deus para o seu dia</p>
              </div>

              <div className="max-w-4xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <DevotionalCard devotional={todaysDevotional} featured={true} />
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Recent Devotionals */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-4">Devocionais Recentes</h2>
                <p className="text-muted-foreground text-lg">Explore nossas reflexões mais recentes</p>
              </div>
              <Button asChild variant="outline" className="border-2 hover:bg-primary/5">
                <Link href="/devocionais">Ver Todos</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentDevotionals.map((devotional, index) => (
                <motion.div
                  key={devotional.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1, duration: 0.8 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <DevotionalCard devotional={devotional} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Features */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mb-20"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Por que Alimento Diário?</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Nossa missão é fornecer conteúdo bíblico de qualidade que ajude você a crescer espiritualmente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Baseado na Bíblia</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Todos os devocionais são fundamentados na Palavra de Deus, com referências bíblicas claras e aplicações práticas para o dia a dia.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Atualizações Diárias</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Novo conteúdo todos os dias para manter sua rotina de devocional consistente e fortalecer sua caminhada espiritual.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="text-center border-2 hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Comunidade</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Junte-se a uma comunidade de pessoas que buscam crescer na fé e compartilhar experiências espirituais.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 shadow-2xl shadow-primary/10">
              <CardContent className="pt-12 pb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/25"
                >
                  <Sparkles className="h-10 w-10 text-white" />
                </motion.div>

                <h2 className="text-4xl font-bold mb-6">Comece Sua Jornada Hoje</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Dedique alguns minutos do seu dia para meditar na Palavra de Deus e fortalecer sua fé
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 text-lg px-8 py-3">
                    <Link href="/devocionais" className="gap-2">
                      <Sparkles className="h-5 w-5" />
                      Explorar Devocionais
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-2 hover:bg-primary/5">
                    <Link href="/sobre">Saiba Mais</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
