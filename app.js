'use strict';
/* ============================================================
   THE LONDON REVIEW · app v3
   ============================================================ */

const K='rota_v3';
let S, VK, curView='today', editDay=false;

/* ================= STATE ================= */
function todayISO(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function defaults(){return{
  settings:{ieltsDate:'2026-09-19',cycleStart:todayISO(),ritualSteps:DEF_RITUAL.slice(),
    template:defaultTemplate(),apiKey:'',model:'claude-sonnet-5'},
  days:{},vocab:[],hiddenTerms:[]
};}
function load(){
  try{const raw=localStorage.getItem(K);if(raw){S=Object.assign(defaults(),JSON.parse(raw));
    if(!S.settings.ritualSteps||!S.settings.ritualSteps.length)S.settings.ritualSteps=DEF_RITUAL.slice();
    if(!Array.isArray(S.vocab))S.vocab=[];
    if(!Array.isArray(S.hiddenTerms))S.hiddenTerms=[];
    return;}}catch(e){}
  S=defaults();save();
}
function save(){try{localStorage.setItem(K,JSON.stringify(S));}catch(e){}}

/* ================= UTIL ================= */
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function pad(n){return String(n).padStart(2,'0');}
function keyOf(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function todayKey(){return keyOf(new Date());}
function parseKey(k){const p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function addDays(k,n){const d=parseKey(k);d.setDate(d.getDate()+n);return keyOf(d);}
function diffDays(a,b){return Math.round((parseKey(b)-parseKey(a))/86400000);}
function mins(t){const p=String(t).split(':');return (+p[0]||0)*60+(+p[1]||0);}
function nowMins(){const d=new Date();return d.getHours()*60+d.getMinutes();}
function dowKey(k){return String(parseKey(k).getDay());}
const DOWS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function fmtDay(k){const d=parseKey(k);return DOWS[d.getDay()]+', '+d.getDate()+' '+MONS[d.getMonth()];}
function fmtShort(k){const d=parseKey(k);return d.getDate()+' '+MONS[d.getMonth()].slice(0,3);}
function dayN(k){return diffDays(S.settings.cycleStart,k)+1;}
function totalDays(){return Math.max(1,diffDays(S.settings.cycleStart,S.settings.ieltsDate)+1);}
function getPhase(n){const f=Math.max(0,Math.min(1,n/totalDays()));for(const p of PHASES)if(f<p.lim)return p;return PHASES[PHASES.length-1];}
function roman(n){const R=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const[v,l]of R){while(n>=v){s+=l;n-=v;}}return s||'I';}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove('show'),2600);}
function wordCount(t){return (String(t).trim().match(/\S+/g)||[]).length;}

/* ================= DAY ================= */
function maybeSyncTpl(day,key){
  /* days the user has not touched follow the weekly template live */
  if(day.custom)return;
  if(Object.keys(day.checks||{}).length)return;
  const cur=JSON.stringify(S.settings.template[dowKey(key)]||[]);
  if(JSON.stringify(day.tpl)!==cur){day.tpl=JSON.parse(cur);save();}
}
function ensureDay(key){
  if(S.days[key]){maybeSyncTpl(S.days[key],key);return S.days[key];}
  const n=Math.max(1,dayN(key));
  const day={
    tpl:JSON.parse(JSON.stringify(S.settings.template[dowKey(key)]||[])),
    checks:{},
    ritual:S.settings.ritualSteps.map(t=>({t,done:false})),
    obstacle:'',plan:'',
    intention:{text:'',fb:null,lt:null},
    essay:{pi:(n-1)%PROMPTS.length,text:'',fb:null,lt:null,done:false},
    ed:(n-1)%EDITIONS.length
  };
  S.days[key]=day;save();
  return day;
}
function tracked(day){return day.tpl.filter(b=>b.type!=='routine');}
function dayScore(day){
  const tb=tracked(day);if(!tb.length)return{p:0,d:0,t:0};
  const d=tb.filter(b=>day.checks[b.id]==='done').length;
  return{p:Math.round(d/tb.length*100),d,t:tb.length};
}
function studyDone(day){return day.tpl.some(b=>b.type==='study'&&day.checks[b.id]==='done');}
function ritualDone(day){return day.ritual.length>0&&day.ritual.every(r=>r.done);}
function elapsedKeys(){
  const out=[],t=todayKey();
  if(diffDays(S.settings.cycleStart,t)<0)return[todayKey()];
  for(let k=S.settings.cycleStart;diffDays(k,t)>=0;k=addDays(k,1))out.push(k);
  return out;
}
function currentStreak(){
  let n=0,t=todayKey();
  for(let k=t;diffDays(S.settings.cycleStart,k)>=0;k=addDays(k,-1)){
    const d=S.days[k];
    if(d&&studyDone(d))n++;
    else if(k===t)continue; /* today not done yet does not break */
    else break;
  }
  return n;
}
function bestStreak(){
  let cur=0,best=0;
  elapsedKeys().forEach(k=>{
    const d=S.days[k];
    if(d&&studyDone(d)){cur++;best=Math.max(best,cur);}else cur=0;
  });
  return best;
}

/* ================= RENDER · MAST + COVER ================= */
function imgTag(src,cls){
  return '<img src="'+src+'" alt="" loading="lazy" onerror="this.onerror=null;this.src=IMG_FALLBACK;"'+(cls?' class="'+cls+'"':'')+'>';
}
function renderMast(){
  $('#mastEd').textContent='Edition No. '+Math.max(1,dayN(VK))+' · Road to Band 7.0';
}
function renderCover(day){
  const n=Math.max(1,dayN(VK)),y=totalDays();
  const phase=getPhase(n);
  const img=phase.imgs[n%phase.imgs.length];
  const cap=phase.caps[n%phase.caps.length];
  const pct=Math.max(0,Math.min(100,Math.round(n/y*100)));
  const left=Math.max(0,diffDays(todayKey(),S.settings.ieltsDate));
  const wk=Math.max(1,Math.ceil(n/7));
  let dots='<span class="k">Week '+wk+'</span>';
  const wkStart=addDays(S.settings.cycleStart,(wk-1)*7);
  for(let i=0;i<7;i++){
    const k=addDays(wkStart,i);let cls='wkd';
    if(diffDays(k,todayKey())>=0&&S.days[k]){
      const p=dayScore(S.days[k]).p;
      if(p===100)cls+=' p2';else if(p>0)cls+=' p1';
    }
    if(k===todayKey())cls+=' tdy';
    dots+='<i class="'+cls+'"></i>';
  }
  $('#cover').innerHTML=
    '<div class="covtop"><span class="k ox">'+esc(phase.name)+'</span><span class="ed">No. '+n+'</span></div>'+
    '<div class="covimg">'+imgTag(img)+
      '<div class="cap"><div class="k">Cover photograph</div><div class="covph">'+esc(cap)+'</div></div></div>'+
    '<div class="covline"><span class="covdate">'+fmtDay(VK)+'</span><span class="k">'+(VK===todayKey()?'Today’s edition':'From the archive')+'</span></div>'+
    '<div class="covprog">'+
      '<div class="cpnum"><b>Day '+n+' <small>of '+y+'</small></b><span>'+pct+'%</span></div>'+
      '<div class="cpbar"><i style="width:'+pct+'%"></i></div>'+
      '<div class="cpsub"><span>'+esc(phase.mantra)+'</span></div>'+
      '<div class="cpsub"><span>Exam: '+fmtShort(S.settings.ieltsDate)+'</span><span>'+left+' days remaining</span></div>'+
      '<div class="wkdots">'+dots+'</div>'+
    '</div>';
}
function renderDayNav(){
  const t=todayKey(),isT=VK===t;
  $('#dLabel').innerHTML=esc(fmtShort(VK))+(isT?' · today':'')+'<small>Edition '+Math.max(1,dayN(VK))+' of the journey</small>';
  $('#dPrev').disabled=diffDays(S.settings.cycleStart,VK)<=0;
  $('#dNext').disabled=isT;
  const pb=$('#pastband');
  if(isT)pb.classList.add('hidden');
  else{pb.classList.remove('hidden');pb.textContent='Reading the archive — taps still edit this day’s record.';}
}

