async function atualizar() {
  const resposta = await fetch('/api/status');
  const dados = await resposta.json();
  document.getElementById('uptime').textContent = dados.uptime;
}

atualizar();
setInterval(atualizar, 1000);




// const homeView = document.getElementById('homeView');
// const detailsView = document.getElementById('detailsView');
// const screenScroll = document.getElementById('screenScroll');
// document.getElementById('openDetails').addEventListener('click', () => { homeView.classList.add('hidden'); detailsView.classList.add('active'); screenScroll.scrollTop = 0; });
// document.getElementById('backHome').addEventListener('click', () => { detailsView.classList.remove('active'); homeView.classList.remove('hidden'); screenScroll.scrollTop = 0; });
// document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
//   document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === btn));
//   document.querySelectorAll('.detail-pane').forEach(p => p.classList.toggle('active', p.id === 'pane-' + btn.dataset.tab));
//   screenScroll.scrollTop = 0;
// }));
const posts = [
  [{ n: 'Quiosque 11', d: '1,2 km', p: 'Posto 06' }, { n: 'Quiosque 13', d: '0,8 km', p: 'Posto 08' }],
  [{ n: 'Quiosque 10', d: '1,7 km', p: 'Posto 05' }, { n: 'Quiosque 14', d: '1,1 km', p: 'Posto 09' }],
  [{ n: 'Quiosque 09', d: '2,1 km', p: 'Posto 04' }, { n: 'Quiosque 15', d: '1,6 km', p: 'Posto 10' }]
];
let postIndex = 0;
function renderPosts() { const pair = posts[postIndex]; document.getElementById('near1Name').textContent = pair[0].n; document.getElementById('near1Dist').textContent = pair[0].d; document.querySelector('#near1Dist').nextElementSibling.textContent = pair[0].p; document.getElementById('near2Name').textContent = pair[1].n; document.getElementById('near2Dist').textContent = pair[1].d; document.querySelector('#near2Dist').nextElementSibling.textContent = pair[1].p; }
document.getElementById('nextPost').addEventListener('click', () => { postIndex = (postIndex + 1) % posts.length; renderPosts() });
document.getElementById('prevPost').addEventListener('click', () => { postIndex = (postIndex - 1 + posts.length) % posts.length; renderPosts() });