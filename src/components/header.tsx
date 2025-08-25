"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Menu, X, User, LogOut, Settings, Sparkles, Home, BookText, Info, Search, Users, Shield } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { SearchModal } from "@/components/search-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, logout, loading } = useAuth()

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
      >
        <div className="container flex h-16 sm:h-20 items-center justify-between px-3 sm:px-4">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 sm:gap-4"
          >
            <Link href="/" className="flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white relative z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent text-sm sm:text-base lg:text-lg">
                  Alimento Diário
                </span>
                <span className="text-xs text-slate-500 font-normal hidden sm:block">Devocionais Diários</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 sm:gap-8">
            <motion.div className="flex items-center gap-6 sm:gap-8">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 relative group">
                  <Home className="h-4 w-4" />
                  <span>Início</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link href="/devocionais" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 relative group">
                  <BookText className="h-4 w-4" />
                  <span>Devocionais</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link href="/sobre" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200 relative group">
                  <Info className="h-4 w-4" />
                  <span>Sobre</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>



              {/* User Menu */}
              {!loading && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="ghost" size="sm" className="gap-2 sm:gap-3 bg-gradient-to-r from-slate-100 to-blue-50 hover:from-slate-200 hover:to-blue-100 border border-slate-200 text-slate-700 px-3 sm:px-4 py-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <span className="font-medium text-xs sm:text-sm hidden sm:block">{user.name}</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 sm:w-64 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl">
                    <div className="p-3 sm:p-4 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        {user.role === 'ADMIN' ? (
                          <>
                            <Shield className="h-3 w-3 text-blue-500" />
                            Administrador
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 text-gray-500" />
                            Usuário
                          </>
                        )}
                      </p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 p-3 sm:p-4">
                        <Settings className="h-4 w-4" />
                        <div>
                          <p className="font-medium text-sm">Painel Admin</p>
                          <p className="text-xs text-slate-500">Gerenciar conteúdo</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'ADMIN' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/usuarios" className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 p-3 sm:p-4">
                          <Users className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-sm">Gerenciar Usuários</p>
                            <p className="text-xs text-slate-500">Administrar contas</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/admin/perfil" className="flex items-center gap-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 p-3 sm:p-4">
                        <User className="h-4 w-4" />
                        <div>
                          <p className="font-medium text-sm">Meu Perfil</p>
                          <p className="text-xs text-slate-500">Editar informações</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100" />
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-700 hover:bg-red-50 p-3 sm:p-4">
                      <LogOut className="mr-3 h-4 w-4" />
                      <div>
                        <p className="font-medium text-sm">Sair</p>
                        <p className="text-xs text-slate-500">Encerrar sessão</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : !loading ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/25 px-3 sm:px-4 py-2">
                    <Link href="/login" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Login</span>
                    </Link>
                  </Button>
                </motion.div>
              ) : null}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 sm:w-12 sm:h-12 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-xl"
            >
              <nav className="container flex flex-col gap-1 sm:gap-2 p-4 sm:p-6">
                {/* Mobile Navigation Items */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/"
                    className="flex items-center gap-3 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    Início
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/devocionais"
                    className="flex items-center gap-3 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookText className="h-5 w-5" />
                    Devocionais
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/sobre"
                    className="flex items-center gap-3 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Info className="h-5 w-5" />
                    Sobre
                  </Link>
                </motion.div>

                {/* Mobile Actions */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 sm:pt-6 border-t border-slate-200/50 space-y-3"
                >
                  {/* Search */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm"
                      onClick={() => {
                        setIsSearchOpen(true)
                        setIsMenuOpen(false)
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                  </div>

                  {/* User Section */}
                  {!loading && user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            {user.role === 'ADMIN' ? (
                              <>
                                <Shield className="h-3 w-3 text-blue-500" />
                                Administrador
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3 text-gray-500" />
                                Usuário
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5" />
                        Painel Admin
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin/usuarios"
                          className="flex items-center gap-3 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Users className="h-5 w-5" />
                          Gerenciar Usuários
                        </Link>
                      )}
                      <Link
                        href="/admin/perfil"
                        className="flex items-center gap-3 text-base font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        Meu Perfil
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center gap-3 text-base font-medium text-red-600 hover:text-red-700 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        Sair
                      </button>
                    </div>
                  ) : !loading ? (
                    <Button asChild size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/25">
                      <Link href="/login" className="gap-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        <Sparkles className="h-4 w-4" />
                        Fazer Login
                      </Link>
                    </Button>
                  ) : null}
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
