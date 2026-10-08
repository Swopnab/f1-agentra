'use strict';

// Fixed fictional design fixtures. Not prices, recommendations or performance.
const examples = {
  quality: {
    name: 'Northstar Systems', symbol: 'DEMO-A', brief: '001', score: 82,
    evidence: 3, status: 'For discussion', className: '',
    bull: 'The fictional packet describes recurring demand and improving cash generation. A controlled pullback makes the question worth discussing.',
    bear: 'The example still depends on execution and valuation assumptions. A compelling story alone does not justify risking real money.',
    decision: 'Discuss the thesis and its limits. This sample is not a buy decision, permission to trade, or a validated strategy.',
    path: [129, 135, 122, 126, 111, 119, 97, 103, 87, 98, 91, 76, 84, 62, 72, 59, 66, 41, 50, 35, 42, 27, 33],
  },
  uncertain: {
    name: 'Meridian Works', symbol: 'DEMO-B', brief: '002', score: 74,
    evidence: 2, status: 'More context needed', className: 'badge-warning',
    bull: 'The fictional headline looks promising. Demand may be recovering, but the sample does not provide enough information to support that interpretation.',
    bear: 'One evidence item is absent. Debt, cash conversion, and the durability of the headline remain unanswered questions.',
    decision: 'Wait for missing context. The example demonstrates that incomplete information is a reason to stop—not a gap to guess across.',
    path: [117, 105, 120, 94, 108, 90, 78, 97, 104, 89, 107, 99, 119, 103, 108, 85, 98, 89, 106, 93, 111, 103, 107],
  },
  risk: {
    name: 'Orchard Labs', symbol: 'DEMO-C', brief: '003', score: 58,
    evidence: 3, status: 'Set aside', className: 'badge-rejected',
    bull: 'A fictional product announcement offers a possible growth story. The original interest was a catalyst—not proof of a sustainable business.',
    bear: 'The sample introduces weakening cash flow and dilution risk. Those facts challenge the original narrative rather than strengthen it.',
    decision: 'Set the example aside. The downside case outweighs the initial story; a lower price does not repair a weak thesis.',
    path: [42, 31, 38, 48, 40, 61, 53, 69, 62, 83, 73, 99, 88, 111, 104, 127, 116, 132, 125, 145, 136, 153, 148],
  },
};

let selected = 'quality';
const byId = (id) => document.getElementById(id);
const missingInput = byId('missing-input');

function render() {
  const example = examples[selected];
  const missing = missingInput.checked;
  byId('demo-name').textContent = example.name;
  byId('demo-symbol').textContent = `${example.symbol} · FICTIONAL COMPANY`;
  byId('brief-number').textContent = example.brief;
  byId('demo-score').textContent = missing ? '—' : String(example.score);
  byId('demo-evidence').textContent = `${Math.max(0, example.evidence - (missing ? 1 : 0))} / 3`;
  const status = byId('demo-status');
  status.textContent = missing ? 'Input unavailable' : example.status;
  status.className = `badge ${missing ? 'badge-warning' : example.className}`.trim();
  byId('demo-bull').textContent = example.bull;
  byId('demo-bear').textContent = example.bear;
  byId('demo-decision').textContent = missing
    ? 'One sample input was removed. The illustrative score is now unavailable, and discussion stops until the missing context is supplied. Nothing is assumed or executed.'
    : example.decision;
  const points = example.path.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * 640 / (example.path.length - 1)).toFixed(2)} ${y}`).join(' ');
  byId('demo-line').setAttribute('d', points);
  byId('demo-area').setAttribute('d', `${points} L640 180 L0 180 Z`);
  byId('demo-chart').classList.toggle('chart-risk', selected === 'risk');
  byId('demo-chart-title').textContent = `Fictional ${example.name} scenario path. Not historical prices, a backtest, or investment performance.`;
  for (const button of document.querySelectorAll('[data-scenario]')) {
    const active = button.dataset.scenario === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}

for (const button of document.querySelectorAll('[data-scenario]')) {
  button.addEventListener('click', () => {
    selected = button.dataset.scenario;
    missingInput.checked = false;
    render();
  });
}
missingInput.addEventListener('change', render);
byId('reset-demo').addEventListener('click', () => {
  selected = 'quality';
  missingInput.checked = false;
  render();
});
render();
