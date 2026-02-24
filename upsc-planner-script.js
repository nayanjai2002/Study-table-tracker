'use strict';
/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const COLORS=['#3b7dd8','#d94f3d','#2e9e5b','#e07a2a','#7c5cbf','#1e9b8a','#c89520','#e84393','#5a7fbf','#8b6914'];
const ICONS=['⚖️','📈','🗺️','🔁','📝','🧮','💡','📖','🏛️','🎯','📊','✏️','🏆','🔬','💰','🌍','⚡','🎓','📋','🗞️'];
const SK='ias6_data', SP='ias6_prog', SC='ias6_conf';

// Page detection: set dynamically by each HTML file
let isManagePage = false;

/* ══════════════════════════════════════════
   DEFAULT DATA
══════════════════════════════════════════ */
const DEF_SUBJ=[
  {id:'pol',  name:'Polity',         color:'#d94f3d', icon:'⚖️',  defaultHrs:3},
  {id:'eco',  name:'Economy',        color:'#2e9e5b', icon:'📈',  defaultHrs:3},
  {id:'geo',  name:'Geography',      color:'#3b7dd8', icon:'🗺️',  defaultHrs:3},
  {id:'csat', name:'CSAT',           color:'#7c5cbf', icon:'🧮',  defaultHrs:2},
  {id:'test', name:'Test Analysis',  color:'#e07a2a', icon:'📝',  defaultHrs:1.5},
  {id:'rev',  name:'Revision',       color:'#1e9b8a', icon:'🔁',  defaultHrs:1.5},
  {id:'cur',  name:'Current Affairs',color:'#c89520', icon:'🗞️',  defaultHrs:1},
];
const DEF_DAYS=[
  {id:'d1',title:'Polity + CSAT Start',dateOverride:null,targetHrs:9,blocks:[
    {id:'b1a',subjectId:'pol', targetHrs:3,  topic:'Historical Background of Constitution',subtopics:['Sources of Indian Constitution','Regulating Act 1773','Charter Acts 1813–1853','Government of India Acts','Independence Act 1947']},
    {id:'b1b',subjectId:'csat',targetHrs:2,  topic:'CSAT Paper 2 Practice',subtopics:['Reading comprehension set 1','Logical reasoning puzzles','Data interpretation basics']},
    {id:'b1c',subjectId:'cur', targetHrs:1,  topic:'Current Affairs',subtopics:['The Hindu editorial reading','PIB highlights','Monthly magazine review']},
    {id:'b1d',subjectId:'rev', targetHrs:1.5,topic:'Previous week revision',subtopics:['Flashcard review','Mind map update']},
  ]},
  {id:'d2',title:'Polity + Economy Day',dateOverride:null,targetHrs:9,blocks:[
    {id:'b2a',subjectId:'pol', targetHrs:3,  topic:'Fundamental Rights (Part III)',subtopics:['Art 12–13: State & Laws','Art 14–18: Right to Equality','Art 19–22: Right to Freedom','Art 23–24: Against Exploitation','Art 25–28: Religion','Art 32: Remedies']},
    {id:'b2b',subjectId:'eco', targetHrs:3,  topic:'Basic Economic Concepts',subtopics:['GDP, GNP, NNP formulas','Nominal vs Real GDP','Types of inflation (CPI, WPI)','Monetary aggregates M0–M3']},
    {id:'b2c',subjectId:'cur', targetHrs:1,  topic:'Current Affairs',subtopics:['The Hindu editorial','Economic survey highlights']},
    {id:'b2d',subjectId:'rev', targetHrs:1.5,topic:'Revision Day 1 content',subtopics:['Polity revision','Constitution sources recap']},
  ]},
  {id:'d3',title:'Polity + Geography + CSAT',dateOverride:null,targetHrs:10,blocks:[
    {id:'b3a',subjectId:'pol', targetHrs:3,  topic:'DPSP, Duties & Amendments',subtopics:['Nature of DPSPs (non-justiciable)','Gandhian, Socialist, Liberal principles','Art 51A: 11 Fundamental Duties','Key amendments: 42nd, 44th, 86th, 101st','Basic Structure Doctrine']},
    {id:'b3b',subjectId:'geo', targetHrs:3,  topic:'Physiography of India',subtopics:['Himalayan ranges & formation','Northern Plains','Peninsular Plateau & Western Ghats','Coastal plains & island groups']},
    {id:'b3c',subjectId:'csat',targetHrs:2,  topic:'CSAT Reasoning',subtopics:['Series & analogies','Coding-decoding','Blood relations','Syllogisms']},
    {id:'b3d',subjectId:'cur', targetHrs:1,  topic:'Current Affairs',subtopics:['News analysis','Yojana reading']},
    {id:'b3e',subjectId:'rev', targetHrs:1,  topic:'Revision',subtopics:['Economy recap','Polity recap']},
  ]},
  {id:'d4',title:'Test + Analysis Day',dateOverride:null,targetHrs:8,blocks:[
    {id:'b4a',subjectId:'test',targetHrs:3,  topic:'Full Mock Test (GS)',subtopics:['100 MCQ timed attempt','Mark difficult questions','Rough score estimate']},
    {id:'b4b',subjectId:'test',targetHrs:1.5,topic:'Test Analysis',subtopics:['Review each wrong answer','Identify weak chapters','Category-wise error analysis']},
    {id:'b4c',subjectId:'eco', targetHrs:2,  topic:'Banking & RBI',subtopics:['Functions of RBI','Monetary Policy: Repo, CRR, SLR','Priority Sector Lending','NPA & IBC resolution']},
    {id:'b4d',subjectId:'cur', targetHrs:1,  topic:'Current Affairs',subtopics:['The Hindu editorial']},
  ]},
  {id:'d5',title:'Polity + Geography + CSAT Maths',dateOverride:null,targetHrs:9,blocks:[
    {id:'b5a',subjectId:'pol', targetHrs:3,  topic:'Parliament & Executive',subtopics:['Lok Sabha & Rajya Sabha','Sessions & Budget process','Parliamentary procedures','President powers (Art 52–78)','PM & Council of Ministers']},
    {id:'b5b',subjectId:'geo', targetHrs:3,  topic:'Climate, Monsoon & Soils',subtopics:['Factors affecting India\'s climate','Southwest & Northeast Monsoon','El Niño & La Niña effects','Types of soils: Alluvial, Black, Red, Laterite']},
    {id:'b5c',subjectId:'csat',targetHrs:1.5,topic:'CSAT Maths',subtopics:['Percentages & ratio','Time-speed-distance','Profit & loss','Number system']},
    {id:'b5d',subjectId:'rev', targetHrs:1.5,topic:'Weekly Revision',subtopics:['Polity days 1–5 recap','Economy concepts','Geography flashcards']},
  ]},
  {id:'d6',title:'Economy + Geography Focus',dateOverride:null,targetHrs:10,blocks:[
    {id:'b6a',subjectId:'eco', targetHrs:3,  topic:'Fiscal Policy & External Sector',subtopics:['Union Budget components','Fiscal, Revenue & Primary Deficit','FRBM Act','Balance of Payments','IMF, World Bank, WTO']},
    {id:'b6b',subjectId:'geo', targetHrs:3,  topic:'Minerals, Industries & Disaster',subtopics:['Iron, Coal, Bauxite distribution','Non-conventional energy','Major industries & regions','Disaster Management Act 2005','Sendai Framework']},
    {id:'b6c',subjectId:'csat',targetHrs:1,  topic:'CSAT Mock Set',subtopics:['20-question practice set','Review answers']},
    {id:'b6d',subjectId:'cur', targetHrs:1,  topic:'Current Affairs',subtopics:['Weekly current affairs wrap-up']},
    {id:'b6e',subjectId:'pol', targetHrs:2,  topic:'Constitutional Bodies',subtopics:['UPSC (Art 315–323)','Election Commission (Art 324)','CAG (Art 148–151)','Finance Commission (Art 280)']},
  ]},
  {id:'d7',title:'Light Day — Revision Focus',dateOverride:null,targetHrs:7,blocks:[
    {id:'b7a',subjectId:'rev', targetHrs:3,  topic:'Full Week Revision',subtopics:['Polity: all topics recap','Economy: key concepts','Geography: maps & facts','CSAT: formula sheet review']},
    {id:'b7b',subjectId:'test',targetHrs:1.5,topic:'Sectional Test',subtopics:['30 Polity MCQs','Mark & review wrong answers']},
    {id:'b7c',subjectId:'cur', targetHrs:1.5,topic:'Current Affairs Wrap-up',subtopics:['Weekly news summary','Important schemes list']},
    {id:'b7d',subjectId:'csat',targetHrs:1,  topic:'Light CSAT Practice',subtopics:['10 reasoning questions','Review errors']},
  ]},
];

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
let subj=[], days=[], prog={}, conf={startDate:null,dark:false};
let curDay=0;
let timers={};
let editSubjId=null, editDayId=null, bpDayId=null, bpSelSubjId=null;
let modalBlocks=[];
let selColor=COLORS[0], selIcon=ICONS[0];

