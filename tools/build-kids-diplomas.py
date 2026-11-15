"""Local concert diploma options for children aged 5–7; no deployment."""
from pathlib import Path
import argparse,shutil
from bs4 import BeautifulSoup
p=argparse.ArgumentParser();p.add_argument('--base',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();out=a.output;out.mkdir(parents=True,exist_ok=True)
for n in ['fonts']:shutil.copytree(a.base/n,out/n,dirs_exist_ok=True)
shutil.copy2(a.base/'logo.webp',out/'logo.webp')

def flat_keyboard(paper,divider):
 # Same full-height left strip; a flat, softly outlined 2+3 black-key rhythm.
 shapes=[f'<svg viewBox="0 0 250 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="250" height="1123" fill="{paper}"/>']
 step=49
 for i in range(24):
  y=i*step
  shapes.append(f'<path d="M0 {y}H250" stroke="{divider}" stroke-width="1.4"/>')
 for i in range(24):
  y=i*step
  if i%7 in [0,1,3,4,5]:
   shapes.append(f'<rect x="-5" y="{y+step-13}" width="178" height="26" rx="5" fill="#53574f"/>')
 shapes.append(f'<path d="M249 0V1123" stroke="{divider}" stroke-width="2"/></svg>')
 return ''.join(shapes)

def art(kind):
 bg={'fox':'#f7cf89','bunny':'#cfdbf3','bear':'#ccdfbd'}[kind]
 head={
 'fox':'''<path d="M163 107L160 23L215 66Q250 49 285 66L340 23L337 107Q355 183 250 211Q145 183 163 107" fill="#de8644"/><path d="M174 80L173 47L202 73M298 73L327 47L326 80" fill="#713e2e"/><path d="M171 119Q202 118 250 167Q298 118 329 119Q335 177 250 197Q165 177 171 119" fill="#fff3d8"/>''',
 'bunny':'''<ellipse cx="211" cy="61" rx="25" ry="58" fill="#e9e3d8" transform="rotate(-13 211 61)"/><ellipse cx="285" cy="61" rx="25" ry="58" fill="#e9e3d8" transform="rotate(13 285 61)"/><ellipse cx="211" cy="56" rx="10" ry="38" fill="#e5b5b7" transform="rotate(-13 211 56)"/><ellipse cx="285" cy="56" rx="10" ry="38" fill="#e5b5b7" transform="rotate(13 285 56)"/><ellipse cx="250" cy="140" rx="79" ry="69" fill="#f5efe4"/>''',
 'bear':'''<circle cx="183" cy="83" r="31" fill="#ac7956"/><circle cx="317" cy="83" r="31" fill="#ac7956"/><circle cx="183" cy="83" r="17" fill="#e8bd8c"/><circle cx="317" cy="83" r="17" fill="#e8bd8c"/><ellipse cx="250" cy="139" rx="82" ry="73" fill="#bc8d64"/><ellipse cx="250" cy="167" rx="45" ry="33" fill="#f2d7ac"/>'''}[kind]
 return f'''<svg viewBox="0 0 500 290" xmlns="http://www.w3.org/2000/svg" aria-label="Детская музыкальная иллюстрация"><ellipse cx="250" cy="161" rx="166" ry="122" fill="{bg}" opacity=".55"/><path d="M91 71l4 11 12 1-9 8 3 12-10-6-10 6 3-12-9-8 12-1zM394 45l4 11 12 1-9 8 3 12-10-6-10 6 3-12-9-8 12-1z" fill="#d7a44c"/>{head}<path d="M203 132q10-12 20 0M277 132q10-12 20 0" fill="none" stroke="#493c32" stroke-width="5" stroke-linecap="round"/><ellipse cx="250" cy="159" rx="9" ry="6" fill="#594436"/><path d="M250 166v9m-12-1q12 12 24 0" fill="none" stroke="#594436" stroke-width="3" stroke-linecap="round"/><ellipse cx="196" cy="153" rx="12" ry="6" fill="#ec9e91" opacity=".65"/><ellipse cx="304" cy="153" rx="12" ry="6" fill="#ec9e91" opacity=".65"/><path d="M171 208q79-38 158 0v55H171z" fill="#70865d"/><path d="M250 214l-34-13v27l34-8 34 8v-27z" fill="#e5b64c"/><circle cx="250" cy="216" r="7" fill="#c39332"/><rect x="132" y="237" width="236" height="40" rx="6" fill="#fffaf0" stroke="#777669" stroke-width="2"/><path d="M160 238v38m29-38v38m29-38v38m29-38v38m29-38v38m29-38v38m29-38v38" stroke="#aaa591"/><path d="M155 238v23h11v-23m18 0v23h11v-23m47 0v23h11v-23m18 0v23h11v-23m18 0v23h11v-23" fill="#3f473d"/><ellipse cx="189" cy="237" rx="20" ry="12" fill="{'#de8644' if kind=='fox' else '#f5efe4' if kind=='bunny' else '#bc8d64'}"/><ellipse cx="311" cy="237" rx="20" ry="12" fill="{'#de8644' if kind=='fox' else '#f5efe4' if kind=='bunny' else '#bc8d64'}"/><g fill="#70865d"><ellipse cx="103" cy="174" rx="9" ry="6"/><path d="M110 174v-39l22-5v9l-19 4v31z"/><ellipse cx="394" cy="150" rx="9" ry="6"/><path d="M401 150v-39q23 12 14 27-2-15-11-16v28z"/></g></svg>'''

opts=[('01','fox','Лисёнок на сцене','#fff6e5','#b77538','Тёплый персиковый и солнечные акценты.'),('02','bunny','Зайчонок-музыкант','#f1f3fc','#777fa7','Нежный сиреневый и мягкие звёздочки.'),('03','bear','Медвежонок за клавишами','#f1f5e8','#688450','Светлый зелёный и уютный лесной характер.')]
for n,kind,title,bg,accent,desc in opts:
 s=BeautifulSoup((a.base/'variant-01.html').read_text(encoding='utf-8'),'html.parser')
 colors={'fox':('#fff3dd','#dbcdb5'),'bunny':('#f1f0fa','#cccddd'),'bear':('#eef3e3','#cbd5bc')}
 s.select_one('.keys').clear()
 s.select_one('.keys').append(BeautifulSoup(flat_keyboard(*colors[kind]),'html.parser'))
 s.title.string=title+' — детский диплом'
 s.select_one('.city').decompose()
 city=s.new_tag('div',attrs={'class':'city-bottom'});city.string='Сургут 2026';s.select_one('.sheet').append(city)
 s.select_one('.tools').clear();s.select_one('.tools').append(BeautifulSoup(f'<strong>{n} · {title}</strong><p>Для детей 5–7 лет · на согласование</p><a href="index.html">Все варианты</a> <button onclick="print()">Печать / PDF</button>','html.parser'))
 s.select_one('.subtitle').string='За выступление в отчётном концерте'
 s.select_one('.thanks').clear();s.select_one('.thanks').append(BeautifulSoup('Спасибо за старание, смелость<br>и музыку, которой ты делишься!','html.parser'))
 s.select_one('.music').replace_with(BeautifulSoup('<div class="animal">'+art(kind)+'</div>','html.parser'))
 st=s.new_tag('style');st.string=f'''.sheet{{background:{bg};--accent:{accent}}}.sheet .frame{{border-color:{accent};border-radius:16px}}.sheet .content{{top:13mm}}.sheet .logo{{width:66mm}}.eyebrow{{font-size:9px;letter-spacing:2px}}.rule{{margin:22px auto 19px}}.sheet h1{{font-size:58px;color:{accent}}}.subtitle{{margin:15px 0 20px}}.awarded{{margin-bottom:8px}}.sheet .name{{font-size:24px;min-height:50px}}.sheet .reason{{margin-top:18px;font-size:15px;line-height:1.65}}.sheet .event{{font-size:20px;min-height:42px}}.sheet .thanks{{margin-top:18px;font-size:13px;line-height:1.7}}.animal{{position:absolute;bottom:98px;width:100%;height:242px}}.animal svg{{width:100%;height:100%;display:block}}.footer{{font-size:10px}}''';s.head.append(st)
 st.string += '.sheet .keys svg{display:block;width:100%;height:100%}.sheet .keys{border:0;opacity:1}.city-bottom{position:absolute;bottom:3mm;left:71mm;right:9mm;text-align:center;font-size:11px;letter-spacing:1.5px;color:#53574f;line-height:1.4}'
 (out/f'variant-{n}.html').write_text(str(s),encoding='utf-8')
cards=''.join(f'<article><a href="variant-{n}.html"><img src="variant-{n}.png" alt="{title}"></a><h2>{n} · {title}</h2><p>{desc}</p><a href="variant-{n}.html">Заполнить диплом</a> · <a href="variant-{n}.pdf">PDF A4</a></article>' for n,k,title,bg,accent,desc in opts)
base=BeautifulSoup((a.base/'index.html').read_text(encoding='utf-8'),'html.parser');base.title.string='Три детских диплома';base.h1.string='Детские дипломы · 5–7 лет';base.select_one('.note').string='Клавиши сохранены из последнего согласованного по композиции варианта. Логотип сайта, добрые зверята и награда за выступление. Только локальное согласование; на сайте не опубликовано.';base.select_one('.grid').clear();base.select_one('.grid').append(BeautifulSoup(cards,'html.parser'));base.select('p.note')[-1].string='Все варианты подходят детям 5–7 лет. Выберите героя и оформление. Имя, название концерта и дата заполняются в HTML; PDF — пустой бланк A4. Подпись ставится вручную.'
base.select_one('.note').string='Единая иллюстративная стилистика: плоские клавиши в тон каждого диплома, мягкий графит, добрые зверята и логотип студии. Дипломы за выступление, для детей 5–7 лет. Только на согласование.'
(out/'index.html').write_text(str(base),encoding='utf-8');print(out)
