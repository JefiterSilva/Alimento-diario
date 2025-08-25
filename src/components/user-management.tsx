"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { UserWithoutPassword } from '@/lib/types'

export function UserManagement() {
    const {
        users,
        fetchAllUsers,
        createNewUser,
        updateExistingUser,
        deleteExistingUser,
        user: currentUser
    } = useAuth()

    const [loading, setLoading] = useState(false)
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER' as 'USER' | 'ADMIN'
    })
    const [editingUser, setEditingUser] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER' as 'USER' | 'ADMIN'
    })
    const [deletingUser, setDeletingUser] = useState<string | null>(null)
    const [userDevotionalsCount, setUserDevotionalsCount] = useState<number>(0)
    const [confirmDelete, setConfirmDelete] = useState(false)

    // Carregar usuários quando o componente montar
    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setLoading(true)
        try {
            await fetchAllUsers()
        } catch (error) {
            console.error('Erro ao carregar usuários:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await createNewUser(newUser)
            if (result.success) {
                setNewUser({ name: '', email: '', password: '', role: 'USER' })
                alert('Usuário criado com sucesso!')
            } else {
                alert(`Erro ao criar usuário: ${result.error}`)
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error)
            alert('Erro ao criar usuário')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return

        setLoading(true)

        try {
            const updateData: Record<string, unknown> = {}
            if (editForm.name) updateData.name = editForm.name
            if (editForm.email) updateData.email = editForm.email
            if (editForm.password) updateData.password = editForm.password
            if (editForm.role) updateData.role = editForm.role

            const result = await updateExistingUser(editingUser, updateData)
            if (result.success) {
                setEditingUser(null)
                setEditForm({ name: '', email: '', password: '', role: 'USER' })
                alert('Usuário atualizado com sucesso!')
            } else {
                alert(`Erro ao atualizar usuário: ${result.error}`)
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error)
            alert('Erro ao atualizar usuário')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (userId: string, userName: string) => {
        // Verificar quantos devocionais o usuário tem
        try {
            const { data: devotionals, error } = await supabase
                .from("devotionals")
                .select("id")
                .eq("author_id", userId);

            if (error) {
                console.error('Erro ao verificar devocionais:', error);
                setUserDevotionalsCount(0);
            } else {
                setUserDevotionalsCount(devotionals?.length || 0);
            }
        } catch (error) {
            console.error('Erro ao verificar devocionais:', error);
            setUserDevotionalsCount(0);
        }

        setDeletingUser(userId);
    }

    const confirmDeleteUser = async () => {
        if (!deletingUser) return

        const userName = users.find(u => u.id === deletingUser)?.name || 'Usuário'

        setLoading(true)

        try {
            console.log('🔄 Iniciando processo de exclusão para usuário:', userName, 'ID:', deletingUser)

            const result = await deleteExistingUser(deletingUser)

            if (result.success) {
                console.log('✅ Usuário deletado com sucesso:', userName)
                const message = result.devotionalsCount && result.devotionalsCount > 0
                    ? `Usuário "${userName}" deletado com sucesso! ${result.devotionalsCount} devocionais também foram deletados.`
                    : `Usuário "${userName}" deletado com sucesso!`
                alert(message)
                setDeletingUser(null)
                setUserDevotionalsCount(0)
            } else {
                console.error('❌ Erro retornado pela função de deletar:', result.error)
                alert(`Erro ao deletar usuário: ${result.error || 'Erro desconhecido'}`)
            }
        } catch (error) {
            console.error('❌ Erro capturado no try/catch:', error)

            let errorMessage = 'Erro desconhecido ao deletar usuário'

            if (error instanceof Error) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            } else if (error && typeof error === 'object') {
                errorMessage = JSON.stringify(error)
            }

            alert(`Erro ao deletar usuário: ${errorMessage}`)
        } finally {
            setLoading(false)
        }
    }

    const cancelDelete = () => {
        setDeletingUser(null)
        setUserDevotionalsCount(0)
        setConfirmDelete(false)
    }

    const startEditing = (user: UserWithoutPassword) => {
        setEditingUser(user.id)
        setEditForm({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        })
    }

    const cancelEditing = () => {
        setEditingUser(null)
        setEditForm({ name: '', email: '', password: '', role: 'USER' })
    }

    // Verificar se o usuário atual é admin
    if (currentUser?.role !== 'ADMIN') {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-gray-600">
                        Acesso negado. Apenas administradores podem gerenciar usuários.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Formulário para criar novo usuário */}
            <Card>
                <CardHeader>
                    <CardTitle>Criar Novo Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    id="name"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Função</Label>
                                <select
                                    id="role"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'USER' | 'ADMIN' })}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="USER">Usuário</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? 'Criando...' : 'Criar Usuário'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Lista de usuários */}
            <Card>
                <CardHeader>
                    <CardTitle>Usuários ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Carregando usuários...</p>
                    ) : (
                        <div className="space-y-3 sm:space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="border rounded-lg p-3 sm:p-4">
                                    {editingUser === user.id ? (
                                        // Formulário de edição
                                        <form onSubmit={handleUpdateUser} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Nome</Label>
                                                    <Input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Email</Label>
                                                    <Input
                                                        type="email"
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Nova Senha (deixe em branco para manter)</Label>
                                                    <Input
                                                        type="password"
                                                        value={editForm.password}
                                                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Função</Label>
                                                    <select
                                                        value={editForm.role}
                                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'USER' | 'ADMIN' })}
                                                        className="w-full p-2 border rounded-md"
                                                    >
                                                        <option value="USER">Usuário</option>
                                                        <option value="ADMIN">Administrador</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                                    {loading ? 'Salvando...' : 'Salvar'}
                                                </Button>
                                                <Button type="button" variant="outline" onClick={cancelEditing} className="w-full sm:w-auto">
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        // Exibição normal
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-sm sm:text-base">{user.name}</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                                                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                                                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                                                        {user.role}
                                                    </Badge>
                                                    {user.id === currentUser?.id && (
                                                        <Badge variant="outline" className="text-xs">Você</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => startEditing(user)}
                                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                                >
                                                    Editar
                                                </Button>
                                                {user.id !== currentUser?.id && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                                                    >
                                                        Deletar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de confirmação de exclusão */}
            <Dialog open={!!deletingUser} onOpenChange={(open) => {
                if (!open) {
                    setDeletingUser(null)
                    setConfirmDelete(false)
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão de Usuário</DialogTitle>
                    </DialogHeader>

                    {deletingUser && (
                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Atenção: Esta ação não pode ser desfeita!
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>
                                                Você está prestes a deletar o usuário{" "}
                                                <strong>{users.find(u => u.id === deletingUser)?.name}</strong>.
                                            </p>
                                            {userDevotionalsCount > 0 && (
                                                <p className="mt-2">
                                                    <strong>{userDevotionalsCount} devocionais</strong> também serão deletados automaticamente.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-yellow-800">
                                            O que acontecerá:
                                        </h3>
                                        <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                                            <li>• O usuário será removido permanentemente</li>
                                            <li>• Todos os dados do usuário serão perdidos</li>
                                            {userDevotionalsCount > 0 && (
                                                <li>• {userDevotionalsCount} devocionais serão deletados</li>
                                            )}
                                            <li>• Esta ação não pode ser desfeita</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="confirm-delete"
                                    checked={confirmDelete}
                                    onChange={(e) => setConfirmDelete(e.target.checked)}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                    required
                                />
                                <label htmlFor="confirm-delete" className="text-sm text-gray-700">
                                    Eu entendo que esta ação é irreversível e confirmei que desejo prosseguir
                                </label>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDelete}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteUser}
                            disabled={loading || !confirmDelete}
                        >
                            {loading ? 'Deletando...' : 'Confirmar Exclusão'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
