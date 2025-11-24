const API = 'http://localhost:5000/api';
const productTableBody = document.querySelector('#productTable tbody');
const totalProductsEl = document.getElementById('totalProducts');
const totalQuantityEl = document.getElementById('totalQuantity');
const lowStockEl = document.getElementById('lowStock');
const searchBox = document.getElementById('searchBox');
const categoryFilter = document.getElementById('categoryFilter');
const searchBtn = document.getElementById('searchBtn');
const refreshBtn = document.getElementById('refreshBtn');
const addBtn = document.getElementById('addBtn');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

let editId = null;

async function fetchProducts(q='', category=''){
  const url = new URL(API + '/products');
  if(q) url.searchParams.append('q', q);
  if(category) url.searchParams.append('category', category);
  const res = await fetch(url);
  const data = await res.json();
  renderTable(data);
  updateStats(data);
  populateCategories(data);
}

function renderTable(products){
  productTableBody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td>
      <td>${p.sku || '-'}</td>
      <td>${p.category}</td>
      <td class="${p.quantity < p.minStock ? 'low' : ''}">${p.quantity}</td>
      <td>${p.minStock}</td>
      <td>${p.supplier || '-'}</td>
      <td>
        <button data-id="${p._id}" class="edit">Edit</button>
        <button data-id="${p._1d}" class="del">Delete</button>
        <button data-id="${p._id}" class="sell">Sell</button>
      </td>`;
    productTableBody.appendChild(tr);
  });
}

function updateStats(products){
  totalProductsEl.innerText = products.length;
  const totalQty = products.reduce((s,p)=> s + (p.quantity||0), 0);
  totalQuantityEl.innerText = totalQty;
  const low = products.filter(p=> p.quantity < p.minStock).length;
  lowStockEl.innerText = low;
}

function populateCategories(products){
  const cats = new Set(products.map(p=> p.category || 'General'));
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  cats.forEach(c=> {
    const opt = document.createElement('option');
    opt.value = c; opt.innerText = c;
    categoryFilter.appendChild(opt);
  });
}

// Controls
searchBtn.addEventListener('click', ()=> fetchProducts(searchBox.value, categoryFilter.value));
refreshBtn.addEventListener('click', ()=> { searchBox.value=''; categoryFilter.value=''; fetchProducts(); });
addBtn.addEventListener('click', ()=> openModal());

// Modal logic
function openModal(product){
  modal.classList.remove('hidden');
  if(product){
    modalTitle.innerText = 'Edit Product';
    document.getElementById('p_name').value = product.name || '';
    document.getElementById('p_sku').value = product.sku || '';
    document.getElementById('p_category').value = product.category || '';
    document.getElementById('p_quantity').value = product.quantity || 0;
    document.getElementById('p_minStock').value = product.minStock || 10;
    document.getElementById('p_price').value = product.price || 0;
    document.getElementById('p_supplier').value = product.supplier || '';
    editId = product._id;
  }else{
    modalTitle.innerText = 'Add Product';
    document.getElementById('p_name').value = '';
    document.getElementById('p_sku').value = '';
    document.getElementById('p_category').value = '';
    document.getElementById('p_quantity').value = 0;
    document.getElementById('p_minStock').value = 10;
    document.getElementById('p_price').value = 0;
    document.getElementById('p_supplier').value = '';
    editId = null;
  }
}

cancelBtn.addEventListener('click', ()=> { modal.classList.add('hidden'); });

saveBtn.addEventListener('click', async ()=> {
  const payload = {
    name: document.getElementById('p_name').value,
    sku: document.getElementById('p_sku').value,
    category: document.getElementById('p_category').value,
    quantity: Number(document.getElementById('p_quantity').value),
    minStock: Number(document.getElementById('p_minStock').value),
    price: Number(document.getElementById('p_price').value),
    supplier: document.getElementById('p_supplier').value
  };
  if(editId){
    await fetch(API + '/products/' + editId, { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
  }else{
    await fetch(API + '/products', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
  }
  modal.classList.add('hidden');
  fetchProducts();
});

// Table action delegation
productTableBody.addEventListener('click', async (e)=>{
  const id = e.target.dataset.id;
  if(e.target.classList.contains('edit')){
    // fetch single product then open modal
    const res = await fetch(API + '/products');
    const list = await res.json();
    const prod = list.find(x=> x._id === id);
    openModal(prod);
  }else if(e.target.classList.contains('del')){
    if(confirm('Delete item?')){
      await fetch(API + '/products/' + id, { method:'DELETE' });
      fetchProducts();
    }
  }else if(e.target.classList.contains('sell')){
    const qty = prompt('Quantity to sell', '1');
    const n = Number(qty);
    if(n>0){
      await fetch(API + '/sales', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ productId: id, quantitySold: n })});
      fetchProducts();
    }
  }
});

// initial load
fetchProducts();