function load(){
  try{const d=JSON.parse(localStorage.getItem(SK));if(d&&d.subj&&d.days){subj=d.subj;days=d.days;}else defReset();}catch{defReset();}
  try{prog=JSON.parse(localStorage.getItem(SP))||{};}catch{prog={};}
  try{const c=JSON.parse(localStorage.getItem(SC));if(c)conf={...conf,...c};}catch{}
  if(!conf.startDate){const n=new Date();n.setHours(0,0,0,0);conf.startDate=n.toISOString();}
  const today=new Date();today.setHours(0,0,0,0);
  for(let i=0;i<days.length;i++){if(getDd(i).getTime()===today.getTime()){curDay=i;break;}}
}
function defReset(){subj=JSON.parse(JSON.stringify(DEF_SUBJ));days=JSON.parse(JSON.stringify(DEF_DAYS));}
function sd(){localStorage.setItem(SK,JSON.stringify({subj,days}));}
function sp(){localStorage.setItem(SP,JSON.stringify(prog));}
function sc(){localStorage.setItem(SC,JSON.stringify(conf));}
function gp(bid){if(!prog[bid])prog[bid]={subtopics:{},customTasks:[],notes:'',timeSpent:0};return prog[bid];}
function getDd(i){const d=days[i];if(d?.dateOverride)return new Date(d.dateOverride);const dt=new Date(conf.startDate);dt.setDate(dt.getDate()+i);return dt;}
function isToday(d){const t=new Date();t.setHours(0,0,0,0);return d.getTime()===t.getTime();}
function fd(d){return d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});}
function gid(){return 'b'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);}
function sj(id){return subj.find(s=>s.id===id)||{name:'?',color:'#888',icon:'❓',defaultHrs:2};}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function bPct(bid,sts){
  const p=gp(bid);
  const tot=sts.length+(p.customTasks?.length||0);
  if(!tot)return 100;
  return Math.round((sts.filter((_,j)=>p.subtopics[j]).length+(p.customTasks||[]).filter(t=>t.done).length)/tot*100);
}
function dPct(i){
  const d=days[i];if(!d||!d.blocks.length)return 0;
  return Math.round(d.blocks.reduce((s,b)=>s+bPct(b.id,b.subtopics),0)/d.blocks.length);
}
function dLogHrs(i){
  return days[i]?.blocks.reduce((s,b)=>{
    const p=gp(b.id);let sec=p.timeSpent||0;
    if(timers[b.id]?.running)sec+=Math.floor((Date.now()-timers[b.id].start)/1000);
    return s+sec;
  },0)/3600||0;
}
function dPlannedHrs(i){return days[i]?.blocks.reduce((s,b)=>s+(b.targetHrs||0),0)||0;}

/* ══════════════════════════════════════════
   STATS
══════════════════════════════════════════ */
function renderStats(){
  const tot=days.length, done=days.filter((_,i)=>dPct(i)===100).length;
  let streak=0;const today=new Date();today.setHours(0,0,0,0);
  for(let i=0;i<days.length;i++){const dd=getDd(i);if(dd>today)break;if(dPct(i)===100)streak++;else streak=0;}
  const totalSec=days.reduce((s,d)=>s+d.blocks.reduce((ss,b)=>ss+(gp(b.id).timeSpent||0),0),0);
  const th=Math.floor(totalSec/3600),tm=Math.floor((totalSec%3600)/60);
  const todayI=days.findIndex((_,i)=>isToday(getDd(i)));
  const todayLog=todayI>=0?dLogHrs(todayI).toFixed(1):0;
  const todayTgt=todayI>=0?(days[todayI].targetHrs||9):9;
  document.getElementById('statsRow').innerHTML=`
    <div class="stat-card"><div class="stat-label">Progress</div><div class="stat-value">${tot?Math.round(done/tot*100):0}%</div><div class="stat-sub">${done}/${tot} days done</div></div>
    <div class="stat-card"><div class="stat-label">🔥 Streak</div><div class="stat-value" style="color:var(--orange)">${streak}</div><div class="stat-sub">days in a row</div></div>
    <div class="stat-card"><div class="stat-label">⏱ Time</div><div class="stat-value" style="color:var(--green)">${th?th+'h '+tm+'m':tm+'m'}</div><div class="stat-sub">total logged</div></div>
    <div class="stat-card"><div class="stat-label">📅 Today</div><div class="stat-value" style="color:var(--purple)">${todayLog}h</div><div class="stat-sub">of ${todayTgt}h target</div></div>`;
  renderHoursBar();
}

function renderHoursBar(){
  const d=days[curDay];
  if(!d){document.getElementById('hoursBar').innerHTML='<div style="font-size:13px;color:var(--ink3)">No day selected</div>';return;}
  const target=d.targetHrs||9;
  const planned=dPlannedHrs(curDay);
  const logged=dLogHrs(curDay);
  const logH=Math.floor(logged),logM=Math.round((logged-logH)*60);
  const logStr=`${logH}h ${String(logM).padStart(2,'0')}m`;
  let st='low',stTxt=`↑ Keep going (${logStr} / ${target}h)`;
  if(logged>=target){st='done';stTxt=`🎯 Target met! (${logStr})`;}
  else if(logged>=target*.5){st='ok';stTxt=`✓ On track (${logStr} / ${target}h)`;}
  const segs=d.blocks.map(b=>{
    const s=sj(b.subjectId);
    const pct=Math.min((b.targetHrs/target)*100,100);
    const fillOpacity=0.45+Math.min((gp(b.id).timeSpent||0)/3600/b.targetHrs,.55)*.55;
    const lbl=pct>10?`${s.icon} ${b.targetHrs}h`:'';
    return `<div class="hb-seg" style="width:${pct}%;background:${s.color};opacity:${fillOpacity}" title="${s.name}: ${b.targetHrs}h">${lbl}</div>`;
  }).join('');
  const legend=d.blocks.map(b=>{const s=sj(b.subjectId);return `<div class="hb-leg-item"><div class="hb-leg-dot" style="background:${s.color}"></div>${s.icon} ${s.name}: <strong>${b.targetHrs}h</strong></div>`;}).join('');
  document.getElementById('hoursBar').innerHTML=`
    <div class="hb-top">
      <div class="hb-title">Day ${curDay+1} Hours Plan</div>
      <span class="hb-status ${st}">${stTxt}</span>
      <div class="hb-meta">Planned: <strong>${planned}h</strong> · Target: <strong>${target}h</strong></div>
    </div>
    <div class="hb-track">${segs||'<div style="padding:4px 10px;font-size:11px;color:var(--ink3)">No subjects</div>'}</div>
    <div class="hb-legend">${legend}</div>`;
}