/* ================= RENDER · MORNING PAGE ================= */
function highlight(text,terms){
  let out=esc(text);
  terms.forEach((tm,i)=>{
    const e=esc(tm.w);
    const idx=out.indexOf(e);
    if(idx>=0)out=out.slice(0,idx)+'<em class="hl" data-t="'+i+'">'+e+'</em>'+out.slice(idx+e.length);
  });
  return out;
}
function renderMorning(day){
  const ed=EDITIONS[day.ed]||EDITIONS[0];
  let paras=ed.x.map(p=>'<p>'+highlight(p,ed.w)+'</p>').join('');
  let terms=ed.w.map((tm,i)=>
    '<div class="term" id="term'+i+'">'+
      '<div class="termh"><span class="termw">'+esc(tm.w)+'</span><span class="termk">'+esc(tm.k)+'</span></div>'+
      '<div class="termd">'+esc(tm.d)+'</div>'+
      '<div class="terme">'+esc(tm.e)+'</div>'+
    '</div>').join('');
  $('#morning').innerHTML=
    '<div class="shead"><span class="k ox">The Morning Page</span><span class="snum">I</span></div>'+
    '<div class="arttitle">'+esc(ed.t)+'</div>'+
    '<div class="artsub">'+esc(ed.s)+'</div>'+
    '<div class="artbody">'+paras+'</div>'+
    '<div class="k" style="margin-top:18px">Today’s three · bank these for the exam</div>'+
    '<div class="terms">'+terms+'</div>';
  $$('#morning .hl').forEach(h=>h.onclick=()=>{
    const el=$('#term'+h.dataset.t);
    if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.style.background='rgba(154,123,63,.12)';setTimeout(()=>el.style.background='',1200);}
  });
}

/* ================= RENDER · INTENTION ================= */
function renderIntention(day){
  const it=day.intention;
  let h='<div class="shead"><span class="k ox">Intention of the Day</span><span class="snum">II</span></div>';
  if(!it.text){
    h+='<div class="artsub" style="margin-bottom:10px">One simple sentence, in English: what will make today a victory?</div>'+
      '<input id="intIn" placeholder="Today I will…" autocomplete="off" maxlength="220">'+
      '<div class="obsrow"><div class="k" style="margin-bottom:8px">Name today’s obstacle</div><div class="chips" id="obsChips">'+
      OBSTACLES.map(o=>'<button class="chip'+(day.obstacle===o.o?' on':'')+'" data-o="'+o.o+'">'+o.o+'</button>').join('')+'</div></div>'+
      (day.obstacle?'<div class="planbox"><b>If-then plan.</b> '+esc((OBSTACLES.find(x=>x.o===day.obstacle)||{}).plan||'')+'</div>':'')+
      '<div class="iactions"><button class="btn" id="intSave">Set intention</button>'+
      '<span class="k">Feedback arrives the moment you set it</span></div>';
  }else{
    h+='<div class="intlocked"><span class="qm">“</span>'+esc(it.text)+'<span class="qm">”</span></div>';
    if(day.obstacle)h+='<div class="k" style="margin-top:10px">Obstacle named: '+esc(day.obstacle)+'</div>';
    if(day.plan)h+='<div class="planbox"><b>If-then plan.</b> '+esc(day.plan)+'</div>';
    h+=renderFb(it,'intention');
    h+='<div class="iactions"><button class="btn line" id="intEdit">Rewrite</button>'+
      (!it.fb&&S.settings.apiKey?'<button class="btn" id="intAI">Examiner feedback</button>':'')+
      (!it.lt?'<button class="btn dim" id="intLT">Quick grammar check</button>':'')+'</div>';
  }
  $('#intention').innerHTML=h;
  const sv=$('#intSave');
  if(sv)sv.onclick=()=>{
    const v=$('#intIn').value.trim();
    if(!v){toast('Write one sentence first.');return;}
    it.text=v;
    day.plan=(OBSTACLES.find(x=>x.o===day.obstacle)||{}).plan||'';
    save();renderIntention(day);
    runLT(it,day,'intention');
    if(S.settings.apiKey)runClaude(it,day,'intention');
  };
  $$('#obsChips .chip').forEach(c=>c.onclick=()=>{
    day.obstacle=c.dataset.o;save();
    const v=$('#intIn')?$('#intIn').value:'';
    renderIntention(day);
    if($('#intIn'))$('#intIn').value=v;
  });
  const ie=$('#intEdit');
  if(ie)ie.onclick=()=>{const old=it.text;it.text='';it.fb=null;it.lt=null;save();renderIntention(day);if($('#intIn'))$('#intIn').value=old;};
  const ia=$('#intAI');if(ia)ia.onclick=()=>runClaude(it,day,'intention');
  const il=$('#intLT');if(il)il.onclick=()=>runLT(it,day,'intention');
}

/* ================= FEEDBACK RENDER (shared) ================= */
function renderFb(obj,kind){
  let h='';
  if(obj.busyLT)h+='<div class="fbwait">Checking grammar…</div>';
  if(obj.lt&&obj.lt.length){
    h+='<div class="fb"><div class="fbh"><span class="k navy">Grammar quick-check</span><span class="k">'+obj.lt.length+' note'+(obj.lt.length>1?'s':'')+'</span></div>'+
      obj.lt.map(m=>'<div class="ltm"><b>'+esc(m.bad)+'</b>'+(m.sug?' → <span class="sug">'+esc(m.sug)+'</span>':'')+'<br><span style="color:var(--ink2)">'+esc(m.msg)+'</span></div>').join('')+'</div>';
  }else if(obj.lt&&!obj.lt.length){
    h+='<div class="fb"><span class="k navy">Grammar quick-check</span><div class="fbwait" style="padding-bottom:0">No issues found. Clean sentence'+(kind==='essay'?'s':'')+'.</div></div>';
  }
  if(obj.busyAI)h+='<div class="fbwait">The examiner is reading…</div>';
  if(obj.fb){
    const f=obj.fb;
    h+='<div class="fb"><div class="fbh"><span class="k ox">Examiner’s desk</span>'+(f.band?'<span class="fbband">'+esc(String(f.band))+'</span>':'')+'</div>';
    if(f.errors&&f.errors.length){
      h+=f.errors.map(e=>'<div class="fberr"><span class="bad">'+esc(e.from)+'</span> → <span class="good">'+esc(e.to)+'</span>'+(e.why?'<span class="why">'+esc(e.why)+'</span>':'')+'</div>').join('');
    }else h+='<div class="fbwait" style="padding:4px 0">No errors worth marking.</div>';
    if(f.rewrite)h+='<div class="k" style="margin-top:12px">Rewritten for Band 7+</div><div class="fbrew">'+esc(f.rewrite)+'</div>';
    if(f.note)h+='<div class="fbnote">'+esc(f.note)+'</div>';
    h+='</div>';
  }
  if(obj.err)h+='<div class="fb"><span class="k ox">Feedback unavailable</span><div class="fbwait" style="padding-bottom:0">'+esc(obj.err)+'</div></div>';
  return h;
}

