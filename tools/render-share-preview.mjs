import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const browser = await chromium.launch({headless:true,...(process.env.CITYCHAT_BROWSER_EXECUTABLE ? {executablePath:process.env.CITYCHAT_BROWSER_EXECUTABLE} : {})});
const records=[];
for(const lang of ['th','en']) {
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto(pathToFileURL(resolve(`tools/share-preview/${lang}.html`)).href);
 await page.evaluate(()=>document.fonts.ready);
 const dimensions=await page.locator('.logo').evaluate(e=>({loaded:e.complete&&e.naturalWidth>0,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}));
 if(!dimensions.loaded||dimensions.height!==56)throw Error('Share logo not loaded at governed dimensions');
 const bytes=await page.screenshot({type:'png'}),sha256=createHash('sha256').update(bytes).digest('hex');
 const path=`assets/identity/citychat-share-${lang}-${sha256.slice(0,8)}.png`;
 writeFileSync(resolve('deployment',path),bytes);
 records.push({locale:lang,path,sha256,bytes:bytes.length,mimeType:'image/png',width:1200,height:630,source:'tools/share-preview/'+lang+'.html',sourceSha256:createHash('sha256').update(readFileSync('tools/share-preview/'+lang+'.html')).digest('hex'),visibleText:await page.locator('main').innerText(),identitySource:'assets/citychat-lockup.png',identitySourceSha256:createHash('sha256').update(readFileSync('deployment/assets/citychat-lockup.png')).digest('hex'),transform:'Whole unmodified lockup rendered proportionally at 56px height; no crop, recolour, motif or motion.',authority:'Owner request 2026-10-01: update/publish current CityChat public surface including sharing hero; same current public copy.',visualReview:'pending root review before publication',thirdPartyCache:'not checked; origin delivery only'});
 await page.close();
}
await browser.close();writeFileSync('deployment/assets/identity/citychat-share-20261001-01.json',JSON.stringify({schemaVersion:'citychat-share-preview-1',buildId:'citychat-landing-20261001-01',role:'social_preview',records},null,2)+'\n');
console.log(records.map(({locale,path,sha256})=>({locale,path,sha256})));
