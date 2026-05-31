(function(){
  function init(){
    if(window.m2cReadyInitialized) return;
    if(!document.getElementById('m2c-root')) return;
    window.m2cReadyInitialized = true;

    var ALBATO_URL = 'https://h.albato.ru/wh/38/1lfdal7/j0yLMXtDYLWSsqsCoc_siTb4eTAuz4ZDI_FGDL1DHA0/';
    var YM_ID = 108662561;
    var prices = {cosmetic:6500, comfort:14000, design:22000};
    var typeMult = {studio:1, '1k':1, '2k':1.05, '3k':1.1, '4k':1.2};
    var condMult = {rough:1, pre:0.85, old:1.15, cosmetic:0.5};
    var terms = {cosmetic:'14–30', comfort:'60–75', design:'90–120'};
    var typeNames = {studio:'Студия','1k':'1-комнатная','2k':'2-комнатная','3k':'3-комнатная','4k':'4+ комнат'};
    var condNames = {rough:'Новостройка черновая',pre:'Новостройка предчистовая',old:'Вторичка со старым ремонтом',cosmetic:'Косметика без капремонта'};
    var repairNames = {cosmetic:'Косметический',comfort:'Комфорт',design:'Дизайнерский'};
    
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

    function toggleBtn(btn, disable) {
      if(!btn) return;
      btn.disabled = disable;
      if(disable) {
        btn.setAttribute('disabled', 'true');
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';
      } else {
        btn.removeAttribute('disabled');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      }
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
        toggleBtn(document.getElementById('m2c-next'), false);
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
        var t=[['studio','Студия','до 30 м²'],['1k','1-комн.','30–45 м²'],['2k','2-комн.','45–65 м²'],['3k','3-комн.','65–90 м²'],['4k','4+ комн.','от 90 м²']];
        for(var i=0;i<t.length;i++){
          var sel=data.type===t[i][0]?' sel':'';
          html+='<button class="m2c-opt'+sel+'" data-v="'+t[i][0]+'">'+svg(t[i][0])+'<div><div class="m2c-opt-t">'+t[i][1]+'</div><div class="m2c-opt-d">'+t[i][2]+'</div></div></button>';
        }
        html+='</div>';
        content.innerHTML=html;
        back.style.display='none';
        next.style.display='flex';
        next.textContent='Далее →';
        toggleBtn(next, !data.type);
        var btns=content.querySelectorAll('.m2c-opt');
        for(var j=0;j<btns.length;j++) btns[j].onclick=pickHandler('type');

      } else if(step===1){
        html+='<p class="m2c-lbl">Шаг 2 из 4</p><h3 class="m2c-h">Площадь квартиры</h3>';
        html+='<div class="m2c-slider"><div class="m2c-slider-v"><span id="m2c-area">'+data.area+'</span><sub>м²</sub></div>';
        html+='<input type="range" min="20" max="200" step="1" value="'+data.area+'" class="m2c-range" id="m2c-range">';
        html+='<div class="m2c-marks"><span>20 м²</span><span>110 м²</span><span>200 м²</span></div></div>';
        content.innerHTML=html;
        back.style.display='block';
        next.style.display='flex';
        next.textContent='Далее →';
        toggleBtn(next, false);
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
        next.textContent='Далее →';
        toggleBtn(next, !data.condition);
        var btns2=content.querySelectorAll('.m2c-opt');
        for(var l=0;l<btns2.length;l++) btns2[l].onclick=pickHandler('condition');

      } else if(step===3){
        html+='<p class="m2c-lbl">Шаг 4 из 4</p><h3 class="m2c-h">Тип ремонта</h3><div class="m2c-opts g2">';
        var r=[['cosmetic','Косметический','от 6 500 ₽/м² · обои, покраска, пол'],['comfort','Комфорт','от 14 000 ₽/м² · полный ремонт под ключ'],['design','Дизайнерский','от 22 000 ₽/м² · авторский 3D-проект']];
        for(var m=0;m<r.length;m++){
          var sel3=data.repair===r[m][0]?' sel':'';
          html+='<button class="m2c-opt m2c-opt-row'+sel3+'" data-v="'+r[m][0]+'"><div><div class="m2c-opt-t">'+r[m][1]+'</div><div class="m2c-opt-d">'+r[m][2]+'</div></div></button>';
        }
        html+='</div>';
        content.innerHTML=html;
        back.style.display='block';
        next.style.display='flex';
        next.textContent='Рассчитать →';
        toggleBtn(next, !data.repair);
        var btns3=content.querySelectorAll('.m2c-opt');
        for(var n=0;n<btns3.length;n++) btns3[n].onclick=pickHandler('repair');

      } else if(step===4){
        ymGoal('calculator_result_shown');
        html+='<div class="m2c-result">';
        html+='<p class="m2c-r-lbl">ВАШ РАСЧЕТ СТОИМОСТИ ГОТОВ!</p>';
        html+='<p class="m2c-r-price" style="font-size:32px;font-weight:700;line-height:1.3;margin:20px 0;color:#22c55e;">Оставьте заявку, чтобы узнать стоимость ремонта</p>';
        html+='<p class="m2c-r-note" style="font-size:15px;color:rgba(255,255,255,.7);">Впишите свои данные ниже — мы закрепим за вашим номером скидку и пришлём готовую смету в течение 15 минут.</p>';
        html+='<div class="m2c-r-grid">';
        html+='<div class="m2c-r-item"><p class="m2c-r-i-l">Срок расчета</p><p class="m2c-r-i-v">15 минут</p></div>';
        html+='<div class="m2c-r-item"><p class="m2c-r-i-l">Гарантия</p><p class="m2c-r-i-v">3 года</p></div>';
        html+='<div class="m2c-r-item"><p class="m2c-r-i-l">Договор</p><p class="m2c-r-i-v">Фикс смета</p></div>';
        html+='</div>';
        html+='<form class="m2c-form" id="m2c-form">';
        html+='<input type="text" name="name" placeholder="Ваше имя" required>';
        html+='<input type="tel" name="phone" id="m2c-phone" placeholder="Телефон для связи" required>';
        html+='<label class="m2c-agree"><input type="checkbox" id="m2c-agree-cb" required><span class="m2c-agree-t">Нажимая кнопку, я соглашаюсь с <a href="https://m2-nvrsk.ru/politika-konfidencialnosti" target="_blank">политикой конфиденциальности</a> и даю согласие на обработку персональных данных</span></label>';
        html+='<button type="submit" class="m2c-submit" id="m2c-submit">Получить стоимость ремонта за 15 минут</button>';
        html+='</form></div>';
        content.innerHTML=html;
        back.style.display='block';
        next.style.display='none';

        var pInput = document.getElementById('m2c-phone');
        if (pInput) {
          pInput.addEventListener('input', function () {
            let matrix = "+7 (___) ___-__-__", i = 0, def = matrix.replace(/\D/g, ""), val = this.value.replace(/\D/g, "");
            if (def.length >= val.length) val = def;
            this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
            });
          });
        }

        document.getElementById('m2c-form').onsubmit=submitForm;

      } else if(step===5){
        content.innerHTML='<div class="m2c-success"><div class="m2c-s-icon">✓</div><h3 class="m2c-s-t">Спасибо! Заявка принята</h3><p class="m2c-s-x">Менеджер свяжется с вами в течение 15 минут и рассчитает точную стоимость.</p><p class="m2c-s-x" style="margin-top:12px;font-size:14px;opacity:.7">Если вам удобнее — позвоните сами:<br><a href="tel:+79002923615" style="color:inherit;font-weight:600;font-size:18px">+7 900 292 3615</a></p></div>';
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
      if(phone.length<18){alert('Введите корректный телефон'); return;}
      if(!agree){alert('Необходимо согласие на обработку персональных данных'); return;}

      var btn=document.getElementById('m2c-submit');
      if(btn) {
        btn.disabled=true;
        btn.textContent='Отправка...';
      }

      var rs=calc();

      var leadData = {
        name: name,
        phone: phone,
        area: data.area,
        type: typeNames[data.type],
        condition: condNames[data.condition],
        repair: repairNames[data.repair],
        total: fmt(rs.min) + ' — ' + fmt(rs.max) + ' ₽',
        term: rs.term + ' дней',
        source: 'Середина сайта (Многошаговый)'
      };

      if(typeof ym!=='undefined'){
        try{ym(YM_ID,'params',{calculator_middle:{type:leadData.type,area:leadData.area,condition:leadData.condition,repair:leadData.repair,price_range:leadData.total,client_name:name,client_phone:phone}});}catch(err){}
      }
      ymGoal('calculator_form_submit');
      ymGoal('calculator_complete');

      fetch(ALBATO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })
      .then(response => {
        if (response.ok) {
          step=5;
          render();
        } else { throw new Error(); }
      })
      .catch(() => {
        alert('Ошибка сети. Попробуйте отправить заявку позже.');
        if(btn) {
          btn.disabled=false;
          btn.textContent='Получить стоимость ремонта за 15 минут';
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
  setTimeout(init, 500);
  setTimeout(init, 1500);
})();