/* ================= RENDER · RITUAL ================= */
function renderRitual(day){
  const done=day.ritual.filter(r=>r.done).length,tot=day.ritual.length;
  const all=tot>0&&done===tot;
  let h='<div class="shead"><span class="k ox">The Morning Ritual</span><span class="snum">III</span></div>'+
    '<div class="ritwrap'+(all?' done':'')+'">'+
    '<div class="rith"><span class="k" style="color:'+(all?'var(--ok)':'var(--gold)')+'">'+(all?'✦ Ritual complete':'Before the world wakes')+'</span><span class="k">'+done+'/'+tot+'</span></div>'+
    '<div class="rittitle">'+(all?'The morning is yours.':'Win the first hour.')+'</div>'+
    '<div class="ritsub">'+(all?'Everything else today is downhill.':'Five quiet moves, in order, no phone.')+'</div>'+
    '<div style="margin-top:8px">'+
    day.ritual.map((r,i)=>'<button class="ritstep'+(r.done?' on':'')+'" data-i="'+i+'"><span class="ritdot">'+(r.done?'✓':'')+'</span><span>'+esc(r.t)+'</span></button>').join('')+
    '</div><div class="ritbar"><i style="width:'+(tot?Math.round(done/tot*100):0)+'%"></i></div></div>';
  $('#ritual').innerHTML=h;
  $$('#ritual .ritstep').forEach(b=>b.onclick=()=>{
    const r=day.ritual[+b.dataset.i];r.done=!r.done;save();renderRitual(day);
    if(ritualDone(day))toast('Ritual complete. The day obeys.');
  });
}

/* ================= RENDER · DAY'S WORK ================= */
function blockState(day,b){
  if(day.checks[b.id]==='done')return'done';
  if(day.checks[b.id]==='miss')return'miss';
  if(VK===todayKey()){
    const n=nowMins();
    if(n>=mins(b.start)&&n<mins(b.end))return'now';
  }
  return'';
}
const TYPE_LABEL={study:'<span class="st">Study</span>',training:'<span class="tr">Training</span>',routine:'<span class="rt">Routine</span>'};
function renderDaywork(day){
  const sc=dayScore(day);
  const wd=DOWS[parseKey(VK).getDay()];
  let h='<div class="shead"><span class="k ox">The Day’s Work · '+wd+'</span><span class="snum">IV</span></div>'+
    '<div class="covline" style="margin:0 0 10px"><span class="k">'+sc.d+' of '+sc.t+' blocks complete</span>'+
    '<button class="k" id="dwEdit" style="color:var(--navy)">'+(editDay?'✓ Done editing':'✎ Edit schedule')+'</button></div>';
  if(!editDay){
    h+='<div class="rule2" style="border-top:2px solid var(--ink)"></div>';
    day.tpl.forEach(b=>{
      const st=blockState(day,b);
      h+='<div class="trow '+st+(b.type==='routine'?' routine':'')+'">'+
        '<div class="ttime"><b>'+esc(b.start)+'</b>'+esc(b.end)+'</div>'+
        '<button class="tmain" data-id="'+esc(b.id)+'">'+
          '<div class="tinfo"><div class="tname">'+esc(b.name)+'</div>'+
          '<div class="tsub">'+(TYPE_LABEL[b.type]||'')+(st==='miss'?' · didn’t happen':'')+(st==='now'?' · now':'')+'</div></div>'+
          '<span class="tcheck">'+(st==='done'?'✓':(st==='miss'?'—':''))+'</span>'+
        '</button></div>';
    });
  }else{
    day.tpl.forEach((b,i)=>{
      h+='<div class="trow"><div class="tedit">'+
        '<button class="tebtn" data-a="up" data-i="'+i+'" '+(i===0?'disabled':'')+'>&#8593;</button>'+
        '<button class="tebtn" data-a="dn" data-i="'+i+'" '+(i===day.tpl.length-1?'disabled':'')+'>&#8595;</button>'+
        '</div><div class="editrow">'+
        '<input class="tim" data-i="'+i+'" data-f="start" value="'+esc(b.start)+'" inputmode="numeric">'+
        '<input class="tim" data-i="'+i+'" data-f="end" value="'+esc(b.end)+'" inputmode="numeric">'+
        '<input class="nam" data-i="'+i+'" data-f="name" value="'+esc(b.name)+'">'+
        '<select data-i="'+i+'" data-f="type">'+['study','training','routine'].map(t=>'<option'+(b.type===t?' selected':'')+'>'+t+'</option>').join('')+'</select>'+
        '<button class="tebtn del" data-a="del" data-i="'+i+'">✕</button>'+
        '</div></div>';
    });
    h+='<div id="dwactions"><button class="btn line" id="dwAdd">+ Add block</button>'+
      '<button class="btn dim" id="dwSort">Sort by time</button></div>';
  }
  $('#daywork').innerHTML=h;
  $('#dwEdit').onclick=()=>{editDay=!editDay;renderDaywork(day);};
  if(!editDay){
    $$('#daywork .tmain').forEach(el=>el.onclick=()=>openBlockSheet(day,el.dataset.id));
  }else{
    $$('#daywork .tebtn[data-a="up"],#daywork .tebtn[data-a="dn"]').forEach(bt=>bt.onclick=()=>{
      const i=+bt.dataset.i,j=bt.dataset.a==='up'?i-1:i+1;
      if(j<0||j>=day.tpl.length)return;
      [day.tpl[i],day.tpl[j]]=[day.tpl[j],day.tpl[i]];
      day.custom=true;save();renderDaywork(day);
    });
    $$('#daywork .tebtn[data-a="del"]').forEach(bt=>bt.onclick=()=>{
      const i=+bt.dataset.i;
      if(!confirm('Remove “'+day.tpl[i].name+'” from today?'))return;
      delete day.checks[day.tpl[i].id];
      day.tpl.splice(i,1);day.custom=true;save();renderDaywork(day);
    });
    $$('#daywork .editrow input,#daywork .editrow select').forEach(el=>el.onchange=()=>{
      day.tpl[+el.dataset.i][el.dataset.f]=el.value;day.custom=true;save();
    });
    $('#dwAdd').onclick=()=>{
      day.tpl.push({id:'x'+Date.now().toString(36),start:'12:00',end:'13:00',name:'New block',type:'study'});
      day.custom=true;save();renderDaywork(day);
    };
    $('#dwSort').onclick=()=>{
      day.tpl.sort((a,b)=>mins(a.start)-mins(b.start));day.custom=true;save();renderDaywork(day);
    };
  }
}
function openBlockSheet(day,id){
  const b=day.tpl.find(x=>x.id===id);if(!b)return;
  const st=day.checks[id]||'';
  openSheet('<div class="sh"><div><div class="arttitle" style="font-size:21px">'+esc(b.name)+'</div>'+
    '<div class="k" style="margin-top:4px">'+esc(b.start)+'–'+esc(b.end)+' · '+esc(b.type)+(VK!==todayKey()?' · '+esc(fmtShort(VK)):'')+'</div></div>'+
    '<button class="shx" id="shClose">✕</button></div>'+
    '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">'+
    '<button class="btn" id="bkDone">'+(st==='done'?'✓ Completed':'Mark complete')+'</button>'+
    '<button class="btn dim" id="bkMiss">'+(st==='miss'?'Marked: didn’t happen':'Didn’t happen')+'</button>'+
    (st?'<button class="btn line" id="bkClear">Clear</button>':'')+
    '</div>'+
    (b.type==='study'?'<p class="keynote" style="margin-top:16px">Finish the block by producing something: one sentence using a term from today’s three, spoken or written.</p>':''));
  $('#shClose').onclick=closeSheet;
  $('#bkDone').onclick=()=>{day.checks[id]='done';save();closeSheet();renderDaywork(day);renderCover(day);
    if(dayScore(day).p===100)toast('Every block complete. Superb.');};
  $('#bkMiss').onclick=()=>{day.checks[id]='miss';save();closeSheet();renderDaywork(day);renderCover(day);};
  const bc=$('#bkClear');if(bc)bc.onclick=()=>{delete day.checks[id];save();closeSheet();renderDaywork(day);renderCover(day);};
}