/* ══════════════════════════════════════════
   DAILY VIEW
══════════════════════════════════════════ */
function renderDaily(){
  renderTodayBanner();
  renderNavLabel();
  renderDots();
  renderDayContent();
}

function renderTodayBanner(){
  const ti=days.findIndex((_,i)=>isToday(getDd(i)));
  const el=document.getElementById('todayBanner');
  if(ti<0){el.style.display='none';return;}
  el.style.display='flex';
  const d=days[ti],s=sj(d.blocks[0]?.subjectId||'');
  el.innerHTML=`<div style="font-size:22px">${s.icon}</div>
    <div class="tb-text"><div class="tb-title">Today — Day ${ti+1}${d.title?' · '+esc(d.title):''}</div><div class="tb-sub">${fd(getDd(ti))} · ${dPct(ti)}% complete · ${dPlannedHrs(ti)}h planned</div></div>
    <button class="goto-btn" onclick="jumpTo(${ti})">Go ›</button>`;
}

function renderNavLabel(){
  if(!days.length){document.getElementById('navLabel').textContent='No days';return;}
  const d=days[curDay];
  document.getElementById('navLabel').innerHTML=`Day ${curDay+1}${d.title?' — '+esc(d.title):''}<span class="nav-date">${fd(getDd(curDay))}</span>`;
}

function renderDots(){
  document.getElementById('dayDots').innerHTML=days.map((_,i)=>{
    const p=dPct(i);
    let c='dot';
    if(p===100)c+=' done';else if(p>0)c+=' partial';
    if(isToday(getDd(i)))c+=' today';
    if(i===curDay)c+=' active';
    return `<div class="${c}" onclick="jumpTo(${i})" title="Day ${i+1} — ${p}%">${i+1}</div>`;
  }).join('');
}

function renderDayContent(){
  if(!days.length){
    document.getElementById('dayContent').innerHTML=`<div class="empty-state"><div class="es-icon">📋</div><p>No days yet. Go to <strong>Manage</strong> to build your plan.</p></div>`;
    return;
  }
  const day=days[curDay];
  let html=`<div class="day-meta">
    <div class="day-badge" style="background:${sj(day.blocks[0]?.subjectId).color||'var(--blue)'}">${curDay+1}</div>
    <div class="day-meta-info">
      <div class="day-title-input" style="font-size:15px;font-weight:700;color:var(--ink);border:none;background:transparent;padding:0;margin:0">${esc(day.title||'Untitled Day')}</div>
      <div class="day-meta-row">
        <div style="font-size:12px;color:var(--ink3);padding:3px 0">${fd(getDd(curDay))}</div>
        <div class="target-ctrl">Target: <strong id="tgt-${day.id}">${day.targetHrs||9}h</strong></div>
      </div>
    </div>
    <button class="add-block-btn" style="background:#3b7dd820;color:var(--blue)" onclick="window.location='upsc-planner-manage.html'">⚙️ Manage Plan</button>
  </div>
  <div class="day-blocks">`;
  day.blocks.forEach((b,bi)=>{ html+=buildBlockReadOnly(day.id,b,bi); });
  html+='</div>';
  document.getElementById('dayContent').innerHTML=html;
}

function buildBlockReadOnly(dayId,block,bi){
  const s=sj(block.subjectId);
  const p=gp(block.id);
  const pct=bPct(block.id,block.subtopics);
  const circ=2*Math.PI*15;
  const offset=circ-(pct/100)*circ;
  const sec=p.timeSpent||0;
  const extra=timers[block.id]?.running?Math.floor((Date.now()-timers[block.id].start)/1000):0;
  const tot=sec+extra;
  const th=Math.floor(tot/3600),tm=Math.floor((tot%3600)/60),ts=tot%60;
  const tStr=`${String(th).padStart(2,'0')}:${String(tm).padStart(2,'0')}:${String(ts).padStart(2,'0')}`;
  const isRun=!!timers[block.id]?.running;
  const barW=Math.min((tot/3600/block.targetHrs)*100,100);
  const stHtml=block.subtopics.map((st,j)=>{
    const done=!!p.subtopics[j];
    return `<div class="st-row ${done?'done':''}">
      <div class="st-check ${done?'on':''}" onclick="toggleST('${block.id}',${j},'${dayId}')">${done?'✓':''}</div>
      <input class="st-text" value="${esc(st)}" onchange="editST('${dayId}','${block.id}',${j},this.value)">
      <button class="st-del" onclick="delST('${dayId}','${block.id}',${j})">✕</button>
    </div>`;
  }).join('');
  const ctHtml=(p.customTasks||[]).map((ct,j)=>`
    <div class="st-row ${ct.done?'done':''}">
      <div class="st-check ${ct.done?'on':''}" onclick="toggleCT('${block.id}',${j},'${dayId}')">${ct.done?'✓':''}</div>
      <input class="st-text" value="${esc(ct.text)}" onchange="editCT('${block.id}',${j},this.value)">
      <button class="st-del" onclick="delCT('${block.id}',${j},'${dayId}')">✕</button>
    </div>`).join('');
  return `<div class="block-card" id="sb-${block.id}" style="border-left-color:${s.color}">
    <div class="block-head" onclick="toggleBlock('${block.id}')">
      <div class="block-icon" style="background:${s.color}20">${s.icon}</div>
      <div class="block-info">
        <div class="block-name" style="color:${s.color}">${s.name}</div>
        <div class="block-subtitle">${pct}% · ${Math.round(tot/360)/10}/${block.targetHrs}h · ${esc(block.topic||'No topic set')}</div>
      </div>
      <div class="block-right">
        <div class="hrs-widget">
          <div style="text-align:center">
            <div class="hw-val" style="color:${s.color}" id="bhv-${block.id}">${block.targetHrs}h</div>
            <div class="hw-lbl">target</div>
          </div>
        </div>
        <div class="mini-ring">
          <svg class="mr-svg" width="36" height="36" viewBox="0 0 36 36">
            <circle class="mr-bg" cx="18" cy="18" r="15"/>
            <circle class="mr-fg" cx="18" cy="18" r="15" stroke="${s.color}"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="mr-label">${pct}%</div>
        </div>
        <div class="chevron" id="chev-${block.id}">▼</div>
      </div>
    </div>
    <div class="block-timer">
      <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3)">⏱</span>
      <div class="timer-display" id="td-${block.id}">${tStr}</div>
      <button class="timer-start ${isRun?'running':'idle'}" id="tbtn-${block.id}" onclick="toggleTimer('${block.id}','${dayId}')">${isRun?'⏸ Pause':'▶ Start'}</button>
      <div class="manual-add">
        <input class="manual-inp" type="number" id="mi-${block.id}" placeholder="min" min="1">
        <button class="manual-btn" onclick="addManTime('${block.id}','${dayId}')">+Add</button>
      </div>
      <div class="target-badge">Target: <strong>${block.targetHrs}h</strong></div>
      <div class="timer-bar-wrap"><div class="timer-bar-fill" id="tbar-${block.id}" style="background:${s.color};width:${barW}%"></div></div>
    </div>
    <div class="block-body" id="sbb-${block.id}">
      <div class="sect-label">📌 Topic</div>
      <div style="font-size:13px;color:var(--ink);padding:9px 12px;background:var(--bg2);border-radius:var(--radius-sm);margin-bottom:12px">${esc(block.topic||'No topic set')}</div>
      <div class="sect-label">📋 Sub-topics</div>
      <div class="st-list" id="stl-${block.id}">${stHtml||'<div style="font-size:12px;color:var(--ink3);padding:4px 0">No sub-topics yet.</div>'}</div>
      <div class="add-row">
        <input class="add-inp" id="nst-${block.id}" placeholder="Add sub-topic…" onkeydown="if(event.key==='Enter')addST('${dayId}','${block.id}')">
        <button class="add-btn" onclick="addST('${dayId}','${block.id}')">Add</button>
      </div>
      <div class="sect-label" style="margin-top:10px">✏️ Custom Tasks</div>
      <div class="st-list">${ctHtml||'<div style="font-size:12px;color:var(--ink3);padding:4px 0">No tasks yet.</div>'}</div>
      <div class="add-row">
        <input class="add-inp" id="nct-${block.id}" placeholder="Add custom task…" onkeydown="if(event.key==='Enter')addCT('${block.id}','${dayId}')">
        <button class="add-btn" onclick="addCT('${block.id}','${dayId}')">Add</button>
      </div>
      <div class="sect-label" style="margin-top:10px">📝 Notes</div>
      <textarea class="notes-area" placeholder="Key points, doubts, next steps…" onblur="gp('${block.id}').notes=this.value;sp()">${esc(p.notes||'')}</textarea>
    </div>
  </div>`;
}

