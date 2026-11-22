const curDate = '2026-11-22';
const d = new Date(curDate + 'T00:00:00');
d.setDate(d.getDate() + 1);
console.log('Local string:', d.toLocaleDateString());
console.log('ISO string (UTC):', d.toISOString());
console.log('Date parts in local time:', d.getFullYear(), d.getMonth() + 1, d.getDate());