/* ================= RENDER · NEW VOCABULARY ================= */
function renderVocab(){
  const mine=S.vocab.map((v,i)=>({v,i})).filter(o=>o.v.k===VK);
  let h='<div class="shead"><span class="k ox">New Vocabulary of the Day</span><span class="snum">V</span></div>'+
    '<div class="artsub" style="margin-bottom:10px">Words you met today, worth keeping. They all build The Lexicon — your private dictionary.</div>'+
    '<div class="vform">'+
      '<input class="vw" id="vwWord" placeholder="Word or phrase" autocomplete="off" maxlength="60">'+
      '<input class="vn" id="vwNote" placeholder="Meaning, example or translation (optional)" autocomplete="off" maxlength="160">'+
      '<button class="btn" id="vwAdd">Add</button>'+
    '</div>';
  if(mine.length){
    h+='<div style="margin-top:14px">'+mine.map(o=>
      '<div class="vrow"><span class="vwd">'+esc(o.v.w)+'</span>'+
      '<span class="vnt">'+esc(o.v.note||'')+'</span>'+
      '<button class="vdel" data-i="'+o.i+'" aria-label="remove">✕</button></div>').join('')+'</div>';
  }
  h+='<div class="k" style="margin-top:12px">'+S.vocab.length+' word'+(S.vocab.length===1?'':'s')+' collected · open the Lexicon below</div>';
  $('#vocab').innerHTML=h;
  const addFn=()=>{
    const w=$('#vwWord').value.trim();
    if(!w){toast('Type a word first.');return;}
    S.vocab.push({w,note:$('#vwNote').value.trim(),k:VK});
    save();renderVocab();toast('“'+w+'” added to the Lexicon.');
    const el=$('#vwWord');if(el){el.value='';el.focus();}
  };
  $('#vwAdd').onclick=addFn;
  $('#vwWord').onkeydown=e=>{if(e.key==='Enter')addFn();};
  $$('#vocab .vdel').forEach(b=>b.onclick=()=>{
    S.vocab.splice(+b.dataset.i,1);save();renderVocab();
  });
}

/* ================= RENDER · LEXICON ================= */
function lexEntries(){
  const seen={},out=[];
  S.vocab.forEach((v,i)=>{
    const key=v.w.toLowerCase();
    if(seen[key])return;seen[key]=1;
    out.push({w:v.w,note:v.note||'',src:'you',date:v.k,idx:i});
  });
  elapsedKeys().forEach(k=>{
    const d=S.days[k];if(!d)return;
    (EDITIONS[d.ed]||{w:[]}).w.forEach(tm=>{
      const key=tm.w.toLowerCase();
      if(seen[key]||S.hiddenTerms.includes(key))return;seen[key]=1;
      out.push({w:tm.w,note:tm.d,src:'edition',date:k,ed:Math.max(1,dayN(k))});
    });
  });
  out.sort((a,b)=>a.w.toLowerCase().localeCompare(b.w.toLowerCase()));
  return out;
}
function renderLexicon(){
  const es=lexEntries();
  const yours=es.filter(e=>e.src==='you').length;
  let h='<div class="jhero"><span class="k ox">A private dictionary</span>'+
    '<div class="arttitle serif">The Lexicon</div>'+
    '<div class="artsub">'+es.length+' living entries · '+yours+' collected by you · '+S.hiddenTerms.length+' mastered and retired</div>'+
    '<div class="artsub" style="font-size:13px">Delete an entry once it is truly yours — a shrinking dictionary is a growing mind.</div></div>';
  if(!es.length){
    h+='<div class="sect"><p class="keynote">Nothing here yet. Add words in “New Vocabulary of the Day”, and each edition’s three terms will file themselves here automatically.</p></div>';
  }else{
    let letter='';
    es.forEach(e=>{
      const L=e.w[0].toUpperCase();
      if(L!==letter){
        if(letter)h+='</div>';
        letter=L;
        h+='<div class="lexletter">'+esc(L)+'<small>'+es.filter(x=>x.w[0].toUpperCase()===L).length+' entr'+(es.filter(x=>x.w[0].toUpperCase()===L).length===1?'y':'ies')+'</small></div><div>';
      }
      h+='<div class="vrow"><span class="vwd">'+esc(e.w)+'</span>'+
        '<span class="vnt">'+esc(e.note)+'</span>'+
        '<span class="lexsrc'+(e.src==='you'?' you':'')+'">'+(e.src==='you'?'yours · '+fmtShort(e.date):'No. '+e.ed)+'</span>'+
        '<button class="vdel" data-w="'+esc(e.w.toLowerCase())+'" data-src="'+e.src+'" data-idx="'+(e.idx!==undefined?e.idx:'')+'" aria-label="retire">✕</button></div>';
    });
    h+='</div>';
  }
  $('#lexmain').innerHTML=h;
  $$('#lexmain .vdel').forEach(b=>b.onclick=()=>{
    if(!confirm('Retire “'+b.dataset.w+'” from the Lexicon? (Do it when the word is consolidated.)'))return;
    if(b.dataset.src==='you'){
      const i=+b.dataset.idx;
      if(!isNaN(i)&&S.vocab[i]&&S.vocab[i].w.toLowerCase()===b.dataset.w)S.vocab.splice(i,1);
      else S.vocab=S.vocab.filter(v=>v.w.toLowerCase()!==b.dataset.w);
    }else{
      S.hiddenTerms.push(b.dataset.w);
    }
    save();renderLexicon();toast('Retired. Well earned.');
  });
}

