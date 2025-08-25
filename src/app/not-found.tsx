import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
            <Card className="w-full max-w-md text-center border-2 shadow-2xl">
                <CardHeader className="space-y-4">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <BookOpen className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-red-600">404</CardTitle>
                    <h1 className="text-2xl font-bold">Página não encontrada</h1>
                    <p className="text-muted-foreground">
                        A página que você está procurando não existe ou foi movida.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild variant="outline" className="gap-2">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>
                        <Button asChild className="gap-2">
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                Página Inicial
                            </Link>
                        </Button>
                    </div>
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Tente navegar para uma das páginas principais:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/devocionais">Devocionais</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/sobre">Sobre</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">Login</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
