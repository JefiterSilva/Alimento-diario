"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { fetchDevotionalBySlug, fetchDevotionals } from "@/lib/api-client"
import { formatDate } from "@/lib/utils-devotional"
import { Calendar, User, Quote, ArrowLeft, Share2, BookOpen, Heart, Sparkles, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import { use, useEffect, useState } from "react"
import type { DevotionalWithTags } from "@/lib/types"

interface DevotionalPageProps {
    params: Promise<{
        slug: string
    }>
}

export default function DevotionalPage({ params }: DevotionalPageProps) {
    const { slug } = use(params)
    const [devotional, setDevotional] = useState<DevotionalWithTags | null>(null)
    const [allDevotionals, setAllDevotionals] = useState<DevotionalWithTags[]>([])
    const [loading, setLoading] = useState(true)
    const [previousDevotional, setPreviousDevotional] = useState<DevotionalWithTags | null>(null)
    const [nextDevotional, setNextDevotional] = useState<DevotionalWithTags | null>(null)

    useEffect(() => {
        async function loadDevotional() {
            try {
                const [devotionalData, allDevotionalsData] = await Promise.all([
                    fetchDevotionalBySlug(slug),
                    fetchDevotionals()
                ])

                setDevotional(devotionalData)
                setAllDevotionals(allDevotionalsData.devotionals)

                // Encontrar devocionais anterior e próximo
                const currentIndex = allDevotionalsData.devotionals.findIndex((d) => d.slug === slug)
                setPreviousDevotional(currentIndex > 0 ? allDevotionalsData.devotionals[currentIndex - 1] : null)
                setNextDevotional(currentIndex < allDevotionalsData.devotionals.length - 1 ? allDevotionalsData.devotionals[currentIndex + 1] : null)
            } catch (error) {
                console.error('Erro ao carregar devocional:', error)
                notFound()
            } finally {
                setLoading(false)
            }
        }

        loadDevotional()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Header />
                <main className="py-6 sm:py-8 px-3 sm:px-4">
                    <div className="container max-w-4xl mx-auto">
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                </div>
                                <p className="text-slate-600 text-lg">Carregando devocional...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    if (!devotional) {
        notFound()
    }

    // Extrair nomes das tags com verificação de segurança
    const tagNames = devotional.tags
        ?.filter(t => t?.name) // Filtrar tags válidas
        .map(t => t.name) || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Header />

            <main className="py-6 sm:py-8 px-3 sm:px-4">
                <div className="container max-w-4xl mx-auto">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 sm:mb-8"
                    >
                        <Button asChild variant="ghost" size="lg" className="gap-2 hover:bg-blue-50">
                            <Link href="/devocionais">
                                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-sm sm:text-base">Voltar aos Devocionais</span>
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Devotional Content */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 sm:space-y-12"
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                                <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1.5 sm:gap-2">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                    <span className="font-medium">{formatDate(devotional.date)}</span>
                                </motion.div>
                                <div className="hidden sm:block w-1 h-1 bg-slate-400 rounded-full" />
                                <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1.5 sm:gap-2">
                                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                    <span className="font-medium">{devotional.author}</span>
                                </motion.div>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent px-2 sm:px-0"
                            >
                                {devotional.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed px-2 sm:px-0"
                            >
                                {devotional.excerpt}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                                className="flex flex-wrap gap-2 sm:gap-3 px-2 sm:px-0"
                            >
                                {tagNames.map((tag, index) => (
                                    <motion.div
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors duration-200"
                                        >
                                            {tag}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Bible Verse */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            whileHover={{ scale: 1.02 }}
                            className="px-2 sm:px-0"
                        >
                            <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-2xl shadow-blue-500/10">
                                <CardContent className="p-4 sm:p-6 lg:p-8">
                                    <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mt-1 sm:mt-2 shadow-lg shadow-blue-500/25">
                                            <Quote className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                                        </div>
                                        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                            <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl italic text-slate-800 leading-relaxed font-medium">
                                                &ldquo;{devotional.bible_verse}&rdquo;
                                            </blockquote>
                                            <p className="text-blue-600 font-bold text-sm sm:text-base lg:text-lg">{devotional.bible_reference}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none px-2 sm:px-0"
                        >
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-800 text-sm sm:text-base lg:text-lg space-y-4 sm:space-y-6">
                                {devotional.content.split('\n\n').map((paragraph, index) => (
                                    <motion.p
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                                        className="text-slate-700 leading-relaxed"
                                    >
                                        {paragraph}
                                    </motion.p>
                                ))}
                            </div>
                        </motion.div>

                        {/* Share Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6, duration: 0.8 }}
                            whileHover={{ scale: 1.02 }}
                            className="px-2 sm:px-0"
                        >
                            <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
                                <CardHeader>
                                    <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                            <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                        </div>
                                        <span className="text-sm sm:text-base">Compartilhar este devocional</span>
                                    </h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => navigator.share?.({
                                                    title: devotional.title,
                                                    text: devotional.excerpt,
                                                    url: window.location.href
                                                })}
                                                className="gap-2 border-2 hover:bg-blue-50 w-full text-sm sm:text-base"
                                            >
                                                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="text-sm sm:text-base">Compartilhar</span>
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => navigator.clipboard.writeText(window.location.href)}
                                                className="gap-2 border-2 hover:bg-blue-50 w-full text-sm sm:text-base"
                                            >
                                                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="text-sm sm:text-base">Copiar Link</span>
                                            </Button>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.8 }}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 pt-6 sm:pt-8 border-t border-slate-200 px-2 sm:px-0"
                        >
                            {previousDevotional ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                                    <Button asChild variant="outline" size="lg" className="gap-2 border-2 hover:bg-blue-50 w-full sm:w-auto text-sm sm:text-base">
                                        <Link href={`/devocional/${previousDevotional.slug}`}>
                                            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="truncate max-w-[200px] sm:max-w-none">{previousDevotional.title}</span>
                                        </Link>
                                    </Button>
                                </motion.div>
                            ) : (
                                <div />
                            )}

                            {nextDevotional ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                                    <Button asChild variant="outline" size="lg" className="gap-2 border-2 hover:bg-blue-50 w-full sm:w-auto text-sm sm:text-base">
                                        <Link href={`/devocional/${nextDevotional.slug}`}>
                                            <span className="truncate max-w-[200px] sm:max-w-none">{nextDevotional.title}</span>
                                            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            ) : (
                                <div />
                            )}
                        </motion.div>
                    </motion.article>
                </div>
            </main>
        </div>
    )
}
