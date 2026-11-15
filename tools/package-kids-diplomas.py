"""Package approved local diploma designs for review, without deployment."""
from pathlib import Path
import argparse,zipfile
from bs4 import BeautifulSoup
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
guide='''ДЕТСКИЕ ДИПЛОМЫ — НА СОГЛАСОВАНИЕ

01 — лисёнок, 02 — зайчонок, 03 — медвежонок.
Дипломы за выступление в отчётном концерте. Формат A4, вертикальный.

КАК ПОСМОТРЕТЬ
1. Полностью распакуйте ZIP в отдельную папку.
2. Откройте index.html двойным щелчком в Chrome или Edge.
   Интернет и локальный сервер не требуются. Не перемещайте HTML отдельно
   от папки fonts и файла logo.webp.
3. Выберите вариант и нажмите «Заполнить диплом».

КАК ЗАПОЛНИТЬ
1. Нажмите на надпись «Имя и фамилия ученика» и введите нужные данные.
   Это одно общее поле. Например: «Анна Иванова».
2. Нажмите «Название концерта» и введите название.
3. Нажмите «Дата концерта» и укажите дату.
4. Нажмите «Печать / PDF», выберите «Сохранить как PDF».
5. Формат A4, книжная ориентация, масштаб 100%, поля — нет.
   Отключите колонтитулы браузера и включите печать фоновой графики.
6. Проверьте предпросмотр: один лист, имя и концерт помещаются,
   текст не пересекается с иллюстрацией. Сохраните отдельный PDF для ученика.

Поля редактируются в HTML, а не в приложенных PDF.
Изменения полей НЕ сохраняются после обновления или закрытия страницы.
Сразу сохраните заполненный PDF. Подпись руководителя ставится вручную.
Для следующего ученика замените данные и сохраните новый PDF.
Очень длинное имя или название может занять несколько строк — перед печатью
обязательно проверьте размещение. Не меняйте сам текст награждения.

PDF В АРХИВЕ
variant-01.pdf, variant-02.pdf, variant-03.pdf — пустые бланки для печати
и заполнения вручную. Подсказки полей в печать не попадают.
PNG — изображения для быстрого сравнения. Для печати используйте PDF.

СОГЛАСОВАНИЕ
Сообщите номер понравившегося варианта и необходимые правки.
В архиве нет отправки данных, автоматической публикации или загрузки на сайт.
'''
files={}
for pattern in ['variant-*.html','variant-*.pdf','variant-*.png','fonts/*']:
 for f in a.source.glob(pattern):
  if f.is_file():files[f.relative_to(a.source).as_posix()]=f.read_bytes()
for name in ['logo.webp','overview.png']:files[name]=(a.source/name).read_bytes()
s=BeautifulSoup((a.source/'index.html').read_text(encoding='utf-8'),'html.parser')
for e in s.select('a[href="../index.html"]'):e.decompose()
note=s.new_tag('p');note.string='Сначала распакуйте весь архив. Для заполнения откройте HTML-вариант, нажмите на имя, название концерта и дату, затем «Печать / PDF». Поля не сохраняются после закрытия: сразу сохраните заполненный PDF. Подробности — в инструкции.';s.main.insert(0,note)
files['index.html']=str(s).encode('utf-8');files['ИНСТРУКЦИЯ.txt']=guide.encode('utf-8-sig')
a.output.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(a.output,'w',zipfile.ZIP_DEFLATED) as z:
 for name,data in files.items():z.writestr(name,data)
with zipfile.ZipFile(a.output) as z:assert z.testzip() is None
print(f'Created {a.output}: {len(files)} files, {a.output.stat().st_size} bytes')