function buildBlock(dayId,block,bi){
  const s=sj(block.subjectId);
  const p=gp(block.id);
  const pct=bPct(block.id,block.subtopics);
  const circ=2*Math.PI*15;
  const offset=circ-(pct/100)*circ;
  const sec=p.timeSpent||0;
  const extra=timers[block.id]?.running?Math.floor((Date.now()-timers[block.id].start)/1000):0;
  const tot=sec+extra;
  const th=Math.floor(tot/3600),tm=Math.floor((tot%3600)/60),ts=tot%60;
  const tStr=`${String(th).padStart(2,'0')}:${String(tm).padStart(2,'0')}:${String(ts).padStart(2,'0')}`;
  const isRun=!!timers[block.id]?.running;
  const barW=Math.min((tot/3600/block.targetHrs)*100,100);
  const stHtml=block.subtopics.map((st,j)=>{
    const done=!!p.subtopics[j];
    return `<div class="st-row ${done?'done':''}">
      <div class="st-check ${done?'on':''}" onclick="toggleST('${block.id}',${j},'${dayId}')">${done?'✓':''}</div>
      <input class="st-text" value="${esc(st)}" onchange="editST('${dayId}','${block.id}',${j},this.value)">
      <button class="st-del" onclick="delST('${dayId}','${block.id}',${j})">✕</button>
    </div>`;
  }).join('');
  const ctHtml=(p.customTasks||[]).map((ct,j)=>`
    <div class="st-row ${ct.done?'done':''}">
      <div class="st-check ${ct.done?'on':''}" onclick="toggleCT('${block.id}',${j},'${dayId}')">${ct.done?'✓':''}</div>
      <input class="st-text" value="${esc(ct.text)}" onchange="editCT('${block.id}',${j},this.value)">
      <button class="st-del" onclick="delCT('${block.id}',${j},'${dayId}')">✕</button>
    </div>`).join('');
  return `<div class="block-card" id="sb-${block.id}" style="border-left-color:${s.color}">
    <div class="block-head" onclick="toggleBlock('${block.id}')">
      <div class="block-icon" style="background:${s.color}20">${s.icon}</div>
      <div class="block-info">
        <div class="block-name" style="color:${s.color}">${s.name}</div>
        <div class="block-subtitle">${pct}% · ${Math.round(tot/360)/10}/${block.targetHrs}h · ${esc(block.topic||'No topic set')}</div>
      </div>
      <div class="block-right">
        <div class="hrs-widget">
          <button class="ctrl-btn" onclick="event.stopPropagation();chBlkHrs('${dayId}','${block.id}',-0.5)">−</button>
          <div style="text-align:center">
            <div class="hw-val" style="color:${s.color}" id="bhv-${block.id}">${block.targetHrs}h</div>
            <div class="hw-lbl">target</div>
          </div>
          <button class="ctrl-btn" onclick="event.stopPropagation();chBlkHrs('${dayId}','${block.id}',0.5)">+</button>
        </div>
        <div class="mini-ring">
          <svg class="mr-svg" width="36" height="36" viewBox="0 0 36 36">
            <circle class="mr-bg" cx="18" cy="18" r="15"/>
            <circle class="mr-fg" cx="18" cy="18" r="15" stroke="${s.color}"
              stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
          </svg>
          <div class="mr-label">${pct}%</div>
        </div>
        <div class="chevron" id="chev-${block.id}">▼</div>
      </div>
    </div>
    <div class="block-timer">
      <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3)">⏱</span>
      <div class="timer-display" id="td-${block.id}">${tStr}</div>
      <button class="timer-start ${isRun?'running':'idle'}" id="tbtn-${block.id}" onclick="toggleTimer('${block.id}','${dayId}')">${isRun?'⏸ Pause':'▶ Start'}</button>
      <div class="manual-add">
        <input class="manual-inp" type="number" id="mi-${block.id}" placeholder="min" min="1">
        <button class="manual-btn" onclick="addManTime('${block.id}','${dayId}')">+Add</button>
      </div>
      <div class="target-badge">Target: <strong>${block.targetHrs}h</strong></div>
      <div class="timer-bar-wrap"><div class="timer-bar-fill" id="tbar-${block.id}" style="background:${s.color};width:${barW}%"></div></div>
    </div>
    <div class="block-body" id="sbb-${block.id}">
      <div class="sect-subj-sel">
        <select class="subj-sel" onchange="chBlkSubj('${dayId}','${block.id}',this.value)">
          ${subj.map(sx=>`<option value="${sx.id}"${sx.id===block.subjectId?' selected':''}>${sx.icon} ${sx.name}</option>`).join('')}
        </select>
      </div>
      <div class="sect-label">📌 Topic <button class="sl-btn" onclick="markAll('${block.id}','${dayId}')">Mark All ✓</button></div>
      <input class="topic-inp" value="${esc(block.topic||'')}" placeholder="Today's topic…" onchange="chBlkTopic('${dayId}','${block.id}',this.value)">
      <div class="sect-label">📋 Sub-topics</div>
      <div class="st-list" id="stl-${block.id}">${stHtml||'<div style="font-size:12px;color:var(--ink3);padding:4px 0">No sub-topics yet.</div>'}</div>
      <div class="add-row">
        <input class="add-inp" id="nst-${block.id}" placeholder="Add sub-topic…" onkeydown="if(event.key==='Enter')addST('${dayId}','${block.id}')">
        <button class="add-btn" onclick="addST('${dayId}','${block.id}')">Add</button>
      </div>
      <div class="sect-label">✏️ Custom Tasks</div>
      <div class="st-list">${ctHtml||'<div style="font-size:12px;color:var(--ink3);padding:4px 0">No tasks yet.</div>'}</div>
      <div class="add-row">
        <input class="add-inp" id="nct-${block.id}" placeholder="Add custom task…" onkeydown="if(event.key==='Enter')addCT('${block.id}','${dayId}')">
        <button class="add-btn" onclick="addCT('${block.id}','${dayId}')">Add</button>
      </div>
      <div class="sect-label" style="margin-top:10px">📝 Notes</div>
      <textarea class="notes-area" placeholder="Key points, doubts, next steps…" onblur="gp('${block.id}').notes=this.value;sp()">${esc(p.notes||'')}</textarea>
    </div>
  </div>`;
}

function toggleBlock(bid){
  document.getElementById('sbb-'+bid)?.classList.toggle('open');
  document.getElementById('chev-'+bid)?.classList.toggle('open');
}
function jumpTo(i){stopAllTimers();curDay=i;renderDaily();renderStats();window.scrollTo({top:0,behavior:'smooth'});}

