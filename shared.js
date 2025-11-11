// Keys & constants
const USERS_KEY='lms_users'; const SESSION_KEY='lms_session'; const BOOKS_KEY='lms_books'; const ISSUE_KEY='lms_issues'; const REQ_KEY='lms_requests';
const FINE_PER_DAY=10; const GRACE_DAYS=1;
// Defaults
function defaultBooks(){ return [
{id:1,title:'Clean Code',author:'Robert C. Martin',category:'Programming',quantity:5,available:5},
{id:2,title:'The Pragmatic Programmer',author:'Andrew Hunt',category:'Programming',quantity:3,available:3},
{id:3,title:'Effective Java',author:'Joshua Bloch',category:'Programming',quantity:4,available:4},
{id:4,title:'Head First Java',author:'Kathy Sierra',category:'Programming',quantity:6,available:6},
{id:5,title:'Introduction to Algorithms',author:'Cormen et al.',category:'Algorithms',quantity:2,available:2},
{id:6,title:'Operating System Concepts',author:'Silberschatz',category:'OS',quantity:3,available:3},
{id:7,title:'Database System Concepts',author:'Korth',category:'DBMS',quantity:3,available:3},
{id:8,title:'Let Us C',author:'Y. Kanetkar',category:'Programming',quantity:5,available:5},
{id:9,title:'Atomic Habits',author:'James Clear',category:'Self-help',quantity:4,available:4},
{id:10,title:'Think and Grow Rich',author:'Napoleon Hill',category:'Self-help',quantity:4,available:4},
{id:11,title:'Computer Networks',author:'Tanenbaum',category:'Networks',quantity:2,available:2},
{id:12,title:'Design Patterns',author:'GoF',category:'Software',quantity:2,available:2}
];}
function seedBooksIfEmpty(){ const b = JSON.parse(localStorage.getItem(BOOKS_KEY)||'[]'); if(b.length===0){ localStorage.setItem(BOOKS_KEY, JSON.stringify(defaultBooks())); } }
// Theme
function toggleTheme(){ const cur = document.body.getAttribute('data-theme'); if(cur==='dark'){ document.body.setAttribute('data-theme','light'); localStorage.setItem('lms_theme','light'); } else { document.body.setAttribute('data-theme','dark'); localStorage.setItem('lms_theme','dark'); } }
function initTheme(){ const t = localStorage.getItem('lms_theme'); if(!t){ if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ document.body.setAttribute('data-theme','dark'); } } else { if(t==='dark') document.body.setAttribute('data-theme','dark'); else document.body.setAttribute('data-theme','light'); } }
// Storage helpers
function session(){ return JSON.parse(localStorage.getItem(SESSION_KEY)||'null'); } function setSession(u){ localStorage.setItem(SESSION_KEY, JSON.stringify(u)); }
function getUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } function setUsers(arr){ localStorage.setItem(USERS_KEY, JSON.stringify(arr)); }
function books(){ return JSON.parse(localStorage.getItem(BOOKS_KEY)||'[]'); } function setBooks(b){ localStorage.setItem(BOOKS_KEY, JSON.stringify(b)); }
function issues(){ return JSON.parse(localStorage.getItem(ISSUE_KEY)||'[]'); } function setIssues(i){ localStorage.setItem(ISSUE_KEY, JSON.stringify(i)); }
function requests(){ return JSON.parse(localStorage.getItem(REQ_KEY)||'[]'); } function setRequests(r){ localStorage.setItem(REQ_KEY, JSON.stringify(r)); }
// Date utils
function parseDate(s){ return new Date(s+'T00:00:00'); } function todayISO(){ return new Date().toISOString().slice(0,10); }
function daysBetween(a,b){ return Math.ceil((parseDate(b)-parseDate(a))/86400000); }
// Fine with grace
function computeFineWithGrace(toDate, ret){ const late = Math.max(0, daysBetween(toDate, ret)); const chargeable = Math.max(0, late - GRACE_DAYS); return {lateDays: late, chargeableDays: chargeable, fine: chargeable * FINE_PER_DAY}; }
// Toast + backup
function toast(msg){ const id='t'+Date.now(); const el=document.createElement('div'); el.className='toastx'; el.id=id; el.innerText=msg; document.body.appendChild(el); setTimeout(()=>el.remove(), 3200); }
function exportBackup(){ const payload = { users:getUsers(), books:books(), issues:issues(), requests:requests(), exportedAt:new Date().toISOString() }; const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='lms_backup.json'; a.click(); URL.revokeObjectURL(url); }