/* ================= RENDER · EVENING ESSAY ================= */
function renderEssay(day){
  const es=day.essay;
  const pr=PROMPTS[es.pi]||PROMPTS[0];
  let h='<div class="shead"><span class="k ox">The Evening Essay</span><span class="snum">VI</span></div>'+
    '<div class="esswrap">'+
    '<span class="esscat">'+esc(pr.c)+' · Writing Task 2 style</span>'+
    '<div class="essq">'+esc(pr.q)+'</div>'+
    '<div class="essmeta">Two or three paragraphs · aim for 120–180 words · close the day with it</div>';
  if(!es.done){
    h+='<textarea id="essIn" placeholder="Plan for one minute, then write…">'+esc(es.text||'')+'</textarea>'+
      '<div class="esscount" id="essCount"></div>'+
      '<div class="iactions">'+
      '<button class="btn" id="essAI"'+(S.settings.apiKey?'':' disabled')+'>Examiner feedback</button>'+
      '<button class="btn line" id="essLT">Grammar check</button>'+
      '<button class="btn dim" id="essDone">File without feedback</button></div>'+
      (S.settings.apiKey?'':'<p class="keynote">Add your Claude API key in settings to unlock examiner feedback and the Band 7 rewrite.</p>');
  }else{
    h+='<div class="essdone" style="margin-top:12px">Filed · '+wordCount(es.text)+' words written</div>'+
      '<div class="artbody" style="font-size:15px;margin-top:10px">'+es.text.split(/\n+/).map(p=>'<p>'+esc(p)+'</p>').join('')+'</div>'+
      '<div class="iactions"><button class="btn line" id="essReopen">Reopen</button>'+
      (!es.fb&&S.settings.apiKey?'<button class="btn" id="essAI2">Examiner feedback</button>':'')+'</div>';
  }
  h+=renderFb(es,'essay')+'</div>';
  $('#essay').innerHTML=h;
  const ta=$('#essIn');
  if(ta){
    const cnt=()=>{$('#essCount').textContent=wordCount(ta.value)+' words';};
    cnt();
    ta.oninput=()=>{es.text=ta.value;cnt();};
    ta.onchange=()=>{es.text=ta.value;save();};
  }
  const ea=$('#essAI');if(ea)ea.onclick=()=>{
    es.text=($('#essIn')?$('#essIn').value:es.text).trim();
    if(wordCount(es.text)<40){toast('Write at least ~40 words first.');return;}
    es.done=true;save();renderEssay(day);
    runLT(es,day,'essay');runClaude(es,day,'essay');
  };
  const el2=$('#essLT');if(el2)el2.onclick=()=>{
    es.text=($('#essIn')?$('#essIn').value:es.text).trim();
    if(!es.text){toast('Write something first.');return;}
    save();runLT(es,day,'essay');
  };
  const ed2=$('#essDone');if(ed2)ed2.onclick=()=>{
    es.text=($('#essIn')?$('#essIn').value:es.text).trim();
    if(wordCount(es.text)<40){toast('Write at least ~40 words first.');return;}
    es.done=true;save();renderEssay(day);toast('Essay filed. Day closed like a craftsman.');
  };
  const er=$('#essReopen');if(er)er.onclick=()=>{es.done=false;save();renderEssay(day);};
  const ea2=$('#essAI2');if(ea2)ea2.onclick=()=>{runLT(es,day,'essay');runClaude(es,day,'essay');};
}

/* ================= LANGUAGETOOL ================= */
function runLT(obj,day,kind){
  obj.busyLT=true;obj.err=null;rerender(day,kind);
  const body='text='+encodeURIComponent(obj.text)+'&language=en-GB&level=picky';
  fetch('https://api.languagetool.org/v2/check',{method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},body})
  .then(r=>{if(!r.ok)throw new Error('LanguageTool returned '+r.status);return r.json();})
  .then(j=>{
    obj.busyLT=false;
    obj.lt=(j.matches||[]).slice(0,8).map(m=>({
      bad:obj.text.substr(m.offset,m.length)||'—',
      sug:(m.replacements&&m.replacements[0])?m.replacements[0].value:'',
      msg:m.shortMessage||m.message||''}));
    save();rerender(day,kind);
  })
  .catch(e=>{obj.busyLT=false;obj.err='Grammar service unreachable ('+e.message+'). Try again in a minute.';save();rerender(day,kind);});
}

/* ================= CLAUDE ================= */
function claudePrompt(kind,text,question){
  if(kind==='intention'){
    return 'You are a supportive IELTS writing examiner. A Brazilian student preparing for IELTS Academic (target Band 7.0) wrote this one-sentence intention for the day:\n\n"'+text+'"\n\nRespond ONLY with strict JSON, no markdown fences, in this exact shape:\n{"errors":[{"from":"exact wrong fragment","to":"corrected fragment","why":"one-line explanation"}],"rewrite":"the sentence rewritten naturally at Band 7+ level (keep the meaning and the personal voice)","note":"one warm, specific coaching sentence"}\n\nIf there are no errors, use an empty errors array. Never invent errors.';
  }
  return 'You are an experienced IELTS Writing Task 2 examiner. A Brazilian student (target Band 7.0) wrote this short practice response (2–3 paragraphs, deliberately shorter than a full Task 2 answer).\n\nQuestion: "'+question+'"\n\nResponse:\n"""\n'+text+'\n"""\n\nAssess it against the four criteria (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy), scaled fairly for its short length. Respond ONLY with strict JSON, no markdown fences, exactly:\n{"band":"estimated band as a number like 6.5","errors":[{"from":"exact fragment with an error","to":"correction","why":"brief reason"}],"rewrite":"the full response rewritten at Band 7.5 level, similar length, keeping the student’s ideas","note":"2–3 sentences: the single most important thing to improve next, plus one genuine strength"}\n\nList at most 6 errors, the most instructive ones.';
}
function runClaude(obj,day,kind){
  const key=S.settings.apiKey;
  if(!key){toast('Add your Claude API key in settings first.');return;}
  const q=kind==='essay'?(PROMPTS[obj.pi]||{}).q||'':'';
  obj.busyAI=true;obj.err=null;rerender(day,kind);
  fetch('https://api.anthropic.com/v1/messages',{method:'POST',
    headers:{'content-type':'application/json','x-api-key':key,
      'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model:S.settings.model||'claude-sonnet-5',max_tokens:1400,
      messages:[{role:'user',content:claudePrompt(kind,obj.text,q)}]})})
  .then(r=>r.json().then(j=>({ok:r.ok,j})))
  .then(({ok,j})=>{
    obj.busyAI=false;
    if(!ok){throw new Error((j.error&&j.error.message)||'API error');}
    let raw=(j.content||[]).filter(c=>c&&typeof c.text==='string').map(c=>c.text).join('\n');
    const a=raw.indexOf('{'),b=raw.lastIndexOf('}');
    if(a<0||b<=a)throw new Error('Unexpected reply format');
    const f=JSON.parse(raw.slice(a,b+1));
    obj.fb={band:f.band||'',errors:Array.isArray(f.errors)?f.errors:[],rewrite:f.rewrite||'',note:f.note||''};
    save();rerender(day,kind);
  })
  .catch(e=>{obj.busyAI=false;obj.err='Examiner feedback failed: '+e.message;save();rerender(day,kind);});
}
function rerender(day,kind){
  if(curView!=='today')return;
  if(kind==='intention')renderIntention(day);else renderEssay(day);
}

