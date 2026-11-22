function formatLocalDateISO(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const curDate = '2026-11-22';
const d = new Date(curDate + 'T12:00:00');
d.setDate(d.getDate() + 1);
console.log('delta +1:', formatLocalDateISO(d));

d.setDate(d.getDate() - 2);
console.log('delta -1 from original:', formatLocalDateISO(d));
