import{_,d as i,a$ as l,E as n,r as d,D as v,o as s,c as p,a as c,G as f,q as m,w as b,e as h}from"./index.17d3c514.js";const k={mounted(e,t){if(typeof t.value!="function"){console.error("callback must be a function");return}let o=null;e.__handleClick__=function(a){o&&clearInterval(o),o=setTimeout(()=>{t.value()},200)},e.addEventListener("click",e.__handleClick__)},beforeUnmount(e){e.removeEventListener("click",e.__handleClick__)}};const y=i({directives:{Debounce:k},setup(){const e=t=>function(){console.log(t),n({type:"success",message:"\u6B63\u5728\u62C9\u53D6\u6570\u636E"})};return l(()=>{n.closeAll()}),{getData:e}}}),C={class:"layout-container"},D={class:"layout-container-table"},E={class:"box"};function x(e,t,o,a,g,B){const r=d("el-button"),u=v("debounce");return s(),p("div",C,[c("div",D,[c("div",E,[f((s(),m(r,{type:"primary"},{default:b(()=>[h("\u9632\u6296\u6309\u94AE")]),_:1})),[[u,e.getData(123)]])])])])}var w=_(y,[["render",x],["__scopeId","data-v-6d25bf24"]]);export{w as default};