/* ================= RENDER · JOURNEY ================= */
function renderJourney(){
  const t=todayKey(),n=Math.max(1,dayN(t)),y=totalDays();
  const phase=getPhase(n);
  const keys=elapsedKeys();
  let scoreSum=0,scoreN=0,blocksDone=0,fullDays=0,ritKept=0,essays=0,intents=0;
  keys.forEach(k=>{
    const d=S.days[k];
    const hasTracked=d?tracked(d).length>0:(S.settings.template[dowKey(k)]||[]).some(b=>b.type!=='routine');
    if(hasTracked){scoreSum+=d?dayScore(d).p:0;scoreN++;if(d&&dayScore(d).p===100)fullDays++;}
    if(d){
      blocksDone+=tracked(d).filter(b=>d.checks[b.id]==='done').length;
      if(ritualDone(d))ritKept++;
      if(d.essay&&d.essay.done)essays++;
      if(d.intention&&d.intention.text)intents++;
    }
  });
  const consist=scoreN?Math.round(scoreSum/scoreN):0;
  const words=keys.length*3;
  const stk=currentStreak(),bst=bestStreak();
  const pct=Math.max(0,Math.min(100,Math.round(n/y*100)));

  let h='<div class="jhero">'+
    '<span class="k ox">'+esc(phase.name)+'</span>'+
    '<div class="arttitle serif">The Journey</div>'+
    '<div class="artsub">'+esc(phase.mantra)+'</div>'+
    '<div class="cpnum" style="margin-top:8px"><b>Day '+n+' <small>of '+y+'</small></b><span>'+pct+'%</span></div>'+
    '<div class="cpbar"><i style="width:'+pct+'%"></i></div>'+
    '<div class="cpsub"><span>Started '+fmtShort(S.settings.cycleStart)+'</span><span>Exam '+fmtShort(S.settings.ieltsDate)+'</span></div>'+
    '</div>';

  h+='<div class="sect"><div class="shead"><span class="k">The numbers</span></div><div class="kgrid">'+
    '<div class="kpi hl"><b>'+consist+'<small>%</small></b><span>Consistency</span></div>'+
    '<div class="kpi"><b>'+stk+'<small> days</small></b><span>Current streak · best '+bst+'</span></div>'+
    '<div class="kpi"><b>'+blocksDone+'</b><span>Blocks completed</span></div>'+
    '<div class="kpi"><b>'+fullDays+'</b><span>Perfect days</span></div>'+
    '<div class="kpi"><b>'+essays+'</b><span>Essays filed</span></div>'+
    '<div class="kpi"><b>'+words+'</b><span>Words banked</span></div>'+
    '</div></div>';

  h+='<div class="sect"><div class="shead"><span class="k">Map of constancy</span><span class="snum">'+keys.length+' days</span></div>'+
    heatmap()+
    '<div class="legend"><span><i style="background:#EDE8DE"></i>No record</span>'+
    '<span><i style="background:#B9CDBB"></i>Partial</span>'+
    '<span><i style="background:#3E6B4F"></i>Perfect day</span>'+
    '<span><i style="background:transparent;border:1px solid #CFC6B5"></i>Ahead</span></div></div>';

  h+='<div class="sect"><div class="shead"><span class="k">Weekly rhythm</span><span class="snum">% completed</span></div>'+weeklyChart()+'</div>';

  h+='<div class="sect"><div class="shead"><span class="k">Disciplines</span></div>';
  [['Study','var(--navy)',keys.filter(k=>S.days[k]&&studyDone(S.days[k])).length],
   ['Training','var(--ok)',keys.filter(k=>{const d=S.days[k];return d&&d.tpl.some(b=>b.type==='training'&&d.checks[b.id]==='done');}).length],
   ['Ritual','var(--gold)',ritKept],
   ['Essays','var(--ox)',essays]].forEach(([lb,cl,ct])=>{
    const p=keys.length?Math.round(ct/keys.length*100):0;
    h+='<div class="frow2"><span class="fl" style="color:'+cl+'">'+lb+'</span>'+
      '<div class="bar"><i style="width:'+p+'%;background:'+cl+'"></i></div>'+
      '<span class="fp">'+ct+'/'+keys.length+' days</span></div>';
  });
  h+='</div>';

  /* essay archive */
  const arc=keys.slice().reverse().map(k=>({k,d:S.days[k]})).filter(o=>o.d&&o.d.essay&&o.d.essay.done).slice(0,14);
  if(arc.length){
    h+='<div class="sect"><div class="shead"><span class="k">The essay archive</span><span class="snum">'+arc.length+'</span></div>';
    arc.forEach(o=>{
      const pr=PROMPTS[o.d.essay.pi]||{};
      h+='<button class="arcrow" data-k="'+o.k+'"><small>'+fmtShort(o.k)+' · '+esc(pr.c||'')+
        (o.d.essay.fb&&o.d.essay.fb.band?' · <span class="arcband">Band '+esc(String(o.d.essay.fb.band))+'</span>':'')+'</small>'+
        '<div class="arcq">'+esc((pr.q||'').slice(0,110))+((pr.q||'').length>110?'…':'')+'</div></button>';
    });
    h+='</div>';
  }

  /* word bank — last 7 days of terms */
  const wb=[];
  keys.slice(-7).reverse().forEach(k=>{
    const d=S.days[k];if(!d)return;
    (EDITIONS[d.ed]||{w:[]}).w.forEach(tm=>wb.push({k,tm}));
  });
  if(wb.length){
    h+='<div class="sect"><div class="shead"><span class="k">The word bank · last 7 days</span><span class="snum">'+words+' total</span></div>'+
      wb.map(o=>'<div class="wlrow"><span class="wlw">'+esc(o.tm.w)+'</span><span class="wlk">'+esc(o.tm.k.split('·')[0].trim())+' · '+fmtShort(o.k)+'</span></div>').join('')+'</div>';
  }

  /* intentions */
  const ints=keys.slice().reverse().map(k=>({k,d:S.days[k]})).filter(o=>o.d&&o.d.intention&&o.d.intention.text).slice(0,7);
  if(ints.length){
    h+='<div class="sect"><div class="shead"><span class="k">In your own words</span><span class="snum">'+intents+'</span></div>'+
      ints.map(o=>'<div class="intarc"><small>'+fmtShort(o.k)+'</small><em>“'+esc(o.d.intention.text)+'”</em></div>').join('')+'</div>';
  }

  $('#jmain').innerHTML=h;
  $$('#jmain .arcrow').forEach(b=>b.onclick=()=>openEssayArchive(b.dataset.k));
}
function openEssayArchive(k){
  const d=S.days[k];if(!d||!d.essay)return;
  const pr=PROMPTS[d.essay.pi]||{};
  openSheet('<div class="sh"><div><span class="k ox">'+fmtShort(k)+' · '+esc(pr.c||'')+'</span>'+
    '<div class="arttitle" style="font-size:19px;margin-top:6px">'+esc(pr.q||'')+'</div></div>'+
    '<button class="shx" id="shClose">✕</button></div>'+
    '<div class="artbody" style="font-size:15px;margin-top:8px">'+String(d.essay.text||'').split(/\n+/).map(p=>'<p>'+esc(p)+'</p>').join('')+'</div>'+
    renderFb(d.essay,'essay'));
  $('#shClose').onclick=closeSheet;
}

