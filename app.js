'use strict';

// Original browser-only implementation. All financial-looking fixtures are fictional.
// No network, account, approval, order, storage, or background-service capability.
const examples = {
  quality: {
    name: 'Northstar Systems', symbol: 'DEMO-A', score: 82, status: 'For discussion', tone: '',
    components: [85, 82, 83, 74, 80],
    bull: 'The fictional packet describes recurring demand and improving cash generation. A controlled pullback gives the example a question worth exploring.',
    bear: 'The sample still depends on execution and valuation assumptions. A compelling story does not justify risking real money.',
    decision: 'Explore the thesis and its limits. This example is not a buy decision, permission to trade, or a validated strategy.',
    evidence: [
      ['Business context', 'The invented company describes recurring demand and improving cash conversion.', true],
      ['Catalyst context', 'A fictional release supports the narrative. Its assumptions still need to be challenged.', true],
      ['Risk context', 'The sample includes valuation and execution uncertainty, rather than only a bull case.', true],
    ],
    path: [95,94,96,97,96,99,98,100,99,102,101,100,103,104,103,105,104,107,106,108,110,109,113,112],
  },
  uncertain: {
    name: 'Meridian Works', symbol: 'DEMO-B', score: 74, status: 'More context needed', tone: 'warning',
    components: [77,76,72,69,71],
    bull: 'The fictional headline suggests recovering demand. The example lacks enough information to establish the durability of that story.',
    bear: 'Cash conversion, debt, and catalyst durability remain unresolved. Missing evidence is not a reason to invent a convenient answer.',
    decision: 'Wait for missing context. Incomplete information is a reason to stop—not a gap to guess across.',
    evidence: [
      ['Business context', 'The invented narrative suggests recovering demand, with uncertain durability.', true],
      ['Catalyst context', 'A fictional announcement is present, but supporting context is incomplete.', true],
      ['Risk context', 'Debt and cash-conversion details are absent from the sample packet.', false],
    ],
    path: [98,100,97,101,99,102,104,101,100,102,99,100,97,99,98,102,100,101,99,101,98,100,99,99.5],
  },
  risk: {
    name: 'Orchard Labs', symbol: 'DEMO-C', score: 58, status: 'Set aside', tone: 'rejected',
    components: [55,65,55,48,67],
    bull: 'An invented product announcement offers a growth story. That catalyst is a starting question—not proof of a sustainable business.',
    bear: 'The sample introduces weakening cash flow and dilution risk. A falling example path does not repair the original thesis.',
    decision: 'Set the example aside. The challenging case outweighs the original story; a lower price is not a stronger thesis.',
    evidence: [
      ['Business context', 'The invented company has an interesting product story with unresolved demand quality.', true],
      ['Catalyst context', 'The sample announcement does not address the underlying funding risks.', true],
      ['Risk context', 'Fictional dilution and cash-flow concerns challenge the initial narrative.', true],
    ],
    path: [112,114,113,111,112,109,110,108,109,106,107,104,105,102,103,100,101,98,99,96,97,94,95,93],
  },
};
const stages = {
  evidence: ['01 / EVIDENCE BEFORE OPINION','A source is a starting point. Not the conclusion.','Separate reported facts, interpretations, and missing context. An attractive headline still needs a business, a balance sheet, and a bear case behind it.'],
  challenge: ['02 / THE OTHER SIDE OF THE STORY','A stronger question is better than a louder conviction.','Ask what the optimistic case leaves out. Dilution, debt, execution risk, or a weak catalyst may change the story. This demonstration never substitutes enthusiasm for evidence.'],
  boundaries: ['03 / MAKE UNCERTAINTY VISIBLE','Unknown is an answer. A useful one.','Define what is missing, what invalidates the thesis, and where assumptions could fail. A score can organize a discussion; it cannot manufacture permission, liquidity, or certainty.'],
  human: ['04 / HUMAN JUDGMENT, BY DESIGN','Research can support the decision. It cannot own it.','A thoughtful review can end in waiting or rejection. The workspace is educational and disconnected from brokers. Its buttons create demo notes, never transactions.'],
};
const byId = id => document.getElementById(id);
const all = selector => [...document.querySelectorAll(selector)];
const state = { scenario:'quality', view:'overview', journal:[], eventCount:0 };
const missingInput = byId('missing-input');
const money = value => value.toLocaleString('en-US',{style:'currency',currency:'USD'});