/* Day edits */
function saveDayDate(id,v){const d=days.find(x=>x.id===id);if(d)d.dateOverride=v?new Date(v).toISOString():null;sd();renderNavLabel();renderDots();}
function changeTgt(id,delta){const d=days.find(x=>x.id===id);if(!d)return;d.targetHrs=+(Math.max(1,Math.min(16,(d.targetHrs||9)+delta)).toFixed(1));sd();const el=document.getElementById('tgt-'+id);if(el)el.textContent=d.targetHrs+'h';renderHoursBar();renderStats();}

/* Block edits */
function chBlkHrs(dayId,bid,delta){
  const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);if(!b)return;
  b.targetHrs=+(Math.max(.5,Math.min(12,b.targetHrs+delta)).toFixed(1));sd();
  const el=document.getElementById('bhv-'+bid);if(el)el.textContent=b.targetHrs+'h';
  renderHoursBar();renderStats();
}
function chBlkSubj(dayId,bid,sid){const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);if(b){b.subjectId=sid;sd();}refreshBlock(dayId,bid);}
function chBlkTopic(dayId,bid,v){const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);if(b){b.topic=v.trim();sd();}}
function delBlock(dayId,bid){if(!confirm('Remove this subject block?'))return;const d=days.find(x=>x.id===dayId);if(!d)return;d.blocks=d.blocks.filter(b=>b.id!==bid);delete prog[bid];sd();sp();renderDayContent();renderHoursBar();renderStats();}
function markAll(bid,dayId){const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);if(!b)return;b.subtopics.forEach((_,j)=>gp(bid).subtopics[j]=true);sp();refreshBlock(dayId,bid);renderStats();renderDots();renderSyllabus();}

/* Subtopics */
function toggleST(bid,j,dayId){const p=gp(bid);p.subtopics[j]=!p.subtopics[j];sp();refreshBlock(dayId,bid);renderStats();renderDots();renderSyllabus();}
function editST(dayId,bid,j,v){const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);if(b){b.subtopics[j]=v;sd();}}
function delST(dayId,bid,j){
  const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);if(!b)return;
  b.subtopics.splice(j,1);const p=gp(bid);
  const ns={};Object.keys(p.subtopics).forEach(k=>{const ki=+k;if(ki<j)ns[ki]=p.subtopics[ki];else if(ki>j)ns[ki-1]=p.subtopics[ki];});
  p.subtopics=ns;sd();sp();refreshBlock(dayId,bid);renderStats();renderSyllabus();
}
function addST(dayId,bid){
  const inp=document.getElementById('nst-'+bid);const txt=inp?.value?.trim();if(!txt)return;
  const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);if(!b)return;
  b.subtopics.push(txt);inp.value='';sd();refreshBlock(dayId,bid);renderStats();renderSyllabus();
}
/* Custom tasks */
function toggleCT(bid,j,dayId){const p=gp(bid);p.customTasks[j].done=!p.customTasks[j].done;sp();refreshBlock(dayId,bid);renderStats();renderSyllabus();}
function editCT(bid,j,v){gp(bid).customTasks[j].text=v;sp();}
function delCT(bid,j,dayId){gp(bid).customTasks.splice(j,1);sp();refreshBlock(dayId,bid);renderStats();renderSyllabus();}
function addCT(bid,dayId){const inp=document.getElementById('nct-'+bid);const txt=inp?.value?.trim();if(!txt)return;gp(bid).customTasks.push({text:txt,done:false});inp.value='';sp();refreshBlock(dayId,bid);renderStats();renderSyllabus();}

function refreshBlock(dayId,bid){
  const d=days.find(x=>x.id===dayId);if(!d)return;
  const bi=d.blocks.findIndex(x=>x.id===bid);if(bi<0)return;
  const wrap=document.getElementById('sb-'+bid);if(!wrap)return;
  const wasOpen=document.getElementById('sbb-'+bid)?.classList.contains('open');
  wrap.outerHTML=buildBlock(dayId,d.blocks[bi],bi);
  if(wasOpen){document.getElementById('sbb-'+bid)?.classList.add('open');document.getElementById('chev-'+bid)?.classList.add('open');}
  renderHoursBar();
}

/* Timer */
function toggleTimer(bid,dayId){
  if(timers[bid]?.running){
    const el=Math.floor((Date.now()-timers[bid].start)/1000);
    clearInterval(timers[bid].interval);
    gp(bid).timeSpent=(gp(bid).timeSpent||0)+el;
    timers[bid]={running:false};sp();
    refreshBlock(dayId,bid);renderStats();renderHoursBar();
  } else {
    // stop any other running timer first
    Object.keys(timers).forEach(id=>{
      if(id!==bid&&timers[id]?.running){
        const el=Math.floor((Date.now()-timers[id].start)/1000);
        clearInterval(timers[id].interval);
        gp(id).timeSpent=(gp(id).timeSpent||0)+el;
        timers[id]={running:false};
      }
    });
    timers[bid]={running:true,start:Date.now(),interval:null};
    const d=days.find(x=>x.id===dayId),b=d?.blocks.find(x=>x.id===bid);
    timers[bid].interval=setInterval(()=>{
      const ex=Math.floor((Date.now()-timers[bid].start)/1000);
      const tot=(gp(bid).timeSpent||0)+ex;
      const th=Math.floor(tot/3600),tm=Math.floor((tot%3600)/60),ts=tot%60;
      const el=document.getElementById('td-'+bid);
      if(el)el.textContent=`${String(th).padStart(2,'0')}:${String(tm).padStart(2,'0')}:${String(ts).padStart(2,'0')}`;
      if(b){const w=Math.min((tot/3600/b.targetHrs)*100,100);const tbar=document.getElementById('tbar-'+bid);if(tbar)tbar.style.width=w+'%';}
      renderStats();renderHoursBar();
    },1000);
    const btn=document.getElementById('tbtn-'+bid);if(btn){btn.textContent='⏸ Pause';btn.className='timer-start running';}
  }
}
function stopAllTimers(){
  Object.keys(timers).forEach(bid=>{
    if(timers[bid]?.running){
      clearInterval(timers[bid].interval);
      const el=Math.floor((Date.now()-timers[bid].start)/1000);
      gp(bid).timeSpent=(gp(bid).timeSpent||0)+el;
      timers[bid]={running:false};
    }
  });sp();
}
function addManTime(bid,dayId){
  const inp=document.getElementById('mi-'+bid);const m=parseInt(inp?.value)||0;if(m<=0)return;
  gp(bid).timeSpent=(gp(bid).timeSpent||0)+m*60;inp.value='';sp();refreshBlock(dayId,bid);renderStats();renderHoursBar();
}