/* ================= HEATMAP + WEEKLY ================= */
function heatmap(){
  const start=S.settings.cycleStart,t=todayKey(),total=totalDays();
  const sd=parseKey(start).getDay();
  const off=(sd+6)%7;
  const weeks=Math.max(1,Math.ceil((total+off)/7));
  const cell=13,gap=3,lx=16;
  const W=lx+weeks*(cell+gap),H=7*(cell+gap)+2;
  let s='<svg class="hm" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMinYMin meet">';
  ['M','T','W','T','F','S','S'].forEach((l,i)=>{
    s+='<text x="0" y="'+(i*(cell+gap)+cell-2)+'" font-size="8" fill="#6E6557">'+l+'</text>';
  });
  for(let i=0;i<total;i++){
    const k=addDays(start,i);
    const pos=i+off,wx=Math.floor(pos/7),wy=pos%7;
    const xp=lx+wx*(cell+gap),yp=wy*(cell+gap);
    let fill='transparent',stroke='#E4DDD0',extra='';
    if(diffDays(t,k)<=0){
      /* future */
    }
    if(diffDays(k,t)>=0){
      const d=S.days[k];
      const p=d?dayScore(d).p:0;
      if(!d)fill='#EDE8DE';
      else if(p===0)fill='#E4DDD0';
      else if(p===100){fill='#3E6B4F';stroke='transparent';}
      else{fill='#B9CDBB';stroke='transparent';}
      if(k===t){stroke='#1B1712';extra=' stroke-width="1.5"';}
    }
    s+='<rect x="'+xp+'" y="'+yp+'" width="'+cell+'" height="'+cell+'" rx="2" fill="'+fill+'" stroke="'+stroke+'"'+extra+'/>';
  }
  s+='</svg>';
  return s;
}
function weeklyChart(){
  const keys=elapsedKeys();
  const wkMap={};
  keys.forEach(k=>{
    const w=Math.floor((dayN(k)-1)/7);
    if(!wkMap[w])wkMap[w]={sum:0,n:0};
    const d=S.days[k];
    const hasTracked=d?tracked(d).length>0:(S.settings.template[dowKey(k)]||[]).some(b=>b.type!=='routine');
    if(hasTracked){wkMap[w].sum+=d?dayScore(d).p:0;wkMap[w].n++;}
  });
  const ws=Object.keys(wkMap).map(Number).sort((a,b)=>a-b);
  if(!ws.length)return'<p class="keynote">No data yet — the first bars appear tomorrow.</p>';
  const W=300,H=110,PB=18,PT=14;
  const bw=Math.min(32,(W-20)/ws.length-8);
  let s='<svg class="chart" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" style="height:110px">';
  ws.forEach((w,i)=>{
    const m=wkMap[w],p=m.n?Math.round(m.sum/m.n):0;
    const x=10+i*((W-20)/ws.length)+((W-20)/ws.length-bw)/2;
    const bh=Math.max(2,(H-PB-PT)*p/100);
    const yb=H-PB-bh;
    s+='<rect x="'+x.toFixed(1)+'" y="'+yb.toFixed(1)+'" width="'+bw+'" height="'+bh.toFixed(1)+'" fill="#22405C" opacity="'+(0.35+0.65*p/100).toFixed(2)+'"/>'+
      '<text x="'+(x+bw/2).toFixed(1)+'" y="'+(yb-4).toFixed(1)+'" text-anchor="middle" font-size="9" fill="#1B1712">'+p+'%</text>'+
      '<text x="'+(x+bw/2).toFixed(1)+'" y="'+(H-5)+'" text-anchor="middle" font-size="9" fill="#6E6557">W'+(w+1)+'</text>';
  });
  s+='</svg>';
  return s;
}

/* ================= SHEET ================= */
function openSheet(html){
  $('#sheet').innerHTML='<div class="in">'+html+'</div>';
  $('#sheet').classList.remove('hidden');
  $('#backdrop').classList.remove('hidden');
  $('#backdrop').onclick=closeSheet;
}
function closeSheet(){$('#sheet').classList.add('hidden');$('#backdrop').classList.add('hidden');}

/* ================= SETTINGS ================= */
const DAY_ORDER=['1','2','3','4','5','6','0'];
const TAB_LABEL={'1':'Mon','2':'Tue','3':'Wed','4':'Thu','5':'Fri','6':'Sat','0':'Sun'};
let tplTab=DAY_ORDER.includes(String(new Date().getDay()))?String(new Date().getDay()):'1';
function openSettings(){
  showView('settings');
  $('#sIelts').value=S.settings.ieltsDate;
  $('#sStart').value=S.settings.cycleStart;
  $('#sKey').value=S.settings.apiKey||'';
  $('#sModel').value=S.settings.model||'claude-sonnet-5';
  renderRitEditor();renderTplEditor();
  window.scrollTo(0,0);
}
function renderRitEditor(){
  $('#ritRows').innerHTML=S.settings.ritualSteps.map((t,i)=>
    '<div class="srow">'+
    '<button class="sarr" data-a="up" data-i="'+i+'" '+(i===0?'disabled':'')+'>&#8593;</button>'+
    '<button class="sarr" data-a="dn" data-i="'+i+'" '+(i===S.settings.ritualSteps.length-1?'disabled':'')+'>&#8595;</button>'+
    '<input class="nam" data-i="'+i+'" value="'+esc(t)+'">'+
    '<button class="sdel" data-i="'+i+'">✕</button></div>').join('');
  $$('#ritRows input').forEach(el=>el.onchange=()=>{
    S.settings.ritualSteps[+el.dataset.i]=el.value.trim()||S.settings.ritualSteps[+el.dataset.i];save();
  });
  $$('#ritRows .sdel').forEach(d=>d.onclick=()=>{S.settings.ritualSteps.splice(+d.dataset.i,1);save();renderRitEditor();});
  $$('#ritRows .sarr').forEach(bt=>bt.onclick=()=>{
    const i=+bt.dataset.i,j=bt.dataset.a==='up'?i-1:i+1;
    const a=S.settings.ritualSteps;
    if(j<0||j>=a.length)return;
    [a[i],a[j]]=[a[j],a[i]];save();renderRitEditor();
  });
}
function renderTplEditor(){
  $('#dayTabs').innerHTML=DAY_ORDER.map(g=>
    '<button class="chip'+(g===tplTab?' on':'')+'" data-g="'+g+'">'+TAB_LABEL[g]+'</button>').join('');
  $$('#dayTabs .chip').forEach(c=>c.onclick=()=>{tplTab=c.dataset.g;renderTplEditor();});
  $('#copyTo').innerHTML='<option value="">Copy '+TAB_LABEL[tplTab]+' to…</option>'+
    DAY_ORDER.filter(g=>g!==tplTab).map(g=>'<option value="'+g+'">'+TAB_LABEL[g]+'</option>').join('')+
    '<option value="wk">All weekdays</option>';
  if(!S.settings.template[tplTab])S.settings.template[tplTab]=[];
  const rows=S.settings.template[tplTab];
  $('#tplRows').innerHTML=rows.map((b,i)=>
    '<div class="srow">'+
    '<button class="sarr" data-a="up" data-i="'+i+'" '+(i===0?'disabled':'')+'>&#8593;</button>'+
    '<button class="sarr" data-a="dn" data-i="'+i+'" '+(i===rows.length-1?'disabled':'')+'>&#8595;</button>'+
    '<input class="tim" data-i="'+i+'" data-f="start" value="'+esc(b.start)+'" inputmode="numeric">'+
    '<input class="tim" data-i="'+i+'" data-f="end" value="'+esc(b.end)+'" inputmode="numeric">'+
    '<input class="nam" data-i="'+i+'" data-f="name" value="'+esc(b.name)+'">'+
    '<select data-i="'+i+'" data-f="type">'+['study','training','routine'].map(t=>'<option'+(b.type===t?' selected':'')+'>'+t+'</option>').join('')+'</select>'+
    '<button class="sdel" data-i="'+i+'">✕</button>'+
    '</div>').join('');
  $$('#tplRows input,#tplRows select').forEach(el=>el.onchange=()=>{
    S.settings.template[tplTab][+el.dataset.i][el.dataset.f]=el.value;save();
  });
  $$('#tplRows .sdel').forEach(d=>d.onclick=()=>{S.settings.template[tplTab].splice(+d.dataset.i,1);save();renderTplEditor();});
  $$('#tplRows .sarr').forEach(bt=>bt.onclick=()=>{
    const i=+bt.dataset.i,j=bt.dataset.a==='up'?i-1:i+1;
    const a=S.settings.template[tplTab];
    if(j<0||j>=a.length)return;
    [a[i],a[j]]=[a[j],a[i]];save();renderTplEditor();
  });
}

