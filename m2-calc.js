(function(){
function init(){
if(window.m2cReady) return;
if(!document.getElementById('m2c-root')) return;
window.m2cReady = true;

var WEBHOOK = 'https://formsubmit.co/ajax/daovladimir_01@mail.ru';
var YM_ID = 108662561;
var prices = {cosmetic:6500, comfort:14000, design:22000};
var typeMult = {studio:1, '1k':1, '2k':1.05, '3k':1.1, '4k':1.2};
var condMult = {rough:1, pre:0.85, old:1.15, cosmetic:0.5};
var terms = {cosmetic:'14-30', comfort:'60-75', design:'90-120'};
var typeNames = {studio:'Студия','1k':'1-комнатная','2k':'2-комнатная','3k':'3-комнатная','4k':'4+ комнат'};
var condNames = {rough:'Новостройка черновая',pre:'Новостройка предчистовая',old:'Вторичка со старым ремонтом',cosmetic:'Косметика без капремонта'};
var repairNames = {cosmetic:'Косметический',comfort:'Комфорт',premium:'Премиум',design:'Дизайнерский'};

var step = 0, started = false;
var data = {type:null, area:50, condition:null, repair:null};

function ymGoal(n){if(typeof ym!=='undefined'){try{ym(YM_ID,'reachGoal',n);}catch(e){}}}
function fmt(n){return n.toLocaleString('ru-RU');}
function calc(){
var b = prices[data.repair]*data.area*typeMult[data.type]*condMult[data.condition];
return {min:Math.round(b*0.9/10000)*10000, max:Math.round(b*1.2/10000)*10000, term:terms[data.repair]};
}
function svg(t){
var s = {
studio:'<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="2" fill="currentColor"/></svg>',
'1k':'<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="4" x2="18" y2="32" stroke="currentColor" stroke-width="1.5"/></svg>',
'2k':'<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="4" x2="18" y2="32" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>',
'3k':'<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="4" x2="18" y2="32" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="14" x2="18" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="22" x2="32" y2="22" stroke="currentColor" stroke-width="1.5"/></svg>',
'4k':'<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="4" x2="18" y2="32" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="18" x2="32" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>'
};
return s[t]||'';
}

function progBar(){
var html='';
for(var i=0;i<4;i++) html+='<div class="m2c-prog-s'+(i<=step?' on':'')+'"></div>';
var p=document.getElementById('m2c-prog');
if(p) p.innerHTML=html;
}

function pickHandler(key){
return function(){
if(!started){started=true; ymGoal('calculator_start');}
data[key]=this.dataset.v;
var opts=document.querySelectorAll('#m2c-content .m2c-opt');
for(var i=0;i<opts.length;i++) opts[i].classList.remove('sel');
this.classList.add('sel');
document.getElementById('m2c-next').disabled=false;
};
}

function render(){
progBar();
var content=document.getElementById('m2c-content');
var back=document.getElementById('m2c-back');
var next=document.getElementById('m2c-next');
if(!content||!back||!next) return;
var html='';

if(step===0){
html+='<p class="m2c-lbl">Шаг 1 из 4</p><h3 class="m2c-h">Какая у вас квартира?</h3><div class="m2c-opts g5">';
var t=[['studio','Студия','до 30 м\u00B2'],['1k','1-комн.','30-45 м\u00B2'],['2k','2-комн.','45-65 м\u00B2'],['3k','3-комн.','65-90 м\u00B2'],['4k','4+ комн.','от 90 м\u00B2']];
for(var i=0;i<t.length;i++){
var sel=data.type===t[i][0]?' sel':'';
html+='<button class="m2c-opt'+sel+'" data-v="'+t[i][0]+'">'+svg(t[i][0])+'<div><div class="m2c-opt-t">'+t[i][1]+'</div><div class="m2c-opt-d">'+t[i][2]+'</div></div></button>';
}
html+='</div>';
content.innerHTML=html;
back.style.display='none';
next.style.display='flex';
next.textContent='Далее \u2192';
next.disabled=!data.type;
var btns=content.querySelectorAll('.m2c-opt');
for(var j=0;j<btns.length;j++) btns[j].onclick=pickHandler('type');

} else if(step===1){
html+='<p class="m2c-lbl">Шаг 2 из 4</p><h3 class="m2c-h">Площадь квартиры</h3>';
html+='<div class="m2c-slider"><div class="m2c-slider-v"><span id="m2c-area">'+data.area+'</span><sub>м\u00B2</sub></div>';
html+='<input type="range" min="20" max="200" step="1" value="'+data.area+'" class="m2c-range" id="m2c-range">';
html+='<div class="m2c-marks"><span>20 м\u00B2</span><span>110 м\u00B2</span><span>200 м\u00B2</span></div></div>';
content.innerHTML=html;
back.style.display='block';
next.style.display='flex';
next.textContent='Далее \u2192';
next.disabled=false;
document.getElementById('m2c-range').oninput=function(){
data.area=parseInt(this.value);
document.getElementById('m2c-area').textContent=data.area;
};

} else if(step===2){
html+='<p class="m2c-lbl">Шаг 3 из 4</p><h3 class="m2c-h">Состояние квартиры</h3><div class="m2c-opts g2">';
var c=[['rough','Новостройка черновая','Голые стены, нужен полный цикл'],['pre','Новостройка предчистовая','Базовая отделка от застройщика'],['old','Вторичка со старым ремонтом','Нужен демонтаж старой отделки'],['cosmetic','Косметика без капремонта','Только финишная отделка']];
for(var k=0;k<c.length;k++){
var sel2=data.condition===c[k][0]?' sel':'';
html+='<button class="m2c-opt m2c-opt-row'+sel2+'" data-v="'+c[k][0]+'"><div><div class="m2c-opt-t">'+c[k][1]+'</div><div class="m2c-opt-d">'+c[k][2]+'</div></div></button>';
}
html+='</div>';
content.innerHTML=html;
back.style.display='block';
next.style.display='flex';
next.textContent='Далее \u2192';
next.disabled=!data.condition;
var btns2=content.querySelectorAll('.m2c-opt');
for(var l=0;l<btns2.length;l++) btns2[l].onclick=pickHandler('condition');

} else if(step===3){
html+='<p class="m2c-lbl">Шаг 4 из 4</p><h3 class="m2c-h">Тип ремонта</h3><div class="m2c-opts g2">';
var r=[['cosmetic','Косметический','от 6 500 \u20BD/м\u00B2 \u00B7 обои, покраска, пол'],['comfort','Комфорт','от 14 000 \u20BD/м\u00B2 \u00B7 полный ремонт под ключ'],['premium','Премиум','от 22 000 \u20BD/м\u00B2 \u00B7 премиальные материалы'],['design','Дизайнерский','от 32 000 \u20BD/м\u00B2 \u00B7 авторский 3D-проект']];
for(var m=0;m<r.length;m++){
var sel3=data.repair===r[m][0]?' sel':'';
html+='<button class="m2c-opt m2c-opt-row'+sel3+'" data-v="'+r[m][0]+'"><div><div class="m2c-opt-t">'+r[m][1]+'</div><div class="m2c-opt-d">'+r[m][2]+'</div></div></button>';
}
html+='</div>';
content.innerHTML=html;
back.style.display='block';
next.style.display='flex';
next.textContent='Рассчитать \u2192';
next.disabled=!data.repair;
var btns3=content.querySelectorAll('.m2c-opt');
for(var n=0;n<btns3.length;n++) btns3[n].onclick=pickHandler('repair');

} else if(step===4){
ymGoal('calculator_result_shown');
var rs=calc();
html+='<div class="m2c-result">';
html+='<p class="m2c-r-lbl">Стоимость вашего ремонта</p>';
html+='<p class="m2c-r-price">'+fmt(rs.min)+' \u2014 '+fmt(rs.max)+' \u20BD</p>';
html+='<p class="m2c-r-note">Это предварительная оценка. Менеджер рассчитает точную смету после бесплатного замера.</p>';
html+='<div class="m2c-r-grid">';
html+='<div class="m2c-r-item"><p class="m2c-r-i-l">Срок</p><p class="m2c-r-i-v">'+rs.term+' дней</p></div>';
html+='<div class="m2c-r-item"><p class="m2c-r-i-l">Гарантия</p><p class="m2c-r-i-v">3 года</p></div>';
html+='<div class="m2c-r-item"><p class="m2c-r-i-l">Договор</p><p class="m2c-r-i-v">Фикс смета</p></div>';
html+='</div>';
html+='<form class="m2c-form" id="m2c-form">';
html+='<input type="text" name="name" placeholder="Ваше имя" required>';
html+='<input type="tel" name="phone" placeholder="Телефон для связи" required>';
html+='<label class="m2c-agree"><input type="checkbox" id="m2c-agree-cb" checked><span class="m2c-agree-t">Нажимая кнопку, я соглашаюсь с <a href="https://m2-nvrsk.ru/politika-konfidencialnosti" target="_blank">политикой конфиденциальности</a> и даю согласие на обработку персональных данных</span></label>';
html+='<button type="submit" class="m2c-submit" id="m2c-submit">Получить точный расч\u0451т</button>';
html+='</form></div>';
content.innerHTML=html;
back.style.display='block';
next.style.display='none';
document.getElementById('m2c-form').onsubmit=submitForm;

} else if(step===5){
content.innerHTML='<div class="m2c-success"><div class="m2c-s-icon">\u2713</div><h3 class="m2c-s-t">Спасибо! Заявка отправлена</h3><p class="m2c-s-x">Менеджер свяжется с вами в течение 15 минут и рассчитает точную стоимость.</p></div>';
back.style.display='none';
next.style.display='none';
}
}

function submitForm(e){
e.preventDefault();
var f=e.target;
var name=f.name.value.trim();
var phone=f.phone.value.trim();
var agree=document.getElementById('m2c-agree-cb').checked;
if(name.length<2){alert('Введите имя'); return;}
if(phone.length<10){alert('Введите корректный телефон'); return;}
if(!agree){alert('Необходимо согласие на обработку персональных данных'); return;}
var btn=document.getElementById('m2c-submit');
btn.disabled=true;
btn.textContent='Отправляем...';
var rs=calc();
var payload={
_subject:'Заявка с калькулятора - M2 Новороссийск',
_template:'table',
_captcha:'false',
'Имя':name,
'Телефон':phone,
'Тип квартиры':typeNames[data.type],
'Площадь':data.area+' м\u00B2',
'Состояние':condNames[data.condition],
'Тип ремонта':repairNames[data.repair],
'Расч\u0451тная стоимость':fmt(rs.min)+' \u2014 '+fmt(rs.max)+' \u20BD',
'Срок':rs.term+' дней',
'Источник':'Калькулятор сайта',
'UTM':'utm_source=calculator&utm_medium=site_form'
};
fetch(WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
.then(function(r){return r.json();})
.then(function(){ymGoal('calculator_form_submit'); ymGoal('calculator_complete'); step=5; render();})
.catch(function(){btn.disabled=false; btn.textContent='Получить точный расч\u0451т'; alert('Не удалось отправить заявку. Позвоните: +7 900 292 3615');});
}

document.getElementById('m2c-back').onclick=function(){if(step>0){step--; render();}};
document.getElementById('m2c-next').onclick=function(){
if(step<4){
step++;
if(step===1) ymGoal('calculator_step_2');
else if(step===2) ymGoal('calculator_step_3');
else if(step===3) ymGoal('calculator_step_4');
render();
}
};

render();
}

if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',init);
} else {
init();
}
setTimeout(init, 1000);
setTimeout(init, 3000);
})();
