<img src="marca/marca.svg" width="72" alt="">

# PCD Motors

Marketplace exclusivo para **compra e venda de veículos já adaptados para Pessoas com Deficiência (PcD)**.

> Projeto desenvolvido para o **Projeto Integrador I** (Profa. Silvia Garcia), a partir da análise da empresa Webmotors e do mercado de e-commerce automotivo.

**Equipe:** Kayke Müller Diniz · Gabriel Kazuo Seckler · Cibele Santiago Soares
**Região de referência:** Itapetininga - SP

**Site:** https://kazuo12.github.io/PCDMotors/

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

## MVP

O MVP valida a hipótese central: **compradores PcD preferem um marketplace com filtros especializados por adaptação a garimpar anúncios genéricos.**

| # | Funcionalidade | Estado |
|---|---|---|
| 1 | Home com busca especializada | pronto |
| 2 | Listagem com filtros por adaptação, carroceria, preço, laudo e isenção | pronto |
| 3 | Ordenação (relevância, preço, km, ano) | pronto |
| 4 | Página de detalhe com glossário da adaptação e status do laudo | pronto |
| 5 | Selo de verificação do laudo | pronto |
| 6 | Comparação de até 3 veículos, adaptação por adaptação | pronto |
| 7 | Simulador de isenção (IPI, ICMS, IPVA) com os tetos legais | pronto |
| 8 | Cadastro/login, com a adaptação já aplicada ao catálogo | interface pronta, sem back-end |
| 9 | Alerta quando entrar um carro compatível | interface pronta, sem back-end |
| 10 | Contato direto com o vendedor | botão presente, sem integração |
| 11 | Cadastro de anúncio (lado do vendedor) | não iniciado |
| 12 | Diretório de oficinas parceiras | não iniciado |

**Métrica de sucesso do MVP:** tempo médio até o usuário encontrar um veículo compatível com sua adaptação, e taxa de contato iniciado com vendedores a partir da busca filtrada.

---

## Rodar

```bash
cd web
npm install
npm run dev              # desenvolvimento
npm run build            # gera web/dist/ — é o conteúdo de docs/
```

Versão de arquivo único, que abre do disco com dois cliques (sem servidor):

```bash
npx vite build --config vite.config.unico.js    # web/dist-unico/index.html
```

## Publicar

O GitHub Pages está configurado para servir a pasta **`/docs`** da branch
**`web-page-MVP-review`**. Depois de mexer no código:

```bash
cd web && npm run build
rm -rf ../docs/a ../docs/app-*.js && cp -r dist/. ../docs/
```

e faça o commit da pasta `docs/`.

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Os anúncios (preço, km, adaptações) | `web/src/data/veiculos.js` |
| **As fotos dos anúncios** | `web/src/assets/fotos/` |
| Texto das adaptações | `web/src/data/adaptacoes.js` |
| Regras e alíquotas da isenção | `web/src/components/Simulador.jsx` |
| Cores e tipografia | `web/src/styles/tokens.css` |
| Layout | `web/src/styles/app.css` |
| Quadros da abertura | `web/src/assets/quadros/` |

---

## Mockups estáticos (primeira entrega)

As telas estáticas de alta fidelidade que precederam o site continuam em
`docs/mockups/` e seguem acessíveis:

1. [Home](https://kazuo12.github.io/PCDMotors/mockups/home.html) — busca especializada
2. [Busca](https://kazuo12.github.io/PCDMotors/mockups/busca.html) — filtros por adaptação
3. [Detalhe](https://kazuo12.github.io/PCDMotors/mockups/detalhe.html) — ficha do veículo e da adaptação

## Sobre as imagens

As **12 fotos dos anúncios são recortes do vídeo gravado pelo grupo** — um sedã
branco na terra e um SUV branco no asfalto, em instantes, enquadramentos e
tratamentos de cor diferentes. Elas **não correspondem** aos modelos anunciados,
e o site diz isso na ficha ("foto ilustrativa"). Para publicar de verdade, troque
os arquivos de `web/src/assets/fotos/` mantendo a ordem dos nomes; nenhum outro
arquivo precisa mudar.

As logos das marcas vêm do
[car-logos-dataset](https://github.com/filippofilip95/car-logos-dataset)
(licença MIT). O catálogo é fictício: não há venda, cadastro ou coleta de dados.

## Como foi feito

Vite + React 19, sem biblioteca de animação. A física de mola é escrita à mão em
`web/src/lib/mola.js` (Euler semi-implícito, passo fixo de 1/120 s, um único
`requestAnimationFrame` para a página inteira). A reordenação da lista usa FLIP
(`web/src/hooks/useFlip.js`). A abertura é uma sequência de 72 quadros desenhada
num `<canvas>` conforme a rolagem — não é um `<video>`, porque *seek* em MP4
salta para o keyframe anterior e a imagem engasga a cada arrasto.

Os arquivos são servidos separadamente e não embutidos em base64: a página pinta
depois de ~413 KB em vez de esperar um HTML de 4,3 MB, e o navegador cacheia
fontes e imagens entre visitas.

## Próximos passos

1. Validar os wireframes com usuários PcD (teste de usabilidade)
2. Detalhar modelo de dados (veículo, adaptação, anúncio, usuário, oficina)
3. Back-end para conta, alerta de adaptação e cadastro de anúncio
4. Priorizar backlog pós-MVP (avaliações, pagamentos, app mobile)