/* ══════════════════════════════════════════
   SYLLABUS VIEW
══════════════════════════════════════════ */
function renderSyllabus(){
  let html='';
  subj.forEach((s,si)=>{
    const blocks=[];
    days.forEach(d=>d.blocks.filter(b=>b.subjectId===s.id).forEach(b=>blocks.push({...b,dayId:d.id,dayIdx:days.indexOf(d)})));
    if(!blocks.length)return;
    const stT=blocks.reduce((a,b)=>a+b.subtopics.length+(gp(b.id).customTasks?.length||0),0);
    const stD=blocks.reduce((a,b)=>{const p=gp(b.id);return a+b.subtopics.filter((_,j)=>p.subtopics[j]).length+(p.customTasks||[]).filter(t=>t.done).length;},0);
    const pct=stT?Math.round(stD/stT*100):0;
    html+=`<div class="syl-card" style="animation-delay:${si*.04}s">
      <div class="syl-head">
        <div class="syl-icon" style="background:${s.color}20">${s.icon}</div>
        <div class="syl-name">${esc(s.name)}</div>
        <div class="syl-pct" style="color:${s.color}">${pct}%</div>
      </div>
      <div class="syl-prog"><div class="syl-prog-fill" style="background:${s.color};width:${pct}%"></div></div>
      <div>${blocks.map(b=>{
        const p=gp(b.id);
        const bD=b.subtopics.filter((_,j)=>p.subtopics[j]).length+(p.customTasks||[]).filter(t=>t.done).length;
        const bT=b.subtopics.length+(p.customTasks?.length||0);
        const full=bD===bT&&bT>0,part=bD>0&&!full;
        const stRows=[
          ...b.subtopics.map((st,j)=>{const done=!!p.subtopics[j];return `<div class="syl-st"><div class="syl-stck${done?' on':''}" onclick="toggleST('${b.id}',${j},'${b.dayId}')">${done?'✓':''}</div><input class="syl-st-inp" value="${esc(st)}" onchange="editSylSt('${b.dayId}','${b.id}',${j},this.value)" style="flex:1;padding:4px 6px;background:var(--bg2);color:var(--ink);border:1px solid var(--border);border-radius:3px;font-size:12px;outline:none" /><button onclick="event.stopPropagation();delSylSt('${b.dayId}','${b.id}',${j})" style="padding:2px 6px;border:none;background:#f44336;color:#fff;border-radius:3px;font-size:10px;cursor:pointer;margin-left:4px">✕</button></div>`;}),
          ...(p.customTasks||[]).map((ct,j)=>`<div class="syl-st"><div class="syl-stck${ct.done?' on':''}" onclick="toggleCT('${b.id}',${j},'${b.dayId}')">${ct.done?'✓':''}</div><span style="padding:0 4px">★</span><input class="syl-st-inp" value="${esc(ct.text)}" onchange="editSylCt('${b.dayId}','${b.id}',${j},this.value)" style="flex:1;padding:4px 6px;background:var(--bg2);color:var(--ink);border:1px solid var(--border);border-radius:3px;font-size:12px;outline:none" /><button onclick="event.stopPropagation();delSylCt('${b.dayId}','${b.id}',${j})" style="padding:2px 6px;border:none;background:#f44336;color:#fff;border-radius:3px;font-size:10px;cursor:pointer;margin-left:4px">✕</button></div>`)
        ].join('');
        return `<div class="syl-day" onclick="sylToggle(this,'${b.id}')">
          <div class="syl-day-row">
            <div class="syl-ck${full?' full':part?' part':''}">${full?'✓':part?'~':''}</div>
            <input class="syl-topic-inp" value="${esc(b.topic||'')}" onchange="editSylTopic('${b.dayId}','${b.id}',this.value)" style="flex:1;padding:4px 8px;background:var(--bg2);color:var(--ink);border:1px solid var(--border);border-radius:3px;font-size:13px;margin:0 8px;outline:none" placeholder="Topic…" />
            <span class="syl-day-meta">${bD}/${bT}</span>
            <span class="syl-arr">▶</span>
          </div>
        </div>
        <div class="syl-sts" id="sst-${b.id}">${stRows}<div style="padding:6px;display:flex;gap:5px"><input id="sylst-${b.id}" placeholder="Add subtopic…" style="flex:1;padding:4px 6px;background:var(--bg2);color:var(--ink);border:1px solid var(--border);border-radius:3px;font-size:11px;outline:none" /><button onclick="addSylSt('${b.dayId}','${b.id}')" style="padding:4px 8px;background:var(--green);color:#fff;border:none;border-radius:3px;font-size:10px;cursor:pointer">Add</button></div></div>`;
      }).join('')}</div>
    </div>`;
  });
  document.getElementById('sylGrid').innerHTML=html||'<div class="empty-state"><div class="es-icon">📚</div><p>No subjects yet.</p></div>';
}
function sylToggle(el,bid){el.classList.toggle('open');document.getElementById('sst-'+bid)?.classList.toggle('open');}

/* Syllabus editing functions */
function editSylTopic(dayId,blockId,newTopic){
  const day=days.find(d=>d.id===dayId);
  if(day){
    const block=day.blocks.find(b=>b.id===blockId);
    if(block){
      block.topic=newTopic.trim();
      sd();
    }
  }
}

function editSylSt(dayId,blockId,idx,newText){
  const day=days.find(d=>d.id===dayId);
  if(day){
    const block=day.blocks.find(b=>b.id===blockId);
    if(block){
      block.subtopics[idx]=newText.trim();
      sd();
    }
  }
}

function delSylSt(dayId,blockId,idx){
  if(confirm('Delete this subtopic?')){
    const day=days.find(d=>d.id===dayId);
    if(day){
      const block=day.blocks.find(b=>b.id===blockId);
      if(block){
        block.subtopics.splice(idx,1);
        delete gp(blockId).subtopics[idx];
        sd();sp();renderSyllabus();
      }
    }
  }
}

function addSylSt(dayId,blockId){
  const inp=document.getElementById('sylst-'+blockId);
  const txt=inp?.value?.trim();
  if(!txt)return;
  const day=days.find(d=>d.id===dayId);
  if(day){
    const block=day.blocks.find(b=>b.id===blockId);
    if(block){
      block.subtopics.push(txt);
      inp.value='';
      sd();renderSyllabus();
    }
  }
}

function editSylCt(dayId,blockId,idx,newText){
  const day=days.find(d=>d.id===dayId);
  if(day){
    const block=day.blocks.find(b=>b.id===blockId);
    if(block&&block.customTasks){
      block.customTasks[idx].text=newText.trim();
      sd();
    }
  }
}

function delSylCt(dayId,blockId,idx){
  if(confirm('Delete this task?')){
    const day=days.find(d=>d.id===dayId);
    if(day){
      const block=day.blocks.find(b=>b.id===blockId);
      if(block&&block.customTasks){
        block.customTasks.splice(idx,1);
        sd();sp();renderSyllabus();
      }
    }
  }
}

