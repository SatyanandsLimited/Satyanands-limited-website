const DEFAULT_STORE = {
  settings: {
    businessName: "Satyanand's Limited",
    established: "Est. 2024",
    phone: "8687870821",
    displayPhone: "(868) 787-0821",
    email: "satyanandslimitedest.24@yahoo.com",
    instagram: "Satyanand's Limited",
    vatRate: 12.5,
    adminPassword: "SL2024!"
  },
  products: [
    {id:"raksha-thread",name:"Plaited Raksha Thread",description:"Hand-plaited for pujas and religious celebrations.",price:14,unit:"pc",tax:"inclusive",image:"raksha-thread.png",active:true},
    {id:"ladoo",name:"Ladoo",description:"Traditional festive Indian sweet.",price:3,unit:"pc",tax:"taxable",image:"",active:true},
    {id:"gulab-jamun",name:"Gulab Jamun",description:"Soft, sweet and delicious.",price:3,unit:"pc",tax:"taxable",image:"",active:true},
    {id:"milk-barfi",name:"Milk Barfi",description:"Rich traditional milk sweet.",price:4.5,unit:"pc",tax:"taxable",image:"",active:true},
    {id:"hanuman-roat-banana",name:"Hanuman Roat — With Banana",description:"Traditional Hanuman Roat prepared with banana.",price:8,unit:"pc",tax:"taxable",image:"",active:true},
    {id:"hanuman-roat-plain",name:"Hanuman Roat — Without Banana",description:"Traditional Hanuman Roat without banana.",price:8,unit:"pc",tax:"taxable",image:"",active:true},
    {id:"sweet-rice",name:"Sweet Rice",description:"Festive sweet rice in a 16 oz container.",price:0,unit:"16 oz container",tax:"quote",image:"",active:true},
    {id:"flour-parsad",name:"Flour Parsad",description:"Fresh flour parsad.",price:150,unit:"lb",tax:"taxable",image:"",active:true}
  ],
  freeItems: [
    {id:"fresh-flowers",name:"Fresh Flowers",description:"Fresh flowers for puja and religious occasions."},
    {id:"neem-leaf",name:"Neem Leaf",description:"Neem leaf provided free."},
    {id:"bay-leaf",name:"Bay Leaf",description:"Bay leaf provided free."}
  ]
};

function loadStore(){
  try {
    const saved = localStorage.getItem('satyanandsStore');
    if(saved) return JSON.parse(saved);
  } catch(e) {}
  return structuredClone(DEFAULT_STORE);
}
function saveStore(store){ localStorage.setItem('satyanandsStore', JSON.stringify(store)); }
function money(n){ return `TT$${Number(n||0).toFixed(2)}`; }
if(typeof window !== 'undefined'){
  window.SATYANANDS_DEFAULT_STORE = DEFAULT_STORE;
  window.SATYANANDS_LOAD = loadStore;
  window.SATYANANDS_SAVE = saveStore;
  window.SATYANANDS_MONEY = money;
}
