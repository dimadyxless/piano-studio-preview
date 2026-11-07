(() => {
  const form = document.getElementById('chooser');
  if (!form) return;
  const result = document.getElementById('chooser-result');
  const note = document.getElementById('chooser-note');
  const heading = document.getElementById('chooser-heading');
  const cards = [...document.querySelectorAll('.picker__result')];
  form.hidden = false;
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
    heading.focus();
  });
  form.addEventListener('input', () => { result.hidden = true; });
  form.addEventListener('reset', () => { result.hidden = true; });
})();
