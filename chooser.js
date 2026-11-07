(() => {
  const form = document.getElementById('chooser');
  if (!form) return;
  const result = document.getElementById('chooser-result');
  const note = document.getElementById('chooser-note');
  const heading = document.getElementById('chooser-heading');
  const cards = [...document.querySelectorAll('.picker__result')];
  const family = document.getElementById('family-questions');
  const familyResult = document.getElementById('family-result');
  const advice = document.getElementById('family-advice');
  const syncFamily = () => {
    const value = form.elements.age.value;
    const child = value !== '' && form.elements.age.validity.valid && Number(value) < 18;
    family.hidden = !child;
    family.disabled = !child;
  };
  const renderAdvice = () => {
    advice.replaceChildren();
    const messages = [];
    if (!family.disabled) {
      const value = name => form.elements[name].value;
      if (value('instrument')) messages.push(value('instrument') === 'yes' ? 'Расскажите педагогу, какой инструмент есть дома: это поможет обсудить домашнюю практику.' : 'Перед покупкой инструмента обсудите с педагогом подходящий вариант. Отсутствие инструмента сейчас не исключает знакомство со студией.');
      if (value('support')) messages.push(value('support') === 'yes' ? 'Уточните, какая помощь нужна ребёнку дома и как пользоваться рекомендациями педагога.' : 'Обсудите, какую помощь семье удобно оказывать ребёнку: рекомендации должны учитывать ваши возможности.');
      if (value('practice')) messages.push(value('practice') === 'regular' ? 'Согласуйте с педагогом частоту и продолжительность домашней практики с учётом возраста и программы.' : 'Расскажите о семейном графике, чтобы вместе найти посильное время для домашней практики.');
      if (value('parentExperience')) messages.push(value('parentExperience') === 'no' ? 'Для помощи с организацией занятий музыкальное образование родителя не требуется. Непонятные задания можно обсудить с педагогом.' : 'Расскажите о своём музыкальном опыте и обсудите с педагогом, как лучше поддерживать ребёнка.');
      if (value('attendance')) messages.push(value('attendance') === 'no' && Number(form.elements.age.value) <= 4 ? '«Моцарт на подушках» предполагает участие мамы и малыша. Если приходить вместе не получается, обсудите возможный формат по телефону.' : 'Уточните, требуется ли присутствие родителя на выбранной программе и как организовать участие семьи.');
    }
    for (const message of messages) {
      const li = document.createElement('li');
      li.textContent = message;
      advice.append(li);
    }
    familyResult.hidden = messages.length === 0;
  };
  form.hidden = false;
  syncFamily();
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const age = Number(form.elements.age.value);
    const goal = form.elements.goal.value;
    const exp = form.elements.experience.value;
    let count = 0;
    for (const card of cards) {
      const matches = age >= Number(card.dataset.min) && age <= Number(card.dataset.max) && card.dataset.goals.split(' ').includes(goal) && (card.dataset.slug !== 'solfeggio' || exp === 'school');
      card.hidden = !matches; if (matches) count++;
    }
    result.hidden = false;
    heading.textContent = count ? 'Можно рассмотреть эти программы' : 'Давайте подберём занятие вместе';
    const experience = {new:'Вы начинаете с нуля — расскажите преподавателю о своих ожиданиях.',return:'Вы возвращаетесь после перерыва — расскажите, что играли раньше.',learning:'Вы уже занимаетесь — обсудите с преподавателем текущий уровень и задачи.',school:'Вы учитесь в музыкальной школе — расскажите о программе и возникших вопросах.'};
    note.textContent = count ? experience[exp] + (goal === 'school' ? ' Подготовка не гарантирует поступления; требования уточняйте в выбранной музыкальной школе.' : '') : (goal === 'theory' && exp !== 'school' ? '«Сольфеджио просто» рассчитано на учеников музыкальных школ. Для вашего опыта подходящий формат лучше обсудить по телефону.' : 'В опубликованном каталоге нет точного совпадения возраста и цели. Позвоните: обсудим возможный формат без автоматического обещания места.');
    renderAdvice();
    heading.focus();
  });
  form.addEventListener('input', () => { syncFamily(); result.hidden = true; });
  form.addEventListener('reset', () => { result.hidden = true; family.hidden = true; family.disabled = true; familyResult.hidden = true; advice.replaceChildren(); });
})();
