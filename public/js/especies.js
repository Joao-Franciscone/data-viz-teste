document.addEventListener('DOMContentLoaded', function(){
  const selectAquario = document.getElementById('selectAquario');
  const tabelaBody = document.querySelector('#tabelaEspecies tbody');

  function fetchAquarios(){
    fetch('/aquarios').then(r=>r.json()).then(data=>{
      selectAquario.innerHTML = '';
      data.forEach(a=>{
        const opt = document.createElement('option'); opt.value = a.id; opt.textContent = a.descricao || a.id; selectAquario.appendChild(opt);
      });
    }).catch(()=>{});
  }

  function carregarLista(){
    const tipo = document.getElementById('filtroTipoAgua').value;
    const tamanho = document.getElementById('filtroTamanho').value;
    const q = [];
    if(tipo) q.push('tipo_agua='+encodeURIComponent(tipo));
    if(tamanho) q.push('tamanho='+encodeURIComponent(tamanho));
    fetch('/especies?'+q.join('&')).then(r=>r.json()).then(data=>{
      tabelaBody.innerHTML='';
      data.forEach(e=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${e.id}</td><td>${e.nome}</td><td>${e.fk_aquario||''}</td><td>${e.tipo_agua||''}</td><td>${e.tamanho||''}</td>`;
        tabelaBody.appendChild(tr);
      });
    }).catch(()=>{});
  }

  document.getElementById('formEspecie').addEventListener('submit', function(ev){
    ev.preventDefault();
    const nome = document.getElementById('nome').value;
    const idAquario = selectAquario.value;
    const tipo = document.getElementById('tipoAgua').value;
    if(!nome||!idAquario){ alert('preencha nome e aquário'); return; }
    fetch('/especies',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nome, idAquario, tipo_agua_preferida:tipo})}).then(r=>{
      if(r.status===201){ carregarLista(); alert('Cadastrado'); } else { r.text().then(t=>alert('Erro: '+t)); }
    });
  });

  document.getElementById('btnFiltrar').addEventListener('click', carregarLista);

  fetchAquarios(); carregarLista();
});
