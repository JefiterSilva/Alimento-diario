import { config } from 'dotenv'

// Carregar variáveis de ambiente ANTES de qualquer outro import
config()

import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

// Dados iniciais para o seed
const initialTags = [
  { name: 'confiança', color: 'from-green-500 via-emerald-500 to-teal-500' },
  { name: 'paz', color: 'from-emerald-500 via-teal-500 to-cyan-500' },
  { name: 'oração', color: 'from-indigo-500 via-purple-500 to-violet-500' },
  { name: 'poder', color: 'from-yellow-500 via-orange-500 to-red-500' },
  { name: 'amor', color: 'from-rose-500 via-pink-500 to-fuchsia-500' },
  { name: 'graça', color: 'from-violet-500 via-purple-500 to-indigo-500' },
  { name: 'força', color: 'from-orange-500 via-amber-500 to-yellow-500' },
  { name: 'perdão', color: 'from-blue-500 via-cyan-500 to-teal-500' },
  { name: 'cruz', color: 'from-red-500 via-rose-500 to-pink-500' },
  { name: 'fraqueza', color: 'from-slate-500 via-gray-500 to-zinc-500' }
]

const initialDevotionals = [
  {
    slug: 'confianca-em-deus',
    title: 'Confiança em Deus',
    excerpt: 'Descubra como confiar completamente em Deus em todos os momentos da vida.',
    content: `Em tempos de incerteza e dificuldades, é natural que nos sintamos ansiosos e preocupados. Mas a Palavra de Deus nos lembra constantemente que devemos confiar Nele.

"Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará suas veredas." (Provérbios 3:5-6)

Este versículo nos ensina três princípios importantes sobre confiança:

1. **Confiar de todo o coração**: Não é uma confiança parcial ou condicional, mas total e absoluta.

2. **Não se apoiar no próprio entendimento**: Reconhecer que nossa sabedoria é limitada e que Deus vê o quadro completo.

3. **Reconhecer o Senhor em todos os caminhos**: Incluir Deus em todas as nossas decisões e planos.

Quando confiamos em Deus, Ele promete endireitar nossos caminhos. Isso não significa que não enfrentaremos dificuldades, mas que Ele nos guiará através delas.

Que hoje você possa renovar sua confiança em Deus, sabendo que Ele está no controle de todas as coisas e que tem um plano perfeito para sua vida.`,
    bible_verse: 'Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará suas veredas.',
    bible_reference: 'Provérbios 3:5-6',
    author: 'Pastor João Silva',
    date: '2024-08-22',
    featured: true,
    published: true,
    tagNames: ['confiança', 'paz']
  },
  {
    slug: 'o-poder-da-oracao',
    title: 'O Poder da Oração',
    excerpt: 'Aprenda sobre a importância da oração e como ela transforma nossa vida espiritual.',
    content: `A oração é uma das práticas mais importantes da vida cristã. É através dela que nos comunicamos com Deus, apresentamos nossas necessidades e adoramos ao Senhor.

"Orem continuamente." (1 Tessalonicenses 5:17)

Esta simples instrução de Paulo nos mostra que a oração deve ser uma prática constante em nossa vida. Não é algo que fazemos apenas quando estamos em dificuldades, mas um hábito diário.

A oração tem o poder de:

**Transformar nossa perspectiva**: Quando oramos, nossa mente se volta para Deus e Sua vontade.

**Trazer paz**: Filipenses 4:6-7 nos diz que quando apresentamos nossas ansiedades a Deus em oração, Sua paz guarda nossos corações.

**Fortalecer nossa fé**: Ver Deus respondendo nossas orações fortalece nossa confiança Nele.

**Conectar-nos com Deus**: A oração é uma conversa íntima com nosso Pai celestial.

Jesus nos deixou o exemplo perfeito de uma vida de oração. Mesmo sendo o Filho de Deus, Ele passava longas horas em oração, buscando a vontade do Pai.

Que hoje você possa dedicar tempo à oração, sabendo que Deus está sempre pronto para ouvir e responder aos Seus filhos.`,
    bible_verse: 'Orem continuamente.',
    bible_reference: '1 Tessalonicenses 5:17',
    author: 'Maria Santos',
    date: '2024-08-21',
    featured: false,
    published: true,
    tagNames: ['oração', 'poder']
  },
  {
    slug: 'amor-incondicional',
    title: 'Amor Incondicional',
    excerpt: 'Reflita sobre o amor incondicional de Deus e como devemos amar uns aos outros.',
    content: `O amor é a essência do caráter de Deus e deve ser a marca distintiva de todos os que seguem a Cristo.

"Amados, amemos uns aos outros, pois o amor procede de Deus. Aquele que ama é nascido de Deus e conhece a Deus." (1 João 4:7)

Este versículo nos ensina que o amor não é apenas um sentimento, mas uma característica que identifica os filhos de Deus. Quando amamos, demonstramos que conhecemos a Deus, porque Deus é amor.

O amor de Deus é:

**Incondicional**: Ele nos ama não pelo que fazemos, mas pelo que somos - Seus filhos.

**Sacrificial**: Jesus demonstrou o maior amor ao dar Sua vida por nós.

**Transformador**: O amor de Deus nos transforma e nos capacita a amar outros.

**Eterno**: O amor de Deus nunca falha e nunca termina.

Como seguidores de Cristo, somos chamados a amar como Deus ama. Isso significa amar mesmo quando não é fácil, perdoar quando somos ofendidos, e buscar o bem dos outros acima do nosso próprio.

Que hoje você possa experimentar o amor de Deus de forma mais profunda e compartilhar esse amor com aqueles ao seu redor.`,
    bible_verse: 'Amados, amemos uns aos outros, pois o amor procede de Deus. Aquele que ama é nascido de Deus e conhece a Deus.',
    bible_reference: '1 João 4:7',
    author: 'Ana Costa',
    date: '2024-08-20',
    featured: true,
    published: true,
    tagNames: ['amor', 'graça']
  }
]

