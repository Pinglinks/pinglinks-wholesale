import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CONFIG ───────────────────────────────────────────────────────────
const SUPABASE_URL = "https://hzykmhxsilbfkgzjkqoy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6eWttaHhzaWxiZmtnemprcW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjI4NDQsImV4cCI6MjA4NzczODg0NH0.jQ_Pey7cYwe6ZyqiMLMvnCj_FPdEuN9OXRAEqeFbYQQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const LOGO_SRC = new URL("./logo.png", import.meta.url).href;

// ─── DEMO DATA (used when Supabase not yet connected) ─────────────────────────
const DEMO_CATEGORIES = ["Devices: Phones","Samsung A Series","Airpods","Devices: Tablets","Macbook","USB & AUX Cables","Power Bank","LCD & Touch & Digitizers","Google Pixel","Smart Watch","Gaming","Accessories"];

const DEMO_SUPPLIERS = [
  { id:"s1", name:"TechSource International", contact:"techsource@email.com", phone:"+1-305-555-0101", address:"Miami, FL, USA" },
  { id:"s2", name:"Asia Pacific Electronics", contact:"ape@email.com", phone:"+852-555-0202", address:"Hong Kong" },
  { id:"s3", name:"Caribbean Tech Distributors", contact:"ctd@email.com", phone:"+1-876-555-0303", address:"Kingston, Jamaica" },
];

const DEMO_STORES = [
  { id:"store1", name:"Pinglinks - Half Way Tree", address:"Shop 12, Half Way Tree Plaza, Kingston" },
  { id:"store2", name:"Pinglinks - Portmore", address:"Lot 5, Portmore Mall, St. Catherine" },
  { id:"store3", name:"Pinglinks - Montego Bay", address:"Unit 3, Baywest Shopping Centre, MoBay" },
  { id:"store4", name:"Pinglinks - Online Warehouse", address:"20A South Avenue, Kingston" },
];

const DEMO_PRODUCTS = [
  { id:"p1", sku:"IP15P-256-NT", barcode:"192456789012", brand:"Apple", name:"iPhone 15 Pro 256GB Natural Titanium", category:"Devices: Phones", supplier_id:"s1", cost:55000, wholesale_price:85000, retail_price:105000, stock:12, low_stock_threshold:5, min_order:2, description:"Apple iPhone 15 Pro, 256GB, Natural Titanium finish. Factory unlocked.", is_clearance:false, clearance_price:null, is_new_arrival:true, active:true, created_at:"2025-01-10" },
  { id:"p2", sku:"SGS24U-512", barcode:"192456789013", brand:"Samsung", name:"Samsung Galaxy S24 Ultra 512GB", category:"Devices: Phones", supplier_id:"s1", cost:48000, wholesale_price:78000, retail_price:98000, stock:8, low_stock_threshold:4, min_order:2, description:"Samsung Galaxy S24 Ultra 512GB, S Pen included.", is_clearance:false, clearance_price:null, is_new_arrival:true, active:true, created_at:"2025-01-12" },
  { id:"p3", sku:"SGA55-128", barcode:"192456789014", brand:"Samsung", name:"Samsung Galaxy A55 128GB", category:"Samsung A Series", supplier_id:"s2", cost:18000, wholesale_price:32000, retail_price:42000, stock:3, low_stock_threshold:8, min_order:5, description:"Samsung Galaxy A55 5G, 128GB, various colors.", is_clearance:false, clearance_price:null, is_new_arrival:false, active:true, created_at:"2024-11-01" },
  { id:"p4", sku:"APP-2G", barcode:"192456789015", brand:"Apple", name:"Apple AirPods Pro (2nd Gen)", category:"Airpods", supplier_id:"s1", cost:10000, wholesale_price:18000, retail_price:25000, stock:30, low_stock_threshold:10, min_order:3, description:"AirPods Pro 2nd Gen with USB-C charging case.", is_clearance:false, clearance_price:null, is_new_arrival:false, active:true, created_at:"2024-10-15" },
  { id:"p5", sku:"IPAD10-64W", barcode:"192456789016", brand:"Apple", name:"iPad 10th Gen 64GB WiFi", category:"Devices: Tablets", supplier_id:"s3", cost:28000, wholesale_price:45000, retail_price:58000, stock:7, low_stock_threshold:3, min_order:2, description:"Apple iPad 10th Generation, 64GB, WiFi only.", is_clearance:false, clearance_price:null, is_new_arrival:false, active:true, created_at:"2024-09-20" },
  { id:"p6", sku:"MBA-M2-256", barcode:"192456789017", brand:"Apple", name:"MacBook Air M2 256GB", category:"Macbook", supplier_id:"s1", cost:75000, wholesale_price:115000, retail_price:145000, stock:5, low_stock_threshold:2, min_order:1, description:"Apple MacBook Air M2, 8GB RAM, 256GB SSD.", is_clearance:false, clearance_price:null, is_new_arrival:true, active:true, created_at:"2025-01-20" },
  { id:"p7", sku:"USBC-6FT-10", barcode:"192456789018", brand:"Anker", name:"USB-C Fast Charge Cable 6ft (10pk)", category:"USB & AUX Cables", supplier_id:"s2", cost:1200, wholesale_price:3500, retail_price:6000, stock:100, low_stock_threshold:20, min_order:10, description:"Premium braided USB-C cables, 6ft, pack of 10.", is_clearance:true, clearance_price:2800, is_new_arrival:false, active:true, created_at:"2024-08-01" },
  { id:"p8", sku:"PB-20K-5", barcode:"192456789019", brand:"Baseus", name:"20000mAh Power Bank (5pk)", category:"Power Bank", supplier_id:"s2", cost:3500, wholesale_price:8500, retail_price:14000, stock:2, low_stock_threshold:10, min_order:5, description:"20000mAh slim power bank, dual USB-A + USB-C.", is_clearance:false, clearance_price:null, is_new_arrival:false, active:true, created_at:"2024-07-15" },
  { id:"p9", sku:"LCD-IP14", barcode:"192456789020", brand:"OEM", name:"iPhone 14 LCD Screen Assembly", category:"LCD & Touch & Digitizers", supplier_id:"s3", cost:6000, wholesale_price:12000, retail_price:18000, stock:20, low_stock_threshold:5, min_order:3, description:"OEM iPhone 14 LCD assembly with digitizer.", is_clearance:false, clearance_price:null, is_new_arrival:false, active:true, created_at:"2024-06-10" },
  { id:"p10", sku:"GP8P-128", barcode:"192456789021", brand:"Google", name:"Google Pixel 8 Pro 128GB", category:"Google Pixel", supplier_id:"s1", cost:35000, wholesale_price:55000, retail_price:70000, stock:0, low_stock_threshold:3, min_order:2, description:"Google Pixel 8 Pro 128GB, all colors.", is_clearance:true, clearance_price:48000, is_new_arrival:false, active:true, created_at:"2024-05-01" },
];

const DEMO_CUSTOMERS = [
  { id:"c1", name:"Marcus Electronics", email:"marcus@electronics.jm", company:"Marcus Electronics Ltd", tax_id:"TAX-10001", role:"buyer", customer_type:"upfront", approved:true, discount_pct:0, min_order_value:5000, created_at:"2024-10-01" },
  { id:"c2", name:"Island Gadgets", email:"info@islandgadgets.jm", company:"Island Gadgets Co", tax_id:"TAX-10002", role:"buyer", customer_type:"consignment", approved:true, discount_pct:5, min_order_value:10000, created_at:"2024-11-15" },
  { id:"c3", name:"Tech Haven Store", email:"buy@techhaven.jm", company:"Tech Haven Store", tax_id:"TAX-10003", role:"buyer", customer_type:"upfront", approved:true, discount_pct:10, min_order_value:0, created_at:"2025-01-05" },
  { id:"c4", name:"New Applicant Co", email:"new@applicant.jm", company:"New Applicant Co", tax_id:"TAX-10004", role:"buyer", customer_type:null, approved:false, discount_pct:0, min_order_value:0, created_at:"2025-01-25" },
];

const DEMO_ORDERS = [
  { id:"INV-2025-001", customer_id:"c1", customer_name:"Marcus Electronics", date:"2025-01-15", status:"paid", payment_method:"bank_transfer", subtotal:170000, tax_rate:15, tax_amount:25500, total:195500, notes:"", items:[{product_id:"p1",name:"iPhone 15 Pro 256GB Natural Titanium",qty:2,unit_price:85000,barcode:"192456789012"}] },
  { id:"INV-2025-002", customer_id:"c2", customer_name:"Island Gadgets", date:"2025-01-28", status:"pending", payment_method:"", subtotal:320000, tax_rate:15, tax_amount:48000, total:368000, type:"consignment", consignment_due:"2025-03-28", notes:"Net 60", items:[{product_id:"p3",name:"Samsung Galaxy A55 128GB",qty:10,unit_price:32000,barcode:"192456789014"}] },
  { id:"INV-2025-003", customer_id:"c3", customer_name:"Tech Haven Store", date:"2025-02-01", status:"processing", payment_method:"cash", subtotal:115000, tax_rate:15, tax_amount:17250, total:132250, notes:"", items:[{product_id:"p6",name:"MacBook Air M2 256GB",qty:1,unit_price:115000,barcode:"192456789017"}] },
];

const DEMO_TRANSFERS = [
  { id:"TRF-2025-001", store_id:"store1", store_name:"Pinglinks - Half Way Tree", date:"2025-01-20", items:[{product_id:"p4",name:"Apple AirPods Pro (2nd Gen)",sku:"APP-2G",barcode:"192456789015",qty:5,cost:10000}], total_cost:50000, notes:"" },
];

const DEMO_STOCK_TAKES = [
  { id:"ST-2025-001", date:"2025-01-10", status:"completed", items:[{product_id:"p1",expected:14,counted:12,variance:-2},{product_id:"p3",expected:5,counted:3,variance:-2}], notes:"Post-holiday count" },
];

const DEMO_SETTINGS = {
  tax_rate: 15,
  company_name: "Pinglinks Cellular",
  company_address: "20A South Avenue, Kingston, Jamaica",
  company_phone: "+1-876-276-7464",
  company_email: "wholesale@pinglinkscellular.com",
  invoice_prefix: "INV",
  transfer_prefix: "TRF",
  currency: "J$",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f0f2f5;--bg2:#ffffff;--bg3:#f5f6f8;--bg4:#eceef2;
  --border:#e0e3ea;--border2:#d0d4de;
  --accent:#1a6fc4;--accent2:#0ea5e9;--accent3:#f97316;--accent4:#8b5cf6;
  --text:#1a1d2e;--text2:#4a5068;--text3:#8a90a8;
  --danger:#dc2626;--warn:#d97706;--success:#059669;
  --radius:10px;--radius-lg:14px;
}
html{font-size:14px}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;line-height:1.5}
h1,h2,h3,h4{font-family:'DM Sans',sans-serif;line-height:1.2;font-weight:700}
a{color:var(--accent);text-decoration:none}
button{font-family:inherit;cursor:pointer}

/* ── Layout ── */
.layout{display:flex;min-height:100vh}
.sidebar{width:220px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto}
.sidebar-logo{padding:20px 16px 16px;border-bottom:1px solid var(--border);flex-shrink:0}
.sidebar-logo img{object-fit:contain;max-width:100%}
.sidebar-logo .sub{font-size:10px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;margin-top:2px}
.sidebar-nav{flex:1;padding:12px 10px}
.nav-section{margin-bottom:20px}
.nav-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);padding:0 8px;margin-bottom:6px}
.nav-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;font-size:13px;color:var(--text2);border:none;background:none;width:100%;text-align:left;transition:all .15s;cursor:pointer}
.nav-item:hover{background:var(--bg3);color:var(--text)}
.nav-item.active{background:rgba(26,111,196,.1);color:var(--accent)}
.nav-item .ni{font-size:15px;width:18px;text-align:center;flex-shrink:0}
.sidebar-footer{padding:12px 10px;border-top:1px solid var(--border);flex-shrink:0}
.user-chip{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:7px;margin-bottom:6px}
.avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#fff;flex-shrink:0}
.main{margin-left:220px;flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid var(--border);background:var(--bg2);position:sticky;top:0;z-index:50;flex-shrink:0}
.topbar-title{font-family:'DM Sans',sans-serif;font-weight:700;font-size:17px}
.content{padding:24px;flex:1}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:7px;font-size:13px;font-weight:500;border:none;transition:all .15s;white-space:nowrap;cursor:pointer}
.btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:#1558a0}
.btn-secondary{background:var(--bg3);color:var(--text);border:1px solid var(--border)}.btn-secondary:hover{border-color:var(--accent);color:var(--accent)}
.btn-danger{background:rgba(255,68,102,.12);color:var(--danger);border:1px solid rgba(255,68,102,.25)}.btn-danger:hover{background:rgba(255,68,102,.2)}
.btn-ghost{background:transparent;color:var(--text2)}.btn-ghost:hover{background:var(--bg3);color:var(--text)}
.btn-warn{background:rgba(255,170,0,.12);color:var(--warn);border:1px solid rgba(255,170,0,.25)}
.btn-purple{background:rgba(168,85,247,.12);color:var(--accent4);border:1px solid rgba(168,85,247,.25)}.btn-purple:hover{background:rgba(168,85,247,.2)}
.btn-sm{padding:5px 10px;font-size:12px}
.btn-xs{padding:3px 8px;font-size:11px}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn-group{display:flex;gap:6px;flex-wrap:wrap}

/* ── Cards ── */
.card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg)}
.card-header{padding:16px 20px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.card-header h3{font-size:15px;font-weight:700}
.card-body{padding:20px}

/* ── Stats ── */
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px}
.stat{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px 20px;position:relative;overflow:hidden}
.stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.stat.c1::before{background:var(--accent)}.stat.c2::before{background:var(--accent2)}
.stat.c3::before{background:var(--accent3)}.stat.c4::before{background:var(--accent4)}
.stat.c5::before{background:var(--warn)}.stat.c6::before{background:var(--danger)}
.stat-label{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:6px}
.stat-val{font-family:'DM Sans',sans-serif;font-size:24px;font-weight:700;line-height:1}
.stat-sub{font-size:11px;color:var(--text3);margin-top:4px}

/* ── Tables ── */
.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse}
th{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);padding:8px 12px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
td{padding:10px 12px;font-size:13px;border-bottom:1px solid var(--border);vertical-align:middle}
tr:last-child td{border-bottom:none}
tbody tr:hover td{background:rgba(26,111,196,.04)}
.tbl-actions{display:flex;gap:4px}
th.sortable{cursor:pointer;user-select:none}.th.sortable:hover{color:var(--text)}

/* ── Badges ── */
.badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500;white-space:nowrap}
.bg{background:rgba(5,150,105,.12);color:var(--success)}
.bb{background:rgba(0,153,255,.12);color:var(--accent2)}
.bo{background:rgba(255,107,53,.12);color:var(--accent3)}
.bp{background:rgba(168,85,247,.12);color:var(--accent4)}
.br{background:rgba(255,68,102,.12);color:var(--danger)}
.bw{background:rgba(255,170,0,.12);color:var(--warn)}
.bgr{background:rgba(138,143,168,.12);color:var(--text2)}
.bclear{background:rgba(255,107,53,.18);color:#ff8855;border:1px solid rgba(255,107,53,.3)}

/* ── Forms ── */
.form-group{margin-bottom:14px}
.form-group label{display:block;font-size:11px;font-weight:500;color:var(--text2);margin-bottom:5px;letter-spacing:.3px;text-transform:uppercase}
input,select,textarea{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:7px;padding:8px 12px;color:var(--text);font-size:13px;font-family:inherit;outline:none;transition:border-color .15s}
input:focus,select:focus,textarea:focus{border-color:var(--accent)}
input[type=checkbox]{width:auto;accent-color:var(--accent)}
select option{background:var(--bg3)}
textarea{resize:vertical;min-height:70px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.form-row-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}
.input-hint{font-size:11px;color:var(--text3);margin-top:3px}

/* ── Modals ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;backdrop-filter:blur(4px)}
.modal{background:var(--bg2);border:1px solid var(--border);border-radius:16px;width:100%;max-height:92vh;overflow-y:auto;box-shadow:0 24px 60px rgba(0,0,0,.15)}
.modal-sm{max-width:440px}.modal-md{max-width:580px}.modal-lg{max-width:800px}.modal-xl{max-width:1000px}
.modal-head{padding:20px 20px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg2);z-index:1}
.modal-head h2{font-size:16px}
.modal-body{padding:20px}
.modal-foot{padding:14px 20px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;position:sticky;bottom:0;background:var(--bg2)}
.xbtn{background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer;padding:2px 6px;border-radius:4px;line-height:1}
.xbtn:hover{color:var(--text);background:var(--bg3)}

/* ── Login ── */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#e8f0fb 0%,#f0f2f5 50%,#e8f4fd 100%)}
.login-box{width:100%;max-width:400px;padding:20px}
.login-logo{text-align:center;margin-bottom:32px}
.login-logo img{object-fit:contain}
.login-logo .ls{font-size:11px;color:var(--text3);letter-spacing:3px;text-transform:uppercase;margin-top:3px}
.login-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:28px;box-shadow:0 8px 32px rgba(0,0,0,.12)}
.ltabs{display:flex;gap:3px;background:var(--bg3);border-radius:7px;padding:3px;margin-bottom:20px}
.ltab{flex:1;padding:7px;text-align:center;border-radius:5px;font-size:12px;font-weight:500;color:var(--text2);border:none;background:none;cursor:pointer;font-family:inherit;transition:all .15s}
.ltab.active{background:var(--bg2);color:var(--accent);box-shadow:0 2px 8px rgba(0,0,0,.1)}

/* ── Alerts ── */
.alert{padding:10px 14px;border-radius:7px;font-size:13px;margin-bottom:14px}
.alert-err{background:rgba(255,68,102,.1);border:1px solid rgba(255,68,102,.3);color:var(--danger)}
.alert-ok{background:rgba(0,212,168,.1);border:1px solid rgba(0,212,168,.3);color:var(--accent)}
.alert-info{background:rgba(0,153,255,.1);border:1px solid rgba(0,153,255,.3);color:var(--accent2)}
.alert-warn{background:rgba(255,170,0,.1);border:1px solid rgba(255,170,0,.3);color:var(--warn)}

/* ── Search/Filter bar ── */
.filter-bar{display:flex;gap:10px;margin-bottom:18px;align-items:center;flex-wrap:wrap}
.search-wrap{position:relative;flex:1;min-width:180px}
.search-wrap input{padding-left:34px}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:15px;pointer-events:none}
.filter-select select{width:auto;min-width:140px}
.page-size select{width:auto}

