"""Build a local-only approval bundle from existing drafts; never deploys it."""
import argparse, shutil, json
from pathlib import Path
from bs4 import BeautifulSoup

p=argparse.ArgumentParser()
p.add_argument('--drafts',type=Path,required=True)
p.add_argument('--reviews',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
a=p.parse_args()
repo=Path(__file__).resolve().parents[1]
out=a.output.resolve();out.mkdir(parents=True,exist_ok=True)
for name in ['fonts','video-package']:
 shutil.copytree(a.drafts/name,out/name,dirs_exist_ok=True)
for name in ['diploma-template.pdf','diploma-template.png','diploma-editable.html','reviews-qr-A5.pdf','reviews-qr-A5.png','qr-2gis.png','message-to-parents.txt']:
 shutil.copy2(a.drafts/name,out/name)
site=out/'site';site.mkdir(exist_ok=True)
for name in ['assets','fonts','vendor']:
 shutil.copytree(repo/name,site/name,dirs_exist_ok=True)
for pattern in ['*.html','*.css','*.js','*.json','*.ico']:
 for f in repo.glob(pattern):shutil.copy2(f,site/f.name)
review=BeautifulSoup(a.reviews.read_text(encoding='utf-8'),'html.parser')
shell=BeautifulSoup((repo/'contacts.html').read_text(encoding='utf-8'),'html.parser')
shell.main.replace_with(review.main)
shell.title.string='Отзывы — черновик на согласование'
for el in shell.select('link[rel=canonical],meta[property^="og:"]'):el.decompose()
style=shell.new_tag('style');style.string='''
.approval-banner{padding:14px 24px;background:#e5ebd5;text-align:center;color:#202719}
.review-layout{display:grid;grid-template-columns:2fr 1fr;gap:40px}
.review-qr img{width:100%;max-width:260px;height:auto}.review-direct{padding:36px}
@media(max-width:700px){.review-layout{grid-template-columns:1fr;gap:24px}}
''';shell.head.append(style)
banner=shell.new_tag('div',attrs={'class':'approval-banner'});banner.append('Черновик · не опубликован. ')
back=shell.new_tag('a',href='../index.html');back.string='Вернуться к согласованию';banner.append(back);shell.body.insert(0,banner)
(site/'reviews.html').write_text(str(shell),encoding='utf-8')
shutil.copy2(a.drafts/'qr-2gis.png',site/'assets/qr-reviews-2gis.png')
html=(a.drafts/'index.html').read_text(encoding='utf-8').replace('../../dist/reviews.html','site/reviews.html').replace('10 ноября','15 ноября').replace('10 ноября 2026','15 ноября 2026')
html=html.replace('Один согласованный комплект','Комплект на согласование')
html=html.replace('<a class="btn primary" href="approval-materials.zip" download>Скачать все материалы ZIP</a>','<nav><a class="btn" href="#diploma">Диплом</a><a class="btn" href="#reviews">Отзывы</a><a class="btn" href="#videos">Видео</a><a class="btn" href="#decision">Решение</a></nav>')
soup=BeautifulSoup(html,'html.parser')
for section,id in zip(soup.select('main > section'),['diploma','reviews','videos']):section['id']=id
decision=BeautifulSoup('''<section id="decision"><h2>Ваше решение</h2><p>Отметьте решение по каждому материалу и напишите замечания. Ответы сохраняются только в этом браузере. Кнопка скачает текст для передачи исполнителю; отправки и публикации нет.</p><div id="choices"></div><button class="btn primary" id="save">Скачать решение TXT</button><p class="note">Для видео отдельно подтвердите выбор роликов, тексты и возможность публикации людей в кадре. Доступ к внешним каналам потребуется только после согласования.</p></section>''','html.parser')
soup.main.append(decision)
extra=soup.new_tag('style');extra.string='label{display:block;margin:12px 0}select,textarea,button{font:inherit}select,textarea{display:block;width:100%;min-height:44px;padding:12px;border:1px solid #a89a84;border-radius:8px;background:white}textarea{min-height:90px}button{cursor:pointer}a:focus-visible,button:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #566b37;outline-offset:3px}';soup.append(extra)
js=soup.new_tag('script');js.string='''
const labels=['Диплом','Страница отзывов, QR и сообщение','Видеопакет: 6 роликов'];
const key='piano-approval-20261115';let previous=[];try{previous=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
document.querySelector('#choices').innerHTML=labels.map((x,i)=>`<fieldset><legend>${x}</legend><label>Решение<select id="s${i}"><option>Не рассмотрено</option><option>Согласовано</option><option>Нужны правки</option><option>Отложить</option></select></label><label>Замечания<textarea id="t${i}"></textarea></label></fieldset>`).join('');
function state(){return labels.map((x,i)=>({material:x,status:document.querySelector('#s'+i).value,notes:document.querySelector('#t'+i).value}))}
previous.forEach((x,i)=>{if(i<3){document.querySelector('#s'+i).value=x.status;document.querySelector('#t'+i).value=x.notes}});
document.querySelector('#choices').addEventListener('input',()=>{try{localStorage.setItem(key,JSON.stringify(state()))}catch{}});
document.querySelector('#save').onclick=()=>{const text='Решение по материалам студии\\n\\n'+state().map(x=>x.material+' — '+x.status+'\\n'+x.notes).join('\\n\\n');const u=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='approval-decision.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
''';soup.append(js)
(out/'index.html').write_text(str(soup),encoding='utf-8')
# All preview HTML is explicitly excluded from indexing.
f=out/'diploma-editable.html'
text=f.read_text(encoding='utf-8').replace('<meta charset="utf-8">','<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">')
text=text.replace('</style>','@media print{.sheet{zoom:1!important}}</style>')
text=text.replace('</html>','<script>function fit(){document.querySelector(".sheet").style.zoom=Math.min(1,(innerWidth-16)/794)}addEventListener("resize",fit);fit()</script></html>')
f.write_text(text,encoding='utf-8')
for f in out.rglob('*.html'):
 text=f.read_text(encoding='utf-8');text=text.replace('<meta charset="utf-8">','<meta charset="utf-8"><meta name="robots" content="noindex,nofollow">',1)
 f.write_text(text,encoding='utf-8')
(out/'robots.txt').write_text('User-agent: *\nDisallow: /\n')
(out/'START.cmd').write_text('@echo off\ncd /d "%~dp0"\nstart "" http://127.0.0.1:8879/\npython -m http.server 8879 --bind 127.0.0.1\n',encoding='ascii')
(out/'README.txt').write_text('Локальное превью для согласования. Запуск: START.cmd (нужен Python).\nНичего не отправляется и не публикуется автоматически.\nДиплом и QR: PDF для печати. Видео: 6 MP4, обложки и тексты.\nСтраница отзывов: site/reviews.html. Решение можно скачать TXT на главной.\n',encoding='utf-8')
print(out)
