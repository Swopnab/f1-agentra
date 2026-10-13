const assert=require('node:assert/strict'),path=require('node:path');const {chromium}=require('playwright');const {serve}=require('./server.cjs');
(async()=>{const site=await serve(path.resolve(__dirname,'..'));const browser=await chromium.launch({headless:true});try{

for(const [width,height] of [[390,844],[768,1024],[1440,900]]){const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(site.url);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await p.locator('[data-scenario="uncertain"]').click();assert(await p.locator('#discuss-demo').isDisabled());await p.locator('[data-scenario="risk"]').click();assert.equal(await p.locator('#demo-name').textContent(),'Orchard Labs');
await p.locator('.switch-label').click();assert.equal(await p.locator('#demo-score').textContent(),'—');assert(await p.locator('#discuss-demo').isDisabled());await p.locator('.switch-label').click();await p.locator('#discuss-demo').click();assert.equal(await p.locator('#journal-count').textContent(),'1');
await p.locator('#tab-overview').focus();await p.keyboard.press('ArrowRight');assert.equal(await p.locator('#tab-evidence').getAttribute('aria-selected'),'true');await p.keyboard.press('ArrowRight');assert.equal(await p.locator('#tab-journal').getAttribute('aria-selected'),'true');
await p.locator('#reset-demo').click();assert.equal(await p.locator('#journal-count').textContent(),'0');assert.equal(await p.locator('#demo-name').textContent(),'Northstar Systems');
await p.locator('#virtual-budget').fill('1000');await p.locator('#risk-budget').fill('20');assert.equal(await p.locator('#size-output').textContent(),'12.50');assert.match(await p.locator('#allocation-caption').textContent(),/25.0%/);
await p.locator('#research-core').focus();await p.keyboard.press('ArrowRight');await p.keyboard.press('Home');assert.deepEqual(errors,[]);await c.close();}
console.log('PASS fictional scenarios, missing-input handling, keyboard tabs, journal/reset, sizing constraints and three responsive viewports');
}finally{await browser.close();site.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