function node(tag,className,text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
function renderEvidence(example,missing) {
  const list = byId('evidence-list');
  list.replaceChildren();
  example.evidence.forEach(([title,copy,present],index) => {
    const unavailable = !present || (missing && index === 0);
    const item = node('article',`evidence-item${unavailable ? ' missing' : ''}`);
    const icon = node('span','evidence-icon',unavailable ? '?' : '◇');
    icon.setAttribute('aria-hidden','true');
    const content = node('div');
    content.append(node('h5','',title),node('p','',missing && index===0 ? 'This sample input was deliberately removed. No replacement is inferred.' : copy));
    item.append(icon,content,node('span','evidence-tag',unavailable ? 'Missing' : 'Sample only'));
    list.append(item);
  });
  const dimensions = byId('score-dimensions');
  dimensions.replaceChildren();
  ['Quality','Catalyst','Structure','Valuation','Context'].forEach((label,index) => {
    const item = node('div','dimension');
    const track = node('div','dimension-track');
    track.setAttribute('aria-hidden','true');
    const fill = node('i');
    fill.style.transform = `scaleX(${missing ? 0 : example.components[index]/100})`;
    track.append(fill);
    item.append(node('span','',label),node('strong','',missing ? '—' : example.components[index]),track);
    dimensions.append(item);
  });
}
function chartPoint(value,index) {
  return [10+index*640/23,155-(value-90)*5];
}
function chartPath(values) {
  return values.map((value,index) => {
    const [x,y] = chartPoint(value,index);
    return `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}
function renderChart() {
  const example = examples[state.scenario];
  const path = chartPath(example.path);
  byId('demo-line').setAttribute('d',path);
  byId('demo-area').setAttribute('d',`${path} L650 180 L10 180 Z`);
  const benchmark = example.path.map((_,index)=>96+index*.24+Math.sin(index*1.5)*.9);
  byId('benchmark-line').setAttribute('d',chartPath(benchmark));
  byId('benchmark-line').toggleAttribute('hidden',!byId('compare-path').checked);
  byId('demo-chart').classList.toggle('chart-risk',state.scenario==='risk');
  const index = Math.max(0,Math.min(23,Number(byId('chart-scrub').value)-1));
  const [x,y] = chartPoint(example.path[index],index);
  byId('scrub-guide').setAttribute('d',`M${x} 10V170`);
  byId('scrub-point').setAttribute('cx',String(x));
  byId('scrub-point').setAttribute('cy',String(y));
  byId('observation-label').textContent = `Observation ${index+1}`;
  byId('observation-value').textContent = example.path[index].toFixed(1);
  byId('chart-scrub').setAttribute('aria-valuetext',`Fictional observation ${index+1}, indexed sample value ${example.path[index].toFixed(1)}`);
  byId('demo-chart-title').textContent = `Fictional ${example.name} indexed path${byId('compare-path').checked ? ' with a second synthetic comparison path' : ''}. Not actual prices or investment performance.`;
}
function renderScenario() {
  const example = examples[state.scenario];
  const missing = missingInput.checked;
  byId('demo-name').textContent = example.name;
  byId('demo-symbol').textContent = `${example.symbol} / FICTIONAL COMPANY`;
  byId('demo-score').textContent = missing ? '—' : example.score;
  byId('demo-evidence').textContent = `${example.evidence.filter(item=>item[2]).length-(missing?1:0)} / 3`;
  byId('demo-status').textContent = missing ? 'Input unavailable' : example.status;
  byId('demo-status').className = `status-badge ${missing ? 'warning' : example.tone}`.trim();
  byId('demo-bull').textContent = example.bull;
  byId('demo-bear').textContent = example.bear;
  byId('demo-decision').textContent = missing ? 'A sample input was removed. The illustrative score is unavailable and discussion stops until the context is supplied. Nothing is assumed, approved, or executed.' : example.decision;
  byId('discuss-demo').disabled = missing || state.scenario==='uncertain';
  all('[data-scenario]').forEach(button=>{
    const selected = button.dataset.scenario===state.scenario;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  renderEvidence(example,missing);
  renderChart();
}
function setView(view,focus=false) {
  state.view = view;
  const labels = {overview:'Overview',evidence:'Evidence room',journal:'Decision journal'};
  all('[data-view]').forEach(button=>{
    const selected = button.dataset.view===view;
    button.setAttribute('aria-selected',String(selected));
    button.tabIndex = selected ? 0 : -1;
    byId(`panel-${button.dataset.view}`).hidden = !selected;
    if (focus && selected) button.focus();
  });
  byId('view-label').textContent = labels[view];
}
function renderJournal() {
  const list = byId('journal-list');
  list.replaceChildren();
  byId('journal-count').textContent = state.journal.length;
  if (!state.journal.length) {
    const empty = node('div','journal-empty');
    empty.append(node('span','','≡'),node('h5','','A clean slate.'),node('p','','Flag a fictional scenario for discussion or set it aside. Your demo decision will appear here.'));
    list.append(empty);
    return;
  }
  state.journal.forEach(entry=>{
    const item = node('article','journal-entry');
    const content = node('div');
    content.append(node('strong','',`${entry.name} · ${entry.action}`),node('p','',entry.note),node('small','',`Demo interaction ${entry.sequence} · In memory only · No order or approval`));
    item.append(node('span','',entry.action==='Set aside' ? '⊘' : '↗'),content);
    list.append(item);
  });
}
function journalDecision(action) {
  if (action==='Flagged for discussion' && byId('discuss-demo').disabled) return;
  const example = examples[state.scenario];
  state.eventCount+=1;
  state.journal.unshift({name:example.name,action,sequence:state.eventCount,note:missingInput.checked ? 'A sample input is missing. No transaction decision is possible.' : example.decision});
  // Bound demo memory; never persist visitor activity.
  state.journal = state.journal.slice(0,12);
  renderJournal();
  byId('interaction-status').textContent = `${example.name}: ${action.toLowerCase()} in the demo journal. This is not a trade or an approval.`;
}
all('[data-scenario]').forEach(button=>button.addEventListener('click',()=>{
  state.scenario = button.dataset.scenario;
  missingInput.checked = false;
  byId('chart-scrub').value = '24';
  byId('interaction-status').textContent = 'Scenario changed. All information remains fictional.';
  renderScenario();
}));
all('[data-view]').forEach((button,index,buttons)=>{
  button.addEventListener('click',()=>setView(button.dataset.view));
  button.addEventListener('keydown',event=>{
    let target = index;
    if (event.key==='ArrowRight' || event.key==='ArrowDown') target=(index+1)%buttons.length;
    else if (event.key==='ArrowLeft' || event.key==='ArrowUp') target=(index+buttons.length-1)%buttons.length;
    else if (event.key==='Home') target=0;
    else if (event.key==='End') target=buttons.length-1;
    else return;
    event.preventDefault();
    setView(buttons[target].dataset.view,true);
  });
});
missingInput.addEventListener('change',()=>{ renderScenario(); byId('interaction-status').textContent=missingInput.checked ? 'Sample removed. The score is unavailable and the discussion control is disabled.' : 'Sample restored. This remains a fictional demonstration.'; });
byId('compare-path').addEventListener('change',renderChart);
byId('chart-scrub').addEventListener('input',renderChart);
byId('discuss-demo').addEventListener('click',()=>journalDecision('Flagged for discussion'));
byId('dismiss-demo').addEventListener('click',()=>journalDecision('Set aside'));
byId('reset-demo').addEventListener('click',()=>{
  state.scenario='quality'; state.journal=[]; state.eventCount=0;
  missingInput.checked=false; byId('compare-path').checked=false; byId('chart-scrub').value='24';
  setView('overview'); renderScenario(); renderJournal();
  byId('interaction-status').textContent='Demo reset. No activity was saved or submitted.';
});
all('[data-stage]').forEach(button=>button.addEventListener('click',()=>{
  const stage = stages[button.dataset.stage];
  ['stage-label','stage-title','stage-copy'].forEach((id,index)=>byId(id).textContent=stage[index]);
  all('[data-stage]').forEach(item=>{ item.classList.toggle('selected',item===button); item.setAttribute('aria-pressed',String(item===button)); });
}));
function renderRisk() {
  const capital = Number(byId('virtual-budget').value);
  const fraction = Number(byId('risk-budget').value)/1000;
  const {shares,allocation,allocationFraction} = DemoSizing.calculateSizing(capital,fraction);
  byId('budget-output').textContent=money(capital);
  byId('risk-output').textContent=`${(fraction*100).toFixed(1)}%`;
  byId('virtual-budget').setAttribute('aria-valuetext',`${capital.toLocaleString('en-US')} virtual dollars`);
  byId('risk-budget').setAttribute('aria-valuetext',`${(fraction*100).toFixed(1)} percent of virtual capital`);
  byId('size-output').textContent=shares.toFixed(2);
  byId('loss-output').textContent=money(shares);
  byId('allocation-caption').textContent=`${money(allocation)} allocation · ${(allocationFraction*100).toFixed(1)}% of virtual capital`;
  byId('allocation-fill').style.transform=`scaleX(${allocationFraction})`;
}
['virtual-budget','risk-budget'].forEach(id=>byId(id).addEventListener('input',renderRisk));

// Original lightweight 3D projection: geometry and depth, with no vendor runtime.
const canvas = byId('research-core');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
let coreVisible = true;
let rotationY=.42, rotationX=-.3, width=0, height=0, drag=null, frame=0, lastFrame=0;
const TAU=Math.PI*2;
const sphere=[];
for(let latitude=1;latitude<12;latitude+=1) {
  const angle=Math.PI*latitude/12;
  for(let longitude=0;longitude<24;longitude+=1) {
    const azimuth=TAU*longitude/24;
    sphere.push([Math.sin(angle)*Math.cos(azimuth),Math.cos(angle),Math.sin(angle)*Math.sin(azimuth)]);
  }
}
function project(point,radius) {
  const [px,py,pz]=point;
  const x=px*Math.cos(rotationY)+pz*Math.sin(rotationY);
  const z0=-px*Math.sin(rotationY)+pz*Math.cos(rotationY);
  const y=py*Math.cos(rotationX)-z0*Math.sin(rotationX);
  const z=py*Math.sin(rotationX)+z0*Math.cos(rotationX);
  const depth=3.7/(3.7-z);
  return {x:width*.53+x*radius*depth,y:height*.48+y*radius*depth,z,depth};
}
function drawCore() {
  if(!ctx || !width || !height) return;
  ctx.clearRect(0,0,width,height);
  const radius=Math.min(width*.29,height*.28);
  const halo=ctx.createRadialGradient(width*.53,height*.48,5,width*.53,height*.48,radius*1.6);
  halo.addColorStop(0,'rgba(117,146,255,.14)'); halo.addColorStop(1,'rgba(117,146,255,0)');
  ctx.fillStyle=halo; ctx.fillRect(0,0,width,height);
  // Latitude rings, cut into segments so the back side has lower opacity.
  for(let ring=1;ring<9;ring+=1) {
    const angle=Math.PI*ring/9;
    for(let segment=0;segment<72;segment+=1) {
      const a=TAU*segment/72,b=TAU*(segment+1)/72;
      const p1=project([Math.sin(angle)*Math.cos(a),Math.cos(angle),Math.sin(angle)*Math.sin(a)],radius);
      const p2=project([Math.sin(angle)*Math.cos(b),Math.cos(angle),Math.sin(angle)*Math.sin(b)],radius);
      ctx.strokeStyle=`rgba(67,97,202,${p1.z>0 ? .22 : .07})`; ctx.lineWidth=.6;
      ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
    }
  }
  for(let ring=0;ring<12;ring+=1) {
    ctx.beginPath();
    for(let step=0;step<=72;step+=1) {
      const a=TAU*step/72,azimuth=Math.PI*ring/12;
      const point=project([Math.cos(a)*Math.cos(azimuth),Math.sin(a),Math.cos(a)*Math.sin(azimuth)],radius);
      if(step===0)ctx.moveTo(point.x,point.y); else ctx.lineTo(point.x,point.y);
    }
    ctx.strokeStyle='rgba(70,100,220,.10)'; ctx.lineWidth=.5; ctx.stroke();
  }
  sphere.map(p=>project(p,radius)).sort((a,b)=>a.z-b.z).forEach(p=>{
    ctx.fillStyle=`rgba(55,84,190,${.15+(p.z+1)*.28})`;
    ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(.7,p.depth*1.2),0,TAU); ctx.fill();
  });
  // Tilted orbital paths around the central wireframe sphere.
  for(let orbit=0;orbit<3;orbit+=1) {
    ctx.beginPath();
    for(let step=0;step<=100;step+=1) {
      const a=TAU*step/100,tilt=.45+orbit*.62;
      const point=project([Math.cos(a)*1.34,Math.sin(a)*Math.sin(tilt)*1.34,Math.sin(a)*Math.cos(tilt)*1.34],radius);
      if(!step)ctx.moveTo(point.x,point.y); else ctx.lineTo(point.x,point.y);
    }
    ctx.strokeStyle=orbit===0 ? 'rgba(60,85,230,.34)' : 'rgba(89,116,230,.18)';
    ctx.lineWidth=orbit===0 ? 1.1 : .7; ctx.stroke();
    const a=rotationY*.8+orbit*2.1,tilt=.45+orbit*.62;
    const point=project([Math.cos(a)*1.34,Math.sin(a)*Math.sin(tilt)*1.34,Math.sin(a)*Math.cos(tilt)*1.34],radius);
    ctx.fillStyle='#617ced'; ctx.beginPath(); ctx.arc(point.x,point.y,3.2,0,TAU); ctx.fill();
  }
  ctx.fillStyle='rgba(84,112,236,.75)'; ctx.beginPath(); ctx.arc(width*.53,height*.48,6,0,TAU);ctx.fill();
}
function resizeCore() {
  const rect=canvas.getBoundingClientRect();
  width=rect.width; height=rect.height;
  const dpr=Math.min(window.devicePixelRatio||1,1.5);
  canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
  if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
  drawCore();
}
function animateCore(now) {
  frame=0;
  if(motionPaused || !coreVisible || document.hidden || !ctx) return;
  const delta=Math.min(40,now-(lastFrame||now));lastFrame=now;
  if(!drag)rotationY+=delta*.00008;
  drawCore();
  frame=requestAnimationFrame(animateCore);
}
function syncAnimation() {
  cancelAnimationFrame(frame); frame=0; lastFrame=0;
  document.body.classList.toggle('motion-paused',motionPaused);
  byId('motion-toggle').setAttribute('aria-pressed',String(motionPaused));
  byId('motion-toggle').setAttribute('aria-label',motionPaused ? 'Resume decorative motion' : 'Pause decorative motion');
  byId('motion-icon').textContent=motionPaused ? '▷' : 'Ⅱ';
  drawCore();
  if(!motionPaused && coreVisible && !document.hidden && ctx)frame=requestAnimationFrame(animateCore);
}
byId('motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;syncAnimation();});
reducedMotion.addEventListener('change',()=>{motionPaused=reducedMotion.matches;syncAnimation();});
document.addEventListener('visibilitychange',syncAnimation);
if(window.ResizeObserver)new ResizeObserver(resizeCore).observe(canvas); else window.addEventListener('resize',resizeCore);
if(window.IntersectionObserver)new IntersectionObserver(entries=>{coreVisible=entries[0].isIntersecting;syncAnimation();},{threshold:.05}).observe(canvas);
canvas.addEventListener('pointerdown',event=>{
  if(event.pointerType==='touch')return; // Preserve ordinary touch scrolling.
  drag={x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove',event=>{
  if(!drag)return;
  rotationY+=(event.clientX-drag.x)*.008;
  rotationX=Math.max(-1.1,Math.min(1.1,rotationX+(event.clientY-drag.y)*.006));
  drag={x:event.clientX,y:event.clientY};drawCore();
});
const stopDrag=()=>{drag=null;};
canvas.addEventListener('pointerup',stopDrag);canvas.addEventListener('pointercancel',stopDrag);canvas.addEventListener('lostpointercapture',stopDrag);
function resetCore(){rotationY=.42;rotationX=-.3;drawCore();}
canvas.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft')rotationY-=.18;
  else if(event.key==='ArrowRight')rotationY+=.18;
  else if(event.key==='ArrowUp')rotationX-=.12;
  else if(event.key==='ArrowDown')rotationX+=.12;
  else if(event.key==='Home')resetCore();else return;
  rotationX=Math.max(-1.1,Math.min(1.1,rotationX));event.preventDefault();drawCore();
});
byId('rotate-core').addEventListener('click',()=>{rotationY+=.4;drawCore();});
byId('reset-core').addEventListener('click',resetCore);

// Delegated pointer enhancement: no React state, network, or external runtime.
document.addEventListener('pointermove',event=>{
  if(motionPaused || reducedMotion.matches || event.pointerType==='touch')return;
  const card=event.target.closest('[data-spotlight]');
  all('[data-spotlight]').forEach(item=>{if(item!==card)item.style.setProperty('--glow','0');});
  if(!card)return;
  const rect=card.getBoundingClientRect();
  card.style.setProperty('--spot-x',`${event.clientX-rect.left}px`);
  card.style.setProperty('--spot-y',`${event.clientY-rect.top}px`);
  card.style.setProperty('--glow','1');
},{passive:true});
document.addEventListener('pointerleave',()=>all('[data-spotlight]').forEach(item=>item.style.setProperty('--glow','0')));
let scrollFrame=0;
window.addEventListener('scroll',()=>{
  if(scrollFrame)return;
  scrollFrame=requestAnimationFrame(()=>{
    const maximum=document.documentElement.scrollHeight-window.innerHeight;
    byId('scroll-progress').style.transform=`scaleX(${maximum>0 ? window.scrollY/maximum : 0})`;
    scrollFrame=0;
  });
},{passive:true});
const menu=byId('menu-toggle');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');byId('navigation').classList.remove('is-open');}
menu.addEventListener('click',()=>{
  const expanded=menu.getAttribute('aria-expanded')!=='true';
  menu.setAttribute('aria-expanded',String(expanded));
  menu.setAttribute('aria-label',expanded ? 'Close navigation' : 'Open navigation');
  byId('navigation').classList.toggle('is-open',expanded);
});
all('#navigation a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
renderScenario();renderJournal();renderRisk();resizeCore();syncAnimation();
