import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// ── Tabs ──────────────────────────────────────────────────────────────────
function Tabs() {
  const [active, setActive] = useState(0);
  const tabs = [
    {
      label: '⚡ 性能',
      content: [
        h('strong', null, '仅 3KB'),
        ' 依赖体积，比 React 小 7 倍。ESM CDN 直出，浏览器原生模块解析，无打包、无压缩、零混淆。'
      ]
    },
    {
      label: '🎯 精准',
      content: [
        '与 React 完全兼容的 API，支持 hooks、context、Suspense。使用标准 ',
        h('strong', null, 'Web Components'),
        ' 自定义元素方式输出，可嵌入任意页面。'
      ]
    },
    {
      label: '🔥 灵活',
      content: [
        '可与 jQuery、Vue、原生 DOM 并存。渐进式增强，不强求全有全无。一个 ',
        h('strong', null, 'import'),
        ' 引入，立即获得完整的响应式能力。'
      ]
    },
  ];
  return h('div', { class: 'widget' },
    h('div', { class: 'widget-title' },
      h('span', null, '🏷'), ' Preact 特性'
    ),
    h('div', { class: 'tabs-nav' },
      tabs.map((t, i) => h('button', {
        class: 'tab-btn' + (i === active ? ' active' : ''),
        onClick: () => setActive(i),
        key: i
      }, t.label))
    ),
    h('div', { class: 'tab-content' }, tabs[active].content)
  );
}

// ── Counter ─────────────────────────────────────────────────────────────
function Counter() {
  const [count, setCount] = useState(0);
  const steps = [-100, -10, -1, 1, 10, 100];
  return h('div', { class: 'widget' },
    h('div', { class: 'widget-title' },
      h('span', null, '⚙️'), ' 数字调节器'
    ),
    h('div', { class: 'counter-row' },
      h('button', { class: 'counter-btn', onClick: () => setCount(c => c - 1) }, '−'),
      h('div', { class: 'counter-display' }, count),
      h('button', { class: 'counter-btn', onClick: () => setCount(c => c + 1) }, '+')
    ),
    h('div', { class: 'counter-btns-row' },
      steps.map(n => h('button', {
        class: 'counter-step-btn', onClick: () => setCount(c => c + n), key: n
      }, n > 0 ? '+' + n : n))
    )
  );
}

// ── Todo ────────────────────────────────────────────────────────────────
function Todo() {
  const [items, setItems] = useState([
    { id: 1, text: '尝试 Preact 交互组件', done: false },
    { id: 2, text: '零构建直接跑起来', done: true },
    { id: 3, text: '部署到 GitHub Pages', done: false },
  ]);
  const [val, setVal] = useState('');

  const add = () => {
    if (!val.trim()) return;
    setItems(it => [...it, { id: Date.now(), text: val.trim(), done: false }]);
    setVal('');
  };
  const toggle = id => setItems(it => it.map(i => i.id === id ? Object.assign({}, i, { done: !i.done }) : i));
  const del = id => setItems(it => it.filter(i => i.id !== id));

  return h('div', { class: 'widget' },
    h('div', { class: 'widget-title' },
      h('span', null, '📋'), ' 待办事项'
    ),
    h('div', { class: 'todo-input-row' },
      h('input', {
        class: 'todo-input', value: val,
        placeholder: '输入任务，按 Enter 或点击添加...',
        onInput: e => setVal(e.target.value),
        onKeyDown: e => e.key === 'Enter' && add()
      }),
      h('button', { class: 'todo-add-btn', onClick: add }, '添加')
    ),
    h('ul', { class: 'todo-list' },
      items.length === 0 && h('li', { class: 'todo-empty' }, '暂无任务，全部完成了？🎉'),
      items.map(item => h('li', { class: 'todo-item' + (item.done ? ' done' : ''), key: item.id },
        h('span', { class: 'todo-item-text', onClick: () => toggle(item.id) }, item.text),
        h('button', { class: 'todo-del', onClick: () => del(item.id) }, '✕')
      ))
    )
  );
}

// ── App ───────────────────────────────────────────────────────────────────
function App() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.querySelector('.section-wrap');
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return h('div', { class: 'section-wrap' + (visible ? '' : ' reveal') },
    h('div', { class: 'section-title' }, '// Interactive Preact Components'),
    h(Tabs),
    h(Counter),
    h(Todo)
  );
}

render(h(App), document.getElementById('app'));

const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && (e.target.classList.add('visible'), obs.unobserve(e.target)));
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