/* ══════════════════════════════════════════
   MANAGE VIEW
══════════════════════════════════════════ */
function renderManage(){
  document.getElementById('subjListEl').innerHTML=subj.map(s=>`
    <div class="subj-row" onclick="openSubjModal('${s.id}')">
      <div class="sdot" style="background:${s.color}"></div>
      <span style="font-size:15px">${s.icon}</span>
      <span class="srow-name">${esc(s.name)}</span>
      <span class="srow-meta">${s.defaultHrs}h</span>
      <button class="srow-del" onclick="event.stopPropagation();delSubj('${s.id}')">✕</button>
    </div>`).join('')||'<div style="padding:14px;font-size:13px;color:var(--ink3)">No subjects.</div>';
  renderDayListM();populateDFilter();
}
function renderDayListM(){
  const search=(document.getElementById('dSearch')?.value||'').toLowerCase();
  const fs=document.getElementById('dFilter')?.value||'';
  let list=days.map((d,i)=>({...d,i}));
  if(fs)list=list.filter(d=>d.blocks.some(b=>b.subjectId===fs));
  if(search)list=list.filter(d=>(d.title||d.blocks.map(b=>b.topic).join(' ')).toLowerCase().includes(search));
  if(!list.length){document.getElementById('dayListEl').innerHTML='<div style="padding:16px;text-align:center;font-size:13px;color:var(--ink3)">No days found.</div>';return;}
  document.getElementById('dayListEl').innerHTML=list.map(d=>{
    const mc=sj(d.blocks[0]?.subjectId).color||'#888';
    return `<div class="day-row-m">
      <div class="drm-num" style="background:${mc}">${d.i+1}</div>
      <div class="drm-info">
        <div class="drm-title">${esc(d.title)||d.blocks.map(b=>sj(b.subjectId).name).join(' + ')||'Untitled'}</div>
        <div class="drm-meta">${fd(getDd(d.i))} · ${dPlannedHrs(d.i)}h · ${d.blocks.length} subject(s)</div>
      </div>
      <div class="drm-actions">
        <button class="ic-btn" onclick="window.location='upsc-planner-final.html'" title="View">👁</button>
        <button class="ic-btn" onclick="openDayModal('${d.id}')" title="Edit">✏️</button>
        <button class="ic-btn" onclick="moveDay('${d.id}',-1)" title="Up">↑</button>
        <button class="ic-btn" onclick="moveDay('${d.id}',1)" title="Down">↓</button>
        <button class="ic-btn del" onclick="delDay('${d.id}')" title="Delete">🗑</button>
      </div>
    </div>`;
  }).join('');
}
function populateDFilter(){
  const sel=document.getElementById('dFilter');if(!sel)return;
  const cur=sel.value;
  sel.innerHTML='<option value="">All Subjects</option>'+subj.map(s=>`<option value="${s.id}"${s.id===cur?' selected':''}>${s.icon} ${s.name}</option>`).join('');
}
function moveDay(id,dir){const i=days.findIndex(d=>d.id===id);const ni=i+dir;if(ni<0||ni>=days.length)return;[days[i],days[ni]]=[days[ni],days[i]];sd();renderManage();renderDots();renderNavLabel();}
function delDay(id){if(!confirm('Delete this day?'))return;days=days.filter(d=>d.id!==id);if(curDay>=days.length)curDay=Math.max(0,days.length-1);sd();renderManage();renderAll();}
function delSubj(id){
  const cnt=days.reduce((c,d)=>c+d.blocks.filter(b=>b.subjectId===id).length,0);
  if(cnt>0&&!confirm(`Delete subject? ${cnt} block(s) will be removed.`))return;
  subj=subj.filter(s=>s.id!==id);
  days.forEach(d=>d.blocks=d.blocks.filter(b=>b.subjectId!==id));
  sd();renderManage();renderAll();
}

/* ══════════════════════════════════════════
   MODALS
══════════════════════════════════════════ */
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}

function openSubjModal(id){
  editSubjId=id;const s=id?subj.find(x=>x.id===id):null;
  document.getElementById('smTitle').textContent=id?'Edit Subject':'Add Subject';
  document.getElementById('smName').value=s?.name||'';
  document.getElementById('smHrs').value=s?.defaultHrs||3;
  selColor=s?.color||COLORS[0];selIcon=s?.icon||ICONS[0];
  document.getElementById('colorRow').innerHTML=COLORS.map(c=>`<div class="c-opt${c===selColor?' sel':''}" style="background:${c}" onclick="selColor='${c}';document.querySelectorAll('.c-opt').forEach(x=>{x.classList.toggle('sel',x.style.background===selColor)})"></div>`).join('');
  document.getElementById('iconRow').innerHTML=ICONS.map(ic=>`<div class="i-opt${ic===selIcon?' sel':''}" onclick="selIcon='${ic}';document.querySelectorAll('.i-opt').forEach(x=>{x.classList.toggle('sel',x.textContent===selIcon)})">${ic}</div>`).join('');
  openModal('subjOverlay');setTimeout(()=>document.getElementById('smName').focus(),100);
}
function saveSubject(){
  const name=document.getElementById('smName').value.trim();
  const hrs=parseFloat(document.getElementById('smHrs').value)||3;
  if(!name){alert('Enter subject name');return;}
  if(editSubjId){const s=subj.find(x=>x.id===editSubjId);if(s){s.name=name;s.color=selColor;s.icon=selIcon;s.defaultHrs=hrs;}}
  else subj.push({id:'s'+Date.now(),name,color:selColor,icon:selIcon,defaultHrs:hrs});
  sd();closeModal('subjOverlay');renderAll();
}

