$lines=Get-Content -Encoding UTF8 .\all_products_payload.txt
$items=@()
for($i=0;$i -lt $lines.Count;$i++) {
  if($lines[$i] -match '^\s*(\d+)\.\s*$') {
    $nm=[regex]::Match($lines[$i],'^\s*(\d+)\.\s*$')
    $arLine=$lines[$i+1].Trim(); $enLine=$lines[$i+2].Trim()
    $am=[regex]::Match($arLine,'AR Title: "(.*)" \| Price: ([0-9.]+) EGP')
    $em=[regex]::Match($enLine,'EN Title: "(.*)" \| Price: ([0-9.]+) EGP')
    if($nm.Success -and $am.Success -and $em.Success){$items += [ordered]@{n=[int]$nm.Groups[1].Value; ar=$am.Groups[1].Value; price=$am.Groups[2].Value; en=$em.Groups[1].Value}}
  }
}
if($items.Count -ne 591){throw "Parsed $($items.Count) records"}
Write-Output "parsed=$($items.Count)"
$token=$env:PENPOT_TOKEN
if(-not $token){throw 'PENPOT_TOKEN is required'}
$uri='http://localhost:9001/mcp/stream?userToken='+[uri]::EscapeDataString($token)
$h=@{Accept='application/json, text/event-stream';'Content-Type'='application/json'}
$init='{ "jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"gordon","version":"1.0"}}}'
$r=Invoke-WebRequest -Method POST -UseBasicParsing -Headers $h -Body $init -Uri $uri -TimeoutSec 20
$sid=$r.Headers['Mcp-Session-Id']; if(-not $sid){$sid=$r.Headers['mcp-session-id']}; $h['Mcp-Session-Id']=$sid
$data=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(($items|ConvertTo-Json -Compress -Depth 4)))
$js=@'
const products=storage.products;
const black='#000000', white='#FFFFFF', gray='#F5F5F5';
function fill(s,c){s.fills=[{fillColor:c,fillOpacity:1}]}
function text(c,f,z,w,a){const t=penpot.createText(c);t.characters=c;t.fontFamily=f;t.fontSize=String(z);t.fontWeight=String(w);t.align=a;t.fills=[{fillColor:black,fillOpacity:1}];t.growType='auto-height';return t}
function makeBoard(n,x,y){const b=penpot.createBoard();b.name=n;b.x=x;b.y=y;b.resize(595,842);fill(b,white);b.clipContent=true;return b}
function addItem(b,p,lang,row,col){const ar=lang==='AR',f=ar?'Tajawal':'Comfortaa',a=ar?'right':'left';const c=penpot.createBoard();c.name=ar?'List Item Lockup AR RTL':'List Item Lockup EN LTR';c.resize(270,128);fill(c,white);c.addFlexLayout();c.flex.dir=ar?'row-reverse':'row';c.flex.columnGap=16;c.flex.alignItems='center';const av=penpot.createEllipse();av.name='Circular Product Avatar';av.resize(120,120);fill(av,gray);c.appendChild(av);const l=penpot.createBoard();l.name=ar?'Product Text Lockup AR RTL':'Product Text Lockup EN LTR';l.resize(130,90);fill(l,white);l.addFlexLayout();l.flex.dir='column';l.flex.rowGap=4;l.flex.alignItems=ar?'end':'start';const t=text(ar?p.ar:p.en,f,12,700,a);t.resize(130,55);const pr=text(p.price+' EGP',f,12,500,a);pr.resize(130,20);l.appendChild(t);l.appendChild(pr);c.appendChild(l);c.setPluginData('catalog',JSON.stringify({id:p.n,language:lang}));b.grid.appendChild(c,row,col)}
function build(name,lang){const page=penpot.createPage();page.name=name;penpot.openPage(page);const lib=penpot.library.local;for(const [n,c] of [['color_dark',black],['color_light',white],['color_accent',gray]]){const x=lib.createColor();x.name=n;x.color=c}const defs=[['en_heading','Comfortaa',36,700],['en_vertical','Comfortaa',48,400],['en_body','Comfortaa',10,400],['en_product_title','Comfortaa',12,700],['en_price','Comfortaa',12,500],['ar_heading','Tajawal',36,700],['ar_vertical','Tajawal',48,400],['ar_body','Tajawal',10,400],['ar_product_title','Tajawal',12,700],['ar_price','Tajawal',12,500]];for(const d of defs){const x=lib.createTypography();x.name=d[0];x.fontFamily=d[1];x.fontSize=String(d[2]);x.fontWeight=String(d[3]);x.lineHeight=d[0].includes('body')?'1.5':'1.2'}const cover=makeBoard(name+' · 00 · COVER',0,0);const f=lang==='AR'?'Tajawal':'Comfortaa',a=lang==='AR'?'right':'left';const h=text(lang==='AR'?'كتالוג المنتجات':'PRODUCT CATALOG',f,36,700,a);h.x=52;h.y=120;h.resize(490,80);cover.appendChild(h);const toc=makeBoard(name+' · 01 · TABLE OF CONTENTS',650,0);const th=text(lang==='AR'?'المحتويات':'CONTENTS',f,36,700,a);th.x=52;th.y=70;th.resize(490,60);toc.appendChild(th);for(let pg=0;pg<74;pg++){const b=makeBoard(name+' · '+String(pg+1).padStart(2,'0')+' · DENSE PRODUCT LIST',(pg%3)*650,950+Math.floor(pg/3)*900);b.addGridLayout();b.grid.columns=2;b.grid.rows=4;b.grid.columnGap=20;b.grid.rowGap=18;b.grid.horizontalPadding=32;b.grid.verticalPadding=48;const chunk=products.slice(pg*8,pg*8+8);for(let i=0;i<chunk.length;i++)addItem(b,chunk[i],lang,Math.floor(i/2)+1,(i%2)+1)}}
build('Catalog · English LTR','EN');build('Catalog · Arabic RTL','AR');({pages:penpotUtils.getPages(),products:products.length});
'@
$js=$js.Replace('__DATA__',$data)
$body=@{jsonrpc='2.0';id=2;method='tools/call';params=@{name='execute_code';arguments=@{code='storage.products=[]; return {ready:true};'}}}|ConvertTo-Json -Depth 10
$x=Invoke-WebRequest -Method POST -UseBasicParsing -Headers $h -Body $body -Uri $uri -TimeoutSec 60
for($start=0;$start -lt $items.Count;$start+=40){$chunk=@($items[$start..([Math]::Min($start+39,$items.Count-1))])|ConvertTo-Json -Compress -Depth 4;$chunk64=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($chunk));$append="const s=atob('$chunk64');const u=decodeURIComponent(Array.from(s).map(c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')).join(''));storage.products.push(...JSON.parse(u));return storage.products.length;";$body=@{jsonrpc='2.0';id=(3+$start);method='tools/call';params=@{name='execute_code';arguments=@{code=$append}}}|ConvertTo-Json -Depth 10;$x=Invoke-WebRequest -Method POST -UseBasicParsing -Headers $h -Body $body -Uri $uri -TimeoutSec 120}
$js64=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($js))
$runner="const s=atob('$js64');const u=decodeURIComponent(Array.from(s).map(c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')).join(''));eval(u);"
$body=@{jsonrpc='2.0';id=1000;method='tools/call';params=@{name='execute_code';arguments=@{code=$runner}}}|ConvertTo-Json -Depth 10
$x=Invoke-WebRequest -Method POST -UseBasicParsing -Headers $h -Body $body -Uri $uri -TimeoutSec 300
$x.Content
