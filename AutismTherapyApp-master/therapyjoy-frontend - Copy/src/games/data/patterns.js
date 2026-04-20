export const SHAPES = ['●', '■', '▲', '★', '◆', '♥'];

export const patternLevels = {
  easy: [
    { sequence: ['●', '■', '●', '■'], answer: '●', choices: ['●', '▲', '★'], repeatUnit: ['●', '■'] },
    { sequence: ['▲', '★', '▲', '★'], answer: '▲', choices: ['■', '▲', '◆'], repeatUnit: ['▲', '★'] },
    { sequence: ['◆', '♥', '◆', '♥'], answer: '◆', choices: ['♥', '◆', '■'], repeatUnit: ['◆', '♥'] },
  ],
  medium: [
    { sequence: ['●', '■', '▲', '●', '■'], answer: '▲', choices: ['★', '▲', '◆'], repeatUnit: ['●', '■', '▲'] },
    { sequence: ['★', '◆', '♥', '★', '◆'], answer: '♥', choices: ['♥', '★', '■'], repeatUnit: ['★', '◆', '♥'] },
    { sequence: ['■', '▲', '●', '■', '▲'], answer: '●', choices: ['▲', '●', '◆'], repeatUnit: ['■', '▲', '●'] },
  ],
  hard: [
    {
      sequence: [{ shape: '●', color: '#F26A6A' }, { shape: '■', color: '#61A9F7' }, { shape: '●', color: '#F26A6A' }],
      answer: { shape: '■', color: '#61A9F7' },
      choices: [{ shape: '■', color: '#61A9F7' }, { shape: '●', color: '#61A9F7' }, { shape: '■', color: '#F26A6A' }],
      repeatUnit: [{ shape: '●', color: '#F26A6A' }, { shape: '■', color: '#61A9F7' }],
    },
    {
      sequence: [{ shape: '▲', color: '#70C887' }, { shape: '▲', color: '#F5D66F' }, { shape: '▲', color: '#70C887' }],
      answer: { shape: '▲', color: '#F5D66F' },
      choices: [{ shape: '▲', color: '#F5D66F' }, { shape: '★', color: '#70C887' }, { shape: '▲', color: '#70C887' }],
      repeatUnit: [{ shape: '▲', color: '#70C887' }, { shape: '▲', color: '#F5D66F' }],
    },
    {
      sequence: [{ shape: '★', color: '#A97AE8' }, { shape: '◆', color: '#F3A15D' }, { shape: '★', color: '#A97AE8' }],
      answer: { shape: '◆', color: '#F3A15D' },
      choices: [{ shape: '◆', color: '#F3A15D' }, { shape: '◆', color: '#A97AE8' }, { shape: '★', color: '#F3A15D' }],
      repeatUnit: [{ shape: '★', color: '#A97AE8' }, { shape: '◆', color: '#F3A15D' }],
    },
  ],
};
