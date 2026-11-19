const phone = "555198172662";
const products = [
  {id:"cafe-dois",name:"Café da manhã para dois",price:487.90,category:"cafe",label:"Para compartilhar",image:"assets/cafe-dois.png",description:"Cesta de palha natural, bolo caseirinho, pão de fermentação natural, geleia, flores, biscoitos gourmet, croissant, cafés, suco, frios e queijo brie."},
  {id:"bolsa-palha",name:"Bolsa palha natural",price:345.90,category:"presentes",label:"Um presente leve",image:"assets/bolsa-palha.png",description:"Bolsa de palha natural de taboa, flores, drip de café, bolo caseirinho, torradas, doces portugueses, minigeleia francesa, uvas e acabamento Cestear."},
  {id:"mini-cafe",name:"Cesta minicafé da manhã",price:294.90,category:"cafe",label:"Um começo de dia",image:"assets/mini-cafe.png",description:"Cesta de tecido cru, bolo (sabores a confirmar), croissant francês, mini geleia, iogurte natural, drip de café, suco natural, uvas, flores e acabamento Cestear."},
  {id:"maternidade",name:"Cesta maternidade família",price:529.00,category:"momentos",label:"Para acolher",image:"assets/maternidade.png",description:"Cesta de palha, flores, pão de fermentação natural, mel, biscoitos gourmet, palitos salgados, chocolate, chá, drip de café, nuts e detalhes personalizados. Pelúcia opcional."},
  {id:"casillero",name:"Cesta Casillero",price:459.90,category:"presentes",label:"Para brindar",image:"assets/casillero.png",description:"Cesta de palha, vinho Casillero del Diablo, baguete recheada (disponibilidade a confirmar), nuts, geleia, queijo brie e amendoim japonês."},
  {id:"doce-amanhecer",name:"Doce amanhecer",price:489.90,category:"cafe",label:"Manhã especial",image:"assets/doce-amanhecer.png",description:"Flores, pão de fermentação natural, geleia, presunto parma, queijo gouda, drip de café, suco, bolinho caseiro, frutas, nuts e brownie de castanhas."},
  {id:"essencia",name:"Essência",price:489.00,category:"momentos",label:"Um gesto marcante",image:"assets/essencia.png",description:"Flores, croissant francês, creme de queijo, geleia, chá, broas Caxambu, chocolate, torradinhas, brownie, doce português e opções personalizadas."},
  {id:"aconchego",name:"Aconchego da manhã",price:396.00,category:"cafe",label:"Com café Baggio",image:"assets/aconchego.png",description:"Cesta de palha, flores, pão de fermentação natural, café Baggio, bolinho caseiro, biscoitos gourmet, nuts, uvas e acabamento Cestear."},
  {id:"encanto",name:"Encanto",price:255.00,category:"presentes",label:"Um mimo especial",image:"assets/encanto.png",description:"Cesta de tecido, croissant francês, mini geleia, creme de queijo, drip de café, brownie de castanhas, stroopwafel, flores e uvas."},
  {id:"raio-de-sol",name:"Raio de Sol",price:345.00,category:"cafe",label:"Um dia mais leve",image:"assets/raio-de-sol.png",description:"Cesta de palha, flores, pão de fermentação natural, stroopwafel, doce português, mel ou minigeleia, café Baggio e uvas."}
];

const grid = document.querySelector("#product-grid");
const search = document.querySelector("#catalog-search");
const count = document.querySelector("#cart-count");
const selection = new Map();
let activeFilter = "todas";
let toastTimer;
const money = value => new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"}).format(value);
const iconBag = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16l-1.3 12H5.3L4 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>';