function openDayModal(id){
  editDayId=id;const d=id?days.find(x=>x.id===id):null;
  document.getElementById('dmTitle').textContent=id?'Edit Day':'Add Day';
  document.getElementById('dmName').value=d?.title||'';
  document.getElementById('dmDate').value=d?.dateOverride?new Date(d.dateOverride).toISOString().split('T')[0]:'';
  document.getElementById('dmTarget').value=d?.targetHrs||9;
  modalBlocks=d?JSON.parse(JSON.stringify(d.blocks)):[];
  renderModalBlocks();openModal('dayOverlay');
}
function renderModalBlocks(){
  document.getElementById('dmBlocksEl').innerHTML=modalBlocks.map((b,i)=>{
    const s=sj(b.subjectId);
    const stHtml=b.subtopics.map((st,j)=>`<div style="padding:4px 8px;background:var(--border);border-radius:5px;margin-right:5px;margin-bottom:5px;font-size:12px;display:inline-block">${esc(st)}<button onclick="modalBlocks[${i}].subtopics.splice(${j},1);renderModalBlocks()" style="background:none;border:none;color:var(--ink3);margin-left:5px;cursor:pointer;font-size:10px">✕</button></div>`).join('');
    const ctHtml=(b.customTasks||[]).map((ct,j)=>`<div style="padding:4px 8px;background:#ff9800a8;border-radius:5px;margin-right:5px;margin-bottom:5px;font-size:12px;display:inline-block">★ ${esc(ct.text)}<button onclick="modalBlocks[${i}].customTasks.splice(${j},1);renderModalBlocks()" style="background:none;border:none;color:#fff;margin-left:5px;cursor:pointer;font-size:10px">✕</button></div>`).join('');
    return `<div class="mblk-row" style="flex-direction:column;align-items:stretch;gap:10px">
      <div style="display:flex;align-items:center;gap:10px">
        <div style="font-size:18px;flex-shrink:0">${s.icon}</div>
        <div style="flex:1">
          <div class="mblk-name" style="color:${s.color}">${s.name}</div>
          <input class="mblk-topic" value="${esc(b.topic||'')}" placeholder="Topic…" onchange="modalBlocks[${i}].topic=this.value" style="margin-top:5px">
        </div>
        <select style="padding:5px 7px;border-radius:6px;border:1px solid var(--border);background:var(--bg2);color:var(--ink);font-size:12px;outline:none;flex-shrink:0" onchange="modalBlocks[${i}].subjectId=this.value;renderModalBlocks()">
          ${subj.map(sx=>`<option value="${sx.id}"${sx.id===b.subjectId?' selected':''}>${sx.icon} ${sx.name}</option>`).join('')}
        </select>
        <div class="mblk-hrs">
          <button class="ctrl-btn" onclick="modalBlocks[${i}].targetHrs=+(Math.max(.5,modalBlocks[${i}].targetHrs-.5).toFixed(1));renderModalBlocks()">−</button>
          <div class="mblk-hr-val" style="color:${s.color}">${b.targetHrs}h</div>
          <button class="ctrl-btn" onclick="modalBlocks[${i}].targetHrs=+(Math.min(12,modalBlocks[${i}].targetHrs+.5).toFixed(1));renderModalBlocks()">+</button>
        </div>
        <button onclick="modalBlocks.splice(${i},1);renderModalBlocks()" style="width:22px;height:22px;border-radius:5px;border:1px solid var(--border);background:none;color:var(--ink3);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0">✕</button>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:8px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">📋 Sub-topics</div>
        <div style="margin-bottom:8px">${stHtml}</div>
        <div style="display:flex;gap:5px;margin-bottom:12px">
          <input id="mst-${i}" placeholder="Add sub-topic" style="flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:5px;background:var(--bg2);font-size:12px">
          <button onclick="const txt=document.getElementById('mst-${i}').value.trim();if(txt){modalBlocks[${i}].subtopics.push(txt);document.getElementById('mst-${i}').value='';renderModalBlocks()}" style="padding:6px 10px;background:var(--green);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:700">Add</button>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:8px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">✏️ Custom Tasks</div>
        <div style="margin-bottom:8px">${ctHtml}</div>
        <div style="display:flex;gap:5px">
          <input id="mct-${i}" placeholder="Add custom task" style="flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:5px;background:var(--bg2);font-size:12px">
          <button onclick="const txt=document.getElementById('mct-${i}').value.trim();if(txt){if(!modalBlocks[${i}].customTasks)modalBlocks[${i}].customTasks=[];modalBlocks[${i}].customTasks.push({text:txt,done:false});document.getElementById('mct-${i}').value='';renderModalBlocks()}" style="padding:6px 10px;background:var(--blue);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:700">Add</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function addModalBlock(){const s=subj[0];if(!s)return;modalBlocks.push({id:gid(),subjectId:s.id,targetHrs:s.defaultHrs||2,topic:'',subtopics:[]});renderModalBlocks();}
function saveDay(){
  const title=document.getElementById('dmName').value.trim();
  const dv=document.getElementById('dmDate').value;
  const target=parseFloat(document.getElementById('dmTarget').value)||9;
  if(!modalBlocks.length&&!confirm('No subject blocks. Save empty day?'))return;
  if(editDayId){
    const d=days.find(x=>x.id===editDayId);
    if(d){d.title=title;d.dateOverride=dv?new Date(dv).toISOString():null;d.targetHrs=target;
      d.blocks=modalBlocks.map(mb=>{const ex=d.blocks.find(e=>e.id===mb.id);return ex?{...ex,...mb}:mb;});}
  } else {
    days.push({id:'day'+Date.now(),title,dateOverride:dv?new Date(dv).toISOString():null,targetHrs:target,blocks:modalBlocks});
  }
  sd();closeModal('dayOverlay');renderAll();
}

/* Block picker */
function openBpModal(dayId){
  bpDayId=dayId;bpSelSubjId=subj[0]?.id||null;
  document.getElementById('bpList').innerHTML=subj.map(s=>`
    <div class="sp-row${s.id===bpSelSubjId?' sel':''}" onclick="bpSelSubjId='${s.id}';document.querySelectorAll('.sp-row').forEach(r=>r.classList.remove('sel'));this.classList.add('sel');document.getElementById('bpHrs').value=${s.defaultHrs}">
      <div class="hb-leg-dot" style="background:${s.color};width:12px;height:12px;border-radius:3px"></div>
      <span style="font-size:16px">${s.icon}</span>
      <span class="sp-name">${esc(s.name)}</span>
      <span class="sp-hrs">${s.defaultHrs}h</span>
    </div>`).join('');
  document.getElementById('bpHrs').value=subj[0]?.defaultHrs||2;
  openModal('bpOverlay');
}
function confirmAddBlock(){
  if(!bpDayId||!bpSelSubjId)return;
  const d=days.find(x=>x.id===bpDayId);if(!d)return;
  const s=sj(bpSelSubjId);
  d.blocks.push({id:gid(),subjectId:bpSelSubjId,targetHrs:parseFloat(document.getElementById('bpHrs').value)||s.defaultHrs||2,topic:'',subtopics:[]});
  sd();closeModal('bpOverlay');renderDayContent();renderHoursBar();renderStats();
}

/* Bulk */
function openBulkModal(){document.getElementById('bulkInput').value='';openModal('bulkOverlay');}
function saveBulk(){
  const lines=document.getElementById('bulkInput').value.split('\n');
  let added=0,cur=null,curBlocks=[];
  function flush(){if(cur!==null){days.push({id:'day'+Date.now()+added,title:cur,dateOverride:null,targetHrs:9,blocks:curBlocks});added++;cur=null;curBlocks=[];}}
  lines.forEach(l=>{
    if(!l.trim())return;
    if(l.startsWith('  -')||l.startsWith('\t-')){const txt=l.replace(/^\s*-\s*/,'').trim();if(curBlocks.length&&txt)curBlocks[curBlocks.length-1].subtopics.push(txt);}
    else if(l.includes('|')){flush();const parts=l.split('|').map(p=>p.trim());cur=parts[0];curBlocks=parts.slice(1).map(p=>{const[nm,hrs]=p.split(':');const s=subj.find(x=>x.name.toLowerCase()===nm.trim().toLowerCase());if(!s)return null;return{id:gid(),subjectId:s.id,targetHrs:parseFloat(hrs)||s.defaultHrs||2,topic:'',subtopics:[]};}).filter(Boolean);}
  });flush();
  if(added){sd();closeModal('bulkOverlay');renderAll();alert(`${added} day(s) added!`);}
  else alert('No days added. Check subject names match exactly.');
}

/* ══════════════════════════════════════════
   TABS & NAV
══════════════════════════════════════════ */
function switchView(v){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));
  if(v==='syllabus')renderSyllabus();
  if(v==='manage')renderManage();
  if(v==='daily')renderDaily();
}
document.addEventListener('DOMContentLoaded',()=>{
  const tabs=document.querySelectorAll('.tab[data-view]');
  tabs.forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));

  const prevBtn=document.getElementById('prevBtn');
  const nextBtn=document.getElementById('nextBtn');
  if(prevBtn)prevBtn.addEventListener('click',()=>{if(curDay>0)jumpTo(curDay-1);});
  if(nextBtn)nextBtn.addEventListener('click',()=>{if(curDay<days.length-1)jumpTo(curDay+1);});
});

document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
  if(e.key==='ArrowLeft'&&curDay>0)jumpTo(curDay-1);
  if(e.key==='ArrowRight'&&curDay<days.length-1)jumpTo(curDay+1);
  if(e.key==='Escape')document.querySelectorAll('.overlay.open').forEach(o=>o.classList.remove('open'));
});

// Theme & Menu
function toggleTheme(){
  conf.dark=!conf.dark;
  sc();
  applyTheme();
  closeHeaderMenu();
}

function resetPlan(){
  if(!confirm('Reset all progress? Your plan is kept.'))return;
  stopAllTimers();
  prog={};
  timers={};
  sp();
  renderAll();
  closeHeaderMenu();
}

function toggleHeaderMenu(){
  const menu=document.getElementById('headerMenu');
  if(menu)menu.classList.toggle('active');
}

function closeHeaderMenu(){
  const menu=document.getElementById('headerMenu');
  if(menu)menu.classList.remove('active');
}

function applyTheme(){
  document.body.classList.toggle('dark',conf.dark);
  const themeBtn=document.getElementById('themeBtn');
  const menuTheme=document.getElementById('menuTheme');
  const icon=conf.dark?'☀️':'🌙';
  if(themeBtn)themeBtn.textContent=icon;
  if(menuTheme)menuTheme.textContent=icon+' '+(conf.dark?'Light Mode':'Dark Mode');
}

document.addEventListener('DOMContentLoaded',()=>{
  const themeBtn=document.getElementById('themeBtn');
  if(themeBtn)themeBtn.addEventListener('click',toggleTheme);

  const resetBtn=document.getElementById('resetBtn');
  if(resetBtn)resetBtn.addEventListener('click',resetPlan);
  
  // Close menu when clicking outside
  document.addEventListener('click',(e)=>{
    const headerMenu=document.getElementById('headerMenu');
    const menuBtn=document.getElementById('menuBtn');
    if(headerMenu&&menuBtn&&!headerMenu.contains(e.target)&&!menuBtn.contains(e.target)){
      closeHeaderMenu();
    }
  });
});

function renderAll(){renderStats();renderDaily();}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  load();applyTheme();renderAll();
});
