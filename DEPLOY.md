# 🚀 Deploy no GitHub Pages

## Configuração

1. **Habilite o GitHub Pages** no seu repositório:
   - Vá para Settings > Pages
   - Source: Deploy from a branch
   - Branch: main (ou master)
   - Folder: / (root)

2. **Estrutura de arquivos correta**:
   ```
   arab/
   ├── index.html              # Página inicial
   ├── learnArabic.html        # Página de aprendizado
   ├── javascript/
   │   └── main.js            # Lógica principal
   ├── style/
   │   └── style.css          # Estilos CSS
   └── data/
       ├── alphabet.json      # Dados do alfabeto árabe
       ├── words.json         # Palavras árabes comuns
       └── quran.json         # Dados do Alcorão (futuro)
   ```

## Solução para erro 404

O projeto foi configurado para tentar múltiplos caminhos para carregar os arquivos JSON:

- `./data/alphabet.json`
- `../data/alphabet.json`
- `data/alphabet.json`
- `/data/alphabet.json`

Isso garante que funcione tanto em desenvolvimento local quanto em produção.

## Verificação

Após o deploy, verifique:

1. Abra o console do navegador (F12)
2. Vá para a aba "Console"
3. Verifique se há mensagens de sucesso ao carregar os arquivos
4. Se houver erros, eles serão mostrados com detalhes

## URL de produção

Após o deploy, seu projeto estará disponível em:
`https://[seu-usuario].github.io/arab/` 