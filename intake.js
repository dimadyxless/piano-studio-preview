(() => {
 const form=document.querySelector('#intake-form');if(!form)return;
 const steps=[...form.querySelectorAll('fieldset')], fields=[...form.querySelectorAll('input,textarea')];
 const $=id=>document.getElementById(id);let step=0;
 const review=$('intake-review');
 const heading=s=>s.querySelector('legend');
 function show(n,focus=true){
  step=n;form.hidden=n===steps.length;review.hidden=n!==steps.length;
  steps.forEach((s,i)=>{s.hidden=i!==n;});
  $('intake-back').hidden=n===0;
  $('intake-next').textContent=n===steps.length-1?'Проверить ответы':'Далее';
  $('step-status').textContent=n===steps.length?'Шаг 7 из 7 · Проверка и передача':`Шаг ${n+1} из 7 · ${steps[n].dataset.title}`;
  $('step-progress').value=n+1;
  if(focus)(n===steps.length?$('review-title'):heading(steps[n])).focus();
 }
 function entries(){return fields.map(f=>({label:form.querySelector(`label[for="${f.id}"]`).textContent.trim(),value:f.value.trim()||'Не указано'}));}
 function text(){return 'Музыка на кончиках пальцев\nАнкета для знакомства с семьёй\n\n'+entries().map(e=>e.label+'\n'+e.value).join('\n\n');}
 function render(){
  $('intake-answers').replaceChildren();
  for(const s of steps){
   const section=document.createElement('section'),h=document.createElement('h3'),dl=document.createElement('dl');h.textContent=s.dataset.title;section.append(h,dl);
   for(const f of s.querySelectorAll('input,textarea')){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=form.querySelector(`label[for="${f.id}"]`).textContent.trim();dd.textContent=f.value.trim()||'Не указано';dl.append(dt,dd);}
   $('intake-answers').append(section);
  }
  $('answer-count').textContent=`Заполнено ${fields.filter(f=>f.value.trim()).length} из ${fields.length} вопросов.`;
  $('export-status').textContent='';$('manual-copy').hidden=true;
 }
 form.addEventListener('submit',e=>{e.preventDefault();if(![...steps[step].querySelectorAll('input,textarea')].every(f=>f.reportValidity()))return;if(step===steps.length-1)render();show(step+1);});
 $('intake-back').onclick=()=>show(step-1);
 $('intake-edit').onclick=()=>show(0);
 $('intake-copy').onclick=async()=>{try{await navigator.clipboard.writeText(text());$('export-status').textContent='Ответы скопированы. Теперь их можно вставить в личное сообщение педагогу.';}catch{$('manual-copy').hidden=false;$('copy-text').value=text();$('copy-text').focus();$('copy-text').select();$('export-status').textContent='Автоматическое копирование недоступно. Скопируйте выделенный текст вручную.';}};
 $('intake-download').onclick=()=>{const url=URL.createObjectURL(new Blob(['\uFEFF'+text()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='anketa-muzyka.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('export-status').textContent='Файл подготовлен для скачивания. Передайте его педагогу самостоятельно.';};
 $('intake-print').onclick=()=>window.print();
 $('intake-clear').onclick=()=>{$('clear-confirm').hidden=false;$('clear-yes').focus();};
 $('clear-no').onclick=()=>{$('clear-confirm').hidden=true;$('intake-clear').focus();};
 $('clear-yes').onclick=()=>{form.reset();$('intake-answers').replaceChildren();$('copy-text').value='';$('clear-confirm').hidden=true;show(0);};
 window.addEventListener('beforeunload',e=>{if(fields.some(f=>f.value.trim())){e.preventDefault();e.returnValue='';}});
 $('intake-controls').hidden=false;$('intake-progress').hidden=false;show(0,false);
})();