/* ── Product grid ── */
.prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.prod-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;transition:border-color .2s,transform .2s;position:relative}
.prod-card:hover{border-color:rgba(0,212,168,.4);transform:translateY(-2px)}
.prod-card-img{height:100px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:44px;border-bottom:1px solid var(--border)}
.prod-card-body{padding:14px}
.prod-card-brand{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:3px}
.prod-card-name{font-weight:600;font-size:13px;line-height:1.3;margin-bottom:3px}
.prod-card-sku{font-size:11px;color:var(--text3);margin-bottom:10px}
.prod-price-row{display:flex;align-items:baseline;gap:6px;margin-bottom:4px}
.prod-ws{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;color:var(--accent)}
.prod-retail{font-size:11px;color:var(--text3);text-decoration:line-through}
.prod-srp{font-size:11px;color:var(--text2)}
.prod-stock{font-size:11px;color:var(--text2);margin-bottom:12px}
.prod-tag{position:absolute;top:8px;left:8px}
.new-badge{background:var(--accent);color:#000;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 7px;border-radius:10px}
.clearance-badge{background:var(--accent3);color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:2px 7px;border-radius:10px}

/* ── Cart ── */
.cart-btn{position:fixed;bottom:24px;right:24px;z-index:150;width:52px;height:52px;border-radius:50%;background:var(--accent);color:#000;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,212,168,.35);cursor:pointer;border:none;transition:transform .2s}
.cart-btn:hover{transform:scale(1.08)}
.cart-cnt{position:absolute;top:-4px;right:-4px;background:var(--danger);color:#fff;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.cart-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
.cart-item:last-child{border-bottom:none}
.qty-ctrl{display:flex;align-items:center;gap:6px}
.qbtn{width:24px;height:24px;border-radius:5px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.qbtn:hover{border-color:var(--accent);color:var(--accent)}
.total-row{display:flex;justify-content:space-between;padding:7px 0;font-size:13px}
.total-row.grand{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;color:var(--accent);border-top:1px solid var(--border);padding-top:12px;margin-top:4px}

/* ── Tabs ── */
.tabs{display:flex;gap:3px;border-bottom:1px solid var(--border);margin-bottom:20px}
.tab{padding:8px 16px;font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;border-top:none;border-left:none;border-right:none;background:none;font-family:inherit;transition:all .15s}
.tab:hover{color:var(--text)}.tab.active{color:var(--accent);border-bottom-color:var(--accent)}

/* ── Misc ── */
.empty{text-align:center;padding:48px 20px;color:var(--text3)}
.empty .ei{font-size:40px;margin-bottom:10px}
.divider{border:none;border-top:1px solid var(--border);margin:18px 0}
.spinner{display:inline-block;width:18px;height:18px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading{display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:14px}
.loading p{color:var(--text2);font-size:13px}
.tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:500}
.checkbox-row{display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer}
.checkbox-row input{width:14px;height:14px;cursor:pointer}
.section-title{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;margin-bottom:14px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
.pill{display:inline-block;padding:1px 8px;border-radius:20px;font-size:11px}
.text-muted{color:var(--text2)}
.text-danger{color:var(--danger)}
.text-accent{color:var(--accent)}
.text-warn{color:var(--warn)}
.fw-bold{font-weight:700}
.mt-2{margin-top:8px}.mt-3{margin-top:12px}.mt-4{margin-top:16px}
.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}
.flex{display:flex}.items-center{align-items:center}.gap-2{gap:8px}.gap-3{gap:12px}
.justify-between{justify-content:space-between}
code{font-family:'Courier New',monospace;font-size:11px;background:var(--bg3);padding:1px 5px;border-radius:3px;color:var(--text2)}

/* ── Chart bars ── */
.chart-bar-wrap{display:flex;flex-direction:column;gap:8px}
.chart-bar-row{display:grid;grid-template-columns:120px 1fr 80px;align-items:center;gap:8px;font-size:12px}
.chart-bar-bg{background:var(--bg3);border-radius:20px;height:8px;overflow:hidden}
.chart-bar-fill{height:100%;border-radius:20px;transition:width .4s ease}

/* ── Invoice print area ── */
@media print{.no-print{display:none!important}.print-only{display:block!important}}
.print-only{display:none}

/* ── Pagination ── */
.pagination{display:flex;align-items:center;gap:4px;justify-content:center;margin-top:16px}
.pg-btn{padding:5px 10px;border-radius:6px;border:1px solid var(--border);background:var(--bg3);color:var(--text2);font-size:12px;cursor:pointer;font-family:inherit}
.pg-btn:hover{border-color:var(--accent);color:var(--accent)}
.pg-btn.active{background:var(--accent);color:#000;border-color:var(--accent)}
.pg-btn:disabled{opacity:.3;cursor:not-allowed}

/* ── Responsive ── */
@media(max-width:768px){
  .sidebar{transform:translateX(-100%)}.main{margin-left:0}
  .content{padding:16px}.form-row,.form-row-3,.form-row-4{grid-template-columns:1fr}
  .two-col,.three-col{grid-template-columns:1fr}.stats-grid{grid-template-columns:1fr 1fr}
}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => `J$${Number(n||0).toLocaleString()}`;
const fmtNum = (n) => Number(n||0).toLocaleString();
const today = () => new Date().toISOString().slice(0,10);
const isNewArrival = (p) => {
  if (!p.created_at) return false;
  const days = (new Date() - new Date(p.created_at)) / (1000*60*60*24);
  return days <= 30;
};
const genId = (prefix, arr) => `${prefix}-${new Date().getFullYear()}-${String((arr.length+1)).padStart(3,"0")}`;

function applyDiscount(price, pct) { return Math.round(price * (1 - (pct||0)/100)); }

function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(c => `"${String(c||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type:"text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data,null,2)], { type:"application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// Simple invoice HTML generator for print/download
function buildInvoiceHTML(order, customer, settings) {
  const INV_LOGO = LOGO_SRC;
  const taxLabel = `GCT (${order.tax_rate}%)`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${order.id}</title>
<style>
body{font-family:Arial,sans-serif;padding:40px;color:#1a202c;font-size:13px}
.header{display:flex;justify-content:space-between;margin-bottom:32px}
.brand{font-size:22px;font-weight:800;color:#00d4a8}
.inv-title{font-size:28px;font-weight:700;color:#2d3748;text-align:right}
.inv-num{font-size:14px;color:#718096;text-align:right}
.section{margin-bottom:24px}
.section h4{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#718096;margin-bottom:6px}
table{width:100%;border-collapse:collapse;margin-bottom:16px}
th{background:#f7fafc;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#718096;border-bottom:2px solid #e2e8f0}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px}
.totals-table{width:300px;margin-left:auto}
.grand-total td{font-weight:700;font-size:15px;color:#00d4a8;border-top:2px solid #e2e8f0}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#718096}
</style></head><body>
<div class="header">
  <div><img src="${INV_LOGO}" alt="Pinglinks Cellular" style="height:52px;width:auto;display:block;margin-bottom:6px"/><div style="color:#718096;font-size:12px;margin-top:4px">${settings.company_address}<br>${settings.company_phone} · ${settings.company_email}</div></div>
  <div><div class="inv-title">INVOICE</div><div class="inv-num">${order.id}</div><div class="inv-num" style="font-size:12px">Date: ${order.date}</div></div>
</div>
<div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
  <div class="section"><h4>Bill To</h4><div style="font-weight:600">${customer?.company||order.customer_name}</div><div style="color:#718096">${customer?.tax_id?`TRN: ${customer.tax_id}`:""}</div></div>
  <div class="section" style="text-align:right"><h4>Payment</h4><div>Method: ${order.payment_method||"—"}</div><div>Status: ${order.status}</div>${order.type==="consignment"?`<div>Due: ${order.consignment_due||"—"}</div>`:""}</div>
</div>
<table><thead><tr><th>Barcode</th><th>Product</th><th>Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr></thead>
<tbody>${(order.items||[]).map(i=>`<tr><td><code>${i.barcode||"—"}</code></td><td>${i.name}</td><td>${i.qty}</td><td style="text-align:right">${fmt(i.unit_price)}</td><td style="text-align:right">${fmt(i.qty*i.unit_price)}</td></tr>`).join("")}</tbody></table>
<table class="totals-table">
  <tr><td>Subtotal</td><td style="text-align:right">${fmt(order.subtotal)}</td></tr>
  <tr><td>${taxLabel}</td><td style="text-align:right">${fmt(order.tax_amount)}</td></tr>
  <tr class="grand-total"><td><strong>Total</strong></td><td style="text-align:right"><strong>${fmt(order.total)}</strong></td></tr>
</table>
${order.notes?`<div style="margin-top:16px;padding:12px;background:#f7fafc;border-radius:6px"><strong>Notes:</strong> ${order.notes}</div>`:""}

${(settings.bank_name||settings.payment_link)?`
<div style="margin-top:28px;border-top:2px solid #e2e8f0;padding-top:20px;display:grid;grid-template-columns:${settings.bank_name&&settings.payment_link?"1fr 1fr":"1fr"};gap:20px">
  ${settings.bank_name?`
  <div style="background:#f7fafc;border-radius:8px;padding:14px 16px">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#718096;margin-bottom:10px">🏦 Bank Transfer Details</div>
    <table style="width:auto;margin:0"><tbody>
      <tr><td style="color:#718096;font-size:12px;padding:2px 12px 2px 0;border:none">Bank:</td><td style="font-weight:600;font-size:12px;border:none">${settings.bank_name}</td></tr>
      ${settings.bank_account_name?`<tr><td style="color:#718096;font-size:12px;padding:2px 12px 2px 0;border:none">Account Name:</td><td style="font-weight:600;font-size:12px;border:none">${settings.bank_account_name}</td></tr>`:""}
      ${settings.bank_account_number?`<tr><td style="color:#718096;font-size:12px;padding:2px 12px 2px 0;border:none">Account #:</td><td style="font-weight:700;font-size:13px;font-family:monospace;letter-spacing:1px;border:none">${settings.bank_account_number}</td></tr>`:""}
      ${settings.bank_routing?`<tr><td style="color:#718096;font-size:12px;padding:2px 12px 2px 0;border:none">Sort Code:</td><td style="font-weight:600;font-size:12px;border:none">${settings.bank_routing}</td></tr>`:""}
    </tbody></table>
    ${settings.bank_notes?`<div style="margin-top:8px;font-size:11px;color:#00d4a8;font-style:italic">${settings.bank_notes}</div>`:""}
  </div>`:""}
  ${settings.payment_link?`
  <div style="background:#f7fafc;border-radius:8px;padding:14px 16px;text-align:center">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#718096;margin-bottom:8px">💳 Online Payment</div>
    <div style="font-size:20px;font-weight:700;color:#1a202c;margin-bottom:12px">${fmt(order.total)}</div>
    <a href="${settings.payment_link}" style="display:inline-block;padding:10px 24px;background:#00d4a8;color:#fff;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none">${settings.payment_link_label||"Pay Now"} →</a>
    <div style="font-size:10px;color:#718096;margin-top:6px;word-break:break-all">${settings.payment_link}</div>
  </div>`:""}
</div>`:""}

<div class="footer">${settings.company_name} · ${settings.company_address} · ${settings.company_phone}</div>
</body></html>`;
}

function printInvoice(order, customer, settings) {
  const html = buildInvoiceHTML(order, customer, settings);
  const w = window.open("","_blank","width=800,height=600");
  w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(),400);
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = { pending:["bw","⏳ Pending"], processing:["bb","🔄 Processing"], shipped:["bb","🚚 Shipped"], paid:["bg","✓ Paid"], delivered:["bg","✓ Delivered"], cancelled:["br","✕ Cancelled"] };
  const [cls,label] = map[status]||["bgr",status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ─── PAGINATION HOOK ──────────────────────────────────────────────────────────
function usePagination(items, defaultPerPage=20) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const total = items.length;
  const totalPages = perPage === 0 ? 1 : Math.ceil(total / perPage);
  const sliced = perPage === 0 ? items : items.slice((page-1)*perPage, page*perPage);
  const reset = () => setPage(1);
  return { page, setPage, perPage, setPerPage, total, totalPages, sliced, reset };
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i=1; i<=totalPages; i++) {
    if (i===1||i===totalPages||Math.abs(i-page)<=2) pages.push(i);
    else if (pages[pages.length-1]!=="…") pages.push("…");
  }
  return (
    <div className="pagination">
      <button className="pg-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
      {pages.map((p,i)=> p==="…" ? <span key={i} style={{padding:"0 4px",color:"var(--text3)"}}>…</span> :
        <button key={p} className={`pg-btn ${page===p?"active":""}`} onClick={()=>setPage(p)}>{p}</button>
      )}
      <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
    </div>
  );
}

function PageSizeSelect({ perPage, setPerPage, reset }) {
  return (
    <div className="page-size" style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--text2)"}}>
      Show:
      <select value={perPage} onChange={e=>{ setPerPage(e.target.value==="0"?0:+e.target.value); reset(); }} style={{width:"auto",padding:"4px 8px",fontSize:12}}>
        {[20,50,100].map(n=><option key={n} value={n}>{n}</option>)}
        <option value={0}>All</option>
      </select>
    </div>
  );
}

// ─── SORT HOOK ────────────────────────────────────────────────────────────────
function useSort(items, defaultKey, defaultDir="asc") {
  const [key, setKey] = useState(defaultKey);
  const [dir, setDir] = useState(defaultDir);
  const toggle = (k) => { if (k===key) setDir(d=>d==="asc"?"desc":"asc"); else { setKey(k); setDir("asc"); } };
  const sorted = useMemo(()=>[...items].sort((a,b)=>{
    let av=a[key], bv=b[key];
    if (typeof av==="string") av=av.toLowerCase(), bv=(bv||"").toLowerCase();
    if (av==null) return 1; if (bv==null) return -1;
    return dir==="asc"?(av>bv?1:-1):(av<bv?1:-1);
  }),[items,key,dir]);
  return { sorted, key, dir, toggle };
}

function SortTh({ label, sortKey, current, dir, onToggle }) {
  const active = current===sortKey;
  return <th className="sortable" onClick={()=>onToggle(sortKey)} style={{cursor:"pointer",color:active?"var(--accent)":""}}>
    {label} {active?(dir==="asc"?"↑":"↓"):""}
  </th>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── MAIN APP ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── State ──
  const [user, setUser]         = useState(null);
  const [page, setPage]         = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [stockTakes, setStockTakes] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores]     = useState([]);
  const [settings, setSettings] = useState({ company_name:"Pinglinks Cellular", company_address:"Kingston, Jamaica", company_phone:"", company_email:"info@pinglinkscellular.com", currency_symbol:"J$", tax_rate:15, invoice_prefix:"INV", transfer_prefix:"TRF" });
  const [cart, setCart]         = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [modal, setModal]       = useState(null);
  const [toast, setToast]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  const logActivity = async (action, details, entityType="", entityId="") => {
    const entry = {
      action, details, entity_type: entityType, entity_id: String(entityId||""),
      user_name: "Admin", timestamp: new Date().toISOString()
    };
    try {
      await supabase.from("activity_log").insert(entry);
    } catch(e) { console.warn("Activity log error:", e); }
  };

  // ── Toast ──
  const showToast = useCallback((msg, type="ok") => {
    setToast({ msg, type }); setTimeout(()=>setToast(null), 3000);
  }, []);

  // ── Load data from Supabase ──
  const loadData = useCallback(async (u) => {
    if (!u) return;
    setLoading(true);
    try {
      const [
        { data: prods },
        { data: custs },
        { data: ords },
        { data: ordItems },
        { data: supps },
        { data: strs },
        { data: setts },
        { data: transList },
        { data: transItems },
        { data: poList },
        { data: poItems },
      ] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        u.role === "admin" ? supabase.from("profiles").select("*").eq("role","buyer").order("created_at",{ascending:false}) : Promise.resolve({data:[]}),
        u.role === "admin"
          ? supabase.from("orders").select("*").order("created_at",{ascending:false})
          : supabase.from("orders").select("*").eq("customer_id",u.id).order("created_at",{ascending:false}),
        supabase.from("order_items").select("*"),
        u.role === "admin" ? supabase.from("suppliers").select("*").order("name") : Promise.resolve({data:[]}),
        supabase.from("stores").select("*").order("name"),
        supabase.from("site_settings").select("*").eq("id",1).single(),
        u.role === "admin" ? supabase.from("transfers").select("*").order("created_at",{ascending:false}) : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("transfer_items").select("*") : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("purchase_orders").select("*").order("created_at",{ascending:false}) : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("purchase_order_items").select("*") : Promise.resolve({data:[]}),
      ]);
      if (prods) setProducts(prods);
      if (custs) setCustomers(custs);
      if (supps) setSuppliers(supps);
      if (strs) setStores(strs);
      if (setts) setSettings(setts);
      if (ords && ordItems) {
        const merged = ords.map(o => ({
          ...o,
          items: (ordItems || []).filter(i => i.order_id === o.id)
        }));
        setOrders(merged);
      }
      if (transList && transItems) {
        const merged = transList.map(t => ({
          ...t,
          items: (transItems || []).filter(i => i.transfer_id === t.id)
        }));
        setTransfers(merged);
      }
      if (poList && poItems) {
        const merged = poList.map(po => ({
          ...po,
          items: (poItems || []).filter(i => i.po_id === po.id)
        }));
        setPurchaseOrders(merged);
      }
    } catch(e) { console.error("Load error:", e); }
    setLoading(false);
  }, []);

  // ── Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (profile) {
          const u = { ...profile, email: session.user.email };
          setUser(u);
          setPage(u.role === "admin" ? "dashboard" : "catalog");
          await loadData(u);
        }
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") { setUser(null); setCart([]); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, [loadData]);

  const login = async (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "dashboard" : "catalog");
    await loadData(u);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); setCart([]);
  };

  if (loading) return <><style dangerouslySetInnerHTML={{__html:STYLES}}/><div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)"}}><div style={{textAlign:"center"}}><img src={LOGO_SRC} style={{width:200,marginBottom:20}}/><div style={{color:"var(--text3)"}}>Loading…</div></div></div></>;
  if (!user) return <><style dangerouslySetInnerHTML={{__html:STYLES}}/><LoginPage onLogin={login}/></>;

  const isAdmin = user.role === "admin";

  // ── Cart helpers ──
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const addToCart = (product, qty) => {
    setCart(prev=>{
      const ex = prev.find(i=>i.pid===product.id);
      if (ex) return prev.map(i=>i.pid===product.id?{...i,qty:i.qty+qty}:i);
      return [...prev,{pid:product.id,name:product.name,barcode:product.barcode,sku:product.sku,price:applyDiscount(product.wholesale_price,user.discount_pct||0),image:"📱",qty,min:product.min_order||1}];
    });
  };
  const updateQty = (pid,qty)=>{ if(qty<=0) setCart(p=>p.filter(i=>i.pid!==pid)); else setCart(p=>p.map(i=>i.pid===pid?{...i,qty}:i)); };
  const cartSubtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartTax = Math.round(cartSubtotal*settings.tax_rate/100);
  const cartTotal = cartSubtotal + cartTax;

  const placeOrder = async (payMethod, notes, orderType, consignmentDue) => {
    const customer = customers.find(c=>c.id===user.id) || user;
    const minVal = customer.min_order_value||0;
    if (cartSubtotal < minVal) { showToast(`Minimum order value is ${fmt(minVal)}`,"err"); return; }
    const id = genId(settings.invoice_prefix||"INV", orders);
    const orderData = {
      id, customer_id: user.id,
      customer_name: customer.company || user.name,
      date: today(), status: "pending",
      payment_method: payMethod,
      subtotal: cartSubtotal, tax_rate: settings.tax_rate,
      tax_amount: cartTax, total: cartTotal,
      notes, type: orderType,
      consignment_due: consignmentDue || null,
    };
    const { error: orderErr } = await supabase.from("orders").insert(orderData);
    if (orderErr) { showToast("Failed to place order","err"); return; }
    const items = cart.map(i => ({
      order_id: id, product_id: i.pid, name: i.name,
      qty: i.qty, unit_price: i.price, barcode: i.barcode||"", sku: i.sku||""
    }));
    await supabase.from("order_items").insert(items);
    // NOTE: Stock is NOT deducted here — admin deducts when marking as "shipped"
    const o = { ...orderData, items };
    setOrders(prev=>[o,...prev]);
    setCart([]); setShowCart(false);
    setModal({type:"orderSuccess",data:o});
  };

  // ── Nav ──
  const adminNav = [
    {section:"Overview", items:[{id:"dashboard",icon:"📊",label:"Dashboard"}]},
    {section:"Inventory", items:[
      {id:"products",icon:"📦",label:"Products"},
      {id:"purchaseorders",icon:"🛒",label:"Purchase Orders"},
      {id:"categories",icon:"🏷️",label:"Categories"},
      {id:"suppliers",icon:"🏭",label:"Suppliers"},
      {id:"stocktake",icon:"📋",label:"Stock Take"},
      {id:"transfers",icon:"🏪",label:"Store Transfers"},
    ]},
    {section:"Sales", items:[
      {id:"orders",icon:"🧾",label:"Invoices"},
      {id:"clearance",icon:"🔥",label:"Clearance"},
    ]},
    {section:"Accounts", items:[
      {id:"customers",icon:"👥",label:"Customers"},
    ]},
    {section:"Reports", items:[
      {id:"analytics",icon:"📈",label:"Analytics"},
      {id:"activitylog",icon:"🕐",label:"Activity Log"},
    ]},
    {section:"System", items:[
      {id:"settings",icon:"⚙️",label:"Settings"},
      {id:"stores",icon:"🏬",label:"Store Locations"},
      {id:"account",icon:"👤",label:"My Account"},
    ]},
  ];

  const buyerNav = [
    {section:"Shop", items:[
      {id:"catalog",icon:"🏪",label:"Catalog"},
      {id:"incoming",icon:"📬",label:"Arriving Soon"},
      {id:"clearance",icon:"🔥",label:"Clearance"},
      {id:"my-orders",icon:"🧾",label:"My Orders"},
    ]},
    {section:"Account", items:[{id:"account",icon:"👤",label:"Account"}]},
  ];

  const titles = { dashboard:"Dashboard",products:"Products",categories:"Categories",suppliers:"Suppliers",stocktake:"Stock Take",transfers:"Store Transfers",orders:"Invoices",clearance:"Clearance",customers:"Customers",analytics:"Analytics & Reports",activitylog:"Activity Log",settings:"Settings",stores:"Store Locations",catalog:"Wholesale Catalog","my-orders":"My Orders",account:"My Account" };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo" style={{padding:"10px 14px 10px",borderBottom:"1px solid var(--border)"}}>
            <img src={LOGO_SRC} alt="Pinglinks Cellular" style={{width:"100%",maxWidth:165,height:"auto",display:"block",marginBottom:6}}/>
            <div className="sub">Wholesale Portal</div>
          </div>
          <nav className="sidebar-nav">
            {(isAdmin?adminNav:buyerNav).map(sec=>(
              <div className="nav-section" key={sec.section}>
                <div className="nav-label">{sec.section}</div>
                {sec.items.map(item=>(
                  <button key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                    <span className="ni">{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="avatar">{(user.name||"U")[0]}</div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div>
                <div style={{fontSize:10,color:"var(--text3)"}}>{isAdmin?"Administrator":user.customer_type==="consignment"?"Consignment":"Wholesale Buyer"}</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={logout}>🚪 Sign Out</button>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{titles[page]||page}</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {!user.approved && <span className="badge bw">⏳ Pending Approval</span>}
              {!isAdmin && user.approved && (
                <button className="btn btn-secondary btn-sm" onClick={()=>setShowCart(true)}>
                  🛒 Cart{cartCount>0?` (${cartCount})`:""}
                </button>
              )}
            </div>
          </div>
          <div className="content">
            {page==="dashboard" && <DashboardPage products={products} orders={orders} customers={customers} transfers={transfers} settings={settings} setPage={setPage}/>}
            {page==="products" && <ProductsErrorBoundary><ProductsPage products={products} setProducts={setProducts} suppliers={suppliers} setSuppliers={setSuppliers} orders={orders} transfers={transfers} settings={settings} showToast={showToast} isAdmin={isAdmin}/></ProductsErrorBoundary>}
            {page==="categories" && <CategoriesPage products={products} extraCategories={settings.extra_categories?JSON.parse(settings.extra_categories):[]} setExtraCategories={(v)=>setSettings(p=>({...p,extra_categories:JSON.stringify(v)}))} showToast={showToast}/>}
            {page==="suppliers" && <SuppliersPage suppliers={suppliers} setSuppliers={setSuppliers} products={products} showToast={showToast}/>}
            {page==="stocktake" && <StockTakePage products={products} setProducts={setProducts} stockTakes={stockTakes} setStockTakes={setStockTakes} showToast={showToast}/>}
            {page==="transfers" && <TransfersPage products={products} setProducts={setProducts} transfers={transfers} setTransfers={setTransfers} stores={stores} settings={settings} showToast={showToast}/>}
            {page==="purchaseorders" && <PurchaseOrdersPage purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} products={products} setProducts={setProducts} suppliers={suppliers} settings={settings} showToast={showToast}/>}
            {page==="incoming" && <IncomingStockPage purchaseOrders={purchaseOrders}/>}
            {page==="orders" && <InvoicesPage orders={orders} setOrders={setOrders} customers={customers} settings={settings} showToast={showToast} setModal={setModal} products={products} setProducts={setProducts}/>}
            {page==="clearance" && <ClearancePage products={products} isAdmin={isAdmin} addToCart={addToCart} user={user}/>}
            {page==="customers" && <CustomersPage customers={customers} setCustomers={setCustomers} orders={orders} showToast={showToast}/>}
            {page==="analytics" && <AnalyticsPage products={products} orders={orders} customers={customers} transfers={transfers}/>}
            {page==="activitylog" && <ActivityLogPage activityLog={activityLog} setActivityLog={setActivityLog}/>}
            {page==="settings" && <SettingsPage settings={settings} setSettings={setSettings} showToast={showToast}/>}
            {page==="stores" && <StoresPage stores={stores} setStores={setStores} showToast={showToast}/>}
            {page==="catalog" && <CatalogPage products={products} user={user} addToCart={addToCart} cart={cart} settings={settings}/>}
            {page==="my-orders" && <MyOrdersPage orders={orders.filter(o=>o.customer_id===user.id)} settings={settings} customers={customers} setModal={setModal}/>}
            {page==="account" && <AccountPage user={user} customers={customers} showToast={showToast} isAdmin={isAdmin}/>}
          </div>
        </div>

        {/* Cart */}
        {!isAdmin && user.approved && (
          <button className="cart-btn" onClick={()=>setShowCart(true)}>
            🛒{cartCount>0&&<span className="cart-cnt">{cartCount}</span>}
          </button>
        )}

        {/* Modals */}
        {showCart && <CartModal cart={cart} updateQty={updateQty} subtotal={cartSubtotal} tax={cartTax} total={cartTotal} taxRate={settings.tax_rate} user={user} onClose={()=>setShowCart(false)} onPlace={placeOrder} customers={customers}/>}
        {modal?.type==="orderSuccess" && <OrderSuccessModal order={modal.data} settings={settings} customers={customers} onClose={()=>setModal(null)}/>}
        {modal?.type==="viewInvoice" && <InvoiceViewModal order={modal.data} settings={settings} customers={customers} onClose={()=>setModal(null)}/>}

        {/* Toast */}
        {toast && (
          <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",zIndex:300,background:toast.type==="err"?"var(--danger)":"var(--accent)",color:toast.type==="err"?"#fff":"#000",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,.3)",whiteSpace:"nowrap"}}>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab,setTab]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const [success,setSuccess]=useState("");
  const [busy,setBusy]=useState(false);
  const [reg,setReg]=useState({name:"",company:"",taxId:"",email:"",password:"",confirm:""});
  const [showForgot,setShowForgot]=useState(false);
  const [forgotEmail,setForgotEmail]=useState("");

  const doLogin = async () => {
    setErr(""); setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr("Invalid email or password."); setBusy(false); return; }
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    if (!profile) { setErr("Account not found."); setBusy(false); return; }
    if (profile.role !== "admin" && !profile.approved) { setErr("Your account is pending approval. Please check back soon."); await supabase.auth.signOut(); setBusy(false); return; }
    onLogin({ ...profile, email: data.user.email });
    setBusy(false);
  };

  const doForgotPassword = async () => {
    if (!forgotEmail) { setErr("Please enter your email address."); return; }
    setBusy(true); setErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}?reset=true`
    });
    if (error) { setErr(error.message); setBusy(false); return; }
    setSuccess("✅ Password reset email sent! Check your inbox and follow the link.");
    setBusy(false); setShowForgot(false);
  };

  const doRegister = async () => {
    setErr(""); setBusy(true);
    if (!reg.name||!reg.company||!reg.taxId||!reg.email||!reg.password) { setErr("All fields required."); setBusy(false); return; }
    if (reg.password!==reg.confirm) { setErr("Passwords do not match."); setBusy(false); return; }
    if (reg.password.length < 6) { setErr("Password must be at least 6 characters."); setBusy(false); return; }
    const { error } = await supabase.auth.signUp({
      email: reg.email, password: reg.password,
      options: { data: { name: reg.name, company: reg.company, tax_id: reg.taxId, role: "buyer" } }
    });
    if (error) { setErr(error.message); setBusy(false); return; }
    // Send email notification
    fetch(`${SUPABASE_URL}/functions/v1/notify-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ customerName: reg.name, company: reg.company, email: reg.email })
    }).catch(()=>{});
    setSuccess("✅ Application submitted! We'll review and activate your account.");
    setBusy(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">
          <img src={LOGO_SRC} alt="Pinglinks Cellular" style={{width:210,height:"auto",display:"block",margin:"0 auto 12px"}}/>
          <div className="ls">Wholesale Portal</div>
        </div>
        <div className="login-card">
          <div className="ltabs">
            <button className={`ltab ${tab==="login"?"active":""}`} onClick={()=>{setTab("login");setErr("");setSuccess("");}}>Sign In</button>
            <button className={`ltab ${tab==="register"?"active":""}`} onClick={()=>{setTab("register");setErr("");setSuccess("");}}>Apply for Account</button>
          </div>
          {err&&<div className="alert alert-err">{err}</div>}
          {success&&<div className="alert alert-ok">{success}</div>}
          {tab==="login"&&!success&&<>
            <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
            <div className="form-group"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={doLogin} disabled={busy}>{busy?"Signing in…":"Sign In →"}</button>
            <div style={{textAlign:"center",marginTop:12}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>{setShowForgot(true);setErr("");}} style={{fontSize:12,color:"var(--text3)"}}>Forgot password?</button>
            </div>
          </>}
          {showForgot&&<>
            <div style={{marginBottom:12,fontSize:13,color:"var(--text2)"}}>Enter your email and we'll send you a reset link.</div>
            <div className="form-group"><label>Email</label><input type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doForgotPassword()}/></div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={doForgotPassword} disabled={busy}>{busy?"Sending…":"Send Reset Link →"}</button>
            <div style={{textAlign:"center",marginTop:10}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>{setShowForgot(false);setErr("");}} style={{fontSize:12}}>← Back to Sign In</button>
            </div>
          </>}
          {tab==="register"&&!success&&<>
            <div className="alert alert-info">Wholesale accounts require approval and business verification.</div>
            <div className="form-row">
              <div className="form-group"><label>Full Name</label><input value={reg.name} onChange={e=>setReg(p=>({...p,name:e.target.value}))}/></div>
              <div className="form-group"><label>Company Name</label><input value={reg.company} onChange={e=>setReg(p=>({...p,company:e.target.value}))}/></div>
            </div>
            <div className="form-group"><label>Business TRN / Tax ID</label><input value={reg.taxId} onChange={e=>setReg(p=>({...p,taxId:e.target.value}))}/></div>
            <div className="form-group"><label>Email</label><input type="email" value={reg.email} onChange={e=>setReg(p=>({...p,email:e.target.value}))}/></div>
            <div className="form-row">
              <div className="form-group"><label>Password</label><input type="password" value={reg.password} onChange={e=>setReg(p=>({...p,password:e.target.value}))}/></div>
              <div className="form-group"><label>Confirm</label><input type="password" value={reg.confirm} onChange={e=>setReg(p=>({...p,confirm:e.target.value}))}/></div>
            </div>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={doRegister} disabled={busy}>{busy?"Submitting…":"Submit Application →"}</button>
          </>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── DASHBOARD ────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPage({ products, orders, customers, transfers, settings, setPage }) {
  const activeProducts = products.filter(p=>p.active);
  const totalCost = activeProducts.reduce((s,p)=>s+p.cost*p.stock,0);
  const totalRetail = activeProducts.reduce((s,p)=>s+p.retail_price*p.stock,0);
  const totalWholesale = activeProducts.reduce((s,p)=>s+p.wholesale_price*p.stock,0);
  const totalItems = activeProducts.reduce((s,p)=>s+p.stock,0);
  const totalSKUs = activeProducts.length;
  const lowStock = activeProducts.filter(p=>p.stock>0&&p.stock<=p.low_stock_threshold).length;
  const outOfStock = activeProducts.filter(p=>p.stock===0).length;
  const pendingApprovals = customers.filter(c=>!c.approved).length;
  const revenueThisMonth = orders.filter(o=>o.date?.startsWith(today().slice(0,7))).reduce((s,o)=>s+o.total,0);
  const newArrivals = activeProducts.filter(p=>p.is_new_arrival).slice(0,5);
  const lowStockItems = activeProducts.filter(p=>p.stock>0&&p.stock<=p.low_stock_threshold).slice(0,5);

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat c1"><div className="stat-label">Inventory Cost</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalCost)}</div><div className="stat-sub">Total cost value</div></div>
        <div className="stat c2"><div className="stat-label">Retail Value</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalRetail)}</div><div className="stat-sub">At retail prices</div></div>
        <div className="stat c3"><div className="stat-label">Wholesale Value</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalWholesale)}</div><div className="stat-sub">At wholesale prices</div></div>
        <div className="stat c4"><div className="stat-label">SKUs</div><div className="stat-val">{fmtNum(totalSKUs)}</div><div className="stat-sub">Active products</div></div>
        <div className="stat c5"><div className="stat-label">Total Items</div><div className="stat-val">{fmtNum(totalItems)}</div><div className="stat-sub">Units in stock</div></div>
        <div className="stat c6"><div className="stat-label">Low Stock</div><div className="stat-val">{lowStock}</div><div className="stat-sub">{outOfStock} out of stock</div></div>
      </div>

      <div className="two-col" style={{gap:18,marginBottom:18}}>
        {/* New Arrivals */}
        <div className="card">
          <div className="card-header">
            <h3>🆕 New Arrivals</h3>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage("products")}>View All</button>
          </div>
          <div className="tbl-wrap">
            <table><thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Wholesale</th></tr></thead>
              <tbody>{newArrivals.map(p=>(
                <tr key={p.id}>
                  <td><div style={{fontWeight:500,fontSize:12}}>{p.name}</div><code>{p.sku}</code></td>
                  <td><span className="badge bb" style={{fontSize:10}}>{p.category}</span></td>
                  <td>{p.stock}</td>
                  <td style={{color:"var(--accent)",fontWeight:600}}>{fmt(p.wholesale_price)}</td>
                </tr>
              ))}
              {newArrivals.length===0&&<tr><td colSpan={4} style={{textAlign:"center",color:"var(--text3)",padding:24}}>No new arrivals marked.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="card">
          <div className="card-header">
            <h3>⚠️ Low Stock Alerts</h3>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage("products")}>View All</button>
          </div>
          <div className="tbl-wrap">
            <table><thead><tr><th>Product</th><th>Stock</th><th>Threshold</th><th>Status</th></tr></thead>
              <tbody>{lowStockItems.map(p=>(
                <tr key={p.id}>
                  <td style={{fontSize:12}}>{p.name.slice(0,28)}{p.name.length>28?"…":""}</td>
                  <td style={{fontWeight:700,color:p.stock<3?"var(--danger)":"var(--warn)"}}>{p.stock}</td>
                  <td style={{color:"var(--text3)"}}>{p.low_stock_threshold}</td>
                  <td><span className={`badge ${p.stock<3?"br":"bw"}`}>{p.stock<3?"Critical":"Low"}</span></td>
                </tr>
              ))}
              {lowStockItems.length===0&&<tr><td colSpan={4} style={{textAlign:"center",color:"var(--text3)",padding:24}}>All items well stocked ✅</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="two-col" style={{gap:18}}>
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header"><h3>Recent Invoices</h3><button className="btn btn-ghost btn-sm" onClick={()=>setPage("orders")}>View All</button></div>
          <div className="tbl-wrap">
            <table><thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>{orders.slice(0,5).map(o=>(
                <tr key={o.id}>
                  <td><code>{o.id}</code></td>
                  <td style={{fontSize:12}}>{o.customer_name}</td>
                  <td style={{fontWeight:600,color:"var(--accent)"}}>{fmt(o.total)}</td>
                  <td><StatusBadge status={o.status}/></td>
                </tr>
              ))}
              {orders.length===0&&<tr><td colSpan={4} style={{textAlign:"center",color:"var(--text3)",padding:24}}>No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Customers */}
        <div className="card">
          <div className="card-header"><h3>Pending Approvals</h3><button className="btn btn-ghost btn-sm" onClick={()=>setPage("customers")}>Manage</button></div>
          <div className="tbl-wrap">
            <table><thead><tr><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
              <tbody>{customers.filter(c=>!c.approved).slice(0,5).map(c=>(
                <tr key={c.id}>
                  <td><div style={{fontWeight:500,fontSize:12}}>{c.company}</div><div style={{fontSize:11,color:"var(--text3)"}}>{c.email}</div></td>
                  <td style={{fontSize:11,color:"var(--text2)"}}>{c.created_at}</td>
                  <td><span className="badge bw">⏳ Pending</span></td>
                </tr>
              ))}
              {pendingApprovals===0&&<tr><td colSpan={3} style={{textAlign:"center",color:"var(--text3)",padding:24}}>No pending approvals ✅</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

class ProductsErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{padding:24,background:"#fff0f0",borderRadius:8,margin:16}}>
        <h3 style={{color:"red"}}>Products Page Error</h3>
        <pre style={{fontSize:12,whiteSpace:"pre-wrap",color:"#c00"}}>{this.state.error?.message}\n{this.state.error?.stack}</pre>
      </div>
    );
    return this.props.children;
  }
}

function ProductsPage({ products, setProducts, suppliers, setSuppliers, orders, transfers, settings, showToast, isAdmin }) {
  const [search,setSearch]=useState("");
  const [filterCat,setFilterCat]=useState("All");
  const [filterSupplier,setFilterSupplier]=useState("All");
  const [filterStatus,setFilterStatus]=useState("active");
  const [selected,setSelected]=useState([]);
  const [showModal,setShowModal]=useState(false);
  const [editing,setEditing]=useState(null);
  const [showImport,setShowImport]=useState(false);
  const [showHistory,setShowHistory]=useState(null);

  const filtered = useMemo(()=>products.filter(p=>{
    const q=search.toLowerCase();
    if (filterStatus==="active"&&!p.active) return false;
    if (filterStatus==="archived"&&p.active) return false;
    if (filterStatus==="low"&&(p.stock>p.low_stock_threshold||p.stock===0)) return false;
    if (filterStatus==="out"&&p.stock!==0) return false;
    if (filterCat!=="All"&&p.category!==filterCat) return false;
    if (filterSupplier!=="All"&&p.supplier_id!==filterSupplier) return false;
    if (q&&!p.name?.toLowerCase().includes(q)&&!p.sku?.toLowerCase().includes(q)&&!p.barcode?.includes(q)&&!p.brand?.toLowerCase().includes(q)) return false;
    return true;
  }),[products,search,filterCat,filterSupplier,filterStatus]);

  const {sorted,key,dir,toggle} = useSort(filtered,"name");
  const pg = usePagination(sorted,20);

  const toggleSelect = (id) => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const selectAll = () => setSelected(pg.sliced.map(p=>p.id));
  const clearSelect = () => setSelected([]);

  const batchArchive = () => {
    setProducts(p=>p.map(x=>selected.includes(x.id)?{...x,active:false}:x));
    showToast(`${selected.length} products archived`); clearSelect();
  };
  const batchDelete = () => {
    if (!window.confirm(`Permanently delete ${selected.length} products?`)) return;
    setProducts(p=>p.filter(x=>!selected.includes(x.id)));
    showToast(`${selected.length} products deleted`,"ok"); clearSelect();
  };
  const restore = (id) => { setProducts(p=>p.map(x=>x.id===id?{...x,active:true}:x)); showToast("Product restored"); };
  const hardDelete = (id) => { if(!window.confirm("Delete permanently?"))return; setProducts(p=>p.filter(x=>x.id!==id)); showToast("Deleted"); };

  const downloadTemplate = () => {
    const rows = [
      ["barcode","brand","name","category","supplier","cost","wholesale_price","retail_price","stock","low_stock_threshold","min_order","description","is_clearance","clearance_price"],
      ["123456789","Apple","iPhone 15 Pro 256GB","Devices: Phones","Supplier Name","50000","80000","100000","10","5","2","Product description here","false",""],
    ];
    downloadCSV(rows,"inventory_import_template.csv");
    showToast("Template downloaded");
  };

  const parseCSVLine = (line) => {
    const result = [];
    let cur = "", inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { result.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    result.push(cur.trim());
    return result;
  };

  const handleImportCSV = async (text) => {
    const lines = text.trim().split(/\r?\n/);
    const headers = parseCSVLine(lines[0]).map(h=>h.replace(/"/g,"").trim());
    const imported = [];
    let lastError = "";
    const supplierCache = {};
    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;
      const vals = parseCSVLine(line).map(v=>v.replace(/^"|"$/g,"").trim());
      const obj = {};
      headers.forEach((h,i)=>obj[h]=vals[i]||"");
      if (!obj.name) continue;
      const prod = {
        barcode:obj.barcode||"",
        brand:obj.brand||"",
        name:obj.name,
        category:obj.category||"Uncategorized",
        cost:parseFloat(obj.cost)||0,
        wholesale_price:parseFloat(obj.wholesale_price)||0,
        retail_price:parseFloat(obj.retail_price)||0,
        stock:parseInt(obj.stock)||0,
        low_stock_threshold:parseInt(obj.low_stock_threshold)||5,
        min_order:parseInt(obj.min_order)||1,
        description:obj.description||"",
        is_clearance:obj.is_clearance?.toLowerCase()==="true",
        clearance_price:obj.clearance_price?parseFloat(obj.clearance_price):null,
        active:true
      };
      // Create supplier record if supplier name provided
      if (obj.supplier && obj.supplier.trim()) {
        const supplierName = obj.supplier.trim();
        // Check in local cache first
        let supp = supplierCache[supplierName.toLowerCase()];
        if (!supp) {
          // Check DB
          const {data:existing} = await supabase.from("suppliers").select("*").ilike("name", supplierName).maybeSingle();
          if (existing) {
            supp = existing;
          } else {
            // Create new supplier
            const {data:newSupp} = await supabase.from("suppliers").insert({name:supplierName}).select().single();
            if (newSupp) {
              supp = newSupp;
              setSuppliers(p=>[...p, newSupp]);
            }
          }
          if (supp) supplierCache[supplierName.toLowerCase()] = supp;
        }
        if (supp) prod.supplier_id = supp.id;
      }
      const {data, error} = await supabase.from("products").insert(prod).select().single();
      if (data) {
        imported.push(data);
        // Log the import
        await supabase.from("activity_log").insert({action:"product_added",details:`Imported: ${prod.name}`,entity_type:"product",entity_id:String(data.id||""),user_name:"Admin",timestamp:new Date().toISOString()}).catch(()=>{});
      }
      else if (error) { lastError = error.message; console.error("Import error:", prod.name, error.message); }
    }
    if (imported.length > 0) {
      setProducts(p=>[...imported,...p]);
      showToast(`${imported.length} products imported`);
      setShowImport(false);
    } else {
      showToast("Import failed: " + (lastError||"Unknown error"), "err");
    }
  };

  const allCats = ["All",...new Set(products.map(p=>p.category))];
  const allSuppliers = [{id:"All",name:"All Suppliers"},...suppliers];

  return (
    <>
      <div className="filter-bar">
        <div className="search-wrap" style={{flex:2}}>
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, barcode, brand…"/>
        </div>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{width:"auto"}}>
          {allCats.map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={filterSupplier} onChange={e=>setFilterSupplier(e.target.value)} style={{width:"auto"}}>
          {allSuppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{width:"auto"}}>
          <option value="active">Active</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="archived">Archived</option>
          <option value="all">All</option>
        </select>
        <PageSizeSelect perPage={pg.perPage} setPerPage={pg.setPerPage} reset={pg.reset}/>
        <button className="btn btn-secondary btn-sm" onClick={downloadTemplate}>⬇ Template</button>
        <button className="btn btn-secondary btn-sm" onClick={()=>setShowImport(true)}>📥 Import</button>
        <button className="btn btn-primary btn-sm" onClick={()=>{setEditing(null);setShowModal(true);}}>+ Add Product</button>
      </div>

      {selected.length>0&&(
        <div className="alert alert-info" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span>{selected.length} selected</span>
          <div className="btn-group">
            <button className="btn btn-warn btn-xs" onClick={batchArchive}>Archive Selected</button>
            <button className="btn btn-danger btn-xs" onClick={batchDelete}>Delete Selected</button>
            <button className="btn btn-ghost btn-xs" onClick={clearSelect}>Clear</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th><input type="checkbox" onChange={e=>e.target.checked?selectAll():clearSelect()}/></th>
              <th>Barcode</th>
              <SortTh label="Brand" sortKey="brand" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Name" sortKey="name" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Category" sortKey="category" current={key} dir={dir} onToggle={toggle}/>
              <th>Supplier</th>
              <SortTh label="Cost" sortKey="cost" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Wholesale" sortKey="wholesale_price" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="SRP" sortKey="retail_price" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Stock" sortKey="stock" current={key} dir={dir} onToggle={toggle}/>
              <th>Low Threshold</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {pg.sliced.map(p=>{
                const sup = suppliers.find(s=>s.id===p.supplier_id);
                return (
                  <tr key={p.id} style={{opacity:p.active?1:.5}}>
                    <td><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggleSelect(p.id)}/></td>
                    <td><code style={{fontSize:10}}>{p.barcode||"—"}</code></td>
                    <td style={{fontSize:12}}>{p.brand||"—"}</td>
                    <td>
                      <div style={{fontWeight:500,fontSize:12}}>{p.name}</div>
                      {p.description&&<div style={{fontSize:10,color:"var(--text3)",marginTop:1}}>{p.description.slice(0,40)}{p.description.length>40?"…":""}</div>}
                    </td>
                    <td><span className="badge bb" style={{fontSize:10}}>{p.category}</span></td>
                    <td style={{fontSize:11,color:"var(--text2)"}}>{sup?.name||"—"}</td>
                    <td style={{color:"var(--text2)"}}>{fmt(p.cost)}</td>
                    <td style={{fontWeight:600,color:"var(--accent)"}}>{fmt(p.wholesale_price)}</td>
                    <td style={{color:"var(--text2)"}}>{fmt(p.retail_price)}</td>
                    <td>
                      <span style={{fontWeight:700,color:p.stock===0?"var(--danger)":p.stock<=p.low_stock_threshold?"var(--warn)":"var(--text)"}}>{p.stock}</span>
                    </td>
                    <td style={{color:"var(--text3)"}}>{p.low_stock_threshold}</td>
                    <td>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {p.is_new_arrival&&<span className="badge bg" style={{fontSize:9}}>NEW</span>}
                        {p.is_clearance&&<span className="badge bo" style={{fontSize:9}}>CLEARANCE</span>}
                        {!p.active&&<span className="badge br" style={{fontSize:9}}>ARCHIVED</span>}
                      </div>
                    </td>
                    <td>
                      <div className="tbl-actions">
                        <button className="btn btn-ghost btn-xs" onClick={()=>setShowHistory(p)}>History</button>
                        <button className="btn btn-secondary btn-xs" onClick={()=>{setEditing(p);setShowModal(true);}}>Edit</button>
                        {!p.active?<button className="btn btn-ghost btn-xs" onClick={()=>restore(p.id)}>Restore</button>:<button className="btn btn-warn btn-xs" onClick={async()=>{await supabase.from("products").update({active:false}).eq("id",p.id);await supabase.from("activity_log").insert({action:"product_archived",details:`Archived: ${p.name}`,entity_type:"product",entity_id:p.id,user_name:"Admin",timestamp:new Date().toISOString()}).catch(()=>{});setProducts(prev=>prev.map(x=>x.id===p.id?{...x,active:false}:x));showToast("Archived");}}>Archive</button>}
                        <button className="btn btn-danger btn-xs" onClick={()=>hardDelete(p.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pg.sliced.length===0&&<tr><td colSpan={13} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No products found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:12,color:"var(--text3)"}}>{pg.total} products</span>
          <Pagination page={pg.page} totalPages={pg.totalPages} setPage={pg.setPage}/>
        </div>
      </div>

      {showHistory&&<ProductHistoryModal product={showHistory} orders={orders} transfers={transfers} onClose={()=>setShowHistory(null)}/>}
      {showModal&&<ProductModal product={editing} suppliers={suppliers} categories={allCats.filter(c=>c!=="All")} onSave={async(data)=>{
  if(editing){
    await supabase.from("products").update(data).eq("id",editing.id);
    await supabase.from("activity_log").insert({action:"product_updated",details:`Updated: ${data.name}`,entity_type:"product",entity_id:editing.id,user_name:"Admin",timestamp:new Date().toISOString()}).catch(()=>{});
    setProducts(p=>p.map(x=>x.id===editing.id?{...x,...data}:x));
    showToast("Product updated");
  } else {
    const prod={...data,active:true,created_at:new Date().toISOString()};
    const {data:saved} = await supabase.from("products").insert(prod).select().single();
    if(saved){
      await supabase.from("activity_log").insert({action:"product_added",details:`Added: ${data.name}`,entity_type:"product",entity_id:saved.id,user_name:"Admin",timestamp:new Date().toISOString()}).catch(()=>{});
      setProducts(p=>[saved,...p]);
    }
    showToast("Product added");
  }
  setShowModal(false);
}} onClose={()=>setShowModal(false)}/>}
      {showImport&&<ImportModal onImport={handleImportCSV} onDownloadTemplate={downloadTemplate} onClose={()=>setShowImport(false)}/>}
    </>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ─── PRODUCT HISTORY MODAL ───────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ProductHistoryModal({ product, orders, transfers, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    supabase.from("activity_log")
      .select("*")
      .eq("entity_id", String(product.id))
      .order("timestamp",{ascending:false})
      .limit(200)
      .then(({data})=>{ setLogs(data||[]); setLoading(false); });
  },[product.id]);

  // Build history from orders, transfers, stock takes containing this product
  const orderEvents = orders.flatMap(o=>
    (o.items||[]).filter(i=>i.product_id===product.id).map(i=>({
      type:"order", date:o.created_at||o.date, icon:"🛒",
      label:"Order placed", color:"var(--accent)",
      detail:`${i.qty} units @ ${fmt(i.unit_price)} — Order ${o.id} (${o.customer_name||""})`
    }))
  );

  const transferEvents = transfers.flatMap(t=>
    (t.items||[]).filter(i=>i.product_id===product.id).map(i=>({
      type:"transfer", date:t.created_at||t.date, icon:"🏬",
      label:"Transferred to store", color:"var(--accent3)",
      detail:`${i.qty} units → ${t.store_name} — Transfer ${t.id}`
    }))
  );

  const logEvents = logs.map(l=>({
    type:l.action, date:l.timestamp, icon:
      l.action==="product_added"?"➕":
      l.action==="product_updated"?"✏️":
      l.action==="product_archived"?"📦":
      l.action==="stock_take"?"🔢":"📋",
    label: l.action?.replace(/_/g," "),
    color: l.action==="product_added"?"var(--success)":
           l.action==="product_updated"?"var(--accent)":
           l.action==="product_archived"?"var(--warn)":"var(--text2)",
    detail: l.details
  }));

  const allEvents = [...orderEvents, ...transferEvents, ...logEvents]
    .sort((a,b)=>new Date(b.date)-new Date(a.date));

  return (
    <div className="overlay">
      <div className="modal modal-md">
        <div className="modal-head">
          <div>
            <h2>📋 Product History</h2>
            <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{product.name}</div>
          </div>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{maxHeight:500,overflowY:"auto"}}>
          <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>
            <div className="card" style={{flex:1,minWidth:120,padding:12,textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:700,color:"var(--accent)"}}>{product.stock}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>Current Stock</div>
            </div>
            <div className="card" style={{flex:1,minWidth:120,padding:12,textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:700,color:"var(--success)"}}>{orderEvents.reduce((s,e)=>s+(parseInt(e.detail)||0),0)||orderEvents.length}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>Orders ({orderEvents.length})</div>
            </div>
            <div className="card" style={{flex:1,minWidth:120,padding:12,textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:700,color:"var(--accent3)"}}>{transferEvents.length}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>Transfers</div>
            </div>
          </div>

          {loading&&<div style={{textAlign:"center",padding:32,color:"var(--text3)"}}>Loading history…</div>}
          {!loading&&allEvents.length===0&&<div className="empty"><div className="ei">📋</div><p>No history recorded yet.</p></div>}
          {!loading&&allEvents.map((e,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"flex-start"}}>
              <div style={{width:32,height:32,borderRadius:8,background:`${e.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{e.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:600,color:e.color}}>{e.label}</span>
                  <span style={{fontSize:11,color:"var(--text3)",whiteSpace:"nowrap"}}>{new Date(e.date).toLocaleString()}</span>
                </div>
                <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, suppliers, categories, onSave, onClose }) {
  const [f,setF]=useState({
    barcode:product?.barcode||"", brand:product?.brand||"", name:product?.name||"",
    category:product?.category||categories[0]||"", supplier_id:product?.supplier_id||suppliers[0]?.id||"",
    cost:product?.cost||"", wholesale_price:product?.wholesale_price||"", retail_price:product?.retail_price||"",
    stock:product?.stock||"", low_stock_threshold:product?.low_stock_threshold||5, min_order:product?.min_order||1,
    description:product?.description||"", image_url:product?.image_url||"",
    is_clearance:product?.is_clearance||false, clearance_price:product?.clearance_price||""
  });
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef();
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const margin = f.wholesale_price&&f.cost ? Math.round((1-f.cost/f.wholesale_price)*100) : 0;

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (error) { alert("Upload failed: " + error.message); setUploading(false); return; }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    s("image_url", data.publicUrl);
    setUploading(false);
  };

  return (
    <div className="overlay">
      <div className="modal modal-lg">
        <div className="modal-head"><h2>{product?"Edit Product":"Add Product"}</h2><button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-row">
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <div style={{width:120,height:120,border:"2px dashed var(--border)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"var(--bg3)",cursor:"pointer",flexShrink:0}} onClick={()=>imgRef.current.click()}>
                {f.image_url ? <img src={f.image_url} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="product"/> : <div style={{textAlign:"center",color:"var(--text3)",fontSize:12}}>📷<br/>Add Photo</div>}
              </div>
              <input ref={imgRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&handleImageUpload(e.target.files[0])}/>
              <button className="btn btn-ghost btn-xs" onClick={()=>imgRef.current.click()} disabled={uploading}>{uploading?"Uploading…":"📷 Upload Photo"}</button>
              {f.image_url&&<button className="btn btn-danger btn-xs" onClick={()=>s("image_url","")}>Remove</button>}
            </div>
            <div style={{flex:1}}>
              <div className="form-group" style={{marginBottom:10}}><label>Product Name *</label><input value={f.name} onChange={e=>s("name",e.target.value)}/></div>
              <div className="form-row">
                <div className="form-group"><label>Barcode</label><input value={f.barcode} onChange={e=>s("barcode",e.target.value)}/></div>
                <div className="form-group"><label>Brand</label><input value={f.brand} onChange={e=>s("brand",e.target.value)}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={f.category} onChange={e=>s("category",e.target.value)}>
                    {categories.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Supplier</label>
                  <select value={f.supplier_id} onChange={e=>s("supplier_id",e.target.value)}>
                    {suppliers.map(sup=><option key={sup.id} value={sup.id}>{sup.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group"><label>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2}/></div>
          <div className="form-row-4">
            <div className="form-group"><label>Cost (J$)</label><input type="number" value={f.cost} onChange={e=>s("cost",e.target.value)}/></div>
            <div className="form-group"><label>Wholesale Price (J$)</label><input type="number" value={f.wholesale_price} onChange={e=>s("wholesale_price",e.target.value)}/><div className="input-hint" style={{color:margin>0?"var(--success)":"var(--danger)"}}>Margin: {margin}%</div></div>
            <div className="form-group"><label>Suggested Retail (J$)</label><input type="number" value={f.retail_price} onChange={e=>s("retail_price",e.target.value)}/></div>
            <div className="form-group"><label>Min Order Qty</label><input type="number" value={f.min_order} onChange={e=>s("min_order",e.target.value)}/></div>
          </div>
          <div className="form-row-3">
            <div className="form-group"><label>Stock Qty</label><input type="number" value={f.stock} onChange={e=>s("stock",e.target.value)}/></div>
            <div className="form-group"><label>Low Stock Alert</label><input type="number" value={f.low_stock_threshold} onChange={e=>s("low_stock_threshold",e.target.value)}/></div>
            <div className="form-group"><label>Clearance Price (J$)</label><input type="number" value={f.clearance_price} onChange={e=>s("clearance_price",e.target.value)} placeholder="Leave blank if not clearance"/></div>
          </div>
          <div style={{display:"flex",gap:24,marginTop:4}}>
            <label className="checkbox-row"><input type="checkbox" checked={f.is_clearance} onChange={e=>s("is_clearance",e.target.checked)}/> Mark as Clearance</label>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={uploading||!f.name} onClick={()=>{
            if(!f.name){alert("Product name is required");return;}
            onSave({
              ...f,
              cost:parseFloat(f.cost)||0,
              wholesale_price:parseFloat(f.wholesale_price)||0,
              retail_price:parseFloat(f.retail_price)||0,
              stock:parseInt(f.stock)||0,
              low_stock_threshold:parseInt(f.low_stock_threshold)||5,
              min_order:parseInt(f.min_order)||1,
              clearance_price:f.clearance_price&&String(f.clearance_price).trim()!==""?parseFloat(f.clearance_price):null
            });
          }}>{uploading?"Uploading…":"Save Product"}</button>
        </div>
      </div>
    </div>
  );
}

function ImportModal({ onImport, onDownloadTemplate, onClose }) {
  const [text,setText]=useState("");
  const [dragging,setDragging]=useState(false);
  const fileRef=useRef();

  const handleFile = (file) => {
    const reader=new FileReader();
    reader.onload=e=>setText(e.target.result);
    reader.readAsText(file);
  };

  return (
    <div className="overlay">
      <div className="modal modal-md">
        <div className="modal-head"><h2>📥 Batch Import Products</h2><button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="alert alert-info">Upload a CSV file using the template format. Required columns: name, category, wholesale_price, retail_price, stock. Download the template for the correct format.</div>
          <div style={{border:`2px dashed ${dragging?"var(--accent)":"var(--border)"}`,borderRadius:10,padding:32,textAlign:"center",marginBottom:14,transition:"border-color .2s",background:dragging?"rgba(0,212,168,.05)":"transparent",cursor:"pointer"}}
            onDragOver={e=>{e.preventDefault();setDragging(true);}}
            onDragLeave={()=>setDragging(false)}
            onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
            onClick={()=>fileRef.current.click()}>
            <div style={{fontSize:32,marginBottom:8}}>📂</div>
            <div style={{fontSize:13,color:"var(--text2)"}}>Drop CSV file here or click to browse</div>
            <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>e.target.files[0]&&handleFile(e.target.files[0])}/>
          </div>
          {text&&<div className="alert alert-ok">✅ File loaded — {text.trim().split("\n").length-1} rows ready to import</div>}
          <button className="btn btn-ghost btn-sm" onClick={onDownloadTemplate}>⬇ Download Template First</button>
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!text} onClick={()=>onImport(text)}>Import Products</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── CATEGORIES PAGE ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function CategoriesPage({ products, extraCategories, setExtraCategories, showToast }) {
  const [newCat, setNewCat] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const cats = useMemo(()=>{
    const map={};
    // Include extra manually-added categories
    (extraCategories||[]).forEach(name=>{ if(!map[name]) map[name]={name,count:0,totalStock:0,totalCost:0,totalRetail:0,manual:true}; });
    products.filter(p=>p.active).forEach(p=>{
      if(!p.category) return;
      if(!map[p.category]) map[p.category]={name:p.category,count:0,totalStock:0,totalCost:0,totalRetail:0};
      map[p.category].count++;
      map[p.category].totalStock+=p.stock;
      map[p.category].totalCost+=p.cost*p.stock;
      map[p.category].totalRetail+=p.retail_price*p.stock;
    });
    return Object.values(map).sort((a,b)=>b.count-a.count);
  },[products, extraCategories]);

  const maxCount = Math.max(...cats.map(c=>c.count),1);

  const addCategory = async () => {
    if (!newCat.trim()) return;
    if (cats.find(c=>c.name.toLowerCase()===newCat.trim().toLowerCase())) { showToast("Category already exists","err"); return; }
    const updated = [...(extraCategories||[]), newCat.trim()];
    // Save to Supabase settings as JSON
    await supabase.from("site_settings").update({extra_categories: JSON.stringify(updated)}).eq("id",1);
    setExtraCategories(updated);
    setNewCat(""); setShowAdd(false);
    showToast("Category added");
  };

  const deleteManualCat = async (name) => {
    const updated = (extraCategories||[]).filter(c=>c!==name);
    await supabase.from("site_settings").update({extra_categories: JSON.stringify(updated)}).eq("id",1);
    setExtraCategories(updated);
    showToast("Category removed");
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat c1"><div className="stat-label">Categories</div><div className="stat-val">{cats.length}</div></div>
        <div className="stat c2"><div className="stat-label">Total SKUs</div><div className="stat-val">{products.filter(p=>p.active).length}</div></div>
        <div className="stat c3"><div className="stat-label">Total Units</div><div className="stat-val">{fmtNum(products.filter(p=>p.active).reduce((s,p)=>s+p.stock,0))}</div></div>
      </div>
      <div className="card">
        <div className="card-header">
          <h3>Inventory by Category</h3>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>+ Add Category</button>
        </div>
        {showAdd&&(
          <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",gap:8,alignItems:"center"}}>
            <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category name…" style={{maxWidth:280}} onKeyDown={e=>e.key==="Enter"&&addCategory()}/>
            <button className="btn btn-primary btn-sm" onClick={addCategory}>Add</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
          </div>
        )}
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Category</th><th>Products</th><th>Distribution</th><th>Units in Stock</th><th>Inventory Cost</th><th>Retail Value</th><th></th></tr></thead>
            <tbody>{cats.map(c=>(
              <tr key={c.name}>
                <td style={{fontWeight:600}}>{c.name}{c.manual&&c.count===0&&<span className="badge bgr" style={{marginLeft:6,fontSize:9}}>empty</span>}</td>
                <td>{c.count}</td>
                <td style={{width:200}}>
                  <div className="chart-bar-bg" style={{width:180}}>
                    <div className="chart-bar-fill" style={{width:`${(c.count/maxCount)*100}%`,background:"var(--accent2)"}}/>
                  </div>
                </td>
                <td>{fmtNum(c.totalStock)}</td>
                <td style={{color:"var(--text2)"}}>{fmt(c.totalCost)}</td>
                <td style={{color:"var(--accent)"}}>{fmt(c.totalRetail)}</td>
                <td>{c.manual&&c.count===0&&<button className="btn btn-danger btn-xs" onClick={()=>deleteManualCat(c.name)}>Remove</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SUPPLIERS PAGE ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function SuppliersPage({ suppliers, setSuppliers, products, showToast }) {
  const [show,setShow]=useState(false);
  const [editing,setEditing]=useState(null);
  const [filterSupplier,setFilterSupplier]=useState(null);

  const supplierProducts = (sid)=>products.filter(p=>p.supplier_id===sid&&p.active);

  const save=async(data)=>{
    if(editing){
      await supabase.from("suppliers").update(data).eq("id",editing.id);
      setSuppliers(p=>p.map(s=>s.id===editing.id?{...s,...data}:s));
    } else {
      const {data:saved} = await supabase.from("suppliers").insert(data).select().single();
      if(saved) setSuppliers(p=>[...p,saved]);
    }
    showToast(editing?"Supplier updated":"Supplier added"); setShow(false);
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn btn-primary btn-sm" onClick={()=>{setEditing(null);setShow(true);}}>+ Add Supplier</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Supplier Name</th><th>Contact</th><th>Phone</th><th>Address</th><th>Products</th><th>Inv. Cost</th><th>Actions</th></tr></thead>
            <tbody>{suppliers.map(s=>{
              const prods=supplierProducts(s.id);
              const cost=prods.reduce((t,p)=>t+p.cost*p.stock,0);
              return (
                <tr key={s.id}>
                  <td style={{fontWeight:600}}>{s.name}</td>
                  <td style={{fontSize:12,color:"var(--text2)"}}>{s.contact||"—"}</td>
                  <td style={{fontSize:12}}>{s.phone||"—"}</td>
                  <td style={{fontSize:12,color:"var(--text2)"}}>{s.address||"—"}</td>
                  <td><button className="btn btn-ghost btn-xs" onClick={()=>setFilterSupplier(filterSupplier===s.id?null:s.id)}>{prods.length} SKUs</button></td>
                  <td style={{color:"var(--accent)"}}>{fmt(cost)}</td>
                  <td><div className="tbl-actions">
                    <button className="btn btn-secondary btn-xs" onClick={()=>{setEditing(s);setShow(true);}}>Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={async()=>{if(window.confirm("Delete supplier?")){await supabase.from("suppliers").delete().eq("id",s.id);setSuppliers(p=>p.filter(x=>x.id!==s.id));}}}>Del</button>
                  </div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
      {filterSupplier&&(
        <div className="card mt-4">
          <div className="card-header"><h3>Products from {suppliers.find(s=>s.id===filterSupplier)?.name}</h3><button className="xbtn" onClick={()=>setFilterSupplier(null)}>✕</button></div>
          <div className="tbl-wrap">
            <table><thead><tr><th>SKU</th><th>Name</th><th>Stock</th><th>Cost</th><th>Wholesale</th></tr></thead>
              <tbody>{supplierProducts(filterSupplier).map(p=>(
                <tr key={p.id}><td><code>{p.barcode||p.sku||"—"}</code></td><td>{p.name}</td><td>{p.stock}</td><td>{fmt(p.cost)}</td><td style={{color:"var(--accent)"}}>{fmt(p.wholesale_price)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {show&&<SupplierModal supplier={editing} onSave={save} onClose={()=>setShow(false)}/>}
    </>
  );
}

function SupplierModal({ supplier, onSave, onClose }) {
  const [f,setF]=useState({name:supplier?.name||"",contact:supplier?.contact||"",phone:supplier?.phone||"",address:supplier?.address||"",notes:supplier?.notes||""});
  return (
    <div className="overlay"><div className="modal modal-md">
      <div className="modal-head"><h2>{supplier?"Edit Supplier":"Add Supplier"}</h2><button className="xbtn" onClick={onClose}>✕</button></div>
      <div className="modal-body">
        <div className="form-group"><label>Supplier Name *</label><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div>
        <div className="form-row">
          <div className="form-group"><label>Contact Email</label><input value={f.contact} onChange={e=>setF(p=>({...p,contact:e.target.value}))}/></div>
          <div className="form-group"><label>Phone</label><input value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))}/></div>
        </div>
        <div className="form-group"><label>Address</label><input value={f.address} onChange={e=>setF(p=>({...p,address:e.target.value}))}/></div>
        <div className="form-group"><label>Notes</label><textarea value={f.notes} onChange={e=>setF(p=>({...p,notes:e.target.value}))}/></div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>f.name&&onSave(f)}>Save</button>
      </div>
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── STOCK TAKE PAGE ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function StockTakePage({ products, setProducts, stockTakes, setStockTakes, showToast }) {
  const [tab,setTab]=useState("new");
  const [counts,setCounts]=useState({});
  const [notes,setNotes]=useState("");
  const [search,setSearch]=useState("");

  const activeProducts = products.filter(p=>p.active);
  const filtered = activeProducts.filter(p=>!search||p.name?.toLowerCase().includes(search.toLowerCase())||p.sku?.toLowerCase().includes(search.toLowerCase()));

  const downloadCountSheet = () => {
    const rows=[["SKU","Barcode","Brand","Name","Category","System Count","Physical Count","Variance"],...activeProducts.map(p=>[p.sku,p.barcode||"",p.brand||"",p.name,p.category,p.stock,"",""])];
    downloadCSV(rows,`stock_count_${today()}.csv`);
    showToast("Count sheet downloaded");
  };

  const applyCount = async () => {
    const items=Object.entries(counts).filter(([,v])=>v!=="").map(([id,counted])=>{
      const p=products.find(x=>x.id===id);
      const variance=+counted-(p?.stock||0);
      return {product_id:id,product_name:p?.name||"",expected:p?.stock||0,counted:+counted,variance,unit_cost:p?.cost||0,dollar_variance:variance*(p?.cost||0)};
    });
    if(!items.length){showToast("No counts entered","err");return;}
    const stId=genId("ST",stockTakes);
    // Save stock take to Supabase
    const {data:st} = await supabase.from("stock_takes").insert({id:stId,date:today(),status:"completed",notes}).select().single();
    if(st){
      await supabase.from("stock_take_items").insert(items.map(i=>({...i,stock_take_id:stId})));
      setStockTakes(p=>[{...st,items},...p]);
    }
    // Update stock levels in Supabase
    for(const [id,c] of Object.entries(counts)){
      if(c==="") continue;
      await supabase.from("products").update({stock:+c}).eq("id",id);
    }
    setProducts(p=>p.map(x=>{const c=counts[x.id];return c!==undefined&&c!==""?{...x,stock:+c}:x;}));
    setCounts({}); setNotes("");
    showToast(`Stock take completed — ${items.length} items adjusted`);
    setTab("history");
  };

  const totalVariance=Object.entries(counts).reduce((s,[id,v])=>{if(v==="")return s;const p=products.find(x=>x.id===id);return s+(+v-(p?.stock||0));},0);
  const adjCount=Object.values(counts).filter(v=>v!=="").length;

  return (
    <>
      <div className="tabs">
        <button className={`tab ${tab==="new"?"active":""}`} onClick={()=>setTab("new")}>New Count</button>
        <button className={`tab ${tab==="history"?"active":""}`} onClick={()=>setTab("history")}>History</button>
      </div>

      {tab==="new"&&(
        <>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <div className="search-wrap" style={{flex:1}}>
              <span className="search-icon">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…"/>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={downloadCountSheet}>⬇ Download Count Sheet</button>
{adjCount>0&&<span className="badge bw">{adjCount} items counted · Unit variance: {totalVariance>0?"+":""}{totalVariance} · Value: {fmt(Math.abs(Object.entries(counts).reduce((s,[id,v])=>{if(v==="")return s;const p=products.find(x=>x.id===id);return s+(+v-(p?.stock||0))*(p?.cost||0);},0)))}</span>}
          </div>

          <div className="card" style={{marginBottom:16}}>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Barcode</th><th>Name</th><th>Category</th><th>Unit Cost</th><th>System Qty</th><th>Physical Count</th><th>Variance (Units)</th><th>Variance (J$)</th></tr></thead>
                <tbody>{filtered.map(p=>{
                  const counted=counts[p.id];
                  const variance=counted!==undefined&&counted!==""?+counted-p.stock:null;
                  const dollarVar=variance!==null?variance*p.cost:null;
                  return (
                    <tr key={p.id} style={{background:variance!==null&&variance!==0?"rgba(255,170,0,.04)":""}}>
                      <td><code style={{fontSize:10}}>{p.barcode||"—"}</code></td>
                      <td style={{fontSize:12,fontWeight:500}}>{p.name}</td>
                      <td><span className="badge bb" style={{fontSize:10}}>{p.category}</span></td>
                      <td style={{fontSize:12,color:"var(--text2)"}}>{fmt(p.cost)}</td>
                      <td style={{fontWeight:700}}>{p.stock}</td>
                      <td><input type="number" min="0" value={counts[p.id]||""} onChange={e=>setCounts(prev=>({...prev,[p.id]:e.target.value}))} style={{width:80,textAlign:"center"}} placeholder="—"/></td>
                      <td style={{fontWeight:700,color:variance===null?"var(--text3)":variance<0?"var(--danger)":variance>0?"var(--success)":"var(--text2)"}}>
                        {variance===null?"—":(variance>0?"+":"")+variance}
                      </td>
                      <td style={{fontWeight:700,color:dollarVar===null?"var(--text3)":dollarVar<0?"var(--danger)":dollarVar>0?"var(--success)":"var(--text2)"}}>
                        {dollarVar===null?"—":(dollarVar>0?"+":"")+fmt(Math.abs(dollarVar))}
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="form-group"><label>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Stock take notes…" rows={2}/></div>
              <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                <button className="btn btn-secondary" onClick={()=>setCounts({})}>Clear Counts</button>
                <button className="btn btn-primary" onClick={applyCount} disabled={!adjCount}>Apply Count ({adjCount} items)</button>
              </div>
            </div>
          </div>
        </>
      )}

      {tab==="history"&&(
        <div>
          {stockTakes.map(st=>{
            const totalVar=st.items.reduce((s,i)=>s+i.variance,0);
            const negItems=st.items.filter(i=>i.variance<0).length;
            return (
              <div key={st.id} className="card mb-3">
                <div className="card-header">
                  <div>
                    <div style={{fontFamily:"Syne",fontWeight:700}}>{st.id}</div>
                    <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{st.date} · {st.items.length} items counted</div>
                    {st.notes&&<div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{st.notes}</div>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"Syne",fontWeight:700,fontSize:18,color:totalVar<0?"var(--danger)":totalVar>0?"var(--success)":"var(--text)"}}>{totalVar>0?"+":""}{totalVar} units</div>
                    <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>{negItems} shortages</div>
                  </div>
                </div>
                <div className="tbl-wrap">
                  <table><thead><tr><th>Product</th><th>Unit Cost</th><th>Expected</th><th>Counted</th><th>Variance (Units)</th><th>Variance (J$)</th></tr></thead>
                    <tbody>
                    {st.items.map((item,i)=>{
                      const p=products.find(x=>x.id===item.product_id);
                      const dollarVar=item.dollar_variance!==undefined?item.dollar_variance:item.variance*(p?.cost||item.unit_cost||0);
                      return (
                        <tr key={i}>
                          <td style={{fontSize:12,fontWeight:500}}>{item.product_name||p?.name||item.product_id}</td>
                          <td style={{fontSize:12,color:"var(--text2)"}}>{fmt(p?.cost||item.unit_cost||0)}</td>
                          <td>{item.expected}</td>
                          <td>{item.counted}</td>
                          <td style={{fontWeight:700,color:item.variance<0?"var(--danger)":item.variance>0?"var(--success)":"var(--text2)"}}>
                            {item.variance>0?"+":""}{item.variance}
                          </td>
                          <td style={{fontWeight:700,color:dollarVar<0?"var(--danger)":dollarVar>0?"var(--success)":"var(--text2)"}}>
                            {dollarVar>0?"+":""}{fmt(Math.abs(dollarVar))}
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{background:"var(--bg3)",fontWeight:700}}>
                      <td colSpan={4} style={{textAlign:"right",paddingRight:12}}>Total Variance:</td>
                      <td style={{color:st.items.reduce((s,i)=>s+i.variance,0)<0?"var(--danger)":"var(--success)"}}>
                        {st.items.reduce((s,i)=>s+i.variance,0)>0?"+":""}{st.items.reduce((s,i)=>s+i.variance,0)} units
                      </td>
                      <td style={{color:st.items.reduce((s,i)=>s+(i.dollar_variance||0),0)<0?"var(--danger)":"var(--success)"}}>
                        {st.items.reduce((s,i)=>s+(i.dollar_variance||0),0)>0?"+":""}{fmt(Math.abs(st.items.reduce((s,i)=>s+(i.dollar_variance||0),0)))}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
          {stockTakes.length===0&&<div className="empty"><div className="ei">📋</div><p>No stock takes yet.</p></div>}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TRANSFERS PAGE ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function TransfersPage({ products, setProducts, transfers, setTransfers, stores, settings, showToast }) {
  const [tab,setTab]=useState("new");
  const [selectedStore,setSelectedStore]=useState(stores[0]?.id||"");
  const [items,setItems]=useState([]);
  const [search,setSearch]=useState("");
  const [notes,setNotes]=useState("");

  const activeProducts=products.filter(p=>p.active&&p.stock>0);
  const filtered=activeProducts.filter(p=>!search||p.name?.toLowerCase().includes(search.toLowerCase())||p.sku?.toLowerCase().includes(search.toLowerCase()));

  const addItem=(product)=>{
    if(items.find(i=>i.pid===product.id))return;
    setItems(p=>[...p,{pid:product.id,sku:product.sku,barcode:product.barcode||"",name:product.name,cost:product.cost,qty:1,maxQty:product.stock}]);
  };
  const updateItem=(pid,qty)=>{ if(+qty<=0)setItems(p=>p.filter(i=>i.pid!==pid));else setItems(p=>p.map(i=>i.pid===pid?{...i,qty:Math.min(+qty,i.maxQty)}:i)); };

  const createTransfer=async()=>{
    if(!items.length){showToast("Add items first","err");return;}
    const store=stores.find(s=>s.id===selectedStore);
    const id=genId(settings.transfer_prefix||"TRF",transfers);
    const trItems=items.map(i=>({product_id:i.pid,name:i.name,barcode:i.barcode,qty:i.qty,cost:i.cost}));
    const total=items.reduce((s,i)=>s+i.cost*i.qty,0);
    // Save transfer to Supabase
    const {data:tr} = await supabase.from("transfers").insert({id,store_id:selectedStore,store_name:store?.name||"",date:today(),total_cost:total,notes}).select().single();
    if(tr){
      await supabase.from("transfer_items").insert(trItems.map(i=>({...i,transfer_id:id})));
      setTransfers(p=>[{...tr,items:trItems},...p]);
    }
    // Update stock in Supabase
    for(const i of items){
      const prod=products.find(x=>x.id===i.pid);
      const newStock=Math.max(0,(prod?.stock||0)-i.qty);
      await supabase.from("products").update({stock:newStock}).eq("id",i.pid);
    }
    setProducts(p=>p.map(x=>{const ci=items.find(i=>i.pid===x.id);return ci?{...x,stock:Math.max(0,x.stock-ci.qty)}:x;}));
    setItems([]); setNotes("");
    showToast(`Transfer ${id} created`);
    setTab("history");
  };

  const downloadTransfer=(tr)=>{
    const rows=[
      ["Transfer ID",tr.id],["Store",tr.store_name],["Date",tr.date],["Total Cost",tr.total_cost],[""],
      ["SKU","Barcode","Product","Qty","Unit Cost","Total Cost"],
      ...tr.items.map(i=>[i.sku,i.barcode||"",i.name,i.qty,i.cost,i.qty*i.cost])
    ];
    downloadCSV(rows,`${tr.id}.csv`);
    showToast("Transfer sheet downloaded");
  };

  return (
    <>
      <div className="tabs">
        <button className={`tab ${tab==="new"?"active":""}`} onClick={()=>setTab("new")}>New Transfer</button>
        <button className={`tab ${tab==="history"?"active":""}`} onClick={()=>setTab("history")}>Transfer History</button>
      </div>

      {tab==="new"&&(
        <div className="two-col" style={{gap:18,alignItems:"start"}}>
          <div>
            <div className="card mb-3">
              <div className="card-header"><h3>Transfer Details</h3></div>
              <div className="card-body">
                <div className="form-group"><label>Destination Store *</label>
                  <select value={selectedStore} onChange={e=>setSelectedStore(e.target.value)}>
                    {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2}/></div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3>Selected Items ({items.length})</h3></div>
              {items.length===0?<div style={{padding:20,textAlign:"center",color:"var(--text3)"}}>Search and add products →</div>:
                <div className="tbl-wrap"><table><thead><tr><th>SKU</th><th>Product</th><th>Cost</th><th>Qty</th><th>Total</th><th></th></tr></thead>
                  <tbody>{items.map(i=>(
                    <tr key={i.pid}>
                      <td><code style={{fontSize:10}}>{i.sku}</code></td>
                      <td style={{fontSize:12}}>{i.name.slice(0,25)}{i.name.length>25?"…":""}</td>
                      <td style={{fontSize:12}}>{fmt(i.cost)}</td>
                      <td><input type="number" min={1} max={i.maxQty} value={i.qty} onChange={e=>updateItem(i.pid,e.target.value)} style={{width:60,textAlign:"center"}}/></td>
                      <td style={{fontWeight:600}}>{fmt(i.cost*i.qty)}</td>
                      <td><button className="btn btn-danger btn-xs" onClick={()=>setItems(p=>p.filter(x=>x.pid!==i.pid))}>✕</button></td>
                    </tr>
                  ))}</tbody>
                </table></div>
              }
              {items.length>0&&(
                <div style={{padding:"10px 16px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"Syne",fontWeight:700,color:"var(--accent)"}}>Total Cost: {fmt(items.reduce((s,i)=>s+i.cost*i.qty,0))}</span>
                  <button className="btn btn-primary" onClick={createTransfer}>Create Transfer Order</button>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Add Products</h3></div>
            <div style={{padding:"12px 16px"}}>
              <div className="search-wrap"><span className="search-icon">🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search inventory…"/></div>
            </div>
            <div className="tbl-wrap" style={{maxHeight:480,overflowY:"auto"}}>
              <table><thead><tr><th>SKU</th><th>Name</th><th>Stock</th><th></th></tr></thead>
                <tbody>{filtered.slice(0,50).map(p=>(
                  <tr key={p.id}>
                    <td><code style={{fontSize:10}}>{p.sku}</code></td>
                    <td style={{fontSize:12}}>{p.name.slice(0,28)}{p.name.length>28?"…":""}</td>
                    <td style={{fontWeight:700}}>{p.stock}</td>
                    <td><button className="btn btn-primary btn-xs" disabled={!!items.find(i=>i.pid===p.id)} onClick={()=>addItem(p)}>{items.find(i=>i.pid===p.id)?"✓":"Add"}</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab==="history"&&(
        <div>
          {transfers.map(tr=>(
            <div key={tr.id} className="card mb-3">
              <div className="card-header">
                <div>
                  <div style={{fontFamily:"Syne",fontWeight:700}}>{tr.id}</div>
                  <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>→ {tr.store_name} · {tr.date} · {tr.items.length} items</div>
                  {tr.notes&&<div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{tr.notes}</div>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{fontFamily:"Syne",fontWeight:700,fontSize:17,color:"var(--accent)"}}>{fmt(tr.total_cost)}</div>
                  <button className="btn btn-secondary btn-sm" onClick={()=>downloadTransfer(tr)}>⬇ Download</button>
                </div>
              </div>
              <div className="tbl-wrap">
                <table><thead><tr><th>SKU</th><th>Barcode</th><th>Product</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead>
                  <tbody>{tr.items.map((item,i)=>(
                    <tr key={i}><td><code style={{fontSize:10}}>{item.sku}</code></td><td><code style={{fontSize:10}}>{item.barcode||"—"}</code></td><td style={{fontSize:12}}>{item.name}</td><td>{item.qty}</td><td>{fmt(item.cost)}</td><td style={{fontWeight:600}}>{fmt(item.qty*item.cost)}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          ))}
          {transfers.length===0&&<div className="empty"><div className="ei">🏪</div><p>No transfers yet.</p></div>}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── INVOICES PAGE ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// ─── REFUND MODAL ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function RefundModal({ order, onClose, showToast, setOrders, setProducts, products }) {
  const [selected, setSelected] = useState({});
  const [processing, setProcessing] = useState(false);

  const toggle = (item) => {
    setSelected(p => {
      const key = item.product_id;
      if (p[key]) { const n={...p}; delete n[key]; return n; }
      return {...p, [key]: {qty: item.qty, unit_price: item.unit_price, name: item.name, product_id: item.product_id}};
    });
  };

  const updateQty = (productId, qty) => {
    setSelected(p => ({...p, [productId]: {...p[productId], qty: parseInt(qty)||1}}));
  };

  const processRefund = async () => {
    const refundItems = Object.values(selected);
    if (!refundItems.length) { showToast("Select at least one item to refund","err"); return; }
    setProcessing(true);
    const refundTotal = refundItems.reduce((s,i) => s + i.qty * i.unit_price, 0);
    // Record refund in activity log
    await supabase.from("activity_log").insert({
      action:"refund_processed",
      details:`Refund of ${refundItems.length} item(s) totaling ${fmt(refundTotal)} on order ${order.id}`,
      entity_type:"order", entity_id:String(order.id),
      user_name:"Admin", timestamp:new Date().toISOString()
    }).catch(()=>{});
    // Return items to stock
    for (const item of refundItems) {
      const prod = products.find(p=>p.id===item.product_id);
      if (prod) {
        const newStock = prod.stock + item.qty;
        await supabase.from("products").update({stock:newStock}).eq("id",item.product_id);
        setProducts(prev=>prev.map(p=>p.id===item.product_id?{...p,stock:newStock}:p));
      }
    }
    // Update order status to refunded (partial or full)
    const allRefunded = refundItems.length === (order.items||[]).length;
    const newStatus = allRefunded ? "refunded" : "partial_refund";
    await supabase.from("orders").update({status:newStatus}).eq("id",order.id);
    setOrders(prev=>prev.map(o=>o.id===order.id?{...o,status:newStatus}:o));
    setProcessing(false);
    showToast(`Refund processed — ${refundItems.length} item(s) returned to stock`);
    onClose();
  };

  const selectedTotal = Object.values(selected).reduce((s,i)=>s+i.qty*i.unit_price,0);

  return (
    <div className="overlay">
      <div className="modal modal-md">
        <div className="modal-head">
          <div>
            <h2>↩️ Process Refund</h2>
            <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>Order {order.id} · {order.customer_name}</div>
          </div>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="alert alert-warn" style={{marginBottom:14}}>Select the items being returned. Stock will be added back for selected items.</div>
          {(order.items||[]).map((item,i)=>{
            const sel = selected[item.product_id];
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <input type="checkbox" checked={!!sel} onChange={()=>toggle(item)} style={{width:16,height:16,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{item.name}</div>
                  <div style={{fontSize:11,color:"var(--text2)"}}>Ordered: {item.qty} × {fmt(item.unit_price)} = {fmt(item.qty*item.unit_price)}</div>
                </div>
                {sel&&<div style={{display:"flex",alignItems:"center",gap:6}}>
                  <label style={{fontSize:11,color:"var(--text3)"}}>Return qty:</label>
                  <input type="number" min={1} max={item.qty} value={sel.qty}
                    onChange={e=>updateQty(item.product_id, Math.min(item.qty, Math.max(1,+e.target.value)))}
                    style={{width:60,textAlign:"center",padding:"3px 6px",border:"1px solid var(--border)",borderRadius:6}}/>
                </div>}
              </div>
            );
          })}
          {Object.keys(selected).length>0&&(
            <div style={{marginTop:14,padding:"10px 14px",background:"var(--bg3)",borderRadius:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:600}}>
                <span>{Object.keys(selected).length} item(s) selected for refund</span>
                <span style={{color:"var(--danger)"}}>−{fmt(selectedTotal)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={processRefund} disabled={processing||!Object.keys(selected).length}>
            {processing?"Processing…":"Process Refund & Return to Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InvoicesPage({ orders, setOrders, customers, settings, showToast, setModal, setProducts, products }) {
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("all");
  const [filterDate,setFilterDate]=useState("");
  const [showEmailModal,setShowEmailModal]=useState(null);
  const [showRefund,setShowRefund]=useState(null);

  const filtered=useMemo(()=>orders.filter(o=>{
    if(filterStatus!=="all"&&o.status!==filterStatus)return false;
    if(filterDate&&!o.date?.startsWith(filterDate))return false;
    const q=search.toLowerCase();
    if(q&&!o.id.toLowerCase().includes(q)&&!o.customer_name?.toLowerCase().includes(q))return false;
    return true;
  }),[orders,search,filterStatus,filterDate]);

  const {sorted,key,dir,toggle}=useSort(filtered,"date");
  const pg=usePagination(sorted,20);

  const updateStatus=async(id,status)=>{
    const order = orders.find(o=>o.id===id);
    // Deduct stock when admin marks as shipped (only once)
    if(status==="shipped" && order?.status!=="shipped" && order?.status!=="delivered") {
      for(const item of (order?.items||[])) {
        const {data:prod} = await supabase.from("products").select("stock").eq("id",item.product_id).single();
        if(prod) {
          const newStock = Math.max(0, prod.stock - item.qty);
          await supabase.from("products").update({stock:newStock}).eq("id",item.product_id);
          setProducts(prev=>prev.map(p=>p.id===item.product_id?{...p,stock:newStock}:p));
        }
      }
      showToast("Order shipped — inventory deducted");
    }
    await supabase.from("orders").update({status}).eq("id",id);
    setOrders(p=>p.map(o=>o.id===id?{...o,status}:o));
    if(status!=="shipped") showToast("Status updated");
  };

  const exportCSV=()=>{
    const rows=[["Invoice","Customer","Date","Status","Payment","Subtotal","Tax","Total"],...filtered.map(o=>[o.id,o.customer_name,o.date,o.status,o.payment_method||"—",o.subtotal,o.tax_amount,o.total])];
    downloadCSV(rows,`invoices_${today()}.csv`); showToast("Exported");
  };

  return (
    <>
      <div className="filter-bar">
        <div className="search-wrap" style={{flex:2}}>
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by invoice # or customer name…"/>
        </div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{width:"auto"}}>
          <option value="all">All Statuses</option>
          {["pending","processing","shipped","paid","delivered","cancelled","refunded","partial_refund"].map(s=><option key={s} value={s}>{s.replace("_"," ")}</option>)}
        </select>
        <input type="month" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{width:"auto",padding:"6px 10px"}}/>
        <PageSizeSelect perPage={pg.perPage} setPerPage={pg.setPerPage} reset={pg.reset}/>
        <button className="btn btn-secondary btn-sm" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <SortTh label="Invoice" sortKey="id" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Customer" sortKey="customer_name" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Date" sortKey="date" current={key} dir={dir} onToggle={toggle}/>
              <th>Type</th>
              <th>Payment</th>
              <SortTh label="Total" sortKey="total" current={key} dir={dir} onToggle={toggle}/>
              <th>Status</th>
              <th>Actions</th>
            </tr></thead>
            <tbody>{pg.sliced.map(o=>(
              <tr key={o.id}>
                <td><code>{o.id}</code></td>
                <td style={{fontWeight:500}}>{o.customer_name}</td>
                <td style={{fontSize:12,color:"var(--text2)"}}>{o.date}</td>
                <td><span className={`badge ${o.type==="consignment"?"bo":"bb"}`}>{o.type||"standard"}</span></td>
                <td style={{fontSize:12,color:"var(--text2)"}}>{o.payment_method||"—"}</td>
                <td style={{fontWeight:600,color:"var(--accent)"}}>{fmt(o.total)}</td>
                <td>
                  <select value={o.status} onChange={e=>updateStatus(o.id,e.target.value)} style={{padding:"3px 6px",fontSize:11,width:"auto",background:"var(--bg3)"}}>
                    {["pending","processing","shipped","paid","delivered","cancelled","refunded","partial_refund"].map(s=><option key={s} value={s}>{s.replace("_"," ")}</option>)}
                  </select>
                </td>
                <td><div className="tbl-actions">
                  <button className="btn btn-secondary btn-xs" onClick={()=>setModal({type:"viewInvoice",data:o})}>View</button>
                  <button className="btn btn-ghost btn-xs" onClick={()=>{ const c=customers.find(x=>x.id===o.customer_id); printInvoice(o,c,settings); }}>Print</button>
                  <button className="btn btn-ghost btn-xs" onClick={()=>setShowEmailModal(o)}>📧</button>
                  {(o.status==="shipped"||o.status==="delivered"||o.status==="paid")&&<button className="btn btn-warn btn-xs" onClick={()=>setShowRefund(o)}>↩ Refund</button>}
                </div></td>
              </tr>
            ))}
            {pg.sliced.length===0&&<tr><td colSpan={8} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No invoices found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:12,color:"var(--text3)"}}>{pg.total} invoices · Total: {fmt(filtered.reduce((s,o)=>s+o.total,0))}</span>
          <Pagination page={pg.page} totalPages={pg.totalPages} setPage={pg.setPage}/>
        </div>
      </div>

      {showEmailModal&&<EmailModal order={showEmailModal} customers={customers} settings={settings} onClose={()=>setShowEmailModal(null)} showToast={showToast}/>}
      {showRefund&&<RefundModal order={showRefund} onClose={()=>setShowRefund(null)} showToast={showToast} setOrders={setOrders} setProducts={setProducts} products={products}/>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── CLEARANCE PAGE ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ClearancePage({ products, isAdmin, addToCart, user }) {
  const items=products.filter(p=>p.is_clearance&&p.active&&(isAdmin||p.stock>0));
  const isConsignment=user?.customer_type==="consignment";

  return (
    <div>
      <div className="alert alert-warn mb-4">🔥 Clearance items — discounted prices while stock lasts!</div>
      {items.length===0&&<div className="empty"><div className="ei">🔥</div><p>No clearance items currently.</p></div>}
      <div className="prod-grid">
        {items.map(p=>{
          const discountPct=p.clearance_price?Math.round((1-p.clearance_price/p.wholesale_price)*100):0;
          return (
            <div key={p.id} className="prod-card">
              <div className="prod-tag"><span className="clearance-badge">CLEARANCE {discountPct>0?`-${discountPct}%`:""}</span></div>
              <div className="prod-card-img">🏷️</div>
              <div className="prod-card-body">
                <div className="prod-card-brand">{p.brand}</div>
                <div className="prod-card-name">{p.name}</div>
                {p.barcode&&<div className="prod-card-sku">Barcode: {p.barcode}</div>}
                {!isConsignment&&<div className="prod-price-row">
                  <span className="prod-ws">{fmt(p.clearance_price||p.wholesale_price)}</span>
                  {p.clearance_price&&<span className="prod-retail">{fmt(p.wholesale_price)}</span>}
                </div>}
                <div className="prod-srp">SRP: {fmt(p.retail_price)}</div>
                <div className="prod-stock">{p.stock} in stock</div>
                {!isAdmin&&user?.approved&&<button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} disabled={p.stock===0} onClick={()=>addToCart({...p,wholesale_price:isConsignment?0:p.clearance_price||p.wholesale_price},p.min_order)}>Add to Cart</button>}
                {isConsignment&&<div className="alert alert-info" style={{padding:"6px 10px",fontSize:11,marginTop:8}}>Contact us for pricing</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function CustomersPage({ customers, setCustomers, orders, showToast }) {
  const [tab,setTab]=useState("all");
  const [search,setSearch]=useState("");
  const [editing,setEditing]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [showCreateModal,setShowCreateModal]=useState(false);

  const filtered=customers.filter(c=>{
    if(tab==="pending"&&c.approved)return false;
    if(tab==="upfront"&&c.customer_type!=="upfront")return false;
    if(tab==="consignment"&&c.customer_type!=="consignment")return false;
    const q=search.toLowerCase();
    if(q&&!c.name.toLowerCase().includes(q)&&!c.company?.toLowerCase().includes(q)&&!c.email?.toLowerCase().includes(q))return false;
    return true;
  });

  const logAct = async(action,details,entity_type="",entity_id="") => {
    await supabase.from("activity_log").insert({action,details,entity_type,entity_id:String(entity_id||""),user_name:"Admin",timestamp:new Date().toISOString()}).catch(e=>console.warn("Log err:",e));
  };

  const approve=async(id,type)=>{
    const c = customers.find(x=>x.id===id);
    const { error } = await supabase.from("profiles").update({approved:true,customer_type:type||"upfront"}).eq("id",id);
    if(error){ showToast("Failed to approve","err"); return; }
    setCustomers(p=>p.map(x=>x.id===id?{...x,approved:true,customer_type:type||x.customer_type||"upfront"}:x));
    await logAct("customer_approved",`Approved ${c?.company||c?.name} as ${type||"upfront"}`,"customer",id);
    showToast("Account approved");
  };
  const revoke=async(id)=>{
    const c = customers.find(x=>x.id===id);
    const { error } = await supabase.from("profiles").update({approved:false}).eq("id",id);
    if(error){ showToast("Failed to revoke","err"); return; }
    setCustomers(p=>p.map(x=>x.id===id?{...x,approved:false}:x));
    await logAct("customer_revoked",`Revoked access for ${c?.company||c?.name}`,"customer",id);
    showToast("Access revoked");
  };

  const deleteCustomer=async(id, email)=>{
    if(!window.confirm(`Permanently delete this customer? They will be able to sign up again with the same email.`)) return;
    // Delete from profiles first
    await supabase.from("profiles").delete().eq("id",id);
    // Delete from auth via admin API (uses service role - handled by edge function)
    await fetch(`${SUPABASE_URL}/functions/v1/delete-user`, {
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${SUPABASE_ANON_KEY}`},
      body:JSON.stringify({user_id:id})
    }).catch(()=>{});
    setCustomers(p=>p.filter(c=>c.id!==id));
    showToast("Customer deleted — they can sign up again");
  };

  const createCustomer=async(data)=>{
    // Create auth user
    const { data: authData, error } = await supabase.auth.admin?.createUser?.({
      email: data.email, password: data.password, email_confirm: true,
      user_metadata: { name: data.name, company: data.company, tax_id: data.tax_id, role: "buyer" }
    });
    // Fallback: use signUp
    if (error || !authData) {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: data.email, password: data.password,
        options: { data: { name: data.name, company: data.company, tax_id: data.tax_id, role: "buyer" } }
      });
      if (signUpErr) { showToast(signUpErr.message,"err"); return; }
    }
    // Update profile to approved immediately
    await new Promise(r=>setTimeout(r,1000)); // wait for trigger
    await supabase.from("profiles").update({
      approved: true, customer_type: data.customer_type||"upfront",
      discount_pct: data.discount_pct||0, min_order_value: data.min_order_value||0
    }).eq("email", data.email);
    // Reload customers
    const { data: custs } = await supabase.from("profiles").select("*").eq("role","buyer").order("created_at",{ascending:false});
    if (custs) setCustomers(custs);
    setShowCreateModal(false);
    showToast(`Account created for ${data.name} — share their login details`);
  };

  const saveCustomer=async(data)=>{
    await supabase.from("profiles").update(data).eq("id",editing.id);
    setCustomers(p=>p.map(c=>c.id===editing.id?{...c,...data}:c));
    showToast("Customer updated"); setShowModal(false);
  };

  const sendEmail=(c,subject,body)=>{ showToast(`Email queued to ${c.company||c.name}`); };

  return (
    <>
      <div className="tabs">
        {[["all","All"],["pending","Pending"],["upfront","Upfront Buyers"],["consignment","Consignment"]].map(([v,l])=>(
          <button key={v} className={`tab ${tab===v?"active":""}`} onClick={()=>setTab(v)}>{l} {v==="pending"&&customers.filter(c=>!c.approved).length>0?`(${customers.filter(c=>!c.approved).length})`:""}</button>
        ))}
      </div>
      <div className="filter-bar">
        <div className="search-wrap"><span className="search-icon">🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers…"/></div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowCreateModal(true)}>+ Create Account</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Company</th><th>Contact</th><th>TRN</th><th>Type</th><th>Discount</th><th>Min Order</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(c=>{
              const custOrders=orders.filter(o=>o.customer_id===c.id);
              return (
                <tr key={c.id}>
                  <td><div style={{fontWeight:600}}>{c.company||c.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{c.email}</div></td>
                  <td style={{fontSize:12}}>{c.name}</td>
                  <td><code style={{fontSize:10}}>{c.tax_id||"—"}</code></td>
                  <td>{c.customer_type?<span className={`badge ${c.customer_type==="consignment"?"bo":"bb"}`}>{c.customer_type}</span>:<span className="badge bgr">—</span>}</td>
                  <td style={{fontSize:12}}>{c.discount_pct||0}%</td>
                  <td style={{fontSize:12}}>{c.min_order_value?fmt(c.min_order_value):"None"}</td>
                  <td style={{fontSize:11,color:"var(--text2)"}}>{c.created_at}</td>
                  <td>{c.approved?<span className="badge bg">✓ Active</span>:<span className="badge bw">⏳ Pending</span>}</td>
                  <td><div className="tbl-actions">
                    <button className="btn btn-secondary btn-xs" onClick={()=>{setEditing(c);setShowModal(true);}}>Edit</button>
                    {!c.approved&&(
                      <>
                        <button className="btn btn-primary btn-xs" onClick={()=>approve(c.id,"upfront")}>→ Upfront</button>
                        <button className="btn btn-purple btn-xs" onClick={()=>approve(c.id,"consignment")}>→ Consign</button>
                      </>
                    )}
                    {c.approved&&<button className="btn btn-warn btn-xs" onClick={()=>revoke(c.id)}>Revoke</button>}
                    <button className="btn btn-danger btn-xs" onClick={()=>deleteCustomer(c.id, c.email)}>🗑 Delete</button>
                  </div></td>
                </tr>
              );
            })}
            {filtered.length===0&&<tr><td colSpan={9} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No customers found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal&&editing&&<CustomerEditModal customer={editing} onSave={saveCustomer} onClose={()=>setShowModal(false)}/>}
      {showCreateModal&&<CreateCustomerModal onSave={createCustomer} onClose={()=>setShowCreateModal(false)}/>}
    </>
  );
}

function CreateCustomerModal({ onSave, onClose }) {
  const [f,setF]=useState({name:"",company:"",email:"",password:"",tax_id:"",customer_type:"upfront",discount_pct:0,min_order_value:0});
  const [busy,setBusy]=useState(false);
  const genPwd=()=>{ const p=Math.random().toString(36).slice(2,10)+Math.random().toString(36).slice(2,6).toUpperCase()+"!1"; setF(x=>({...x,password:p})); };
  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-md">
        <div className="modal-head"><h2>👤 Create Customer Account</h2><button className="xbtn" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="alert alert-info" style={{marginBottom:14}}>Create an account on behalf of a customer. Share the email and password with them — they can change their password after logging in.</div>
          <div className="form-row">
            <div className="form-group"><label>Full Name</label><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div>
            <div className="form-group"><label>Company Name</label><input value={f.company} onChange={e=>setF(p=>({...p,company:e.target.value}))}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email</label><input type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></div>
            <div className="form-group"><label>Business TRN</label><input value={f.tax_id} onChange={e=>setF(p=>({...p,tax_id:e.target.value}))}/></div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{display:"flex",gap:8}}>
              <input value={f.password} onChange={e=>setF(p=>({...p,password:e.target.value}))} style={{flex:1}}/>
              <button className="btn btn-secondary btn-sm" onClick={genPwd}>Generate</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Account Type</label>
              <select value={f.customer_type} onChange={e=>setF(p=>({...p,customer_type:e.target.value}))}>
                <option value="upfront">Upfront</option>
                <option value="consignment">Consignment</option>
              </select>
            </div>
            <div className="form-group"><label>Discount %</label><input type="number" min={0} max={100} value={f.discount_pct} onChange={e=>setF(p=>({...p,discount_pct:+e.target.value}))}/></div>
          </div>
          <div className="form-group"><label>Min Order Value (J$)</label><input type="number" min={0} value={f.min_order_value} onChange={e=>setF(p=>({...p,min_order_value:+e.target.value}))}/></div>
          {f.password&&<div className="alert alert-ok" style={{fontSize:12}}>📋 Login details to share:<br/><strong>Email:</strong> {f.email}<br/><strong>Password:</strong> {f.password}</div>}
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={busy||!f.name||!f.email||!f.password} onClick={async()=>{setBusy(true);await onSave(f);setBusy(false);}}>{busy?"Creating…":"Create Account"}</button>
        </div>
      </div>
    </div>
  );
}

function CustomerEditModal({ customer, onSave, onClose }) {
  const [f,setF]=useState({
    name:customer.name||"", company:customer.company||"", email:customer.email||"",
    tax_id:customer.tax_id||"", customer_type:customer.customer_type||"upfront",
    discount_pct:customer.discount_pct||0, min_order_value:customer.min_order_value||0,
    approved:customer.approved||false
  });
  return (
    <div className="overlay"><div className="modal modal-md">
      <div className="modal-head"><h2>Edit Customer</h2><button className="xbtn" onClick={onClose}>✕</button></div>
      <div className="modal-body">
        <div className="form-row">
          <div className="form-group"><label>Contact Name</label><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div>
          <div className="form-group"><label>Company</label><input value={f.company} onChange={e=>setF(p=>({...p,company:e.target.value}))}/></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Email</label><input value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))}/></div>
          <div className="form-group"><label>TRN / Tax ID</label><input value={f.tax_id} onChange={e=>setF(p=>({...p,tax_id:e.target.value}))}/></div>
        </div>
        <div className="form-row-3">
          <div className="form-group"><label>Account Type</label>
            <select value={f.customer_type} onChange={e=>setF(p=>({...p,customer_type:e.target.value}))}>
              <option value="upfront">Upfront Buyer</option>
              <option value="consignment">Consignment</option>
            </select>
          </div>
          <div className="form-group"><label>Discount %</label><input type="number" min={0} max={100} value={f.discount_pct} onChange={e=>setF(p=>({...p,discount_pct:+e.target.value}))}/></div>
          <div className="form-group"><label>Min Order Value (J$)</label><input type="number" min={0} value={f.min_order_value} onChange={e=>setF(p=>({...p,min_order_value:+e.target.value}))}/></div>
        </div>
        <label className="checkbox-row" style={{marginTop:8}}>
          <input type="checkbox" checked={f.approved} onChange={e=>setF(p=>({...p,approved:e.target.checked}))}/>
          Account Approved
        </label>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>onSave(f)}>Save Changes</button>
      </div>
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ─── ACTIVITY LOG PAGE ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// ─── PURCHASE ORDERS PAGE ────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function PurchaseOrdersPage({ purchaseOrders, setPurchaseOrders, products, setProducts, suppliers, settings, showToast }) {
  const [tab, setTab] = useState("list");
  const [editing, setEditing] = useState(null);
  const [showReceive, setShowReceive] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = purchaseOrders.filter(po => {
    if (filter !== "all" && po.status !== filter) return false;
    if (search && !po.id?.toLowerCase().includes(search.toLowerCase()) && !po.supplier_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor = { open:"var(--accent)", received:"var(--success)", partial:"var(--warn)", cancelled:"var(--danger)" };

  return (
    <>
      <div className="filter-bar" style={{marginBottom:16}}>
        <div className="search-wrap" style={{flex:2}}>
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by PO # or supplier…"/>
        </div>
        {["all","open","partial","received","cancelled"].map(f=>(
          <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-secondary"}`} onClick={()=>setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" onClick={()=>{setEditing(null);setTab("form");}}>+ New PO</button>
      </div>

      {tab==="list"&&(
        <div className="card">
          <div className="tbl-wrap">
            <table>
              <thead><tr>
                <th>PO #</th><th>Supplier</th><th>Expected</th><th>Items</th><th>Ordered</th><th>Received</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length===0&&<tr><td colSpan={8} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No purchase orders found.</td></tr>}
                {filtered.map(po=>{
                  const totalOrdered = (po.items||[]).reduce((s,i)=>s+i.ordered_qty,0);
                  const totalReceived = (po.items||[]).reduce((s,i)=>s+(i.received_qty||0),0);
                  return (
                    <tr key={po.id}>
                      <td><code style={{fontWeight:700}}>{po.id}</code></td>
                      <td style={{fontWeight:500}}>{po.supplier_name||"—"}</td>
                      <td style={{fontSize:12,color:"var(--text2)"}}>{po.expected_date||"—"}</td>
                      <td>{(po.items||[]).length}</td>
                      <td style={{fontWeight:600}}>{totalOrdered}</td>
                      <td style={{fontWeight:600,color:totalReceived===totalOrdered?"var(--success)":totalReceived>0?"var(--warn)":"var(--text3)"}}>{totalReceived}</td>
                      <td><span className="badge" style={{background:`${statusColor[po.status]||"var(--accent)"}22`,color:statusColor[po.status]||"var(--accent)",fontSize:10}}>{po.status}</span></td>
                      <td><div className="tbl-actions">
                        <button className="btn btn-secondary btn-xs" onClick={()=>{setEditing(po);setTab("form");}}>Edit</button>
                        {po.status!=="received"&&po.status!=="cancelled"&&<button className="btn btn-primary btn-xs" onClick={()=>setShowReceive(po)}>📥 Receive</button>}
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 16px",fontSize:12,color:"var(--text3)",borderTop:"1px solid var(--border)"}}>
            {filtered.length} purchase orders
          </div>
        </div>
      )}

      {tab==="form"&&<POFormPage po={editing} suppliers={suppliers} products={products} setProducts={setProducts} settings={settings} showToast={showToast}
        onSave={async(data)=>{
          if(editing){
            // Auto-determine status from received quantities
            const allReceived = data.items.every(i=>i.received_qty>=i.ordered_qty);
            const anyReceived = data.items.some(i=>i.received_qty>0);
            const autoStatus = allReceived?"received":anyReceived?"partial":data.status==="cancelled"?"cancelled":"open";
            await supabase.from("purchase_orders").update({supplier_id:data.supplier_id,supplier_name:data.supplier_name,expected_date:data.expected_date,shipping_cost:data.shipping_cost,lot_ref:data.lot_ref,notes:data.notes,status:autoStatus}).eq("id",editing.id);
            await supabase.from("purchase_order_items").delete().eq("po_id",editing.id);
            await supabase.from("purchase_order_items").insert(data.items.map(i=>({...i,po_id:editing.id})));
            setPurchaseOrders(prev=>prev.map(p=>p.id===editing.id?{...p,...data,status:autoStatus}:p));
            showToast("Purchase order updated");
          } else {
            const id = "PO-"+Date.now();
            const po = {id,supplier_id:data.supplier_id,supplier_name:data.supplier_name,expected_date:data.expected_date,shipping_cost:data.shipping_cost||0,lot_ref:data.lot_ref||"",notes:data.notes||"",status:"open",created_at:new Date().toISOString()};
            await supabase.from("purchase_orders").insert(po);
            await supabase.from("purchase_order_items").insert(data.items.map(i=>({...i,po_id:id})));
            setPurchaseOrders(prev=>[{...po,items:data.items},...prev]);
            showToast("Purchase order created");
          }
          setEditing(null); setTab("list");
        }}
        onCancel={()=>{setEditing(null);setTab("list");}}
      />}

      {showReceive&&<ReceivePOModal po={showReceive} products={products} setProducts={setProducts} setPurchaseOrders={setPurchaseOrders} showToast={showToast} onClose={()=>setShowReceive(null)}/>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── PO FORM PAGE ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function POFormPage({ po, suppliers, products, setProducts, settings, showToast, onSave, onCancel }) {
  const [f, setF] = useState({
    supplier_id: po?.supplier_id||"",
    supplier_name: po?.supplier_name||"",
    expected_date: po?.expected_date||"",
    shipping_cost: po?.shipping_cost||"",
    lot_ref: po?.lot_ref||"",
    notes: po?.notes||"",
    status: po?.status||"open",
  });
  const [items, setItems] = useState(po?.items||[]);
  const [productSearch, setProductSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  const pickerResults = products.filter(p=>p.active&&(
    p.name?.toLowerCase().includes(productSearch.toLowerCase())||
    p.barcode?.includes(productSearch)||
    p.brand?.toLowerCase().includes(productSearch.toLowerCase())
  )).slice(0,20);

  const addItem = (p) => {
    if (items.find(i=>i.product_id===p.id)) { showToast("Already in PO"); return; }
    setItems(prev=>[...prev,{product_id:p.id,product_name:p.name,barcode:p.barcode||"",ordered_qty:1,received_qty:0,unit_cost:"",note:""}]);
    setProductSearch(""); setShowPicker(false);
  };

  const addNewItem = () => {
    setShowNewProductModal(true);
  };

  const updateItem = (idx,key,val) => setItems(prev=>prev.map((it,i)=>i===idx?{...it,[key]:val}:it));
  const removeItem = (idx) => setItems(prev=>prev.filter((_,i)=>i!==idx));

  const totalUnits = items.reduce((s,i)=>s+(+i.ordered_qty||0),0);

  const handleSave = async () => {
    if (!items.length) { showToast("Add at least one item","err"); return; }
    setSaving(true);

    // For each item where received_qty changed vs what was previously saved,
    // update product stock with weighted average cost
    const previousItems = po?.items || [];
    for (const item of items) {
      const prevItem = previousItems.find(p=>p.product_id===item.product_id);
      const prevReceived = prevItem?.received_qty || 0;
      const nowReceived = parseInt(item.received_qty) || 0;
      const newlyReceived = nowReceived - prevReceived;

      if (newlyReceived > 0 && item.product_id) {
        const prod = products.find(p=>p.id===item.product_id);
        if (prod) {
          const newCost = parseFloat(item.unit_cost) || 0;
          const existingValue = prod.stock * (prod.cost || 0);
          const newValue = newlyReceived * newCost;
          const newStock = prod.stock + newlyReceived;
          const avgCost = newStock > 0 ? Math.round((existingValue + newValue) / newStock) : newCost;
          await supabase.from("products").update({stock:newStock, cost:avgCost, active:true}).eq("id",prod.id);
          setProducts(prev=>prev.map(p=>p.id===prod.id?{...p,stock:newStock,cost:avgCost,active:true}:p));
          await supabase.from("activity_log").insert({
            action:"stock_received",
            details:`Received ${newlyReceived} units of ${prod.name} @ ${fmt(newCost)} (avg cost now ${fmt(avgCost)}) via PO ${po?.id||"new"}`,
            entity_type:"product", entity_id:String(prod.id),
            user_name:"Admin", timestamp:new Date().toISOString()
          }).catch(()=>{});
        }
      }
    }

    await onSave({...f, items: items.map(i=>({
      product_id: i.product_id||null,
      product_name: i.product_name||"",
      barcode: i.barcode||"",
      ordered_qty: parseInt(i.ordered_qty)||1,
      received_qty: parseInt(i.received_qty)||0,
      unit_cost: parseFloat(i.unit_cost)||0,
      note: i.note||""
    }))});
    setSaving(false);
  };

  return (
    <div>
      {showNewProductModal&&<ProductModal
        product={null}
        suppliers={suppliers}
        categories={[...new Set(products.map(p=>p.category).filter(Boolean))]}
        onClose={()=>setShowNewProductModal(false)}
        onSave={async(data)=>{
          // Save full product to DB
          const prod = {
            barcode:data.barcode||"",brand:data.brand||"",name:data.name,
            category:data.category||"Uncategorized",
            cost:parseFloat(data.cost)||0,
            wholesale_price:parseFloat(data.wholesale_price)||0,
            retail_price:parseFloat(data.retail_price)||0,
            stock:0, // will be received via PO
            low_stock_threshold:parseInt(data.low_stock_threshold)||5,
            min_order:parseInt(data.min_order)||1,
            description:data.description||"",
            is_clearance:data.is_clearance||false,
            clearance_price:data.clearance_price||null,
            image_url:data.image_url||null,
            active:false, // not active until received
            created_at:new Date().toISOString()
          };
          const {data:saved,error} = await supabase.from("products").insert(prod).select().single();
          if(error||!saved){ alert("Failed to save product: "+(error?.message||"unknown error")); return; }
          setProducts(prev=>[saved,...prev]);
          // Add to PO items list
          setItems(prev=>[...prev,{
            product_id:saved.id,
            product_name:saved.name,
            barcode:saved.barcode||"",
            ordered_qty:1,
            received_qty:0,
            unit_cost:saved.cost||"",
            note:"",
            is_new:false
          }]);
          setShowNewProductModal(false);
        }}
      />}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{margin:0}}>{po?"Edit Purchase Order":"New Purchase Order"} {po&&<code style={{fontSize:14,marginLeft:8}}>{po.id}</code>}</h3>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>← Back to List</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-header"><h3>🏭 Supplier Info</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label>Supplier</label>
              <select value={f.supplier_id} onChange={e=>{const s=suppliers.find(x=>x.id===e.target.value);setF(p=>({...p,supplier_id:e.target.value,supplier_name:s?.name||""}));}}>
                <option value="">— Select Supplier —</option>
                {suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Supplier Name (manual)</label><input value={f.supplier_name} onChange={e=>setF(p=>({...p,supplier_name:e.target.value}))}/></div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>📋 Order Info</h3></div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group"><label>Expected Date</label><input type="date" value={f.expected_date} onChange={e=>setF(p=>({...p,expected_date:e.target.value}))}/></div>
              <div className="form-group"><label>Lot / Ref #</label><input value={f.lot_ref} onChange={e=>setF(p=>({...p,lot_ref:e.target.value}))}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Shipping Cost (J$)</label><input type="number" value={f.shipping_cost} onChange={e=>setF(p=>({...p,shipping_cost:e.target.value}))}/></div>
              <div className="form-group"><label>Status</label>
                <select value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value}))}>
                  {["open","partial","received","cancelled"].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group"><label>Notes</label><input value={f.notes} onChange={e=>setF(p=>({...p,notes:e.target.value}))}/></div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-header">
          <h3>📦 Items ({items.length})</h3>
          <div style={{display:"flex",gap:8}}>
            <div style={{position:"relative"}}>
              <input value={productSearch} onChange={e=>{setProductSearch(e.target.value);setShowPicker(true);}} placeholder="Search existing product…" style={{padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,fontSize:12,width:220}}/>
              {showPicker&&productSearch&&pickerResults.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,.15)",zIndex:100,width:320,maxHeight:200,overflowY:"auto"}}>
                  {pickerResults.map(p=>(
                    <div key={p.id} style={{padding:"8px 12px",cursor:"pointer",fontSize:12,borderBottom:"1px solid var(--border)"}} onClick={()=>addItem(p)}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
                      onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <div style={{fontWeight:600}}>{p.name}</div>
                      <div style={{color:"var(--text3)",fontSize:11}}>{p.barcode||"No barcode"} · Stock: {p.stock}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={addNewItem}>+ New Item</button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Barcode</th>
              <th style={{textAlign:"center"}}>Ordered Qty</th>
              <th style={{textAlign:"center"}}>Received Qty</th>
              <th style={{textAlign:"right"}}>Unit Cost (J$)</th>
              <th style={{textAlign:"right"}}>Total</th>
              <th>Note</th>
              <th></th>
            </tr></thead>
            <tbody>
              {items.length===0&&<tr><td colSpan={9} style={{textAlign:"center",color:"var(--text3)",padding:24}}>No items added yet. Search for a product or click "+ New Item".</td></tr>}
              {items.map((item,idx)=>{
                const prod = products.find(p=>p.id===item.product_id);
                const fullyReceived = (item.received_qty||0) >= item.ordered_qty;
                return (
                  <tr key={idx} style={{background:fullyReceived?"rgba(34,197,94,.05)":""}}>
                    <td style={{color:"var(--text3)",fontWeight:600}}>{idx+1}</td>
                    <td>
                      {item.is_new
                        ? <input value={item.product_name} onChange={e=>updateItem(idx,"product_name",e.target.value)} style={{width:"100%",minWidth:180}}/>
                        : <div>
                            <div style={{fontSize:13,fontWeight:500}}>{item.product_name}</div>
                            {prod&&<div style={{fontSize:10,color:"var(--text3)"}}>In stock: {prod.stock} · Cost: {fmt(prod.cost)}</div>}
                          </div>
                      }
                    </td>
                    <td>
                      {item.is_new
                        ? <input value={item.barcode} onChange={e=>updateItem(idx,"barcode",e.target.value)} style={{width:110}}/>
                        : <code style={{fontSize:11,color:"var(--text3)"}}>{item.barcode||"—"}</code>
                      }
                    </td>
                    <td style={{textAlign:"center"}}>
                      <input type="number" min={1} value={item.ordered_qty} onChange={e=>updateItem(idx,"ordered_qty",e.target.value)} style={{width:70,textAlign:"center"}}/>
                    </td>
                    <td style={{textAlign:"center"}}>
                      <input type="number" min={0} max={item.ordered_qty} value={item.received_qty||0}
                        onChange={e=>updateItem(idx,"received_qty",Math.min(+item.ordered_qty, Math.max(0,+e.target.value)))}
                        style={{width:70,textAlign:"center",
                          background:fullyReceived?"rgba(34,197,94,.1)":+item.received_qty>0?"rgba(255,170,0,.1)":"",
                          borderColor:fullyReceived?"var(--success)":+item.received_qty>0?"var(--warn)":"var(--border)"
                        }}/>
                      {fullyReceived&&<div style={{fontSize:9,color:"var(--success)",marginTop:1}}>✓ complete</div>}
                    </td>
                    <td style={{textAlign:"right"}}>
                      <input type="number" min={0} value={item.unit_cost} onChange={e=>updateItem(idx,"unit_cost",e.target.value)} placeholder="0" style={{width:100,textAlign:"right"}}/>
                    </td>
                    <td style={{textAlign:"right",fontWeight:600,color:"var(--accent)"}}>{fmt((+item.ordered_qty||0)*(+item.unit_cost||0))}</td>
                    <td><input value={item.note||""} onChange={e=>updateItem(idx,"note",e.target.value)} placeholder="Optional" style={{width:110}}/></td>
                    <td><button className="btn btn-danger btn-xs" onClick={()=>removeItem(idx)}>✕</button></td>
                  </tr>
                );
              })}
              {items.length>0&&(
                <tr style={{background:"var(--bg3)",fontWeight:700}}>
                  <td colSpan={3} style={{textAlign:"right",paddingRight:12,fontSize:12}}>Totals:</td>
                  <td style={{textAlign:"center"}}>{totalUnits} units</td>
                  <td style={{textAlign:"center",color:"var(--success)"}}>{items.reduce((s,i)=>s+(+i.received_qty||0),0)} received</td>
                  <td></td>
                  <td style={{textAlign:"right",color:"var(--accent)"}}>{fmt(items.reduce((s,i)=>s+(+i.ordered_qty||0)*(+i.unit_cost||0),0))}</td>
                  <td colSpan={2}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"flex-end",gap:8,borderTop:"1px solid var(--border)"}}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving?"Saving…":"Save Purchase Order"}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── RECEIVE PO MODAL ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ReceivePOModal({ po, products, setProducts, setPurchaseOrders, showToast, onClose }) {
  const [items, setItems] = useState((po.items||[]).map(i=>({...i, receive_qty: i.ordered_qty-(i.received_qty||0), new_cost: i.unit_cost||""})));
  const [processing, setProcessing] = useState(false);

  const updateItem = (idx,key,val) => setItems(prev=>prev.map((it,i)=>i===idx?{...it,[key]:val}:it));

  const processReceiving = async () => {
    const receiving = items.filter(i=>(+i.receive_qty||0)>0);
    if (!receiving.length) { showToast("Enter qty for at least one item","err"); return; }
    setProcessing(true);

    for (const item of receiving) {
      const receiveQty = parseInt(item.receive_qty)||0;
      const newCost = parseFloat(item.new_cost)||0;
      if (!receiveQty) continue;

      // Find existing product by product_id or barcode
      let prod = products.find(p=>p.id===item.product_id);
      if (!prod && item.barcode) prod = products.find(p=>p.barcode===item.barcode);

      if (prod) {
        // Weighted average cost calculation
        const existingValue = prod.stock * (prod.cost||0);
        const newValue = receiveQty * newCost;
        const newTotalStock = prod.stock + receiveQty;
        const avgCost = newTotalStock > 0 ? Math.round((existingValue + newValue) / newTotalStock) : newCost;

        await supabase.from("products").update({
          stock: newTotalStock,
          cost: avgCost,
          active: true,
          created_at: prod.created_at || new Date().toISOString()
        }).eq("id", prod.id);

        setProducts(prev=>prev.map(p=>p.id===prod.id?{...p,stock:newTotalStock,cost:avgCost,active:true}:p));

        // Log receipt
        await supabase.from("activity_log").insert({
          action:"stock_received",
          details:`Received ${receiveQty} units of ${prod.name} @ ${fmt(newCost)} (avg cost now ${fmt(avgCost)}) via PO ${po.id}`,
          entity_type:"product", entity_id:String(prod.id),
          user_name:"Admin", timestamp:new Date().toISOString()
        }).catch(()=>{});
      } else if (item.product_name) {
        // Create new product from PO item
        const newProd = {
          name: item.product_name,
          barcode: item.barcode||"",
          cost: newCost,
          wholesale_price: 0,
          retail_price: 0,
          stock: receiveQty,
          low_stock_threshold: 5,
          min_order: 1,
          active: true,
          created_at: new Date().toISOString()
        };
        const {data:saved} = await supabase.from("products").insert(newProd).select().single();
        if (saved) {
          setProducts(prev=>[saved,...prev]);
          await supabase.from("activity_log").insert({
            action:"product_added",
            details:`New product received via PO ${po.id}: ${item.product_name} x${receiveQty}`,
            entity_type:"product", entity_id:String(saved.id),
            user_name:"Admin", timestamp:new Date().toISOString()
          }).catch(()=>{});
        }
      }

      // Update PO item received qty
      const newReceived = (item.received_qty||0) + receiveQty;
      await supabase.from("purchase_order_items").update({received_qty:newReceived, unit_cost:newCost}).eq("id",item.id).catch(()=>{});
    }

    // Update PO status
    const updatedItems = items.map(i=>({...i, received_qty:(i.received_qty||0)+(parseInt(i.receive_qty)||0)}));
    const allReceived = updatedItems.every(i=>i.received_qty>=i.ordered_qty);
    const anyReceived = updatedItems.some(i=>(i.received_qty||0)>0);
    const newStatus = allReceived?"received":anyReceived?"partial":"open";
    await supabase.from("purchase_orders").update({status:newStatus}).eq("id",po.id);
    setPurchaseOrders(prev=>prev.map(p=>p.id===po.id?{...p,status:newStatus,items:updatedItems}:p));

    setProcessing(false);
    showToast(`Stock received — ${receiving.length} item(s) added to inventory`);
    onClose();
  };

  return (
    <div className="overlay">
      <div className="modal modal-lg">
        <div className="modal-head">
          <div>
            <h2>📥 Receive Stock</h2>
            <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>PO {po.id} · {po.supplier_name}</div>
          </div>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="alert alert-info" style={{marginBottom:14}}>Enter the quantity received and confirm/update the unit cost for each item. Cost will be averaged with existing inventory.</div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
              <th style={{textAlign:"left",padding:"8px 6px",fontSize:12}}>Product</th>
              <th style={{textAlign:"center",padding:"8px 6px",fontSize:12}}>Ordered</th>
              <th style={{textAlign:"center",padding:"8px 6px",fontSize:12}}>Previously Received</th>
              <th style={{textAlign:"center",padding:"8px 6px",fontSize:12}}>Receiving Now</th>
              <th style={{textAlign:"right",padding:"8px 6px",fontSize:12}}>Unit Cost (J$)</th>
              <th style={{textAlign:"right",padding:"8px 6px",fontSize:12}}>Subtotal</th>
            </tr></thead>
            <tbody>
              {items.map((item,idx)=>{
                const remaining = item.ordered_qty - (item.received_qty||0);
                const subtotal = (parseInt(item.receive_qty)||0)*(parseFloat(item.new_cost)||0);
                const prod = products.find(p=>p.id===item.product_id);
                return (
                  <tr key={idx} style={{borderBottom:"1px solid var(--border)"}}>
                    <td style={{padding:"10px 6px"}}>
                      <div style={{fontWeight:600,fontSize:13}}>{item.product_name}</div>
                      <div style={{fontSize:11,color:"var(--text3)"}}>{item.barcode||"No barcode"}{prod?` · In stock: ${prod.stock}`:""}</div>
                    </td>
                    <td style={{textAlign:"center",fontWeight:600}}>{item.ordered_qty}</td>
                    <td style={{textAlign:"center",color:"var(--text3)"}}>{item.received_qty||0}</td>
                    <td style={{textAlign:"center"}}>
                      <input type="number" min={0} max={remaining} value={item.receive_qty}
                        onChange={e=>updateItem(idx,"receive_qty",Math.min(remaining,Math.max(0,+e.target.value)))}
                        style={{width:70,textAlign:"center",padding:"4px 6px",border:"1px solid var(--border)",borderRadius:6}}/>
                      <div style={{fontSize:10,color:"var(--text3)",marginTop:2}}>{remaining} remaining</div>
                    </td>
                    <td style={{textAlign:"right"}}>
                      <input type="number" min={0} value={item.new_cost}
                        onChange={e=>updateItem(idx,"new_cost",e.target.value)}
                        style={{width:100,textAlign:"right",padding:"4px 6px",border:"1px solid var(--border)",borderRadius:6}}/>
                      {prod&&prod.cost>0&&<div style={{fontSize:10,color:"var(--text3)",marginTop:2}}>Current: {fmt(prod.cost)}</div>}
                    </td>
                    <td style={{textAlign:"right",fontWeight:600,color:"var(--accent)"}}>{fmt(subtotal)}</td>
                  </tr>
                );
              })}
              <tr style={{background:"var(--bg3)"}}>
                <td colSpan={3} style={{padding:"10px 6px",textAlign:"right",fontWeight:700}}>Total Receiving:</td>
                <td style={{textAlign:"center",fontWeight:700}}>{items.reduce((s,i)=>s+(parseInt(i.receive_qty)||0),0)} units</td>
                <td></td>
                <td style={{textAlign:"right",fontWeight:700,color:"var(--accent)"}}>{fmt(items.reduce((s,i)=>s+(parseInt(i.receive_qty)||0)*(parseFloat(i.new_cost)||0),0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={processReceiving} disabled={processing}>{processing?"Processing…":"Confirm Receipt & Update Inventory"}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── INCOMING STOCK PAGE (CUSTOMER FACING) ───────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function IncomingStockPage({ purchaseOrders }) {
  const incoming = purchaseOrders.filter(po=>po.status==="open"||po.status==="partial");
  const allItems = incoming.flatMap(po=>(po.items||[]).filter(i=>(i.ordered_qty-(i.received_qty||0))>0).map(i=>({...i,po_id:po.id,expected_date:po.expected_date,supplier_name:po.supplier_name})));
  const grouped = {};
  allItems.forEach(i=>{ const k=i.product_name||"Unknown"; if(!grouped[k])grouped[k]=[];grouped[k].push(i); });

  return (
    <div>
      <div className="alert alert-info" style={{marginBottom:16}}>📬 These items are on order and expected to arrive soon. Contact us to reserve or for more information.</div>
      {allItems.length===0&&<div className="empty"><div className="ei">📬</div><h3>No Incoming Stock</h3><p>Check back soon for new arrivals.</p></div>}
      <div className="prod-grid">
        {Object.entries(grouped).map(([name,items])=>{
          const earliest = items.map(i=>i.expected_date).filter(Boolean).sort()[0];
          const totalQty = items.reduce((s,i)=>s+(i.ordered_qty-(i.received_qty||0)),0);
          return (
            <div key={name} className="prod-card">
              <div className="prod-card-img"><span style={{fontSize:40}}>📬</span></div>
              <div className="prod-card-body">
                <div className="prod-card-name">{name}</div>
                {items[0]?.barcode&&<div style={{fontSize:10,color:"var(--text3)",marginBottom:4}}>Barcode: {items[0].barcode}</div>}
                <div className="prod-stock" style={{marginBottom:8}}>{totalQty} unit{totalQty!==1?"s":""} incoming</div>
                {earliest&&<div style={{fontSize:11,color:"var(--accent)",fontWeight:600,marginBottom:8}}>📅 Expected: {earliest}</div>}
                <div className="alert alert-info" style={{padding:"6px 10px",fontSize:11,marginBottom:0}}>Contact us to reserve · No pricing shown</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityLogPage({ activityLog, setActivityLog }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(()=>{
    supabase.from("activity_log").select("*").order("timestamp",{ascending:false}).limit(500)
      .then(({data})=>{ if(data) setLogs(data); setLoading(false); })
      .catch(()=>setLoading(false));
  },[]);

  const actionColors = {
    "product_added":"var(--success)","product_updated":"var(--accent)","product_archived":"var(--warn)",
    "product_deleted":"var(--danger)","customer_approved":"var(--success)","customer_created":"var(--accent2)",
    "customer_deleted":"var(--danger)","customer_revoked":"var(--warn)","order_placed":"var(--accent)",
    "order_status":"var(--accent2)","stock_take":"var(--accent4)","transfer":"var(--accent3)",
    "settings_updated":"var(--text3)"
  };

  const filtered = filter==="all" ? logs : logs.filter(l=>l.entity_type===filter);

  return (
    <div>
      <div className="alert alert-info" style={{marginBottom:16}}>📋 Read-only activity log — all actions are recorded and cannot be edited.</div>
      <div className="filter-bar" style={{marginBottom:16}}>
        {["all","product","customer","order","transfer","stock_take"].map(f=>(
          <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-secondary"}`} onClick={()=>setFilter(f)}>
            {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1).replace("_"," ")}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><h3>🕐 Activity Log ({filtered.length} entries)</h3></div>
        {loading?<div style={{padding:32,textAlign:"center",color:"var(--text3)"}}>Loading…</div>:(
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Time</th><th>Action</th><th>Details</th><th>User</th><th>Entity</th></tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No activity recorded yet.</td></tr>}
              {filtered.map(l=>(
                <tr key={l.id}>
                  <td style={{fontSize:11,color:"var(--text3)",whiteSpace:"nowrap"}}>{new Date(l.timestamp).toLocaleString()}</td>
                  <td><span className="badge" style={{background:`${actionColors[l.action]||"var(--accent)"}22`,color:actionColors[l.action]||"var(--accent)",fontSize:10}}>{l.action?.replace(/_/g," ")}</span></td>
                  <td style={{fontSize:12,maxWidth:400}}>{l.details}</td>
                  <td style={{fontSize:12,fontWeight:500}}>{l.user_name||"System"}</td>
                  <td style={{fontSize:11,color:"var(--text3)"}}>{l.entity_type}{l.entity_id?` · ${l.entity_id.slice(0,8)}…`:""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsPage({ products, orders, customers, transfers }) {
  const todayStr = new Date().toISOString().slice(0,10);
  const firstOfMonth = new Date(); firstOfMonth.setDate(1);
  const firstOfMonthStr = firstOfMonth.toISOString().slice(0,10);

  const getPreset = (p) => {
    const now = new Date();
    const d = (n) => { const d=new Date(now); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
    const m = (n) => { const d=new Date(now); d.setMonth(d.getMonth()+n); return d.toISOString().slice(0,10); };
    if(p==="today") return [todayStr, todayStr];
    if(p==="yesterday") return [d(-1), d(-1)];
    if(p==="7days") return [d(-7), todayStr];
    if(p==="30days") return [d(-30), todayStr];
    if(p==="thismonth") return [firstOfMonthStr, todayStr];
    if(p==="lastmonth") { const s=new Date(now.getFullYear(),now.getMonth()-1,1); const e=new Date(now.getFullYear(),now.getMonth(),0); return [s.toISOString().slice(0,10),e.toISOString().slice(0,10)]; }
    if(p==="thisyear") return [`${now.getFullYear()}-01-01`, todayStr];
    return [firstOfMonthStr, todayStr];
  };

  const [preset, setPreset] = useState("thismonth");
  const [fromDate, setFromDate] = useState(firstOfMonthStr);
  const [toDate, setToDate] = useState(todayStr);
  const [keyword, setKeyword] = useState("");
  const [reportType, setReportType] = useState("all");

  const applyPreset = (p) => {
    setPreset(p);
    if(p!=="custom") { const [f,t]=getPreset(p); setFromDate(f); setToDate(t); }
  };

  const filteredOrders = useMemo(()=>orders.filter(o=>{
    if(o.status==="cancelled") return false;
    if(o.date < fromDate || o.date > toDate) return false;
    if(keyword) {
      const kw=keyword.toLowerCase();
      if(!o.customer_name?.toLowerCase().includes(kw)&&!o.id?.toLowerCase().includes(kw)&&!o.payment_method?.toLowerCase().includes(kw)) return false;
    }
    return true;
  }),[orders,fromDate,toDate,keyword]);

  const activeProducts=products.filter(p=>p.active);
  const totalRevenue=filteredOrders.reduce((s,o)=>s+o.total,0);
  const totalTax=filteredOrders.reduce((s,o)=>s+o.tax_amount,0);
  const totalSubtotal=filteredOrders.reduce((s,o)=>s+o.subtotal,0);
  const avgOrderVal=filteredOrders.length?Math.round(totalRevenue/filteredOrders.length):0;
  const totalInventoryCost=activeProducts.reduce((s,p)=>s+p.cost*p.stock,0);
  const totalInventoryRetail=activeProducts.reduce((s,p)=>s+p.retail_price*p.stock,0);
  const potentialMargin=totalInventoryRetail-totalInventoryCost;

  const byCust={};
  filteredOrders.forEach(o=>{ byCust[o.customer_name]=(byCust[o.customer_name]||0)+o.total; });
  const custRanked=Object.entries(byCust).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxCustRev=custRanked[0]?.[1]||1;

  const byCat={};
  filteredOrders.forEach(o=>{ (o.items||[]).forEach(item=>{ const p=products.find(x=>x.id===item.product_id); const cat=p?.category||"Unknown"; byCat[cat]=(byCat[cat]||0)+item.qty*item.unit_price; }); });
  const catRanked=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxCatRev=catRanked[0]?.[1]||1;

  const byMonth={};
  filteredOrders.forEach(o=>{ const m=o.date?.slice(0,7)||"Unknown"; byMonth[m]=(byMonth[m]||0)+o.total; });
  const monthsSorted=Object.entries(byMonth).sort((a,b)=>a[0].localeCompare(b[0]));
  const maxMonth=Math.max(...monthsSorted.map(([,v])=>v),1);

  const byPay={};
  filteredOrders.forEach(o=>{ const m=o.payment_method||"Unspecified"; byPay[m]=(byPay[m]||0)+o.total; });

  const byProduct={};
  filteredOrders.forEach(o=>{ (o.items||[]).forEach(item=>{ if(!byProduct[item.product_id]) byProduct[item.product_id]={name:item.name,qty:0,revenue:0}; byProduct[item.product_id].qty+=item.qty; byProduct[item.product_id].revenue+=item.qty*item.unit_price; }); });
  const prodRanked=Object.values(byProduct).sort((a,b)=>b.revenue-a.revenue).slice(0,10);

  const downloadReport = (type) => {
    let rows, filename;
    if(type==="sales_by_date"){
      rows=[["Date","Invoice #","Customer","Payment","Subtotal","Tax","Total","Status"],
        ...filteredOrders.map(o=>[o.date,o.id,o.customer_name,o.payment_method||"—",o.subtotal,o.tax_amount,o.total,o.status])];
      filename=`sales_by_date_${fromDate}_${toDate}.csv`;
    } else if(type==="sales_by_customer"){
      rows=[["Customer","Orders","Total Revenue"],
        ...Object.entries(byCust).sort((a,b)=>b[1]-a[1]).map(([name,total])=>[name,filteredOrders.filter(o=>o.customer_name===name).length,total])];
      filename=`sales_by_customer_${fromDate}_${toDate}.csv`;
    } else if(type==="sales_by_product"){
      rows=[["Product","Units Sold","Revenue"],
        ...prodRanked.map(p=>[p.name,p.qty,p.revenue])];
      filename=`sales_by_product_${fromDate}_${toDate}.csv`;
    } else if(type==="sales_by_category"){
      rows=[["Category","Revenue"],
        ...catRanked.map(([cat,v])=>[cat,v])];
      filename=`sales_by_category_${fromDate}_${toDate}.csv`;
    } else if(type==="payments_by_type"){
      rows=[["Payment Method","Orders","Total"],
        ...Object.entries(byPay).map(([method,total])=>[method,filteredOrders.filter(o=>o.payment_method===method).length,total])];
      filename=`payments_by_type_${fromDate}_${toDate}.csv`;
    } else if(type==="tax"){
      rows=[["Date","Invoice #","Customer","Subtotal","Tax Rate","Tax Amount","Total"],
        ...filteredOrders.map(o=>[o.date,o.id,o.customer_name,o.subtotal,`${o.tax_rate||0}%`,o.tax_amount,o.total])];
      filename=`tax_report_${fromDate}_${toDate}.csv`;
    } else if(type==="unpaid"){
      const unpaid=orders.filter(o=>o.status==="pending"&&o.date>=fromDate&&o.date<=toDate);
      rows=[["Invoice #","Customer","Date","Total","Type"],
        ...unpaid.map(o=>[o.id,o.customer_name,o.date,o.total,o.type||"standard"])];
      filename=`unpaid_invoices_${fromDate}_${toDate}.csv`;
    }
    if(rows) downloadCSV(rows, filename);
  };

  const presets = [
    {id:"today",label:"Today"},{id:"yesterday",label:"Yesterday"},
    {id:"7days",label:"Last 7 Days"},{id:"30days",label:"Last 30 Days"},
    {id:"thismonth",label:"This Month"},{id:"lastmonth",label:"Last Month"},
    {id:"thisyear",label:"This Year"},{id:"custom",label:"Custom"},
  ];

  const reportRows = [
    {id:"sales_by_date",     label:"Sales by Date",            hasKeyword:false},
    {id:"sales_by_customer", label:"Sales by Customer",        hasKeyword:true, kwPlaceholder:"Customer name…"},
    {id:"payments_by_type",  label:"Payments Received by Type",hasKeyword:true, kwPlaceholder:"Payment type…"},
    {id:"sales_by_product",  label:"Sales by Product",         hasKeyword:true, kwPlaceholder:"Product name…"},
    {id:"sales_by_category", label:"Sales by Category",        hasKeyword:false},
    {id:"tax",               label:"Sales by Tax",             hasKeyword:false},
    {id:"unpaid",            label:"Unpaid Invoices",          hasKeyword:false},
  ];

  return (
    <div>
      {/* Summary stats */}
      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat c1"><div className="stat-label">Total Revenue</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalRevenue)}</div><div className="stat-sub">{filteredOrders.length} orders</div></div>
        <div className="stat c2"><div className="stat-label">Avg Order Value</div><div className="stat-val" style={{fontSize:18}}>{fmt(avgOrderVal)}</div></div>
        <div className="stat c3"><div className="stat-label">Tax Collected</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalTax)}</div></div>
        <div className="stat c4"><div className="stat-label">Inventory Cost</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalInventoryCost)}</div></div>
        <div className="stat c5"><div className="stat-label">Retail Value</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalInventoryRetail)}</div></div>
        <div className="stat c6"><div className="stat-label">Potential Margin</div><div className="stat-val" style={{fontSize:18}}>{fmt(potentialMargin)}</div></div>
      </div>

      {/* Date range selector */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><h3>📅 Date Range</h3>
          <div style={{fontSize:12,color:"var(--text3)"}}>{fromDate} → {toDate} · {filteredOrders.length} orders</div>
        </div>
        <div className="card-body">
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            {presets.map(p=>(
              <button key={p.id} className={`btn btn-sm ${preset===p.id?"btn-primary":"btn-secondary"}`} onClick={()=>applyPreset(p.id)}>{p.label}</button>
            ))}
          </div>
          {preset==="custom"&&(
            <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <div className="form-group" style={{margin:0}}>
                <label style={{fontSize:11}}>From</label>
                <input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} style={{width:"auto"}}/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label style={{fontSize:11}}>To</label>
                <input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} style={{width:"auto"}}/>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sales Reports table (POS-style) */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><h3>📊 Sales Reports</h3></div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th style={{width:220}}>Report Type</th>
                <th>Date Range</th>
                <th>Optional Keyword</th>
                <th style={{width:120}}></th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map(row=>(
                <tr key={row.id}>
                  <td style={{fontWeight:500,fontSize:13}}>{row.label}</td>
                  <td style={{fontSize:12,color:"var(--text2)"}}>📅 {fromDate} — {toDate}</td>
                  <td>
                    {row.hasKeyword&&<input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder={row.kwPlaceholder} style={{width:200,padding:"4px 8px",border:"1px solid var(--border)",borderRadius:6,fontSize:12}}/>}
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={()=>downloadReport(row.id)}>⬇ Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="two-col" style={{gap:18,marginBottom:18}}>
        <div className="card">
          <div className="card-header"><h3>Revenue by Month</h3><button className="btn btn-ghost btn-xs" onClick={()=>downloadReport("sales_by_date")}>⬇ CSV</button></div>
          <div className="card-body">
            <div className="chart-bar-wrap">
              {monthsSorted.map(([m,v])=>(
                <div key={m} className="chart-bar-row">
                  <span style={{fontSize:11,color:"var(--text2)"}}>{m}</span>
                  <div className="chart-bar-bg"><div className="chart-bar-fill" style={{width:`${(v/maxMonth)*100}%`,background:"var(--accent)"}}/></div>
                  <span style={{fontSize:11,textAlign:"right",color:"var(--accent)",fontWeight:600}}>{fmt(v)}</span>
                </div>
              ))}
              {monthsSorted.length===0&&<div style={{textAlign:"center",color:"var(--text3)",padding:24}}>No data in range.</div>}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Revenue by Category</h3><button className="btn btn-ghost btn-xs" onClick={()=>downloadReport("sales_by_category")}>⬇ CSV</button></div>
          <div className="card-body">
            <div className="chart-bar-wrap">
              {catRanked.map(([cat,v])=>(
                <div key={cat} className="chart-bar-row">
                  <span style={{fontSize:11,color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.slice(0,16)}{cat.length>16?"…":""}</span>
                  <div className="chart-bar-bg"><div className="chart-bar-fill" style={{width:`${(v/maxCatRev)*100}%`,background:"var(--accent2)"}}/></div>
                  <span style={{fontSize:11,textAlign:"right",color:"var(--accent2)",fontWeight:600}}>{fmt(v)}</span>
                </div>
              ))}
              {catRanked.length===0&&<div style={{textAlign:"center",color:"var(--text3)",padding:24}}>No sales data in range.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="two-col" style={{gap:18,marginBottom:18}}>
        <div className="card">
          <div className="card-header"><h3>Top Customers by Revenue</h3><button className="btn btn-ghost btn-xs" onClick={()=>downloadReport("sales_by_customer")}>⬇ CSV</button></div>
          <div className="card-body">
            <div className="chart-bar-wrap">
              {custRanked.map(([name,v])=>(
                <div key={name} className="chart-bar-row">
                  <span style={{fontSize:11,color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name?.slice(0,16)}{(name?.length||0)>16?"…":""}</span>
                  <div className="chart-bar-bg"><div className="chart-bar-fill" style={{width:`${(v/maxCustRev)*100}%`,background:"var(--accent3)"}}/></div>
                  <span style={{fontSize:11,textAlign:"right",color:"var(--accent3)",fontWeight:600}}>{fmt(v)}</span>
                </div>
              ))}
              {custRanked.length===0&&<div style={{textAlign:"center",color:"var(--text3)",padding:24}}>No data in range.</div>}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Top Products by Revenue</h3><button className="btn btn-ghost btn-xs" onClick={()=>downloadReport("sales_by_product")}>⬇ CSV</button></div>
          <div className="card-body">
            <div className="chart-bar-wrap">
              {prodRanked.map((p,i)=>{
                const maxProd=prodRanked[0]?.revenue||1;
                return (
                  <div key={i} className="chart-bar-row">
                    <span style={{fontSize:11,color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name?.slice(0,16)}{(p.name?.length||0)>16?"…":""}</span>
                    <div className="chart-bar-bg"><div className="chart-bar-fill" style={{width:`${(p.revenue/maxProd)*100}%`,background:"var(--accent4)"}}/></div>
                    <span style={{fontSize:11,textAlign:"right",color:"var(--accent4)",fontWeight:600}}>{p.qty} × {fmt(p.revenue)}</span>
                  </div>
                );
              })}
              {prodRanked.length===0&&<div style={{textAlign:"center",color:"var(--text3)",padding:24}}>No data in range.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Payment Methods</h3><button className="btn btn-ghost btn-xs" onClick={()=>downloadReport("payments_by_type")}>⬇ CSV</button></div>
        <div className="card-body" style={{display:"flex",flexWrap:"wrap",gap:12}}>
          {Object.entries(byPay).map(([method,total])=>(
            <div key={method} style={{flex:"1 1 180px",background:"var(--bg3)",borderRadius:8,padding:"12px 16px"}}>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:4}}>{method}</div>
              <div style={{fontSize:18,fontWeight:700,color:"var(--accent4)"}}>{fmt(total)}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>{filteredOrders.filter(o=>o.payment_method===method).length} orders</div>
            </div>
          ))}
          {Object.keys(byPay).length===0&&<div style={{textAlign:"center",color:"var(--text3)",padding:24,width:"100%"}}>No data in range.</div>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function SettingsPage({ settings, setSettings, showToast }) {
  const [f,setF]=useState({...settings});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <div style={{maxWidth:680}}>
      <div className="card">
        <div className="card-header"><h3>⚙️ Portal Settings</h3></div>
        <div className="card-body">
          <div className="section-title" style={{marginBottom:14}}>Company Information</div>
          <div className="form-row">
            <div className="form-group"><label>Company Name</label><input value={f.company_name||""} onChange={e=>s("company_name",e.target.value)}/></div>
            <div className="form-group"><label>Company Email</label><input value={f.company_email||""} onChange={e=>s("company_email",e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Phone</label><input value={f.company_phone||""} onChange={e=>s("company_phone",e.target.value)}/></div>
            <div className="form-group"><label>Currency Symbol</label><input value={f.currency||""} onChange={e=>s("currency",e.target.value)}/></div>
          </div>
          <div className="form-group"><label>Address</label><input value={f.company_address||""} onChange={e=>s("company_address",e.target.value)}/></div>

          <div className="divider"/>
          <div className="section-title" style={{marginBottom:14}}>Tax & Pricing</div>
          <div className="form-row">
            <div className="form-group"><label>Tax Rate (GCT %)</label>
              <input type="number" min={0} max={100} value={f.tax_rate||0} onChange={e=>s("tax_rate",+e.target.value)}/>
              <div className="input-hint">Applied at checkout and printed on invoices</div>
            </div>
            <div className="form-group"><label>Invoice ID Prefix</label><input value={f.invoice_prefix||"INV"} onChange={e=>s("invoice_prefix",e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Transfer ID Prefix</label><input value={f.transfer_prefix||"TRF"} onChange={e=>s("transfer_prefix",e.target.value)}/></div>
          </div>

          <div className="divider"/>
          <div className="section-title" style={{marginBottom:14}}>💳 Payment Information</div>
          <div className="alert alert-info" style={{marginBottom:12,fontSize:12}}>This info appears on every customer invoice — both when viewed online and when printed.</div>
          <div className="form-row">
            <div className="form-group"><label>Bank Name</label><input value={f.bank_name||""} onChange={e=>s("bank_name",e.target.value)} placeholder="e.g. NCB, Scotiabank"/></div>
            <div className="form-group"><label>Account Name</label><input value={f.bank_account_name||""} onChange={e=>s("bank_account_name",e.target.value)} placeholder="e.g. Pinglinks Cellular Ltd"/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Account Number</label><input value={f.bank_account_number||""} onChange={e=>s("bank_account_number",e.target.value)} placeholder="e.g. 123456789"/></div>
            <div className="form-group"><label>Routing / Sort Code</label><input value={f.bank_routing||""} onChange={e=>s("bank_routing",e.target.value)} placeholder="Optional"/></div>
          </div>
          <div className="form-group"><label>Additional Banking Notes</label><input value={f.bank_notes||""} onChange={e=>s("bank_notes",e.target.value)} placeholder="e.g. Please use invoice number as reference"/></div>
          <div className="form-group"><label>Payment Link URL</label>
            <input value={f.payment_link||""} onChange={e=>s("payment_link",e.target.value)} placeholder="e.g. https://lynk.com/pinglinks or https://paypal.me/pinglinks"/>
            <div className="input-hint">Customers will see a clickable "Pay Now" button on their invoice</div>
          </div>
          <div className="form-group"><label>Payment Link Label</label>
            <input value={f.payment_link_label||""} onChange={e=>s("payment_link_label",e.target.value)} placeholder="e.g. Pay via Lynk, Pay with PayPal"/>
          </div>

          <div className="divider"/>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button className="btn btn-primary" onClick={async()=>{ await supabase.from("site_settings").update(f).eq("id",1); setSettings(f); showToast("Settings saved"); }}>Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── STORES PAGE ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function StoresPage({ stores, setStores, showToast }) {
  const [show,setShow]=useState(false);
  const [editing,setEditing]=useState(null);
  const [f,setF]=useState({name:"",address:""});

  const openAdd=()=>{ setEditing(null); setF({name:"",address:""}); setShow(true); };
  const openEdit=(s)=>{ setEditing(s); setF({name:s.name,address:s.address}); setShow(true); };
  const save=async()=>{
    if(!f.name)return;
    if(editing){
      await supabase.from("stores").update({name:f.name,address:f.address}).eq("id",editing.id);
      setStores(p=>p.map(s=>s.id===editing.id?{...s,...f}:s));
    } else {
      const {data} = await supabase.from("stores").insert({name:f.name,address:f.address}).select().single();
      if(data) setStores(p=>[...p,data]);
    }
    showToast(editing?"Store updated":"Store added"); setShow(false);
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Store</button>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Store Name</th><th>Address</th><th>Actions</th></tr></thead>
            <tbody>{stores.map(s=>(
              <tr key={s.id}>
                <td style={{fontWeight:600}}>{s.name}</td>
                <td style={{fontSize:12,color:"var(--text2)"}}>{s.address}</td>
                <td><div className="tbl-actions">
                  <button className="btn btn-secondary btn-xs" onClick={()=>openEdit(s)}>Edit</button>
                  <button className="btn btn-danger btn-xs" onClick={async()=>{ if(window.confirm("Delete store?")){await supabase.from("stores").delete().eq("id",s.id);setStores(p=>p.filter(x=>x.id!==s.id));} }}>Del</button>
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      {show&&<div className="overlay"><div className="modal modal-sm">
        <div className="modal-head"><h2>{editing?"Edit Store":"Add Store"}</h2><button className="xbtn" onClick={()=>setShow(false)}>✕</button></div>
        <div className="modal-body">
          <div className="form-group"><label>Store Name *</label><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))}/></div>
          <div className="form-group"><label>Address</label><input value={f.address} onChange={e=>setF(p=>({...p,address:e.target.value}))}/></div>
        </div>
        <div className="modal-foot"><button className="btn btn-secondary" onClick={()=>setShow(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save</button></div>
      </div></div>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── CATALOG PAGE (BUYER) ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function CatalogPage({ products, user, addToCart, cart, settings }) {
  const [search,setSearch]=useState("");
  const [filterCat,setFilterCat]=useState("All");
  const [filterBrand,setFilterBrand]=useState("All");
  const [sortBy,setSortBy]=useState("name");
  const [tab,setTab]=useState("all");
  const isConsignment=user?.customer_type==="consignment";

  if(!user?.approved) return (
    <div className="empty"><div className="ei">⏳</div><h3 style={{marginBottom:8}}>Account Pending Approval</h3><p>Your wholesale account is being reviewed. Contact us at +1-876-276-7464 to expedite.</p></div>
  );

  const visible=products.filter(p=>p.active&&p.stock>0&&!p.is_clearance);
  const newArrivals=visible.filter(p=>isNewArrival(p));

  const showProducts = tab==="new" ? newArrivals : visible;
  const categories=["All",...new Set(showProducts.map(p=>p.category).filter(Boolean)).values()].sort();
  const brands=["All",...new Set(showProducts.map(p=>p.brand).filter(Boolean)).values()].sort();

  const filtered=showProducts.filter(p=>{
    const q=search.toLowerCase();
    return (filterCat==="All"||p.category===filterCat)
      &&(filterBrand==="All"||p.brand===filterBrand)
      &&(!q||p.name.toLowerCase().includes(q)||p.barcode?.includes(q)||p.brand?.toLowerCase().includes(q));
  }).sort((a,b)=>{
    if(sortBy==="price_asc") return (a.wholesale_price||0)-(b.wholesale_price||0);
    if(sortBy==="price_desc") return (b.wholesale_price||0)-(a.wholesale_price||0);
    if(sortBy==="name") return a.name.localeCompare(b.name);
    if(sortBy==="newest") return new Date(b.created_at)-new Date(a.created_at);
    return 0;
  });

  const inCart=(id)=>cart.find(i=>i.pid===id)?.qty||0;

  return (
    <div>
      {newArrivals.length>0&&(
        <div className="alert alert-ok mb-4">🆕 {newArrivals.length} new arrival{newArrivals.length>1?"s":""} in stock!</div>
      )}

      <div className="tabs">
        <button className={`tab ${tab==="all"?"active":""}`} onClick={()=>setTab("all")}>All Products</button>
        {newArrivals.length>0&&<button className={`tab ${tab==="new"?"active":""}`} onClick={()=>setTab("new")}>🆕 New Arrivals ({newArrivals.length})</button>}
      </div>

      <div className="filter-bar" style={{flexWrap:"wrap",gap:8}}>
        <div className="search-wrap" style={{flex:"1 1 200px"}}>
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, brand, barcode…"/>
        </div>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{width:"auto"}}>
          <option value="All">All Categories</option>
          {categories.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} style={{width:"auto"}}>
          <option value="All">All Brands</option>
          {brands.filter(b=>b!=="All").map(b=><option key={b}>{b}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:"auto"}}>
          <option value="name">Sort: A–Z</option>
          <option value="newest">Sort: Newest</option>
          <option value="price_asc">Sort: Price Low–High</option>
          <option value="price_desc">Sort: Price High–Low</option>
        </select>
      </div>

      {isConsignment&&<div className="alert alert-info mb-4">🛒 You are a consignment customer. Add items to cart and place your order — our team will confirm pricing with you.</div>}

      <div className="prod-grid">
        {filtered.map(p=>{
          const qty=inCart(p.id);
          const price=applyDiscount(p.wholesale_price,user.discount_pct||0);
          const savingPct=Math.round((1-price/p.retail_price)*100);
          return (
            <div key={p.id} className="prod-card">
              {p.is_new_arrival&&<div className="prod-tag"><span className="new-badge">NEW</span></div>}
              <div className="prod-card-img">
                {p.image_url ? <img src={p.image_url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:40}}>📱</span>}
              </div>
              <div className="prod-card-body">
                <div className="prod-card-brand">{p.brand}</div>
                <div className="prod-card-name">{p.name}</div>
                {p.barcode&&<div style={{fontSize:10,color:"var(--text3)",marginBottom:4}}>Barcode: {p.barcode}</div>}
                {!isConsignment&&<>
                  <div className="prod-price-row">
                    <span className="prod-ws">{fmt(price)}</span>
                    {user.discount_pct>0&&<span className="prod-retail">{fmt(p.wholesale_price)}</span>}
                  </div>
                  <div className="prod-srp">SRP: {fmt(p.retail_price)} · Save {savingPct}%</div>
                </>}
                <div className="prod-stock">{p.stock} in stock · Min: {p.min_order}{qty>0?` · ${qty} in cart`:""}</div>
                <div style={{fontSize:11,color:"var(--text2)",marginBottom:10,lineHeight:1.4}}>{p.description}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:11,color:"var(--text3)",whiteSpace:"nowrap"}}>Qty:</div>
                  <input
                    type="number"
                    min={p.min_order||1}
                    max={p.stock}
                    defaultValue={p.min_order||1}
                    id={`qty-${p.id}`}
                    style={{width:"70px",textAlign:"center",padding:"4px 6px",border:"1px solid var(--border)",borderRadius:6,fontSize:13,fontWeight:600}}
                    onClick={e=>e.stopPropagation()}
                  />
                  <div style={{fontSize:10,color:"var(--text3)"}}>min {p.min_order||1}</div>
                </div>
                <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>{
                  const inp=document.getElementById(`qty-${p.id}`);
                  const val=Math.max(p.min_order||1, Math.min(p.stock, parseInt(inp?.value)||p.min_order||1));
                  addToCart(p, val);
                }}>
                  {qty>0?"➕ Add More":"Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div className="empty" style={{gridColumn:"1/-1"}}><div className="ei">🔍</div><p>No products match your search.</p></div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── MY ORDERS PAGE (BUYER) ───────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function MyOrdersPage({ orders, settings, customers, setModal }) {
  if(!orders.length) return <div className="empty"><div className="ei">🧾</div><p>You haven't placed any orders yet.</p></div>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {orders.map(o=>(
        <div key={o.id} className="card">
          <div className="card-header">
            <div>
              <div style={{fontFamily:"Syne",fontWeight:700}}>{o.id}</div>
              <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>{o.date} · <span className={`badge ${o.type==="consignment"?"bo":"bb"}`}>{o.type||"standard"}</span></div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <StatusBadge status={o.status}/>
              <div style={{fontFamily:"Syne",fontWeight:700,fontSize:17,color:"var(--accent)"}}>{fmt(o.total)}</div>
              <button className="btn btn-secondary btn-xs" onClick={()=>setModal({type:"viewInvoice",data:o})}>View Invoice</button>
            </div>
          </div>
          <div className="card-body">
            {(o.items||[]).map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
                <span>{item.name}</span>
                <span style={{color:"var(--text2)"}}>× {item.qty} = {fmt(item.qty*item.unit_price)}</span>
              </div>
            ))}
            <div style={{marginTop:10,paddingTop:8,borderTop:"1px solid var(--border)",display:"flex",justifyContent:"flex-end",gap:16}}>
              <span style={{fontSize:12,color:"var(--text2)"}}>Subtotal: {fmt(o.subtotal)} · GCT ({o.tax_rate}%): {fmt(o.tax_amount)}</span>
            </div>
            {o.type==="consignment"&&o.consignment_due&&<div style={{marginTop:8,fontSize:12,color:"var(--warn)"}}>📋 Consignment due: {o.consignment_due}</div>}
            {o.notes&&<div style={{marginTop:6,fontSize:12,color:"var(--text2)"}}>Note: {o.notes}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── ACCOUNT PAGE (BUYER) ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AccountPage({ user, customers, showToast, isAdmin }) {
  const c=customers.find(x=>x.id===user.id)||user;
  const [showPwd,setShowPwd]=useState(false);
  const [pwd,setPwd]=useState({current:"",newPwd:"",confirm:""});
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState("");

  const changePassword = async () => {
    setErr("");
    if (!pwd.newPwd || pwd.newPwd.length < 6) { setErr("New password must be at least 6 characters."); return; }
    if (pwd.newPwd !== pwd.confirm) { setErr("Passwords do not match."); return; }
    setBusy(true);
    // Re-authenticate first with current password
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email, password: pwd.current });
    if (signInErr) { setErr("Current password is incorrect."); setBusy(false); return; }
    const { error } = await supabase.auth.updateUser({ password: pwd.newPwd });
    if (error) { setErr(error.message); setBusy(false); return; }
    setBusy(false);
    setPwd({current:"",newPwd:"",confirm:""});
    setShowPwd(false);
    showToast("Password changed successfully!");
  };

  return (
    <div style={{maxWidth:500}}>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header"><h3>👤 My Account</h3></div>
        <div className="card-body">
          <div style={{display:"flex",gap:16,marginBottom:20,alignItems:"center"}}>
            <div className="avatar" style={{width:56,height:56,fontSize:22}}>{(c.name||"U")[0]}</div>
            <div>
              <div style={{fontWeight:700,fontSize:18}}>{c.company||c.name}</div>
              <div style={{fontSize:12,color:"var(--text2)"}}>{user.email}</div>
              <div style={{fontSize:12,color:"var(--text2)"}}>{c.name}</div>
              {!isAdmin&&<div style={{marginTop:4}}>{c.approved?<span className="badge bg">✓ Approved</span>:<span className="badge bw">⏳ Pending</span>}</div>}
              {isAdmin&&<div style={{marginTop:4}}><span className="badge bb">Administrator</span></div>}
            </div>
          </div>
          {!isAdmin&&<>
            <div className="form-row">
              <div className="form-group"><label>Account Type</label><input value={c.customer_type==="consignment"?"Consignment Customer":"Upfront Buyer"} readOnly/></div>
              <div className="form-group"><label>Discount</label><input value={`${c.discount_pct||0}%`} readOnly/></div>
            </div>
            <div className="form-group"><label>Tax ID / TRN</label><input value={c.tax_id||""} readOnly/></div>
          </>}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>🔒 Change Password</h3>
          {!showPwd&&<button className="btn btn-secondary btn-sm" onClick={()=>setShowPwd(true)}>Change Password</button>}
        </div>
        {showPwd&&<div className="card-body">
          {err&&<div className="alert alert-err">{err}</div>}
          <div className="form-group"><label>Current Password</label><input type="password" value={pwd.current} onChange={e=>setPwd(p=>({...p,current:e.target.value}))}/></div>
          <div className="form-group"><label>New Password</label><input type="password" value={pwd.newPwd} onChange={e=>setPwd(p=>({...p,newPwd:e.target.value}))}/></div>
          <div className="form-group"><label>Confirm New Password</label><input type="password" value={pwd.confirm} onChange={e=>setPwd(p=>({...p,confirm:e.target.value}))}/></div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-primary" onClick={changePassword} disabled={busy}>{busy?"Saving…":"Save New Password"}</button>
            <button className="btn btn-ghost" onClick={()=>{setShowPwd(false);setErr("");}}>Cancel</button>
          </div>
        </div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── CART MODAL ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function CartModal({ cart, updateQty, subtotal, tax, total, taxRate, user, onClose, onPlace, customers }) {
  const [orderType,setOrderType]=useState("standard");
  const [payMethod,setPayMethod]=useState("cash");
  const [notes,setNotes]=useState("");
  const [consignDue,setConsignDue]=useState("");
  const isConsignment=user?.customer_type==="consignment";
  const customer=customers.find(c=>c.id===user.id);
  const minVal=customer?.min_order_value||0;
  const meetsMin=subtotal>=minVal;

  const payMethods=["cash","bank_transfer","cheque","credit_card","wire_transfer","other"];

  return (
    <div className="overlay"><div className="modal modal-md">
      <div className="modal-head"><h2>🛒 Your Cart</h2><button className="xbtn" onClick={onClose}>✕</button></div>
      <div className="modal-body">
        {cart.length===0?<div className="empty"><div className="ei">🛒</div><p>Cart is empty.</p></div>:<>
          {cart.map(item=>(
            <div key={item.pid} className="cart-item">
              <div style={{fontSize:24,width:36,textAlign:"center"}}>📱</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                <div style={{fontSize:11,color:"var(--text2)"}}>{fmt(item.price)} each</div>
              </div>
              <div className="qty-ctrl">
                <button className="qbtn" onClick={()=>updateQty(item.pid,item.qty-1)}>−</button>
                <span style={{fontSize:13,fontWeight:600,minWidth:24,textAlign:"center"}}>{item.qty}</span>
                <button className="qbtn" onClick={()=>updateQty(item.pid,item.qty+1)}>+</button>
              </div>
              <div style={{minWidth:72,textAlign:"right",fontWeight:600,fontSize:13}}>{fmt(item.price*item.qty)}</div>
            </div>
          ))}
          <div className="divider"/>
          <div className="total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div className="total-row"><span>GCT ({taxRate}%)</span><span>{fmt(tax)}</span></div>
          <div className="total-row grand"><span>Total</span><span>{fmt(total)}</span></div>
          {!meetsMin&&<div className="alert alert-warn mt-3">Minimum order value is {fmt(minVal)}. Add {fmt(minVal-subtotal)} more to checkout.</div>}
          <div className="divider"/>
          {!isConsignment&&<>
            <div className="form-group"><label>Order Type</label>
              <select value={orderType} onChange={e=>setOrderType(e.target.value)}>
                <option value="standard">Standard Order</option>
                <option value="consignment">Consignment Order</option>
              </select>
            </div>
            {orderType==="consignment"&&<div className="form-group"><label>Consignment Due Date</label><input type="date" value={consignDue} onChange={e=>setConsignDue(e.target.value)} min={today()}/></div>}
            <div className="form-group"><label>Payment Method</label>
              <select value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                {payMethods.map(m=><option key={m} value={m}>{m.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
              </select>
            </div>
          </>}
          <div className="form-group"><label>Notes (optional)</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2}/></div>
        </>}
      </div>
      {cart.length>0&&<div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Continue Shopping</button>
        <button className="btn btn-primary" disabled={!meetsMin} onClick={()=>onPlace(isConsignment?"—":payMethod,notes,isConsignment?"consignment":orderType,consignDue)}>
          Place Order →
        </button>
      </div>}
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── ORDER SUCCESS MODAL ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function OrderSuccessModal({ order, settings, customers, onClose }) {
  const customer=customers.find(c=>c.id===order.customer_id);
  return (
    <div className="overlay"><div className="modal modal-sm">
      <div className="modal-body" style={{textAlign:"center",padding:"36px 28px"}}>
        <div style={{fontSize:48,marginBottom:14}}>✅</div>
        <h2 style={{marginBottom:6}}>Order Placed!</h2>
        <p style={{color:"var(--text2)",marginBottom:14,fontSize:13}}>Your order has been received and is being processed.</p>
        <div style={{background:"var(--bg3)",borderRadius:10,padding:"14px 18px",marginBottom:18,textAlign:"left"}}>
          <div style={{fontSize:11,color:"var(--text3)",marginBottom:3}}>INVOICE</div>
          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:18}}>{order.id}</div>
          <div style={{marginTop:6,fontSize:13,color:"var(--text2)"}}>Total: <strong style={{color:"var(--accent)"}}>{fmt(order.total)}</strong></div>
          <div style={{fontSize:12,color:"var(--text2)"}}>GCT ({order.tax_rate}%): {fmt(order.tax_amount)}</div>
          {order.type==="consignment"&&order.consignment_due&&<div style={{marginTop:4,fontSize:12,color:"var(--warn)"}}>Consignment due: {order.consignment_due}</div>}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-secondary" onClick={()=>printInvoice(order,customer,settings)}>🖨 Print Invoice</button>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── INVOICE VIEW MODAL ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function InvoiceViewModal({ order, settings, customers, onClose }) {
  const customer=customers.find(c=>c.id===order.customer_id);
  const exportCSV=()=>{
    const rows=[
      ["Invoice",order.id],["Customer",order.customer_name],["Date",order.date],["Status",order.status],["Payment",order.payment_method||"—"],[""],
      ["Product","Barcode","Qty","Unit Price","Total"],
      ...(order.items||[]).map(i=>[i.name,i.barcode||"—",i.qty,i.unit_price,i.qty*i.unit_price]),
      [""],["Subtotal","",""," ",order.subtotal],[`GCT (${order.tax_rate}%)`,""," ","",order.tax_amount],["Total","","","",order.total]
    ];
    downloadCSV(rows,`${order.id}.csv`);
  };

  return (
    <div className="overlay"><div className="modal modal-lg">
      <div className="modal-head">
        <h2>Invoice {order.id}</h2>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button className="btn btn-secondary btn-sm" onClick={exportCSV}>⬇ Excel/CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>printInvoice(order,customer,settings)}>🖨 PDF/Print</button>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="modal-body">
        <div className="two-col" style={{marginBottom:20}}>
          <div>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Bill To</div>
            <div style={{fontWeight:700,fontSize:15}}>{customer?.company||order.customer_name}</div>
            <div style={{fontSize:12,color:"var(--text2)"}}>{customer?.tax_id?`TRN: ${customer.tax_id}`:""}</div>
            <div style={{fontSize:12,color:"var(--text2)"}}>{customer?.email||""}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Invoice Details</div>
            <div style={{fontSize:12}}>Date: {order.date}</div>
            <div style={{fontSize:12}}>Payment: {order.payment_method||"—"}</div>
            <div style={{fontSize:12,marginTop:4}}><StatusBadge status={order.status}/></div>
          </div>
        </div>

        <div className="tbl-wrap" style={{marginBottom:16}}>
          <table>
            <thead><tr><th>Barcode</th><th>Product</th><th>Qty</th><th style={{textAlign:"right"}}>Unit Price</th><th style={{textAlign:"right"}}>Total</th></tr></thead>
            <tbody>{(order.items||[]).map((item,i)=>(
              <tr key={i}>
                <td><code style={{fontSize:10}}>{item.barcode||"—"}</code></td>
                <td style={{fontWeight:500}}>{item.name}</td>
                <td>{item.qty}</td>
                <td style={{textAlign:"right"}}>{fmt(item.unit_price)}</td>
                <td style={{textAlign:"right",fontWeight:600}}>{fmt(item.qty*item.unit_price)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{minWidth:240}}>
            <div className="total-row"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
            <div className="total-row"><span>GCT ({order.tax_rate}%)</span><span>{fmt(order.tax_amount)}</span></div>
            <div className="total-row grand"><span>Total</span><span>{fmt(order.total)}</span></div>
          </div>
        </div>
        {order.notes&&<div style={{marginTop:12,padding:12,background:"var(--bg3)",borderRadius:7,fontSize:12,color:"var(--text2)"}}><strong>Notes:</strong> {order.notes}</div>}
        {order.type==="consignment"&&order.consignment_due&&<div style={{marginTop:8,fontSize:12,color:"var(--warn)"}}>📋 Consignment settlement due: {order.consignment_due}</div>}

        {/* Bank transfer + payment link */}
        {(settings.bank_name||settings.payment_link)&&(
          <div style={{marginTop:20,borderTop:"2px solid var(--border)",paddingTop:16,display:"grid",gridTemplateColumns:settings.bank_name&&settings.payment_link?"1fr 1fr":"1fr",gap:16}}>
            {settings.bank_name&&(
              <div style={{background:"var(--bg3)",borderRadius:8,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text3)",marginBottom:10}}>🏦 Bank Transfer Details</div>
                <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 12px",fontSize:13}}>
                  <span style={{color:"var(--text3)"}}>Bank:</span><span style={{fontWeight:600}}>{settings.bank_name}</span>
                  {settings.bank_account_name&&<><span style={{color:"var(--text3)"}}>Account Name:</span><span style={{fontWeight:600}}>{settings.bank_account_name}</span></>}
                  {settings.bank_account_number&&<><span style={{color:"var(--text3)"}}>Account #:</span><span style={{fontWeight:600,fontFamily:"monospace",letterSpacing:1}}>{settings.bank_account_number}</span></>}
                  {settings.bank_routing&&<><span style={{color:"var(--text3)"}}>Sort Code:</span><span style={{fontWeight:600}}>{settings.bank_routing}</span></>}
                </div>
                {settings.bank_notes&&<div style={{marginTop:8,fontSize:11,color:"var(--accent)",fontStyle:"italic"}}>{settings.bank_notes}</div>}
              </div>
            )}
            {settings.payment_link&&(
              <div style={{background:"var(--bg3)",borderRadius:8,padding:"14px 16px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text3)"}}>💳 Online Payment</div>
                <div style={{fontSize:22,fontWeight:700,color:"var(--accent)"}}>{fmt(order.total)}</div>
                <a href={settings.payment_link} target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-block",padding:"10px 24px",background:"var(--accent)",color:"#fff",borderRadius:8,fontWeight:700,fontSize:14,textDecoration:"none",textAlign:"center",width:"100%",boxSizing:"border-box"}}>
                  {settings.payment_link_label||"Pay Now"} →
                </a>
                <div style={{fontSize:10,color:"var(--text3)",wordBreak:"break-all"}}>{settings.payment_link}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── EMAIL MODAL ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function EmailModal({ order, customers, settings, onClose, showToast }) {
  const customer=customers.find(c=>c.id===order.customer_id);
  const [to,setTo]=useState(customer?.email||"");
  const [subject,setSubject]=useState(`Invoice ${order.id} from ${settings.company_name}`);
  const [body,setBody]=useState(`Dear ${customer?.company||order.customer_name},\n\nPlease find attached your invoice ${order.id} for ${order.total?.toLocaleString?`J$${order.total.toLocaleString()}`:""}.\n\nThank you for your business.\n\n${settings.company_name}\n${settings.company_phone}`);

  const send=()=>{ showToast(`Email queued to ${to} (connect email service to send live)`); onClose(); };

  return (
    <div className="overlay"><div className="modal modal-md">
      <div className="modal-head"><h2>📧 Email Invoice</h2><button className="xbtn" onClick={onClose}>✕</button></div>
      <div className="modal-body">
        <div className="alert alert-info">To send live emails, connect a service like SendGrid or Resend to this portal.</div>
        <div className="form-group"><label>To</label><input value={to} onChange={e=>setTo(e.target.value)}/></div>
        <div className="form-group"><label>Subject</label><input value={subject} onChange={e=>setSubject(e.target.value)}/></div>
        <div className="form-group"><label>Message</label><textarea value={body} onChange={e=>setBody(e.target.value)} rows={7}/></div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={send}>Send Email</button>
      </div>
    </div></div>
  );
}
