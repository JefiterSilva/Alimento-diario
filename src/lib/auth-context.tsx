"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { loginUser, fetchUserById } from "./api-client"
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById as getSupabaseUserById,
  checkAndCreateOAuthUser
} from "./supabase-auth"
import { supabase } from "./supabase"
import type { User, UserWithoutPassword } from "./types"

interface AuthContextType {
  user: User | null
  users: UserWithoutPassword[]
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  logout: () => void
  loading: boolean
  // Funções de gerenciamento de usuários
  fetchAllUsers: () => Promise<void>
  createNewUser: (userData: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }) => Promise<{ success: boolean; error?: string }>
  updateExistingUser: (id: string, userData: { name?: string; email?: string; password?: string; role?: 'USER' | 'ADMIN' }) => Promise<{ success: boolean; error?: string }>
  deleteExistingUser: (id: string) => Promise<{ success: boolean; error?: string; devotionalsCount?: number }>
  getUserById: (id: string) => Promise<UserWithoutPassword | null>
  refreshUsers: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<UserWithoutPassword[]>([])
  const [loading, setLoading] = useState(true)

  // Verificar autenticação do Supabase e localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar sessão atual do Supabase
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // Se há sessão do Supabase, buscar dados do usuário
          const userData = await fetchUserById(session.user.id)
          if (userData) {
            setUser(userData as User)
            localStorage.setItem('userId', userData.id)
          }
        } else {
          // Fallback para localStorage (usuários antigos)
          const userId = localStorage.getItem('userId')
          if (userId) {
            const userData = await fetchUserById(userId)
            if (
              userData &&
              "password_hash" in userData &&
              "role" in userData &&
              "created_at" in userData &&
              "updated_at" in userData
            ) {
              setUser(userData as User)
            } else {
              localStorage.removeItem('userId')
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('userId')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Verificar se é um usuário OAuth (sem password_hash)
            const userData = await fetchUserById(session.user.id)

            if (userData) {
              setUser(userData as User)
              localStorage.setItem('userId', userData.id)
            } else {
              // Se não encontrou na tabela users, pode ser um usuário OAuth
              // Verificar e criar se necessário
              const oauthResult = await checkAndCreateOAuthUser(
                session.user.id,
                session.user.user_metadata
              )

              if (oauthResult.success && oauthResult.user) {
                setUser(oauthResult.user as User)
                localStorage.setItem('userId', oauthResult.user.id)
              }
            }
          } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          localStorage.removeItem('userId')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await loginUser(email, password)
      if (userData) {
        setUser(userData)
        localStorage.setItem('userId', userData.id)
        return true
      }
      return false
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      })

      if (error) {
        console.error('Erro no login com Google:', error)
        return false
      }

      // O OAuth redireciona automaticamente
      return true
    } catch (error) {
      console.error('Erro no login com Google:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('userId')
    }
  }

  // Função para buscar todos os usuários do banco
  const fetchAllUsers = async (): Promise<void> => {
    try {
      console.log('🔄 Buscando usuários do banco de dados...')
      const allUsers = await getAllUsers()
      setUsers(allUsers)
      console.log(`✅ ${allUsers.length} usuários carregados`)
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      throw error
    }
  }

  // Função para criar novo usuário
  const createNewUser = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN'
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('➕ Criando novo usuário:', userData.email)
      const newUser = await createUser(userData)

      // Atualizar a lista de usuários
      setUsers(prevUsers => [newUser, ...prevUsers])

      console.log('✅ Usuário criado com sucesso:', newUser.email)
      return { success: true }
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  // Função para atualizar usuário existente
  const updateExistingUser = async (id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    role?: 'USER' | 'ADMIN'
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('✏️ Atualizando usuário:', id)
      const updatedUser = await updateUser(id, userData)

      // Atualizar a lista de usuários
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? updatedUser : user
        )
      )

      // Se for o usuário atual, atualizar também
      if (user?.id === id) {
        setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null)
      }

      console.log('✅ Usuário atualizado com sucesso:', updatedUser.email)
      return { success: true }
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  // Função para deletar usuário
  const deleteExistingUser = async (id: string): Promise<{ success: boolean; error?: string; devotionalsCount?: number }> => {
    try {
      console.log('🗑️ Deletando usuário:', id)
      const result = await deleteUser(id)

      if (result.success) {
        // Remover da lista de usuários
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id))

        // Se for o usuário atual, fazer logout
        if (user?.id === id) {
          logout()
        }

        console.log('✅ Usuário deletado com sucesso')
      }

      return result
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }



  // Função para buscar usuário por ID
  const getUserById = async (id: string): Promise<UserWithoutPassword | null> => {
    try {
      console.log('🔍 Buscando usuário por ID:', id)
      const userData = await getSupabaseUserById(id)
      return userData
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por ID:', error)
      return null
    }
  }

  // Função para atualizar a lista de usuários
  const refreshUsers = async (): Promise<void> => {
    await fetchAllUsers()
  }

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      loginWithGoogle,
      logout,
      loading,
      fetchAllUsers,
      createNewUser,
      updateExistingUser,
      deleteExistingUser,
      getUserById,
      refreshUsers
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
