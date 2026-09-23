<img src="marca/marca.svg" width="72" alt="">

# PCD Motors

Marketplace de veículos **já adaptados** para pessoas com deficiência.

Projeto Integrador I — Itapetininga/SP
Kayke Müller Diniz · Gabriel Kazuo Seckler · Cibele Santiago Soares

---

## O problema

Nos classificados grandes a adaptação não é um campo de busca: é uma frase
perdida no meio da descrição do anúncio. Quem depende de acelerador esquerdo
abre dezenas de anúncios para descobrir que dois servem — e ainda precisa
descobrir por fora se o laudo está válido e se o carro cabe no teto da isenção.

## A solução

O PCD Motors inverte a ordem. A **adaptação é o primeiro filtro**, o laudo e as
isenções aparecem na ficha do anúncio, a comparação mostra lado a lado o que
cada carro tem instalado, e a conta existe para avisar a pessoa quando entrar um
carro que serve — porque, para esse público, o estoque compatível é pequeno.

## MVP

| # | Funcionalidade | Estado |
|---|---|---|
| 1 | Catálogo de anúncios com foto, preço, km e adaptações | pronto |
| 2 | Filtro por adaptação, carroceria, preço, laudo e isenção | pronto |
| 3 | Ordenação (relevância, preço, km, ano) | pronto |
| 4 | Ficha do anúncio com glossário da adaptação e status do laudo | pronto |
| 5 | Comparação de até 3 veículos, adaptação por adaptação | pronto |
| 6 | Simulador de isenção (IPI, ICMS, IPVA) com os tetos legais | pronto |
| 7 | Entrar / criar conta, com a adaptação já aplicada ao catálogo | pronto |
| 8 | Alerta quando entrar um carro compatível | interface pronta, sem back-end |
| 9 | Publicar anúncio (lado do vendedor) | fora do MVP |

## Rodar

```bash
cd web
npm install
npm run dev              # desenvolvimento
npm run build            # gera web/dist/ — é o que vai para docs/
```

Para gerar a versão de arquivo único, que abre do disco com dois cliques:

```bash
npx vite build --config vite.config.unico.js    # web/dist-unico/index.html
```

## Publicar no GitHub Pages

A pasta `docs/` já contém o site construído. Em
**Settings → Pages → Source**, escolha *Deploy from a branch*, a branch deste
projeto e a pasta **`/docs`**. Não é preciso configurar build no servidor.

Depois de mexer no código, rode `npm run build` dentro de `web/` e copie
`web/dist/` por cima de `docs/`.

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
