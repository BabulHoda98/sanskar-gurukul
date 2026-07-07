const fs = require('fs');
const file = 'app/admin/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<h4-slate-900 dark:text-white/g, '<h4 className="font-bold text-sm text-slate-900 dark:text-white"' );
content = content.replace(/<h3-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">/g, '<h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">');
content = content.replace(/<h3-slate-900 dark:text-white/g, '<h3 className="font-bold text-sm text-slate-900 dark:text-white"');
content = content.replace(/<h5-slate-900 dark:text-white/g, '<h5 className="text-sm font-bold text-slate-900 dark:text-white"');
content = content.replace(/<p-slate-900 dark:text-white mt-0.5">/g, '<p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">');
content = content.replace(/<span-slate-900 dark:text-white/g, '<span className="text-xs font-bold text-slate-900 dark:text-white"');
content = content.replace(/<td-slate-900 dark:text-white">\{p\.receiptNumber\}<\/td>/g, '<td className="py-2.5 font-semibold text-slate-900 dark:text-white">{p.receiptNumber}</td>');
content = content.replace(/<td-slate-900 dark:text-white">₹\{p\.amount\}<\/td>/g, '<td className="py-2.5 font-bold text-slate-900 dark:text-white">₹{p.amount}</td>');
content = content.replace(/<td-slate-900 dark:text-white">\{log\.employee\?\.name\}<\/td>/g, '<td className="py-2.5 font-bold text-slate-900 dark:text-white">{log.employee?.name}</td>');

fs.writeFileSync(file, content);
console.log("Done");
