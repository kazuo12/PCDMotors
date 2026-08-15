# PCD Motors

Marketplace exclusivo para **compra e venda de veículos já adaptados para Pessoas com Deficiência (PcD)**.

> Projeto desenvolvido para o **Projeto Integrador II** (Profa. Silvia Garcia), a partir da análise da empresa Webmotors e do mercado de e-commerce automotivo.

**Equipe:** Kayke Müller Diniz · Gabriel Kazuo Seckler · Cibele Santiago Soares
**Região de referência:** Itapetininga - SP

---

## O problema

Sites de compra e venda de veículos tradicionais (como o Webmotors) não possuem filtros especializados para adaptações veiculares. Isso obriga compradores PcD a vasculhar anúncio por anúncio à procura de informações como comando manual, elevador de cadeira de rodas ou adaptação de embreagem — quando essa informação sequer é mencionada no anúncio.

**Resultado:** falta de centralização, alto tempo de busca e um mercado secundário (o de veículos adaptados usados) sem visibilidade nem organização.

## A solução

Um **marketplace web dedicado exclusivamente a veículos já adaptados para PcD**, com:

- Filtros de busca por **tipo de adaptação** (não apenas marca/modelo/preço, como nos sites genéricos);
- **Verificação do laudo técnico** de adaptação em cada anúncio;
- Conexão direta entre compradores, vendedores e **oficinas especializadas** parceiras.

**Justificativa:** reduzir o tempo de busca por um carro adaptado, promover autonomia ao usuário PcD e organizar um mercado secundário que hoje carece de visibilidade.

### Stakeholders

| Stakeholder | Interesse no projeto |
|---|---|
| Pessoas com Deficiência (PcD) e familiares | Encontrar veículos adaptados compatíveis com sua necessidade, com confiança |
| Vendedores particulares | Anunciar para um público qualificado, sem "ruído" de compradores incompatíveis |
| Concessionárias | Canal de venda segmentado para veículos adaptados do estoque |
| Oficinas especializadas em adaptação | Visibilidade como parceiras verificadas; fonte de serviços pós-venda |
| Despachantes | Facilitação de transferência/documentação de veículos adaptados |

---

## Escopo do produto

### Dentro do escopo
- Catálogo de veículos adaptados com página de detalhe (fotos, ficha técnica, ficha da adaptação)
- Busca e filtros especializados: tipo de adaptação, categoria de CNH, localização, faixa de preço, tipo de vendedor
- Cadastro de anúncio por vendedor particular ou concessionária, incluindo dados da adaptação e laudo técnico
- Cadastro/login de usuário (comprador e vendedor)
- Contato direto comprador ↔ vendedor (mensagem interna / WhatsApp)
- Diretório de oficinas parceiras especializadas em adaptação veicular
- Selo de "adaptação verificada" nos anúncios conferidos

### Fora do escopo (por ora)
- Pagamento/transação financeira dentro da plataforma
- Aplicativo mobile nativo (o MVP é 100% web)
- Avaliação automatizada de veículo (laudo de vistoria mecânica geral)
- Integração automatizada com despachantes/Detran
- Chat com histórico avançado, notificações push, etc.

---

## MVP (Minimum Viable Product)

O MVP valida a hipótese central: **compradores PcD preferem um marketplace com filtros especializados por adaptação a garimpar anúncios genéricos.**

| # | Funcionalidade | Descrição |
|---|---|---|
| 1 | Home com busca especializada | Campo de busca com filtro de destaque por tipo de adaptação, localização e marca/modelo |
| 2 | Listagem de veículos com filtros | Filtros por tipo de adaptação, categoria de CNH, faixa de preço, tipo de vendedor |
| 3 | Página de detalhe do veículo | Ficha técnica do veículo + bloco dedicado aos detalhes da adaptação (tipo, oficina responsável, laudo) |
| 4 | Cadastro de anúncio | Formulário para vendedor cadastrar veículo, incluindo os campos de adaptação |
| 5 | Cadastro/login simples | Conta de comprador e de vendedor |
| 6 | Contato direto | Botão de WhatsApp / mensagem para negociar direto com o vendedor |
| 7 | Selo de verificação | Indicação visual de que o laudo de adaptação foi conferido |

**Métrica de sucesso do MVP:** tempo médio até o usuário encontrar um veículo compatível com sua adaptação, e taxa de contato iniciado com vendedores a partir da busca filtrada.

---

## Preview estático da página (mockups)

Telas estáticas de alta fidelidade construídas a partir do escopo acima, representando o fluxo principal do MVP: **buscar → filtrar → ver detalhes do veículo e da adaptação → contatar o vendedor.**

1. **Home** — busca especializada (hero, filtros de destaque, categorias de adaptação, veículos em destaque)
2. **Busca** — listagem com filtros por tipo de adaptação, categoria de CNH, faixa de preço e vendedor
3. **Detalhe do veículo** — ficha técnica, ficha completa da adaptação, laudo e contato com o vendedor

As telas estão em `docs/mockups/` (`home.html`, `busca.html`, `detalhe.html` + `_shared.css`) — abra qualquer um dos arquivos direto no navegador para visualizar. As imagens estáticas (PNG) dessas telas foram geradas com Playwright e compartilhadas junto com a entrega deste projeto.

> Para regerar as imagens estáticas a partir do HTML: abra os arquivos em um navegador e use "Salvar como imagem"/print, ou rode um script de screenshot (ex.: Playwright) apontando para cada página em `docs/mockups/`.

---

## Próximos passos

1. Validar os wireframes com usuários PcD (teste de usabilidade)
2. Detalhar modelo de dados (veículo, adaptação, anúncio, usuário, oficina)
3. Definir stack técnica de implementação do MVP
4. Priorizar backlog de funcionalidades pós-MVP (avaliações, pagamentos, app mobile)
