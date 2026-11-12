# Alma & Tinta — Biblioteca Digital

![Alma & Tinta](capa.png)

A biblioteca digital de **Antônio José**: prévias, leitura online do livro completo (em texto ou nas páginas originais), estante pessoal com progresso de leitura e área do autor para publicar.

| Parte | Onde fica | O que faz |
|---|---|---|
| `index.html` | **GitHub Pages** (este repositório) | O site que os leitores abrem |
| `apps-script/Código.gs` | **Google Apps Script** | Guarda os livros numa planilha, as capas e PDFs no Google Drive e confere a senha |

## Publicar no GitHub Pages
1. **Settings → Pages**
2. **Source:** Deploy from a branch · **Branch:** `main` · pasta `/ (root)` · **Save**
3. Em 1–2 minutos o site fica em `https://SEU-USUARIO.github.io/alma-e-tinta/`

## Atualizar o Apps Script
1. Cole `apps-script/Código.gs` no editor do Apps Script e coloque a sua senha em `SENHA_DE_EDITOR` (a cópia deste repositório vem sem senha).
2. **Implantar → Gerenciar implantações → ✎ Editar → Versão: Nova versão → Implantar** (nunca "Nova implantação", para o endereço não mudar).
3. A implantação deve estar como **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**.

Se um dia o endereço do App da Web mudar, troque o ID na linha `const ID_DO_APPS_SCRIPT = '...'` do `index.html`.

## Regras para mexer no código
- Não use comentários nem `//`, `/*` ou `*/` dentro do `<script>` do `index.html` — o Apps Script apaga o que parece comentário e quebra o site.
- Colunas novas da planilha entram sempre **no fim** da lista `COLS` no `Código.gs`.

© 2026 Antônio José. Todos os direitos reservados. Os livros e textos são protegidos pela Lei 9.610/98.
