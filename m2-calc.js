(function(){
function init(){
  if(window.m2cReady) return;
  if(!document.getElementById('m2c-root')) return;
  window.m2cReady = true;

  var WEBHOOK = 'https://h.integrations-hub.ru/wh/27808/1lfe2eu/KdJwEabQEuLu4I_cSQ18hlHKGBEAUnyCyhkdsKCJdU0/';
  var YM_ID = 108662561;
  var prices = {cosmetic:6500, comfort:14000, design:22000};
  var typeMult = {studio:1, '1k':1, '2k':1.05, '3k':1.1, '4k':1.2};
  var condMult = {rough:1, pre:0.85, old:1.15, cosmetic:0.5};
  var terms = {cosmetic:'14-30', comfort:'60-75', design:'75-100'};
  var typeNames = {studio:'Студия','1k':'1-комнатная','2k':'2-комнатная','3k':'3-комнатная','4k':'4+ комнат'};
  var condNames = {rough:'Новостройка черновая',pre:'Новостройка предчистовая',old:'Вторичка со старым ремонтом',cosmetic:'Косметика без капремонта'};
  var repairNames = {cosmetic:'Косметический',comfort:'Комфорт',design:'Дизайнерский'};

  var step = 0, started = false;
  var data = {type:null, area:50, condition:null, repair:null};

  if(!document.getElementById('m2c-spinner-style')){
    var s=document.createElement('style');
    s.id='m2c-spinner-style';
    s.textContent='@keyframes m2cSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}} .m2c-spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:m2cSpin .8s linear infinite;vertical-align:middle;margin-right:8px}';
    document.head.appendChild(s);
  }

  function ymGoal(n){if(typeof ym!=='undefined'){try{ym(YM_ID,'reachGoal',n);}catch(e){}}}
  function ymParams(p){if(typeof ym!=='undefined'){try{ym(YM_ID,'params',p);}catch(e){}}}
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
      '4k':'<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="4" x2="18" y2="32" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="4" x2="18" y2="32" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="18" x2="32" y2="18" stroke="currentColor" stroke-width="1.5"/></svg>'
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
      html+='<p class="m2c-lbl">Шаг 4 из 4</p><h3 class="m2c-h">Тип ремонта</h3><div class="m2c-opts g3">';
      var r=[['cosmetic','Косметический','от 6 500 \u20BD/м\u00B2 \u00B7 обои, покраска, пол'],['comfort','Комфорт','от 14 000 \u20BD/м\u00B2 \u00B7 полный ремонт под ключ'],['design','Дизайнерский','от 22 000 \u20BD/м\u00B2 \u00B7 авторский 3D-проект']];
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
      html+='<p class="m2c-r-note" id="m2c-form-status" style="margin-top:8px;display:none"></p>';
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

  function sendRequest(payload){
    return new Promise(function(resolve, reject){
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timeoutId = setTimeout(function(){
        if(ctrl) ctrl.abort();
        reject(new Error('timeout'));
      }, 10000);

      var opts = {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload),
        mode:'cors'
      };
      if(ctrl) opts.signal = ctrl.signal;

      fetch(WEBHOOK, opts)
        .then(function(r){
          clearTimeout(timeoutId);
          if(r.ok || r.status===200 || r.status===201 || r.status===204) resolve(true);
          else reject(new Error('http_'+r.status));
        })
        .catch(function(err){
          clearTimeout(timeoutId);
          if(err && err.message === 'timeout') reject(err);
          else resolve(true);
        });
    });
  }

  function sendNoCors(payload){
    try{
      fetch(WEBHOOK, {
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload),
        keepalive:true
      });
    }catch(e){}
  }

  function submitForm(e){
    e.preventDefault();
    var f=e.target;
    var name=f.name.value.trim();
    var phone=f.phone.value.trim();
    var agree=document.getElementById('m2c-agree-cb').checked;
    var status=document.getElementById('m2c-form-status');

    if(name.length<2){status.style.display='block'; status.textContent='Пожалуйста, введите имя'; status.style.color='#ef4444'; return;}
    if(phone.length<10){status.style.display='block'; status.textContent='Пожалуйста, введите корректный телефон'; status.style.color='#ef4444'; return;}
    if(!agree){status.style.display='block'; status.textContent='Необходимо согласие на обработку персональных данных'; status.style.color='#ef4444'; return;}

    var btn=document.getElementById('m2c-submit');
    var origBtnHtml='Получить точный расч\u0451т';
    btn.disabled=true;
    btn.innerHTML='<span class="m2c-spinner"></span>Отправляем заявку...';
    status.style.display='block';
    status.style.color='rgba(255,255,255,.6)';
    status.textContent='Отправляем, пожалуйста подождите...';

    var rs=calc();
    var commentLines = [
      'Заявка с калькулятора',
      typeNames[data.type] + ', ' + data.area + ' м\u00B2, ' + condNames[data.condition].toLowerCase(),
      'Тип ремонта: ' + repairNames[data.repair],
      'Расч\u0451т: ' + fmt(rs.min) + ' \u2014 ' + fmt(rs.max) + ' \u20BD',
      'Срок: ' + rs.term + ' дней',
      'Источник: utm_source=calculator&utm_medium=site_form'
    ];
    var payload = {
      Name: phone,
      client_name: name,
      comment: commentLines.join('\n')
    };

    ymParams({
      calculator: {
        type: typeNames[data.type],
        area: data.area,
        condition: condNames[data.condition],
        repair: repairNames[data.repair],
        price_min: rs.min,
        price_max: rs.max,
        term: rs.term
      }
    });

    function success(){
      ymGoal('calculator_form_submit');
      ymGoal('calculator_complete');
      btn.disabled=false;
      btn.innerHTML=origBtnHtml;
      status.style.display='none';
      sendNoCors(payload);
      step=5;
      render();
    }

    function showError(msg){
      btn.disabled=false;
      btn.innerHTML=origBtnHtml;
      status.style.color='#ef4444';
      status.textContent=msg;
    }

    sendRequest(payload)
      .then(success)
      .catch(function(err){
        if(err && err.message === 'timeout'){
          sendNoCors(payload);
          setTimeout(success, 500);
        } else {
          showError('Не удалось отправить. Позвоните: +7 900 292 3615');
        }
      });
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
