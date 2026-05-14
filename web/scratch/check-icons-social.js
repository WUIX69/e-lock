import * as Lucide from 'lucide-react';
const keys = Object.keys(Lucide);
console.log('Social candidates:');
console.log(keys.filter(k => ['facebook', 'instagram', 'youtube', 'x', 'twitter', 'github', 'linkedin', 'slack', 'discord'].some(s => k.toLowerCase().includes(s))));