/* ================= VIEWS ================= */
function showView(v){
  curView=v;
  $('#vToday').classList.toggle('hidden',v!=='today');
  $('#vJourney').classList.toggle('hidden',v!=='journey');
  $('#vLexicon').classList.toggle('hidden',v!=='lexicon');
  $('#vSettings').classList.toggle('hidden',v!=='settings');
  $('#nav').classList.toggle('hidden',v==='settings');
  $('#navToday').classList.toggle('on',v==='today');
  $('#navJourney').classList.toggle('on',v==='journey');
  $('#navLex').classList.toggle('on',v==='lexicon');
  if(v==='journey')renderJourney();
  if(v==='lexicon')renderLexicon();
  if(v==='today')renderAll();
  window.scrollTo(0,0);
}
function renderAll(){
  const day=ensureDay(VK);
  renderMast();renderDayNav();renderCover(day);renderMorning(day);
  renderIntention(day);renderRitual(day);renderDaywork(day);renderVocab();renderEssay(day);
  $('#footline').textContent=FOOTLINES[Math.max(0,dayN(VK))%FOOTLINES.length];
}

/* ================= INIT ================= */
function init(){
  load();
  VK=todayKey();
  if(diffDays(S.settings.cycleStart,VK)<0)VK=S.settings.cycleStart;
  renderAll();
  $('#btnSet').onclick=openSettings;
  $('#btnBack').onclick=()=>showView('today');
  $('#btnInfo').onclick=()=>openSheet(
    '<div class="sh"><div class="arttitle" style="font-size:21px">About this publication</div><button class="shx" id="shClose">✕</button></div>'+
    '<div class="artbody" style="font-size:15px"><p>The London Review is a private daily — one reader, one goal: IELTS Band 7.0 and a master’s in London.</p>'+
    '<p>Each edition opens with a Morning Page and three terms to bank, asks for one intention in English (with examiner feedback), guards the ritual, tracks the day’s work, and closes with a short essay.</p>'+
    '<p>Written mornings compound. That is the entire editorial policy.</p></div>');
  setTimeout(()=>{const c=$('#shClose');if(c)c.onclick=closeSheet;},0);
  $('#navToday').onclick=()=>showView('today');
  $('#navJourney').onclick=()=>showView('journey');
  $('#navLex').onclick=()=>showView('lexicon');
  $('#dPrev').onclick=()=>{if(diffDays(S.settings.cycleStart,VK)>0){VK=addDays(VK,-1);editDay=false;renderAll();}};
  $('#dNext').onclick=()=>{if(VK!==todayKey()){VK=addDays(VK,1);editDay=false;renderAll();}};
  $('#sIelts').onchange=e=>{S.settings.ieltsDate=e.target.value;save();};
  $('#sStart').onchange=e=>{S.settings.cycleStart=e.target.value;save();};
  $('#sKey').onchange=e=>{S.settings.apiKey=e.target.value.trim();save();toast(S.settings.apiKey?'Key saved in this browser.':'Key removed.');};
  $('#sModel').onchange=e=>{S.settings.model=e.target.value;save();};
  $('#ritAdd').onclick=()=>{S.settings.ritualSteps.push('New step');save();renderRitEditor();};
  $('#tplAdd').onclick=()=>{
    S.settings.template[tplTab].push({id:'x'+Date.now().toString(36),start:'12:00',end:'13:00',name:'New block',type:'study'});
    save();renderTplEditor();
  };
  $('#copyDay').onclick=()=>{
    const v=$('#copyTo').value;if(!v)return;
    const targets=v==='wk'?['1','2','3','4','5'].filter(d=>d!==tplTab):[v];
    if(!confirm('Replace the template of '+(v==='wk'?'all weekdays':TAB_LABEL[v])+' with '+TAB_LABEL[tplTab]+'’s?'))return;
    targets.forEach(d=>{S.settings.template[d]=JSON.parse(JSON.stringify(S.settings.template[tplTab]));});
    save();renderTplEditor();
  };
  $('#tplToday').onclick=()=>{
    if(!confirm('Apply the current template to today? Today’s checks will be reset.'))return;
    const t=todayKey(),old=S.days[t];
    delete S.days[t];
    const nd=ensureDay(t);
    if(old){nd.ritual=old.ritual;nd.obstacle=old.obstacle;nd.plan=old.plan;nd.intention=old.intention;nd.essay=old.essay;}
    save();showView('today');
  };
  $('#ioExp').onclick=()=>{$('#ioArea').value=JSON.stringify(S);$('#ioArea').select();};
  $('#ioImp').onclick=()=>{
    try{
      const p=JSON.parse($('#ioArea').value);
      if(!p.settings||!p.days)throw 0;
      S=Object.assign(defaults(),p);save();location.reload();
    }catch(e){alert('Invalid JSON.');}
  };
  $('#wipeAll').onclick=()=>{
    if(!confirm('Erase ALL progress and restart from day one?'))return;
    if(!confirm('Absolutely sure? This cannot be undone.'))return;
    localStorage.removeItem(K);location.reload();
  };
  setInterval(()=>{
    if(curView!=='today'||editDay)return;
    if(!$('#sheet').classList.contains('hidden'))return;
    const t=todayKey();
    if(VK!==t&&!S.days[t]){VK=t;renderAll();return;}
    if(VK===t){const d=ensureDay(t);renderDaywork(d);}
  },60000);
}
init();
