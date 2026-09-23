import { useEffect, useRef, useState } from 'react';
import { ADAPTACOES, ORDEM_ADAPTACOES } from '../data/adaptacoes';
import Icone from './Icone';
import Marca from './Marca';

// Tela de entrada. Não há servidor: a validação é de verdade, o envio é
// simulado. O que importa aqui é a ideia do produto -- a conta existe para
// guardar a adaptação da pessoa e avisar quando entrar um carro que serve.
// Por isso "criar conta" pergunta a adaptação e não um monte de dado inútil.

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function Campo({ id, rotulo, erro, dica, children }) {
  return (
    <p className={'campo' + (erro ? ' ruim' : '')}>
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {erro ? (
        <span className="campo-erro" id={id + '-erro'} role="alert">
          <Icone nome="escudo" tam={12} /> {erro}
        </span>
      ) : dica ? (
        <span className="campo-dica" id={id + '-dica'}>{dica}</span>
      ) : null}
    </p>
  );
}

export default function Entrar({ aberto, aoFechar, aoEntrar }) {
  const [modo, setModo] = useState('entrar');      // entrar | criar
  const [f, setF] = useState({ nome: '', email: '', senha: '', adaptacao: '' });
  const [erros, setErros] = useState({});
  const [verSenha, setVerSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const painel = useRef(null);
  const antes = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    antes.current = document.activeElement;
    const trava = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    painel.current?.querySelector('input')?.focus();
    const tecla = (e) => {
      if (e.key === 'Escape') { aoFechar(); return; }
      if (e.key !== 'Tab') return;
      const fs = painel.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select');
      if (!fs?.length) return;
      const pri = fs[0], ult = fs[fs.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    };
    addEventListener('keydown', tecla);
    return () => {
      removeEventListener('keydown', tecla);
      document.body.style.overflow = trava;
      antes.current?.focus?.();
    };
  }, [aberto, aoFechar]);

  // Troca de modo limpa os erros: manter "senha muito curta" na tela depois de
  // trocar de aba faz o formulário parecer quebrado.
  useEffect(() => { setErros({}); }, [modo]);

  if (!aberto) return null;

  const criar = modo === 'criar';
  const mexer = (k) => (e) => {
    setF((v) => ({ ...v, [k]: e.target.value }));
    setErros((v) => (v[k] ? { ...v, [k]: null } : v));
  };

  function enviar(e) {
    e.preventDefault();
    const novo = {};
    if (criar && f.nome.trim().length < 2) novo.nome = 'Escreva o seu nome.';
    if (!EMAIL.test(f.email.trim())) novo.email = 'E-mail inválido. Confira o @ e o ponto.';
    if (f.senha.length < 8) novo.senha = 'A senha precisa de pelo menos 8 caracteres.';
    setErros(novo);
    if (Object.keys(novo).length) {
      // Leva o foco ao primeiro campo com erro, senão quem usa teclado ou
      // leitor de tela não descobre onde o formulário travou.
      painel.current?.querySelector('.campo.ruim input')?.focus();
      return;
    }
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      aoEntrar({ nome: criar ? f.nome.trim() : f.email.split('@')[0], adaptacao: f.adaptacao });
    }, 620);
  }

  return (
    <div className="ent-fundo" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <section className="ent" role="dialog" aria-modal="true" aria-labelledby="ent-t" ref={painel}>
        <button type="button" className="ent-x" onClick={aoFechar} aria-label="Fechar">
          <Icone nome="fecha" tam={16} />
        </button>

        {/* Painel da marca: existe para dizer POR QUE criar conta, nao so para
            preencher o espaco com uma imagem bonita. */}
        <aside className="ent-lado">
          <Marca tam={44} />
          <h2>Poucos carros servem para você. A conta avisa quando um entra.</h2>
          <ul>
            <li><Icone nome="check" tam={13} /> Guarda a sua adaptação e já abre o catálogo filtrado</li>
            <li><Icone nome="check" tam={13} /> Alerta quando entra um carro que serve</li>
            <li><Icone nome="check" tam={13} /> Guarda comparações e anúncios favoritos</li>
          </ul>
          <p className="ent-rodape-lado mono">
            Protótipo acadêmico &middot; nenhum dado é enviado ou salvo
          </p>
        </aside>

        <div className="ent-corpo">
          <div className="ent-abas" role="tablist" aria-label="Entrar ou criar conta">
            {[['entrar', 'Entrar'], ['criar', 'Criar conta']].map(([id, r]) => (
              <button key={id} type="button" role="tab" aria-selected={modo === id}
                      className={modo === id ? 'on' : ''} onClick={() => setModo(id)}>
                {r}
              </button>
            ))}
          </div>

          <h1 id="ent-t" className="ent-titulo">
            {criar ? 'Criar conta no PCD Motors' : 'Entrar no PCD Motors'}
          </h1>

          <form onSubmit={enviar} noValidate>
            {criar && (
              <Campo id="nome" rotulo="Nome" erro={erros.nome}>
                <input id="nome" name="nome" type="text" autoComplete="name"
                       value={f.nome} onChange={mexer('nome')}
                       aria-invalid={!!erros.nome}
                       aria-describedby={erros.nome ? 'nome-erro' : undefined} />
              </Campo>
            )}

            <Campo id="email" rotulo="E-mail" erro={erros.email}>
              <input id="email" name="email" type="email" inputMode="email"
                     autoComplete={criar ? 'email' : 'username'}
                     value={f.email} onChange={mexer('email')}
                     aria-invalid={!!erros.email}
                     aria-describedby={erros.email ? 'email-erro' : undefined} />
            </Campo>

            <Campo id="senha" rotulo="Senha" erro={erros.senha}
                   dica={criar ? 'Pelo menos 8 caracteres.' : null}>
              <span className="campo-senha">
                <input id="senha" name="senha" type={verSenha ? 'text' : 'password'}
                       autoComplete={criar ? 'new-password' : 'current-password'}
                       value={f.senha} onChange={mexer('senha')}
                       aria-invalid={!!erros.senha}
                       aria-describedby={
                         erros.senha ? 'senha-erro' : criar ? 'senha-dica' : undefined} />
                <button type="button" onClick={() => setVerSenha((v) => !v)}
                        aria-pressed={verSenha}>
                  {verSenha ? 'ocultar' : 'mostrar'}
                </button>
              </span>
            </Campo>

            {criar && (
              <Campo id="adaptacao" rotulo="Qual adaptação você precisa?"
                     dica="Dá para mudar depois. Serve para já abrir o catálogo filtrado.">
                <select id="adaptacao" value={f.adaptacao} onChange={mexer('adaptacao')}
                        aria-describedby="adaptacao-dica">
                  <option value="">Prefiro escolher depois</option>
                  {ORDEM_ADAPTACOES.map((c) => (
                    <option key={c} value={c}>{ADAPTACOES[c].nome}</option>
                  ))}
                </select>
              </Campo>
            )}

            {!criar && (
              <p className="ent-esqueci">
                <button type="button">Esqueci minha senha</button>
              </p>
            )}

            <button type="submit" className="bt bt-cheio ent-enviar" disabled={enviando}>
              {enviando ? 'Um instante…' : criar ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <p className="ent-ou"><span>ou</span></p>

          {/* gov.br em primeiro lugar não é enfeite: a isenção de IPI e ICMS já
              é pedida por lá, então é a conta que essa pessoa comprovadamente
              tem -- e daria para puxar o laudo sem redigitar nada. */}
          <button type="button" className="ent-social ent-gov">
            <b>gov.br</b>
            <span>Entrar com a conta que você já usa para a isenção</span>
          </button>
          <button type="button" className="ent-social">
            <svg viewBox="0 0 18 18" width="17" height="17" aria-hidden="true">
              <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.3-.2-1.9H9v3.5h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5Z"/>
              <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18Z"/>
              <path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3Z"/>
              <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6Z"/>
            </svg>
            <span>Entrar com Google</span>
          </button>

          <p className="ent-legal">
            Ao continuar você aceita os termos de uso. Este é um protótipo
            acadêmico: nada é enviado, salvo ou compartilhado.
          </p>
        </div>
      </section>
    </div>
  );
}
