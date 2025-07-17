let products;
async function loadData(){
  products = await fetch('data/products.json').then(r=>r.json());
  fillSelect('lamp-select','lamps');
  fillSelect('fan-select','fans');
  fillSelect('vent-select','vents');
}
function fillSelect(id, key){
  const sel = document.getElementById(id);
  products[key].forEach(p => sel.add(new Option(p.name, p.id)));
}
function getProd(key,id){
  return products[key].find(p=>p.id===id);
}
function calc(){
  const b = +document.getElementById('zelt-b').value;
  const t = +document.getElementById('zelt-t').value;
  const area = b*t/10000;
  const lamp = getProd('lamps',document.getElementById('lamp-select').value);
  const fan = getProd('fans',document.getElementById('fan-select').value);
  const vent = getProd('vents',document.getElementById('vent-select').value);
  const mode = document.querySelector('input[name=mode]:checked').value;

  const warnings = [];
  if(b<lamp.min_area[0] || t<lamp.min_area[1]) warnings.push('Lampe zu groß für das Zelt!');
  if(b>lamp.max_area[0] || t>lamp.max_area[1]) warnings.push('Lampe zu schwach für das Zelt!');
  if(fan.flow_m3h < area*60) warnings.push('Lüfter zu schwach (weniger als 1x Luftwechsel pro Minute)!');

  document.getElementById('warnings').innerHTML = warnings.map(w=>'<p>'+w+'</p>').join('');

  const basic = `
    <h3>Basic</h3>
    <p>Preis gesamt: ${(lamp.price+fan.price+vent.price).toFixed(2)} €</p>
    <p>Watt gesamt: ${lamp.watt} W</p>
  `;
  document.getElementById('basic-results').innerHTML = basic;

  if(mode==='pro'){
    const ppfd = lamp.ppf/area;
    const la = lamp.ppf/lamp.watt;
    const pro = `
      <h3>Pro</h3>
      <p>PPFD: ${ppfd.toFixed(1)} µmol/m²/s</p>
      <p>Effizienz: ${la.toFixed(2)} µmol/J</p>
      <p>Empf. Höhe: ${(b<100?40:45)} cm über Pflanzen</p>
    `;
    document.getElementById('pro-results').innerHTML = pro;
  } else {
    document.getElementById('pro-results').innerHTML = '';
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  loadData().then(calc);
  ['zelt-b','zelt-t','lamp-select','fan-select','vent-select']
    .forEach(id=>document.getElementById(id).addEventListener('input',calc));
  document.querySelectorAll('input[name=mode]').forEach(el=>el.addEventListener('change',calc));
});