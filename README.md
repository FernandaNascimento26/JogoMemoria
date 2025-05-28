
# 🎸 Rock Memory - Jogo da Memória Metal

Bem-vindo ao **Rock Memory**, um jogo da memória com temática de bandas de rock e heavy metal! O objetivo é simples: encontrar todos os pares de cartas com o menor número de jogadas possível.

## Como funciona

O jogo foi desenvolvido com:

- **HTML** estruturado e responsivo com **Bootstrap 5**
- **CSS customizado** com um tema visual rockeiro
- **JavaScript Vanilla (sem bibliotecas externas)** para toda a lógica do jogo

---

## Funcionalidades em JavaScript

### 🃏 Criação dinâmica do tabuleiro
As cartas são criadas dinamicamente com base na dificuldade escolhida. O número de linhas e colunas varia conforme:

```js
const DIFFICULTIES = {
  easy: { rows: 4, cols: 4 },
  medium: { rows: 4, cols: 6 },
  hard: { rows: 6, cols: 6 }
};
```

### Lógica de jogo

- As cartas são embaralhadas e renderizadas usando elementos `div`.
- O jogador pode virar até duas cartas por jogada.
- Se os pares forem iguais, ficam marcadas como **corretas**.
- Se forem diferentes, voltam ao estado inicial após um curto intervalo.

```js
if (firstCard.band === secondCard.band) {
  // marcar como par encontrado
} else {
  // desvirar cartas
}
```

### Tela de vitória

Quando todos os pares são encontrados, uma mensagem de sucesso é exibida com efeitos visuais e sonoros.

### Música e efeitos
O jogo conta com:
- Música de fundo
- Efeitos sonoros para virar carta, acertar e vencer

Há também um botão para **ligar/desligar o som**.

---

## Responsividade

O layout é adaptado para diferentes tamanhos de tela com uso de:

- `grid-template-columns: auto-fit` para o tabuleiro
- `Bootstrap` para layout flexível e fluido

---

## Estrutura de arquivos

```
├── index.html                 # HTML com layout Bootstrap
├── css/
│   └── styles-bootstrap-final.css
├── js/
│   └── scripts.js             # Lógica principal do jogo
└── assets/                    # Imagens das bandas
```

---

## Créditos

- Ícones: [Font Awesome](https://fontawesome.com/)
- Música: [SoundHelix](https://www.soundhelix.com/)
- Imagens: Diversas bandas de rock (uso educativo)

---