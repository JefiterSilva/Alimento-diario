import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Quote, ArrowRight, Heart, BookOpen, Sparkles } from "lucide-react"
import type { DevotionalWithTags } from "@/lib/types"
import { formatDate } from "@/lib/utils-devotional"
import { motion } from "framer-motion"

interface DevotionalCardProps {
  devotional: DevotionalWithTags
  featured?: boolean
}

export function DevotionalCard({ devotional, featured }: DevotionalCardProps) {
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

  // Extrair nomes das tags com verificação de segurança
  const tagNames = devotional.tags
    ?.filter(t => t?.name) // Filtrar tags válidas
    .map(t => t.name) || []

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={`group relative overflow-hidden transition-all duration-500 ${devotional.featured
          ? "border-2 border-blue-500/50 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 shadow-2xl shadow-blue-500/20 backdrop-blur-sm"
          : "border border-slate-200/50 hover:border-blue-300/50 bg-white/90 hover:bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl"
          }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/3 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Elements */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          />
        </div>

        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <motion.div
            animate={{ scale: [1, 1.1, 1], y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>

        <CardHeader className="relative space-y-3 sm:space-y-4 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1.5"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <span className="font-medium">{formatDate(devotional.date)}</span>
            </motion.div>
            <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full" />
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1.5"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
              <span className="font-medium">{devotional.author}</span>
            </motion.div>
          </div>

          <Link href={`/devocional/${devotional.slug}`} className="block">
            <motion.h3
              whileHover={{ scale: 1.01 }}
              className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 hover:text-blue-600 transition-colors duration-300 leading-tight"
            >
              {devotional.title}
            </motion.h3>
          </Link>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
            {devotional.excerpt}
          </p>
        </CardHeader>

        <CardContent className="relative space-y-4 sm:space-y-6 pt-0">
          {/* Enhanced Bible Verse Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-slate-50 via-blue-50/50 to-indigo-50/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-200/50 group-hover:border-blue-200/50 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-blue-500/25">
                  <Quote className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <blockquote className="text-xs sm:text-sm lg:text-base italic text-slate-700 leading-relaxed font-medium">
                    &ldquo;{devotional.bible_verse}&rdquo;
                  </blockquote>
                  <p className="text-blue-600 font-semibold text-xs sm:text-sm">{devotional.bible_reference}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tagNames.slice(0, 3).map((tagName) => (
              <motion.div
                key={tagName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium bg-gradient-to-r ${getTagColor(tagName)} text-white border-0 shadow-md hover:shadow-lg transition-shadow duration-200`}
                >
                  {tagName}
                </Badge>
              </motion.div>
            ))}
            {tagNames.length > 3 && (
              <Badge variant="outline" className="text-xs border-slate-300 text-slate-600 bg-white/50 backdrop-blur-sm">
                +{tagNames.length - 3}
              </Badge>
            )}
          </div>

          {/* Enhanced Action Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-1 sm:pt-2"
          >
            <Link
              href={`/devocional/${devotional.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 group/btn"
            >
              <span>Ler devocional completo</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Featured Badge */}
          {devotional.featured && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute top-3 sm:top-4 right-3 sm:right-4"
            >
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-500/25 backdrop-blur-sm">
                <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 inline mr-1" />
                Destaque
              </div>
            </motion.div>
          )}

          {/* Sparkle Effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1 sm:top-2 right-1 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