// Função principal do seed
export async function seedSupabase() {
  console.log('🌱 Iniciando seed do Supabase...')

  try {
    // 1. Criar usuário admin
    console.log('👤 Criando usuário admin...')
    const passwordHash = await bcrypt.hash('admin123', 12)
    
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .upsert({
        id: '1',
        name: 'Administrador',
        email: 'admin@devocionais.com',
        password_hash: passwordHash,
        role: 'ADMIN'
      })
      .select()
      .single()

    if (adminError) {
      console.error('Erro ao criar usuário admin:', adminError)
      throw adminError
    }

    console.log('✅ Usuário admin criado:', adminUser.email)

    // 2. Criar tags
    console.log('🏷️ Criando tags...')
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .upsert(initialTags.map((tag, index) => ({
        id: (index + 1).toString(),
        ...tag
      })))
      .select()

    if (tagsError) {
      console.error('Erro ao criar tags:', tagsError)
      throw tagsError
    }

    console.log(`✅ ${tags.length} tags criadas`)

    // 3. Criar devocionais
    console.log('📖 Criando devocionais...')
    
    for (const devotionalData of initialDevotionals) {
      const { tagNames, ...devotional } = devotionalData

      // Inserir devocional
      const { data: devotionalRecord, error: devotionalError } = await supabase
        .from('devotionals')
        .upsert({
          id: devotional.slug, // Usar slug como ID para facilitar
          ...devotional
        })
        .select()
        .single()

      if (devotionalError) {
        console.error('Erro ao criar devocional:', devotionalError)
        throw devotionalError
      }

      // Criar relacionamentos com tags
      const tagIds = tags
        .filter(tag => tagNames.includes(tag.name))
        .map(tag => tag.id)

      if (tagIds.length > 0) {
        const devotionalTags = tagIds.map(tagId => ({
          devotional_id: devotionalRecord.id,
          tag_id: tagId
        }))

        const { error: relationError } = await supabase
          .from('devotional_tags')
          .upsert(devotionalTags)

        if (relationError) {
          console.error('Erro ao criar relacionamentos:', relationError)
          throw relationError
        }
      }

      console.log(`✅ Devocional criado: ${devotional.title}`)
    }

    console.log('🎉 Seed concluído com sucesso!')
    console.log('📋 Resumo:')
    console.log(`- 👤 1 usuário admin criado`)
    console.log(`- 🏷️ ${tags.length} tags criadas`)
    console.log(`- 📖 ${initialDevotionals.length} devocionais criados`)
    console.log('🔑 Credenciais de acesso:')
    console.log('   Email: admin@devocionais.com')
    console.log('   Senha: admin123')

  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    throw error
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedSupabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Erro fatal:', error)
      process.exit(1)
    })
}
