#!/usr/bin/env node
/**
 * Encaixa as fotos reais dos anuncios.
 *
 * Jogue as imagens em web/fotos-entrada/ (jpg, png ou webp, qualquer tamanho)
 * e rode:  npm run fotos
 *
 * O script descobre a qual anuncio cada arquivo pertence pelo nome, corta no
 * formato 8:5 do cartao, reduz, converte para webp e grava em
 * src/assets/fotos-reais/<id do veiculo>.webp. O site passa a usar a foto
 * real; quem ainda nao tiver foto continua com o recorte do video.
 *
 * Reconhece o arquivo pelo id (argo-23.jpg), pelo modelo (Fiat Argo.jpg,
 * argo.png, t-cross.webp) ou por qualquer nome que contenha um deles.
 */
import { readdir, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTRADA = path.join(RAIZ, 'fotos-entrada');
const SAIDA = path.join(RAIZ, 'src/assets/fotos-reais');
const LARGURA = 840, ALTURA = 525;          // 8:5, o formato do cartao

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Falta a biblioteca de imagem. Rode:  npm install');
  process.exit(1);
}

// Le os ids e modelos direto de veiculos.js, para a lista nunca sair de sincronia
const fonte = await readFile(path.join(RAIZ, 'src/data/veiculos.js'), 'utf8');
const VEICULOS = [...fonte.matchAll(
  /id:\s*'([^']+)',\s*marca:\s*'([^']+)',\s*modelo:\s*'([^']+)'/g)]
  .map(([, id, marca, modelo]) => ({ id, marca, modelo }));

if (!VEICULOS.length) {
  console.error('Nao consegui ler os veiculos de src/data/veiculos.js');
  process.exit(1);
}

const limpo = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '');

// Nome de arquivo do mundo real raramente e o modelo exato: vem
// "Fiat Argo 2023 branco.jpg", nao "Argo Drive 1.3.jpg". Entao cada veiculo
// oferece varias chaves (id, marca+modelo, modelo e os prefixos dele) e vence
// a chave MAIS LONGA que aparecer no nome -- assim "Onix Plus" ganha de
// "Onix" e um palpite curto nunca rouba de um especifico.
function chaves(v) {
  const palavras = v.modelo.split(/\s+/);
  const prefixos = palavras.map((_, i) => palavras.slice(0, i + 1).join(' '));
  return [v.id, `${v.marca} ${v.modelo}`, ...prefixos.map((p) => `${v.marca} ${p}`), ...prefixos]
    .map(limpo)
    .filter((k) => k.length >= 3);
}

function aQuemPertence(arquivo) {
  const nome = limpo(path.basename(arquivo, path.extname(arquivo)));
  let melhor = null, tamanho = 0, empate = false;
  for (const v of VEICULOS) {
    for (const k of chaves(v)) {
      if (!nome.includes(k)) continue;
      if (k.length > tamanho) { melhor = v; tamanho = k.length; empate = false; }
      else if (k.length === tamanho && melhor && melhor.id !== v.id) empate = true;
    }
  }
  if (empate) {
    console.warn(`  ! ${arquivo}: nome ambiguo, renomeie com o id do anuncio`);
    return null;
  }
  return melhor;
}

await mkdir(SAIDA, { recursive: true });
if (!existsSync(ENTRADA)) {
  console.error(`Crie a pasta ${path.relative(RAIZ, ENTRADA)} e ponha as fotos nela.`);
  process.exit(1);
}

const arquivos = (await readdir(ENTRADA))
  .filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));

if (!arquivos.length) {
  console.log(`Nenhuma imagem em ${path.relative(RAIZ, ENTRADA)}/.`);
  console.log('Nomeie cada arquivo com o modelo ou o id do anuncio. Exemplos:');
  for (const v of VEICULOS.slice(0, 3)) console.log(`   ${v.modelo}.jpg   ou   ${v.id}.jpg`);
  process.exit(0);
}

const encaixados = new Map();
const perdidos = [];

for (const f of arquivos) {
  const v = aQuemPertence(f);
  if (!v) { perdidos.push(f); continue; }
  if (encaixados.has(v.id)) {
    console.warn(`  ! ${f} ignorado: ${v.id} ja recebeu ${encaixados.get(v.id)}`);
    continue;
  }
  const destino = path.join(SAIDA, `${v.id}.webp`);
  try {
    await sharp(path.join(ENTRADA, f))
      .rotate()                                   // respeita o EXIF da camera
      .resize(LARGURA, ALTURA, { fit: 'cover', position: 'centre' })
      .webp({ quality: 80 })
      .toFile(destino);
    encaixados.set(v.id, f);
    console.log(`  ok  ${f}  ->  ${v.id}.webp  (${v.modelo})`);
  } catch (e) {
    console.error(`  ERRO ${f}: ${e.message}`);
  }
}

const semFoto = VEICULOS.filter((v) => !existsSync(path.join(SAIDA, `${v.id}.webp`)));

console.log(`\n${encaixados.size} foto(s) encaixada(s) nesta rodada.`);
if (perdidos.length) {
  console.log('\nNao reconheci estes arquivos (renomeie com o modelo ou o id):');
  for (const f of perdidos) console.log('   ' + f);
}
if (semFoto.length) {
  console.log('\nAinda sem foto real (seguem com o recorte do video):');
  for (const v of semFoto) console.log(`   ${v.id}  —  ${v.modelo}`);
} else {
  console.log('\nTodos os anuncios tem foto real.');
}
console.log('\nAgora rode:  npm run build');
