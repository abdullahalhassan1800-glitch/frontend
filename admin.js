const products = [
  {id:1,name:'SUGAR PRO MAX',category:'Health',price:999,salePrice:1299,stock:50,status:'Active',featured:true,sku:'SPM-001',shortDesc:'Ayurvedic wellness formula for sugar balance.',image:'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop'},
  {id:2,name:'Karela Jamun Powder',category:'Health',price:699,salePrice:899,stock:35,status:'Active',featured:true,sku:'KJP-002',shortDesc:'Herbal blend for natural wellness.',image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'},
  {id:3,name:'Wireless Headphones',category:'Electronics',price:1999,salePrice:2499,stock:25,status:'Active',featured:true,sku:'WH-003',shortDesc:'Premium wireless audio experience.',image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop'},
  {id:4,name:'Smart Watch',category:'Electronics',price:2499,salePrice:2999,stock:10,status:'Active',featured:false,sku:'SW-004',shortDesc:'Track fitness and stay connected.',image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop'},
  {id:5,name:'Running Shoes',category:'Footwear',price:1299,salePrice:1699,stock:0,status:'Inactive',featured:false,sku:'RS-005',shortDesc:'Comfortable running shoes.',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop'},
  {id:6,name:'Travel Backpack',category:'Bags',price:899,salePrice:1199,stock:30,status:'Active',featured:true,sku:'TB-006',shortDesc:'Spacious and durable travel backpack.',image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop'},
  {id:7,name:'Herbal Cure',category:'Health',price:749,salePrice:899,stock:20,status:'Active',featured:false,sku:'HC-007',shortDesc:'Natural herbal formulation.',image:'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=400&auto=format&fit=crop'},
  {id:8,name:'Bluetooth Speaker',category:'Electronics',price:1499,salePrice:1799,stock:15,status:'Active',featured:true,sku:'BS-008',shortDesc:'Portable powerful sound.',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop'}
];
let allProducts = JSON.parse(localStorage.getItem('admin_products')) || products.slice();
let currentPage = 1;
let perPage = 8;
let currentFilters = {search:'',category:'',status:''};
let selectedImages = [];
let editingId = null;
const toastContainer = document.getElementById('toastContainer');
function showToast(msg,type='info'){
  const t=document.createElement('div');
  t.className='toast '+(type==='success'?'toast-success':'toast-danger');
  t.innerHTML='<div>'+msg+'</div>';
  toastContainer.appendChild(t);
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300)},2500);
}
function saveProducts(){localStorage.setItem('admin_products',JSON.stringify(allProducts));}
function init(){renderTable();updateStats();}
function updateStats(){
  const total=allProducts.length;
  const active=allProducts.filter(p=>p.status==='Active').length;
  const oos=allProducts.filter(p=>p.stock<=0).length;
  const cats=[...new Set(allProducts.map(p=>p.category))].length;
  if(document.getElementById('statTotal')) document.getElementById('statTotal').textContent=total;
  if(document.getElementById('statActive')) document.getElementById('statActive').textContent=active;
  if(document.getElementById('statOos')) document.getElementById('statOos').textContent=oos;
  if(document.getElementById('statCats')) document.getElementById('statCats').textContent=cats;
}
init();

function openAddDrawer(){ editingId=null; selectedImages=[]; document.getElementById('drawerTitle').textContent='Add New Product'; document.getElementById('productForm').reset(); document.getElementById('imagePreviewGrid').innerHTML=''; document.getElementById('productDrawer').classList.add('show'); document.getElementById('drawerOverlay').classList.add('show'); }
function closeDrawer(){ document.getElementById('productDrawer').classList.remove('show'); document.getElementById('drawerOverlay').classList.remove('show'); }
document.getElementById('btnHamburger') && document.getElementById('btnHamburger').addEventListener('click', ()=>{ document.getElementById('sidebar').classList.toggle('show'); document.getElementById('sidebarOverlay').classList.toggle('show'); });
document.getElementById('sidebarOverlay') && document.getElementById('sidebarOverlay').addEventListener('click', ()=>{ document.getElementById('sidebar').classList.remove('show'); document.getElementById('sidebarOverlay').classList.remove('show'); });
function removeThumb(el){ if(el && el.parentElement){ el.parentElement.remove(); } }

if(document.getElementById(" addBtn\)){document.getElementById(ddBtn\).addEventListener(\click\,openAddDrawer);}
