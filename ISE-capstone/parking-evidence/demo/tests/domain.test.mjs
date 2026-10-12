import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTORS as A, createState, execute, calculateFee, visibleStays } from '../src/domain.js';
import { preparedPayment, successEvent, counterexamples, recoveryExperiment } from '../src/experiments.js';
import { readState, validateSnapshot } from '../src/store.js';
const rejects = (fn, code) => assert.throws(fn, e => e.code === code);
const act = (s, c, a = A.attendant) => execute(s, a, c);
for (const [seconds, rate, n, d, hours, fen] of [
  [0,1000,1,1,0,0], [1,1000,1,1,1,1000], [3599,1000,1,1,1,1000],
  [3600,1000,1,1,1,1000], [3601,1000,1,1,2,2000], [1,1,3,2,1,2],
  [1,1,1,3,1,0], [3600,1000,3,2,1,1500], [90000,1000,1,1,25,25000]]) {
  test(`independent money oracle ${seconds}/${rate}/${n}/${d}`, () => assert.deepEqual(calculateFee(seconds,rate,n,d), { seconds, hours, fen }));
}
test('reject floats, negative duration, invalid coefficient and overflow', () => {
  for (const args of [[-1], [1.1], [1, 0.5], [1,1000,0,1], [1,1000,1,0]]) rejects(() => calculateFee(...args), 'INVALID_FEE_INPUT');
  rejects(() => calculateFee(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), 'AMOUNT_OVERFLOW');
});
test('denied action leaves input exactly unchanged', () => {
  const s = createState(); const before = JSON.stringify(s);
  rejects(() => act(s, { type: 'EXIT', stayId:'S1', version:0 }), 'PAYMENT_REQUIRED');
  assert.equal(JSON.stringify(s), before);
});
test('same entry key is idempotent; changed input conflicts', () => {
  const c = { type:'ENTER', token:'DEMO-202', owner:'BOB', key:'ENTRY1' };
  const first=act(createState(),c); const again=act(first.state,c);
  assert.equal(again.result.id, first.result.id); assert.equal(again.state.stays.length,2);
  rejects(()=>act(again.state,{...c, token:'DEMO-203'}),'IDEMPOTENCY_CONFLICT');
});
test('duplicate active vehicle blocked across distinct keys', () => {
  rejects(()=>act(createState(),{type:'ENTER',token:'DEMO-101',owner:'ALICE',key:'new'}),'DUPLICATE_STAY');
});
test('driver and cross-lot principal cannot edit another stay', () => {
  for (const actor of [A.bob, {...A.attendant,lot:'OTHER'}]) rejects(()=>act(createState(),{type:'QUOTE',stayId:'S1',version:0},actor),actor===A.bob?'NOT_FOUND':'FORBIDDEN');
  assert.equal(visibleStays(createState(),A.bob).length,0);
});
test('stale version rejected', () => {
  const c={type:'QUOTE',stayId:'S1',version:0}; const first=act(createState(),c);
  rejects(()=>act(first.state,c),'STALE_VERSION');
});
test('new tariff applies to new stays; existing stay remains normal', () => {
  let s=act(createState(),{type:'TARIFF',policy:'peak'},A.operator).state;
  s=act(s,{type:'ENTER',token:'DEMO-NEW',owner:'BOB',key:'new'}).state;
  assert.equal(s.stays[0].tariff,'T1'); assert.notEqual(s.stays[1].tariff,'T1');
  s=act(s,{type:'ADVANCE',seconds:60}).state;
  const old=act(s,{type:'QUOTE',stayId:'S1',version:0});
  const newer=act(old.state,{type:'QUOTE',stayId:s.stays[1].id,version:0});
  assert.equal(newer.state.quotes[0].fen,2000); assert.equal(newer.state.quotes[1].fen,1500);
});
test('driver cannot change tariff or create entry', () => {
  rejects(()=>act(createState(),{type:'TARIFF',policy:'peak'},A.alice),'FORBIDDEN');
  rejects(()=>act(createState(),{type:'ENTER',token:'DEMO-2',owner:'ALICE',key:'x'},A.alice),'FORBIDDEN');
});
test('expiry instant included, one second later rejected', () => {
  const q=act(createState(),{type:'QUOTE',stayId:'S1',version:0});
  const edge=act(q.state,{type:'ADVANCE',seconds:300}).state;
  assert.equal(act(edge,{type:'PAY',quoteId:q.result.id,key:'edge'},A.alice).result.status,'PENDING');
  const late=act(edge,{type:'ADVANCE',seconds:1}).state;
  rejects(()=>act(late,{type:'PAY',quoteId:q.result.id,key:'late'},A.alice),'QUOTE_EXPIRED');
});
test('client paid flag and amount cannot create success or change quote', () => {
  const q=act(createState(),{type:'QUOTE',stayId:'S1',version:0});
  const p=act(q.state,{type:'PAY',quoteId:q.result.id,key:'p',paid:true,amountFen:1},A.alice);
  assert.equal(p.result.status,'PENDING'); assert.equal(p.state.quotes[0].fen,2000); assert.equal(p.state.stays[0].receipt,null);
});
test('payment retry remains one order, even after reload/expiry', () => {
  const {state,quoteId,paymentId}=preparedPayment();
  const later=act(JSON.parse(JSON.stringify(state)),{type:'ADVANCE',seconds:600}).state;
  const r=act(later,{type:'PAY',quoteId,key:'fixed-payment-key'},A.alice);
  assert.equal(r.result.id,paymentId); assert.equal(r.state.payments.length,1);
});
test('authorization checked before idempotency replay',()=>{
  const {state,quoteId}=preparedPayment();
  rejects(()=>act(state,{type:'PAY',quoteId,key:'fixed-payment-key'},A.bob),'NOT_FOUND');
});
test('pending attempt blocks replacement quote',()=>{
  const {state}=preparedPayment();
  rejects(()=>act(state,{type:'QUOTE',stayId:'S1',version:1}),'PAYMENT_PENDING');
});
for (const [name, patch] of [['amount',{amountFen:2001}],['currency',{currency:'USD'}],['merchant',{merchant:'OTHER'}],['order',{orderId:'OTHER'}]]) {
  test(`provider mismatch: ${name}`,()=>{
    const {state,paymentId}=preparedPayment(); const r=act(state,successEvent(state,paymentId,patch),A.provider);
    assert.equal(r.result.status,'REVIEW_REQUIRED'); assert.equal(r.state.stays[0].receipt,null);
  });
}
test('unverified or browser-issued provider event rejected',()=>{
  const {state,paymentId}=preparedPayment();
  rejects(()=>act(state,successEvent(state,paymentId,{verified:false}),A.provider),'INVALID_PROVIDER');
  rejects(()=>act(state,successEvent(state,paymentId),A.alice),'FORBIDDEN');
});
test('duplicate event settles once; changed payload with same ID rejected',()=>{
  const {state,paymentId}=preparedPayment(); const e=successEvent(state,paymentId);
  const one=act(state,e,A.provider); const two=act(one.state,e,A.provider);
  assert.equal(two.state.stays[0].receipt.id,one.state.stays[0].receipt.id);
  assert.equal(two.state.audit.filter(x=>x.kind==='PAYMENT_CONFIRMED').length,1);
  rejects(()=>act(two.state,{...e,amountFen:1},A.provider),'EVENT_CONFLICT');
});
test('success never downgraded by later failure',()=>{
  const {state,paymentId}=preparedPayment();const s=act(state,successEvent(state,paymentId),A.provider).state;
  const r=act(s,successEvent(s,paymentId,{status:'FAILED',eventId:'late-failure'}),A.provider);
  assert.equal(r.state.payments[0].status,'SUCCEEDED');
});
test('paid within window but delivered late is accepted; late payment reviewed',()=>{
  const {state,paymentId}=preparedPayment();const ontime=successEvent(state,paymentId);
  const later=act(state,{type:'ADVANCE',seconds:360}).state;
  assert.equal(act(later,ontime,A.provider).result.status,'SUCCEEDED');
  assert.equal(act(later,{...ontime,paidAt:later.now},A.provider).result.status,'REVIEW_REQUIRED');
});
test('timeout survives serialized reload and reconciles existing order',()=>{
  const {state,paymentId}=preparedPayment();const timed=act(state,{type:'SIMULATE_PROVIDER',paymentId,outcome:'timeout'}).state;
  assert.equal(timed.payments[0].status,'PENDING');assert.equal(Object.keys(timed.providerOrders).length,1);
  const restored=JSON.parse(JSON.stringify(timed));
  const recovered=act(restored,{type:'RECONCILE',paymentId},A.operator).state;
  assert.equal(recovered.payments.length,1);assert.equal(recovered.payments[0].status,'SUCCEEDED');
});
test('provider unavailable does not turn pending into failure',()=>{
  const {state,paymentId}=preparedPayment();rejects(()=>act(state,{type:'RECONCILE',paymentId}),'PROVIDER_UNAVAILABLE');
  assert.equal(state.payments[0].status,'PENDING');
});
test('exit is separate from payment and requires current version',()=>{
  const {state,paymentId}=preparedPayment();const s=act(state,successEvent(state,paymentId),A.provider).state;
  assert.equal(s.stays[0].state,'SETTLED');assert.equal(s.stays[0].exitedAt,null);
  rejects(()=>act(s,{type:'EXIT',stayId:'S1',version:1}),'STALE_VERSION');
  const closed=act(s,{type:'EXIT',stayId:'S1',version:2}).state;assert.equal(closed.stays[0].state,'CLOSED');
});
test('zero fee requires staff and is idempotent',()=>{
  const entry=act(createState(),{type:'ENTER',token:'DEMO-ZERO',owner:'ALICE',key:'z'});
  const q=act(entry.state,{type:'QUOTE',stayId:entry.result.id,version:0});
  const c={type:'ZERO_SETTLE',quoteId:q.result.id,version:1,key:'zero'};
  rejects(()=>act(q.state,c,A.alice),'FORBIDDEN');
  const one=act(q.state,c);const two=act(one.state,c);assert.equal(one.result.id,two.result.id);
  assert.equal(two.state.payments.length,0);
});
test('free settlement rejects nonzero quote',()=>{
  const q=act(createState(),{type:'QUOTE',stayId:'S1',version:0});
  rejects(()=>act(q.state,{type:'ZERO_SETTLE',quoteId:q.result.id,version:1,key:'zero'}),'NOT_ZERO_FEE');
});
test('storage corruption is surfaced rather than silently replaced',()=>{
  rejects(()=>readState({getItem:()=>'{broken'}),'STORAGE_INVALID');
  rejects(()=>validateSnapshot({schema:2}),'STORAGE_INVALID');
  assert.equal(readState({getItem:()=>null}).stays.length,1);
});
test('classroom counterexample suite and legitimate control detect seeded fault',()=>{
  const run=counterexamples();assert.equal(run.results.length,12);assert.ok(run.results.every(x=>x.pass));
  assert.deepEqual(run.comparison.map(x=>x.seededBaselinePass),[true,false]);
  assert.ok(run.comparison.every(x=>x.guardedPass));
});
test('recovery lab reports synthetic time separately from actual local timings',()=>{
  const r=recoveryExperiment();assert.equal(r.baseline.status,'PENDING');assert.equal(r.intervention.status,'SUCCEEDED');
  assert.equal(r.intervention.settlements,1);assert.equal(r.intervention.orders,1);assert.equal(r.intervention.simulatedRecoverySeconds,15);
  assert.equal(r.localBenchmark.rawMs.length,200);assert.equal(r.localBenchmark.errors,0);
});