function renderProducts(){
  const term = search.value.trim().toLocaleLowerCase("pt-BR");
  const visible = products.filter(item => (activeFilter === "todas" || item.category === activeFilter) && (!term || `${item.name} ${item.description} ${item.label}`.toLocaleLowerCase("pt-BR").includes(term)));
  document.querySelector("#results-count").textContent = `${visible.length} ${visible.length === 1 ? "sugestão" : "sugestões"}`;
  grid.innerHTML = visible.length ? visible.map(item => `
    <article class="product-card">
      <div class="product-photo"><img src="${item.image}" alt="${item.name}, cesta artesanal da Cestear" loading="lazy" width="452" height="564"/><span class="product-tag">${item.label}</span></div>
      <div class="product-body"><p class="product-kicker">${item.category === "cafe" ? "Café & manhã" : item.category === "momentos" ? "Momentos especiais" : "Para presentear"}</p><h3>${item.name}</h3><p class="product-desc">${item.description}</p>
      <div class="product-bottom"><span class="product-price">${money(item.price)}</span><div class="product-actions"><button class="mini-action" type="button" data-ask="${item.id}" aria-label="Perguntar sobre ${item.name}" title="Perguntar sobre esta cesta"><svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3.5-.8L4 20l1.4-3.4A7.2 7.2 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7Z"/></svg></button><button class="mini-action" type="button" data-add="${item.id}" aria-label="Adicionar ${item.name} à seleção" title="Adicionar à seleção">${iconBag}</button></div></div></div>
    </article>`).join("") : `<p class="no-results">Não encontrei uma cesta com esse termo. Tente outra busca ou veja todas as sugestões.</p>`;
}

function openCart(){document.querySelector("#cart-drawer").hidden=false;document.querySelector("#cart-backdrop").hidden=false;document.body.classList.add("cart-open");document.querySelector("[data-close-cart]").focus();renderCart();}
function closeCart(){document.querySelector("#cart-drawer").hidden=true;document.querySelector("#cart-backdrop").hidden=true;document.body.classList.remove("cart-open");document.querySelector("[data-open-cart]").focus();}
function showToast(message){const toast=document.querySelector("#toast");toast.textContent=message;toast.classList.add("is-visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("is-visible"),2300);}
function addToCart(id){selection.set(id,(selection.get(id)||0)+1);renderCart();showToast("Adicionada à sua seleção");}
function renderCart(){
  const totalCount=[...selection.values()].reduce((sum,n)=>sum+n,0);count.textContent=totalCount;
  const chosen=products.filter(item=>selection.has(item.id));
  const items=document.querySelector("#cart-items");
  items.innerHTML=chosen.map(item=>`<div class="cart-row"><img src="${item.image}" alt=""/><div><h3>${item.name}</h3><small>Quantidade: ${selection.get(item.id)}</small><strong>${money(item.price*selection.get(item.id))}</strong></div><button class="remove-item" type="button" data-remove="${item.id}">Remover</button></div>`).join("");
  document.querySelector("#cart-empty").hidden=chosen.length>0;
  document.querySelector("#cart-total").hidden=chosen.length===0;
  document.querySelector("#cart-total-value").textContent=money(chosen.reduce((sum,item)=>sum+item.price*selection.get(item.id),0));
  const checkout=document.querySelector("#cart-checkout");
  checkout.setAttribute("aria-disabled",String(chosen.length===0));
  const message=chosen.map(item=>`${selection.get(item.id)}x ${item.name}`).join(", ");
  checkout.href=chosen.length?`https://wa.me/${phone}?text=${encodeURIComponent(`Oi, Cestear! Vi a vitrine online e gostaria de consultar disponibilidade e detalhes para: ${message}.`)}`:"#";
}

grid.addEventListener("click",event=>{
  const add=event.target.closest("[data-add]");
  if(add){addToCart(add.dataset.add);return;}
  const ask=event.target.closest("[data-ask]");
  if(ask){const item=products.find(product=>product.id===ask.dataset.ask);window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Oi, Cestear! Gostaria de saber mais sobre a cesta ${item.name} e confirmar disponibilidade.`)}`,"_blank","noopener,noreferrer");}
});
document.querySelector("#cart-items").addEventListener("click",event=>{const remove=event.target.closest("[data-remove]");if(remove){selection.delete(remove.dataset.remove);renderCart();}});
document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;document.querySelectorAll("[data-filter]").forEach(chip=>{const active=chip===button;chip.classList.toggle("is-active",active);chip.setAttribute("aria-pressed",String(active));});renderProducts();}));
search.addEventListener("input",renderProducts);
document.querySelectorAll("[data-open-cart]").forEach(button=>button.addEventListener("click",openCart));
document.querySelectorAll("[data-close-cart]").forEach(button=>button.addEventListener("click",closeCart));
document.querySelector("#cart-backdrop").addEventListener("click",closeCart);
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!document.querySelector("#cart-drawer").hidden)closeCart();});
document.querySelector("#cart-checkout").addEventListener("click",event=>{if(event.currentTarget.getAttribute("aria-disabled")==="true")event.preventDefault();});
renderProducts();renderCart();
