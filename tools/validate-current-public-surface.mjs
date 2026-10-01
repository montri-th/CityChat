import assert from 'node:assert/strict';
import { readFileSync,readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const read=p=>readFileSync('deployment/'+p), hash=b=>createHash('sha256').update(b).digest('hex');
const cfg=JSON.parse(readFileSync('release.config.json'));
const source=JSON.parse(read('assets/downloads/design-system-source-policy.json'));
assert.equal(cfg.artifact.designSystemMigration.parentVersion,'0.9.7');
assert.equal(cfg.artifact.designSystemMigration.colorSetId,'color-srgb-10');
assert.equal(source.normative.requiredDesignSourceFileCount,2);
assert.equal(source.runtimeBoundary.dsVersion,'0.9.7');
assert.equal(source.runtimeBoundary.colorSetId,'color-srgb-10');
assert.equal(source.normative.addon.baseDocument.sha256,source.normative.base.markdownSha256);
let count=0;
for(const line of read('vendor/landometer/v0.9.7/SHA256SUMS.txt').toString().trim().split('\n')) {
 const [sha,path]=line.split('  '); assert.equal(hash(read('vendor/landometer/v0.9.7/'+path)),sha,path);count++;
}
const scales=JSON.parse(read('vendor/landometer/v0.9.7/machine/color-srgb-10.scales.json'));
assert.deepEqual(scales.families,{sequential:14,diverging:6});
for(const [lang,entry] of [['th','index.html'],['en','en/index.html']]) {
 const html=read(entry).toString(),share=cfg.socialPreview.records[lang];
 assert(html.includes('vendor/landometer/v0.9.7/build-kit/lds-0.9.7.css'));
 assert(!html.includes('vendor/landometer/v0.9.5/'));
 assert(html.includes('name="robots" content="noindex,nofollow,noarchive"'));
 for(const [key,value] of [['url',share.canonicalUrl],['image',share.imageUrl],['image:width','1200'],['image:height','630'],['image:alt',share.alt]])assert(html.includes(`property="og:${key}" content="${value}"`),`${lang} og:${key}`);
 assert(html.includes('name="twitter:card" content="summary_large_image"'));
 assert.equal(hash(read(share.path)),share.sha256);
 const png=read(share.path);assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
 for(const family of ['water','density.capita','delta']) {
  const light=scales.scales.find(s=>s.scaleId===family&&s.theme==='light'),dark=scales.scales.find(s=>s.scaleId===family&&s.theme==='dark');assert.deepEqual(light.lut,dark.lut);
  const row=html.match(new RegExp(`<figure data-scale-family="${family.replace('.','\\.')}">([\\s\\S]*?)</figure>`))?.[1];assert(row,`${lang} ${family} fixture`);
  assert.deepEqual([...row.matchAll(/background:(#[A-F0-9]{6})/g)].map(m=>m[1]),light.classes['7']);
 }
 assert(html.indexOf('id="design-system"')<html.indexOf('</main>'));
}
console.log(`Current CityChat surface PASS: ${count} exact LDS 0.9.7 vendor assets; separate exact base/Add-on; 2 locale share cards; 3 exact seven-class examples with identical theme values.`);
