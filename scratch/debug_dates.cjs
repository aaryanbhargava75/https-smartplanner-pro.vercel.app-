const todayISO = new Date().toISOString().split('T')[0];
console.log('todayISO:', todayISO);

let currentScheduleDate = todayISO;

function getScheduleDateDisplayLabel(dateISO) {
  if (!dateISO) return 'Aaj';
  const todayISO = new Date().toISOString().split('T')[0];
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  const tomISO = tom.toISOString().split('T')[0];

  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yestISO = yest.toISOString().split('T')[0];

  console.log('Comparing:', { dateISO, todayISO, tomISO, yestISO });

  if (dateISO === todayISO) return 'Aaj';
  if (dateISO === tomISO) return 'Kal';
  if (dateISO === yestISO) return 'Beeta Kal';

  const d = new Date(dateISO + 'T00:00:00');
  if (isNaN(d.getTime())) return dateISO;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function changeScheduleDay(delta) {
  const todayISO = new Date().toISOString().split('T')[0];
  const curDate = currentScheduleDate || todayISO;
  const d = new Date(curDate + 'T00:00:00');
  d.setDate(d.getDate() + Number(delta || 0));
  const newDateISO = d.toISOString().split('T')[0];
  currentScheduleDate = newDateISO;
  console.log('newDateISO:', newDateISO);
  console.log('label:', getScheduleDateDisplayLabel(newDateISO));
}

changeScheduleDay(1);
