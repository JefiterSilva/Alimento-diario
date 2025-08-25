import { UserManagement } from '@/components/user-management'

export default function UsuariosPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-4 sm:py-8 px-4">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">Gerenciamento de Usuários</h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        Gerencie usuários do sistema. Apenas administradores têm acesso a esta página.
                    </p>
                </div>

                <UserManagement />
            </div>
        </div>
    )
}
