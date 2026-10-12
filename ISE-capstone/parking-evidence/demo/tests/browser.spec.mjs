import {test,expect} from '@playwright/test';
const key='ise.parking.evidence.v1';
async function open(page,stage='a4'){await page.goto(`./#${stage}`);await expect(page.locator('h1')).toBeVisible();}
async function quotePay(page){await page.locator('#quote').click();await expect(page.getByTestId('quote-total')).toHaveText('CNY 20.00');await page.locator('#pay').click();await expect(page.getByTestId('payment-status')).toContainText('PENDING');}
test('all six stages render without errors or horizontal overflow',async({page},info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const stage of ['a1','a2','a3','a4','a5','a6']){
    await open(page,stage);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),stage).toBeTruthy();
    await expect(page.locator(`.stage-link[href="#${stage}"]`)).toHaveAttribute('aria-current','page');
  }
  await open(page,'a1');await page.screenshot({path:`evidence/${info.project.name}-overview.png`,fullPage:true,animations:'disabled'});
  expect(errors).toEqual([]);
});
test('normal workflow quotes, confirms receipt, closes and survives reload',async({page},info)=>{
  await open(page);await quotePay(page);await page.locator('#sim-success').click();
  await expect(page.getByTestId('receipt')).toContainText('CNY 20.00');
  await expect(page.getByTestId('receipt')).toContainText('Physical exit has not been recorded');
  await page.screenshot({path:`evidence/${info.project.name}-receipt.png`,fullPage:true,animations:'disabled'});
  await page.locator('#exit').click();await expect(page.getByTestId('receipt')).toContainText('Exit recorded');
  await page.reload();await expect(page.getByTestId('receipt')).toContainText('Exit recorded');
  const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  expect(s.stays[0].state).toBe('CLOSED');expect(s.payments).toHaveLength(1);expect(s.stays[0].receipt.amountFen).toBe(2000);
});
test('accepted timeout stays pending, alerts, reloads and reconciles once',async({page})=>{
  await open(page);await quotePay(page);await page.locator('#sim-timeout').click();
  await expect(page.getByTestId('payment-status')).toContainText('PENDING');await expect(page.getByTestId('receipt')).toHaveCount(0);
  await page.locator('#advance-minute').click();await page.locator('#advance-minute').click();
  await expect(page.getByText('Pending-age alert:')).toBeVisible();await page.reload();
  await page.locator('#reconcile').click();await expect(page.getByTestId('receipt')).toBeVisible();
  const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  expect(s.payments).toHaveLength(1);expect(Object.keys(s.providerOrders)).toHaveLength(1);
  expect(s.audit.filter(x=>x.kind==='PAYMENT_CONFIRMED')).toHaveLength(1);
});
test('wrong amount requires review and cannot close stay',async({page})=>{
  await open(page);await quotePay(page);await page.locator('#sim-mismatch').click();
  await expect(page.getByText('Operator review required.')).toBeVisible();
  await expect(page.getByTestId('receipt')).toHaveCount(0);await expect(page.locator('#exit')).toHaveCount(0);
});
test('driver scoping and stale mutation denial are observable',async({page})=>{
  await open(page);await page.locator('#actor').selectOption('bob');
  await expect(page.getByText('No stay is visible to this role.')).toBeVisible();await expect(page.locator('#token')).toBeDisabled();
  await page.locator('#actor').selectOption('alice');await page.locator('#quote').click();
  const code=await page.evaluate(async()=>{
    const {commit}=await import('./src/store.js');const {ACTORS}=await import('./src/domain.js');
    try{await commit(ACTORS.alice,{type:'QUOTE',stayId:'S1',version:0});return 'accepted';}catch(e){return e.code;}
  });expect(code).toBe('STALE_VERSION');
});
test('concurrent tabs serialize duplicate entries and payment retries',async({page,context})=>{
  await open(page);const other=await context.newPage();await open(other);
  const enter=async p=>p.evaluate(async()=>{
    const {commit}=await import('./src/store.js');const {ACTORS}=await import('./src/domain.js');
    return (await commit(ACTORS.attendant,{type:'ENTER',token:'DEMO-RACE',owner:'ALICE',key:'same-race'})).result.id;
  });
  const ids=await Promise.all([enter(page),enter(other)]);expect(ids[0]).toBe(ids[1]);
  await page.reload();await quotePay(page);
  const pay=async p=>p.evaluate(async()=>{
    const {commit,readState}=await import('./src/store.js');const {ACTORS}=await import('./src/domain.js');
    const q=readState().stays[0].quoteId;
    return (await commit(ACTORS.alice,{type:'PAY',quoteId:q,key:'concurrent-pay'})).result.id;
  });
  const payments=await Promise.all([pay(page),pay(other)]);expect(payments[0]).toBe(payments[1]);
  const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  expect(s.stays.filter(x=>x.token==='DEMO-RACE')).toHaveLength(1);expect(s.payments).toHaveLength(1);
});
test('independent labs execute and exported evidence includes raw samples',async({page})=>{
  await open(page,'a5');await page.locator('#run-counterexamples').click();await expect(page.getByText('12/12')).toBeVisible();
  await page.locator('a.stage-link[href="#a6"]').click();await page.locator('#run-recovery').click();
  await expect(page.getByText('15 simulated seconds',{exact:true})).toBeVisible();
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export local evidence',exact:true}).click();
  const download=await downloadPromise;expect(download.suggestedFilename()).toMatch(/^parking-evidence-.*\.json$/);
  const stream=await download.createReadStream();let body='';for await(const chunk of stream)body+=chunk;
  const bundle=JSON.parse(body);expect(bundle.state.labRuns).toHaveLength(2);expect(bundle.state.labRuns[1].localBenchmark.rawMs).toHaveLength(200);
  expect(bundle.state.payments).toHaveLength(0); // Isolated experiments never change the live workflow.
});
test('notes are stored as text, with no script execution; fee boundary works',async({page})=>{
  await open(page,'a1');await page.getByText('Add a local learning note').click();
  await page.locator('#evidence-note').fill('<img src=x onerror="window.injected=true">');await page.getByRole('button',{name:'Save note locally'}).click();
  await expect(page.locator('td').filter({hasText:'<img src=x onerror='})).toBeVisible();
  expect(await page.evaluate(()=>window.injected)).toBeUndefined();
  await page.locator('a.stage-link[href="#a2"]').click();await page.locator('#duration').fill('3600');
  await page.getByRole('button',{name:'Calculate exact fee'}).click();await expect(page.locator('#fee-result')).toContainText('CNY 10.00');await expect(page.locator('#duration')).toHaveValue('3600');
});
test('bad saved data is surfaced and reset is explicit',async({page})=>{
  await open(page);await page.evaluate(k=>localStorage.setItem(k,'{corrupt'),key);await page.reload();
  await expect(page.getByRole('heading',{name:'Saved lab unavailable'})).toBeVisible();
  page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Reset local demo data',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Saved lab unavailable'})).toHaveCount(0);await expect(page.locator('#quote')).toBeVisible();
});
test('operator policy change affects new arrival while original tariff is preserved',async({page})=>{
  await open(page);await page.locator('#actor').selectOption('operator');await page.locator('#tariff-peak').click();
  await page.locator('#token').fill('DEMO-PEAK');await page.locator('#owner').selectOption('BOB');
  await page.getByRole('button',{name:'Record entry',exact:true}).click();await page.locator('#advance-minute').click();
  await page.locator('#quote').click();await expect(page.getByTestId('quote-total')).toHaveText('CNY 15.00');
  await page.locator('#actor').selectOption('alice');await page.locator('#quote').click();
  await expect(page.getByTestId('quote-total')).toHaveText('CNY 20.00');
});
test('value worksheet retains inputs and labels unverified improvement',async({page})=>{
  await open(page,'a6');await page.locator('#baseline-time').fill('100');await page.locator('#candidate-time').fill('120');
  await page.getByRole('button',{name:'Compare these inputs'}).click();
  await expect(page.getByText('20.0% more time (negative improvement)',{exact:true})).toBeVisible();
  await expect(page.locator('#baseline-time')).toHaveValue('100');await expect(page.locator('#candidate-time')).toHaveValue('120');
  await expect(page.getByText('FIELD VALUE UNVALIDATED',{exact:true})).toBeVisible();
});
