import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Users, Target, } from "lucide-react"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Heart className="h-4 w-4" />
              Nossa Missão
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Sobre o{" "}
              <span className=" bg-gradient-to-r from-primary to-primary/70 bg-clip-text  ">
                Alimento diário
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Nosso ministério existe para fortalecer a fé e promover o crescimento espiritual através de devocionais
              bíblicos diários que tocam o coração e transformam vidas.
            </p>
          </section>

          {/* Mission Cards */}
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Palavra Diária</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Oferecemos reflexões bíblicas diárias para nutrir sua alma e fortalecer sua caminhada com Deus.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Crescimento Espiritual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Cada devocional é cuidadosamente preparado para promover reflexão profunda e crescimento na fé.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Construímos uma comunidade de fé onde pessoas podem crescer juntas na Palavra de Deus.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* About Content */}
          <section className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Nossa Visão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Acreditamos que a Palavra de Deus tem o poder de transformar vidas, trazer esperança em tempos
                  difíceis e fortalecer a fé de cada pessoa. Nosso objetivo é tornar essa Palavra acessível e relevante
                  para o dia a dia de cada leitor.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Cada devocional é uma oportunidade de encontro com Deus, um momento de pausa na correria do cotidiano
                  para refletir sobre Suas promessas e Seu amor incondicional por nós.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>O que Oferecemos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Devocionais bíblicos diários com reflexões profundas e aplicações práticas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Versículos bíblicos cuidadosamente selecionados para cada reflexão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Conteúdo organizado por temas para facilitar sua jornada espiritual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Interface moderna e responsiva para uma experiência de leitura agradável</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>



          {/* CTA */}
          <section className="text-center bg-primary/5 rounded-lg p-8 space-y-4">
            <h3 className="text-xl font-bold">Comece Sua Jornada Hoje</h3>
            <p className="text-muted-foreground">
              Não perca a oportunidade de fortalecer sua fé com nossos devocionais diários
            </p>
            <Button asChild size="lg">
              <Link href="/">Ver Devocionais</Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  )
}
