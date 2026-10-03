const t=()=>localStorage.getItem("malakoiCurrency")==="USD"?"USD":"PEN",a=(o,r="PEN")=>r==="USD"?`$ ${(o*.27).toFixed(2)}`:`S/ ${o}.00`;export{a as f,t as r};
