#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const RULES = JSON.parse(fs.readFileSync('scripts/style-rules.json','utf8'));
const DATA_DIR = 'public/data/scenario-db-easy';

const files = fs.readdirSync(DATA_DIR).filter(f=>/^hex-\d+\.json$/.test(f));
const report = { files: {}, totals: { ngHits: {}, templateHits: {}, endings: {}, repeats: {} } };

function add(map, key){ map[key] = (map[key]||0) + 1; }

for(const f of files){
  const full = path.join(DATA_DIR,f);
  const d = JSON.parse(fs.readFileSync(full,'utf8'));
  const fileRep = { ng: [], templates: [], entries: 0 };
  for(const [k,v] of Object.entries(d.items||{})){
    const t = v?.easy?.oneLine || '';
    if(!t) continue;
    fileRep.entries++;
    for(const ng of RULES.ng){
      if(t.includes(ng)){
        fileRep.ng.push({ key:k, text:t, ng });
        add(report.totals.ngHits, ng);
      }
    }
    for(const s of RULES.templates){
      if(t.includes(s)){
        fileRep.templates.push({ key:k, text:t, template:s });
        add(report.totals.templateHits, s);
      }
    }
    const last = t.trim().replace(/。+$/,'').split('。').pop();
    if(last) add(report.totals.endings, last.slice(-8));
    add(report.totals.repeats, t);
  }
  report.files[f] = fileRep;
}

// summarize
function topN(obj,n){ return Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n); }

const summary = {
  ngTop: topN(report.totals.ngHits, 20),
  templateTop: topN(report.totals.templateHits, 20),
  endingsTop: topN(report.totals.endings, 20),
  repeatsTop: topN(report.totals.repeats, 20)
};

fs.writeFileSync('.style-report.json', JSON.stringify({ summary, report }, null, 2));
console.log('Wrote .style-report.json');
console.log('NG top:', summary.ngTop);
console.log('Template top:', summary.templateTop);

