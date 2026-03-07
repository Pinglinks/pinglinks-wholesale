import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE CONFIG ───────────────────────────────────────────────────────────
const SUPABASE_URL = "https://hzykmhxsilbfkgzjkqoy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6eWttaHhzaWxiZmtnemprcW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjI4NDQsImV4cCI6MjA4NzczODg0NH0.jQ_Pey7cYwe6ZyqiMLMvnCj_FPdEuN9OXRAEqeFbYQQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUserName = "Admin"; // updated on login, used for activity log attribution

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const LOGO_SRC = new URL("./logo.png", import.meta.url).href;

// Set favicon dynamically from logo
(function() {
  const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAART0lEQVR4nO1aa7RdVXX+5lxrn3PuPfeRm1zyIE+CIQTlGUEBqTyqdgxwUGkHWqzKqC1UrG+solURxQJFClag2FGKxFbkEaUQAUGMiKKEBAmPECBAnjcJue/z2nuvNb/+OOeSB0kgIfQXc5wfd5+x71prrvnNb74O8Ka8KW/Km/KmvA6RN3oDVVXVvfhHkjHGfX6ePZO9O/oeyRtnARFRMr7jmPmnnnpaW1sbCAE4tieJ1rNw7EEAkgCjGX//0G/vWHQPW1/9f4s45wF866KvmeXcK9m8aV0hSURE5A3H+Y7inANw/vmfJhnyRpZWs7SWpbWtf2TVLKu+/Jin9bResZiRHB3p37D+hUV3/vTdJxwnIjuAUADZRt6Q06uqiMycMbUy8lLIqjEbZawyVBirDK2PxarFqjUfY9XyETJu2rTmvPM+PnPG9HHdXdvexW4OKiJ+nysgImb2pS9+ptzZGxpbXJKABjThT4iAEGyFtUUTLa1ZvfK973v/ypWrCkkCoFxuF5FKpdokopbzQBKnhWLBmt+Y1RvpPraCqpKcO2fWsqW/KxYLIiYqLbeV5qEF2zolaUZNyn/+/tNvv/O+sz9y5iX/cmlWG4YKzAYGRh56aMk3vvnPL/UPOOdCCFdc9s0PffjjWV73wpBV+/r69u35W+hf8J9XktVQW8e8z+JGxg20PrL1Metj3MjYx9AXGuvJ0fvvvVkEqnr1VReTxnwzOUgboA2SvP3WG0WaWMIjD95DGpmRFYYt5Mi+hJCqRotHHDb3Q2edYVm/elJMRCgmL6MAEAjEgQGEiDBWLrzwchKkvW3eHHIoNGpOBZAYKb527DuO6OooD49WJ02ccMCsKaz3WTQBwAhiX/sA8fWv/IMvlUKt3xcSoIl4g7Q4HwSooIEx5Llv67lj4cIHfvswIF2dbXNmT0U+osxABYEQtVgeHtySZTmAuQfO7Nmv0+pVaTITlWb7TAHnXIzx+HceefoHTo31fudBxBb2hQClFcAARsKBQRWhMfLNb/2biJCc95bZU2bsDwuu4KAKEW330OSqq6+vpxmAo95+jBSmuPxFeA8A6pH4faZAM15eeME5miBkKbyDAOIgaIFnzHcJEs7y3Ld3/+SGnyz941OFJMnyfPr0SS9t2ZyNjjpVdb5ab7ywZsMN19+64JY7vU9CyGdMHf/SpufzoQ2qCrBSy5584ul9wkLinMYY33PSMb+4+4aY1lxB4EABBKIEO0EHGQJLAGip0UmULG0cdcwHn352tYiYsdxeKhWcEQBFNE3zar0BoGkfER1XLjmvka3LqNWzLMv3iQVIQlUu/NLfwkUggzg0U58mWGUYcKABdZrAgqVp0tlz43U/WvHMi03sAajW6tXadus65wQIMQIgbbBS22Fj7/cFhLxzIcYPnPau406eH0f7XdEBxhbntLifEGELSIziVCqb1l1yxYLm7TbXmXfQzK6OYowGgarr3zKyak0fABGQ8F4Pf+uBPvGW501krl27eeOWwX2ggJGJ99/4wkdpDWgOYfMjglbSSQEVQgZCJlg+5LvK112x4IU1G51TMwNQSJI7/+eS2QdPQ5rBKSiNPL/tlvvO/eL36o2UtLfMmLJk8Q3S1onaZogHdWCkdu21N73efN05Z2ZnnfHuw4+bZ5UR9YEuQAMkEBmQCTIwE6aMORgs2+Rc3r969eVX3yIiNDZTnenTJk2b1M3KsOUNpnWmlULMPvyJMz58xolNDQ+dO0sSyxq1mOdsVK0xOn6/iV+94O9elwWaAGgrli747JnMa3DN63fUdiACI0QUKkBQxABzlsGNK119za0bNw000e9UAc6ZNaXQmYTRijqhhxR8qKaSJXMPnNHca/4Rc4AMMQpMLBeoDayN8fXFAacaYjz7gyfMnT87hG5XGgQGBAI4IIWkgMEEUBoRc7LblYobVqy68gc/b+Z8zVsAcNjcKQFpzKrw3qhiARaSglu6/LnmXoccMjU0qpbTaBZykolzWngdTiyCSOvuKH/506dbWpFiL7QIC5BRsgqhwEChANEg+1F9bKRJe/bdqxYODo28TD5NHz7xnYf4zsQHj7ZxaJ+M2jqY3fHD/1646AEAHW3F4448wLeJL6QoTUKjAmSox0svv3XvFVDVGO0Tf33SjEMmh0q/ujqciOaAQkyEhAedxJxGWj/jBO+z55et/I8fPaAqZq2CPZo5dSufXd+4/p6Ypa69BCbr1vf9+qEVP7tnWdNK5XLbvfc9lhQVFuE0RHth7ZZF9z764NKVexnIVIRg7/hxj9/3tf1m9NAnmkRxGTSHeiqFBBNSJOaMnrladdR39P79Odddd9MDzmmMts1qzrjTBkQzheK2bLvDJe6lBVQQTM+br5Ne+H5jc+KnT4yTD3IdB0N7BbkgBRxAodHImEfr8V0znnrosRtv+52qe/n6m/LK06tTr5LlsRVNXnH6xDuSYe+cWASRnFIufPLoGgcHCiUgfwb1B+nHW9thTucLDgSC0YQGixLbwaJI+PaVd9Tz4J0G25pdA/Cqs6d2uGIJBGOsNkLfxuEsoln2Gjmlt2Pq5O4YogAibmC48sKGYQCCvSopVRBNP3+8229WGrrV9YDTStqRIwwIFhMPWjxZ5M/ANtigmIuN/sSPLlk8eutdj6pq2BY8Kmacd+CkJfd9IykkZinSSq2er9k4fPHld9101+M+8ZaHK79z9plnHRtGal4dQqXWiA/+YfXfnP/jvo2b91gBFRhxQLc7511mbVG7gTIkpIyEF1EPgcRfWFglyRdgJTQ20SbAkosuuzk3a5Zs2xhTAL71oMnF3hnZwIpETFzo6u592+SJP7yq45En+p5buyVRf1BjuT34ZGhEljxqVa8d753T+9X3Tz3vB3ujgASTL70r6ZqSxja4TmGZomaEKokcbAOp6apYuViLHwtuduJHF9/17KJfr1SVHbqFTQ45cl4vG0+QLjqyPozK8/n6J9rrm+dNzJ9bi6k9bnb9d7I8FBLAgRExQ3gcB9U94PZMARVEwyHjCx89LlopyjhhB9CmVqQkgBYgjoxiAXniRtbH4WvR8zG29V70r4s4lptuK5EE5NC37c/RDeHZR1BZh5Eh6xzxw0a4Fzd5ALN7UZ6TpIPQAFFhglCP7eqeebQE1PZAgWZTyagXnODaJtZjWbQLaBcUAU9xCkmETiCMhnpATbl5MOn/3s+fnP+rJRtUEW07MhEBjZ2l4hHZw7rs+XIjhQAeaEtQKn3vZ+6J9VVAj53r3Ljg0oiig4sIWii5554ufPdXmciesJCKmGH+pMKZx8RYMOkStFNKQELxTTQIKIQiEDlZhTZcnhYuumYZxHYVcSZ26poVz6/rBgrtYhYEa5b4nz4qNz1QVxjFDyH530eY9amoijK2J39YZgvuzzdXM5E9ae46kUj92Zml0/+0Hnrh9wcnmnSLtVMKzczOk0BmMkL2M6xHUtUfLSx9ZEHq1KLZTpctemdwMUaQAlircIiAAuZEIh22ry4AQ4tO+Fot4ASROGFa4bSjciuaa6K/BCYQ12yVKCGIhgZRASsqXmtb9Dv3BpGw0wazQiFMgwH2cqsajIB4hybbRhKwZi9gzOfplEY08fgaFRACAve1E9VNaIQuuE6iDJQgCaFCwGiSEw1BjawijKBg7vr73YqNNaeIO7t9CgH3xZPaDpiL3CAOarJ6yG5eHFZvajiVaJzVW/z8me30mSQqkVnGh5/gbb9NadZs8b0mBZxKNLxvdvKeQ0Ms0XWLtANFoTcoWn0HA3KiBhmF1cSnGN3gLrsXu0pjRECyM3FfOTWMm58i0RZCivjchzpO+ZSsXN8A9OQjkk+dVwdTQBAJE0hxwc3lsy+tgzm5E2Z7xU4ASSfu6yd69AR2qXSAZaJk4gEHE8JEA5AJg8bc2ZBoptfdbau21J3AdoafJhre0ou2CcxGkVYtV+Zi9SFOmVE96xQ1CsB5cyzkWWMYYYShKtkw40D9I2/P5kxQI1RegwWa9PeXc91xh6exw3y3sBNoEyaApwiEQCRyIANSYUM0jVtWF664z0Rsp6fHWJ45b6Yrdud5SZKSiQgJczAiSZoK6uEHixcTJ5oIMkFO9EvYQDe27qtYQAASBee+erKgI0MX2EUpC4qKgmu2+ISQCOZAQ2TU0B80uu/fK30jQXdx/WMW0MOnM5YQQBPESDMWy6bi73yYALva3Jyp0VKQjCnjUJQROJElqwrPDlqrW/Fq1y/R5K/mtR1xRBZ61HUZy4Ii4QnXKncRgSCSgSlZgzOsW138/uIoEnd1egCREPjjZ3lXyNo6HdoAEFE3bC586xp5cHkVkIOmu1mzFeqVQEaUxBr6m+WFc27NcpoCtnsnFoCUsnNf/hh5NK1DXUHFxVboHZvQIQozIBWp0yrQ3F+xSPprqXPYzZiUhFe78I688wEJHlCISKWmf3wmHxhJVUDK+n5+4LMWTUAwKiI29Muy5xtAlF3bdqs4BaCfPLGdSwvZco2rYQPOBsUqYC6MYhGWgsPCDWIrNPxGbZGsurSts1gQwW5GWLJL7AogrjUXG5uMbP+CQN02S+/SAgIYMc67fzwNLERNRAoijvQCJbQZNoEoTfdlg6yKNPwlt8tomjdZfNcaCKHTJ/jOcpPCkOVu86CNVHNVMRqAUuJnTvbOBxhgWmnI+pdChEEkcmtY2aUCTiUYzz3azZgccqe+HKSg9IAzaTZu0XIARiADa3DgkyuKCx5OVbBL9mmFXPGit19QOOzQLGsTV2AeuGXE/3Bh8aL/aqjFQBx/mL/7ahfSqKIMrDfc02uTf7rGfvlYY1tu2LkCIojExPbC504CQ4aKxwRHDyEhLwcPgUGMDC0jSJZcfHtohNzpbgEqALl/j86ZlDlLSw7iUHAo74evn1986kX/k3tzQI6aq75cR4i+AAiKndk7p/HG9s5Dz9XBepSxUdvOoagCEp852k+aGkKb+IZh2JBGRqMJIiQCAZIDuTBDrMMp/7Dc37I06i4Sh20XB3DIFOkoxWgAlVEZNKtqqORHzzHAAXrUgWRGBI2p2qjYsMRnZXKeTusScqtz7MQCTtSI6R3FTxxNc9EVIZ4wMCcSYYSYEICBGVGD1EUaQLXw7dsYLLhXC+7NQc28yRrJYOoDAcKEAd7559YlQOqdnzuTVqXVoRA0JNbhE45W/KZKxDZ56U4UEIDULxwpPT15MPEkDAiACYJoFJqhyZ6mTMkR+hxL/+jueSwvOBlrhexSmhPf46bBRXOmoCEBIK5Tl/2+fNP9NQDTe93h06mRrpmKCFy7olC+5G5squReQUAEwV6hgAoCbW5n4eMHRWsEZ8IMqBMFgQpGac0kUiAkclrQ2FBfs8GXJG8VLSJQYpchIBpUXKPuli73oaiu3bEdQ/Vk8TJ37R31oUoOoKesjz0loZGAIiYxw5r+5Kbfc+HShhOGseqou+h3JFoniNR/n5+ce2Se95ifKOwR6SLapZX6q0EFIA0IInXGzGmFYYv78eLir1flv1xna6sG7s4QKq6Zv27THWqyMkVAiqijcZs6RraO6+EOm+hnjrODx+vZx+p2CjRf6fLJc3+i+01MOUFkPNBJdABFgQeU0FYAtnIZpXbZOIC6MVUYtCoYxMKl7X/xQNVJ3I0Ggh1rQRWKSLRWE04gosKtfC/eAYYDxhevPUWOnxuK70jwTIbRsB2EmppmxkcHk1M6GJQagAqkBBQAR4hAyIJDT4e4kjTE4nhuHkKFbLih4Je8iIsfz3aThI5tRGz/QnN0t90LtsNPEhAMx7616+T3FtE3iC2KAMgrICQARdudn1Ui1CBCYfPGODYwdd4hcYwREHVqWWQISjfUkHWNANBJsxTc95I4d8zsjikdSWwEcQT25S4CQOU1lEj7VHaecMlYl2SPhDvi4g2RV40zb8qbskfyf70mUVfT34JTAAAAAElFTkSuQmCC";
  document.head.appendChild(link);
})();


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
.prod-card-img{height:200px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:44px;border-bottom:1px solid var(--border);overflow:hidden}
.prod-card-img img{width:100%;height:100%;object-fit:cover;object-position:center}
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
  const csv = rows.map(r => r.map(c => String(c||"").replace(/"/g, '""')).map(c => `"${c}"`).join(",")).join("\n");
  // \uFEFF = UTF-8 BOM so Excel reads currency symbols correctly
  const blob = new Blob(["\uFEFF" + csv], { type:"text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data,null,2)], { type:"application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// Simple invoice HTML generator for print/download
function buildInvoiceHTML(order, customer, settings, isConsignment=false, docLabel="INVOICE") {
  const INV_LOGO = LOGO_SRC;
  const taxLabel = `GCT (${order.tax_rate}%)`;
  const NAVY = "#1a3a6b";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${order.id}</title>
<style>
body{font-family:Arial,sans-serif;padding:40px;color:#1a202c;font-size:13px}
.header{display:flex;justify-content:space-between;margin-bottom:32px}
.inv-title{font-size:28px;font-weight:700;color:#2d3748;text-align:right}
.inv-num{font-size:14px;color:#4a5568;text-align:right}
.section{margin-bottom:24px}
.section h4{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#4a5568;margin-bottom:6px}
table{width:100%;border-collapse:collapse;margin-bottom:16px}
th{background:#eef2f7;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${NAVY};border-bottom:2px solid #c8d6e8}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px}
.totals-table{width:300px;margin-left:auto}
.grand-total td{font-weight:700;font-size:15px;color:${NAVY};border-top:2px solid #c8d6e8}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#4a5568}
</style></head><body>
<div class="header">
  <div>
    <img src="${INV_LOGO}" alt="Pinglinks Cellular" style="height:52px;width:auto;display:block;margin-bottom:8px"/>
    <div style="font-size:12px;color:#4a5568;line-height:1.6">
      Pinglinks Cellular Limited<br>
      20A South Avenue<br>
      Kingston 10, Jamaica<br>
      info@pinglinkscellular.com
    </div>
  </div>
  <div><div class="inv-title">${docLabel.toUpperCase()}</div><div class="inv-num">${order.id}</div><div class="inv-num" style="font-size:12px">Date: ${order.date}</div></div>
</div>
<div class="two-col" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
  <div class="section"><h4>Bill To</h4><div style="font-weight:600">${customer?.company||order.customer_name}</div><div style="color:#4a5568">${customer?.tax_id?`TRN: ${customer.tax_id}`:""}</div></div>
  <div class="section" style="text-align:right"><h4>Payment</h4><div>Method: ${order.payment_method||"—"}</div><div>Status: ${order.status}</div>${order.type==="consignment"?`<div>Due: ${order.consignment_due||"—"}</div>`:""}</div>
</div>
<table><thead><tr><th>Barcode</th><th>Brand</th><th>Product</th><th>Qty</th>${!isConsignment?'<th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th>':''}</tr></thead>
<tbody>${(order.items||[]).map(i=>`<tr><td><code>${i.barcode||"—"}</code></td><td>${i.brand||"—"}</td><td>${i.name}</td><td>${i.qty}</td>${!isConsignment?`<td style="text-align:right">${fmt(i.unit_price)}</td><td style="text-align:right">${fmt(i.qty*i.unit_price)}</td>`:''}</tr>`).join("")}</tbody></table>
${!isConsignment?`<table class="totals-table">
  <tr><td>Subtotal</td><td style="text-align:right">${fmt(order.subtotal)}</td></tr>
  <tr><td>${taxLabel}</td><td style="text-align:right">${fmt(order.tax_amount)}</td></tr>
  <tr class="grand-total"><td><strong>Total</strong></td><td style="text-align:right"><strong>${fmt(order.total)}</strong></td></tr>
</table>`:'<div style="margin:16px 0;padding:12px;background:#f7fafc;border-radius:6px;font-size:13px;color:#718096">Pricing will be confirmed by our team. Please contact us for your final invoice.</div>'}
${order.notes?`<div style="margin-top:16px;padding:12px;background:#f7fafc;border-radius:6px"><strong>Notes:</strong> ${order.notes}</div>`:""}

${(!isConsignment&&(settings.bank_name||settings.payment_link))?`
<div style="margin-top:28px;border-top:2px solid #c8d6e8;padding-top:20px;display:grid;grid-template-columns:${settings.bank_name&&settings.payment_link?"1fr 1fr":"1fr"};gap:20px">
  ${settings.bank_name?`
  <div style="background:#eef2f7;border-radius:8px;padding:14px 16px">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${NAVY};margin-bottom:10px">🏦 Bank Transfer Details</div>
    <table style="width:auto;margin:0"><tbody>
      <tr><td style="color:#4a5568;font-size:12px;padding:2px 12px 2px 0;border:none">Bank:</td><td style="font-weight:600;font-size:12px;border:none">${settings.bank_name}</td></tr>
      ${settings.bank_account_name?`<tr><td style="color:#4a5568;font-size:12px;padding:2px 12px 2px 0;border:none">Account Name:</td><td style="font-weight:600;font-size:12px;border:none">${settings.bank_account_name}</td></tr>`:""}
      ${settings.bank_account_number?`<tr><td style="color:#4a5568;font-size:12px;padding:2px 12px 2px 0;border:none">Account #:</td><td style="font-weight:700;font-size:13px;font-family:monospace;letter-spacing:1px;border:none">${settings.bank_account_number}</td></tr>`:""}
      ${settings.bank_routing?`<tr><td style="color:#4a5568;font-size:12px;padding:2px 12px 2px 0;border:none">Branch:</td><td style="font-weight:600;font-size:12px;border:none">${settings.bank_routing}</td></tr>`:""}
    </tbody></table>
    ${settings.bank_notes?`<div style="margin-top:8px;font-size:11px;color:${NAVY};font-style:italic">${settings.bank_notes}</div>`:""}
  </div>`:""}
  ${settings.payment_link?`
  <div style="background:#eef2f7;border-radius:8px;padding:14px 16px;text-align:center">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${NAVY};margin-bottom:8px">💳 Online Payment</div>
    <div style="font-size:20px;font-weight:700;color:#1a202c;margin-bottom:12px">${fmt(order.total)}</div>
    <a href="${settings.payment_link}" style="display:inline-block;padding:10px 24px;background:${NAVY};color:#fff;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none;white-space:nowrap">${settings.payment_link_label||"Pay Now"} →</a>
  </div>`:""}
</div>`:""}

<div class="footer">Pinglinks Cellular Limited · 20A South Avenue, Kingston 10, Jamaica · info@pinglinkscellular.com</div>
</body></html>`;
}

function printInvoice(order, customer, settings, isConsignment=false, docLabel=null) {
  const resolvedLabel = docLabel || (isConsignment ? "DELIVERY NOTE" : "INVOICE");
  const html = buildInvoiceHTML(order, customer, settings, isConsignment, resolvedLabel);
  const w = window.open("","_blank","width=800,height=600");
  w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(),400);
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    order:          ["bw",  "📋 Order"],
    partial_shipped:["bo",  "📦 Partial"],
    invoiced:       ["bo",  "🧾 Awaiting Payment"],
    delivery_note:  ["bb",  "📦 Delivery Note"],
    pending:        ["bw",  "⏳ Pending"],
    processing:     ["bb",  "🔄 Processing"],
    shipped:        ["bb",  "🚚 Shipped"],
    paid:           ["bg",  "✓ Paid"],
    delivered:      ["bg",  "✓ Delivered"],
    cancelled:      ["br",  "✕ Cancelled"],
    open:           ["bb",  "⏳ Open"],
    fulfilled:      ["bg",  "✓ Fulfilled"],
    refunded:       ["br",  "↩ Refunded"],
    partial_refund: ["bo",  "↩ Part. Refund"],
  };
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
  const [page, setPageRaw] = useState(() => {
    // On first load, read page from URL hash if present
    const hash = window.location.hash.replace("#","");
    return hash || "dashboard";
  });
  // Wrap setPage to also push browser history state
  const setPage = (newPage) => {
    setPageRaw(newPage);
    window.history.pushState({page: newPage}, "", "#" + newPage);
  };
  // Listen for browser back/forward
  React.useEffect(() => {
    const onPop = (e) => {
      const p = e.state?.page || window.location.hash.replace("#","") || "dashboard";
      setPageRaw(p);
    };
    window.addEventListener("popstate", onPop);
    // Set initial history entry so back button has somewhere to go
    window.history.replaceState({page}, "", "#" + page);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [backorders, setBackorders] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [stockTakes, setStockTakes] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [customerCarts, setCustomerCarts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores]     = useState([]);
  const [salesReps, setSalesReps] = useState([]);
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
        { data: repsData },
        { data: setts },
        { data: transList },
        { data: transItems },
        { data: poList },
        { data: poItems },
        { data: cartList },
        { data: stList },
        { data: stItems },
        { data: boList },
      ] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        u.role === "admin" ? supabase.from("profiles").select("*").eq("role","buyer").order("created_at",{ascending:false}) : Promise.resolve({data:[]}),
        u.role === "admin"
          ? supabase.from("orders").select("*").order("created_at",{ascending:false})
          : supabase.from("orders").select("*").eq("customer_id",u.id).order("created_at",{ascending:false}),
        supabase.from("order_items").select("*"),
        u.role === "admin" ? supabase.from("suppliers").select("*").order("name") : Promise.resolve({data:[]}),
        supabase.from("stores").select("*").order("name"),
        u.role === "admin" ? supabase.from("sales_reps").select("*").order("name") : supabase.from("sales_reps").select("*").order("name"),
        supabase.from("site_settings").select("*").eq("id",1).single(),
        u.role === "admin" ? supabase.from("transfers").select("*").order("created_at",{ascending:false}) : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("transfer_items").select("*") : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("purchase_orders").select("*").order("created_at",{ascending:false}) : supabase.from("purchase_orders").select("*").in("status",["open","partial"]).order("created_at",{ascending:false}),
        u.role === "admin" ? supabase.from("purchase_order_items").select("*") : supabase.from("purchase_order_items").select("*"),
        u.role === "admin" ? supabase.from("customer_carts").select("*").order("updated_at",{ascending:false}) : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("stock_takes").select("*").order("date",{ascending:false}) : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("stock_take_items").select("*") : Promise.resolve({data:[]}),
        u.role === "admin" ? supabase.from("backorders").select("*").order("created_at",{ascending:false}) : Promise.resolve({data:[]}),
      ]);
      if (prods) setProducts(prods);
      if (custs) setCustomers(custs);
      if (supps) setSuppliers(supps);
      if (strs) setStores(strs);
      if (repsData) setSalesReps(repsData);
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
      if (cartList) setCustomerCarts(cartList);
      if (stList && stItems) {
        const merged = stList.map(st => ({
          ...st,
          items: (stItems || []).filter(i => i.stock_take_id === st.id)
        }));
        setStockTakes(merged);
      }
      if (boList) setBackorders(boList);
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
    try { await supabase.from("activity_log").insert({
      action: "user_login",
      details: `${u.name||u.email} signed in (${u.role||"customer"})`,
      entity_type: "user", entity_id: String(u.id||""),
      user_name: u.name||u.email||"Unknown",
      timestamp: new Date().toISOString()
    }); } catch(e) {}
  };

  const logout = async () => {
    if (user) {
      try { await supabase.from("activity_log").insert({
        action: "user_logout",
        details: `${user.name||user.email} signed out`,
        entity_type: "user", entity_id: String(user.id||""),
        user_name: user.name||user.email||"Unknown",
        timestamp: new Date().toISOString()
      }); } catch(e) {}
    }
    await supabase.auth.signOut();
    setUser(null); setCart([]);
  };

  if (loading) return <><style dangerouslySetInnerHTML={{__html:STYLES}}/><div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)"}}><div style={{textAlign:"center"}}><img src={LOGO_SRC} style={{width:200,marginBottom:20}}/><div style={{color:"var(--text3)"}}>Loading…</div></div></div></>;
  if (!user) return <><style dangerouslySetInnerHTML={{__html:STYLES}}/><LoginPage onLogin={login}/></>;

  const isAdmin = user.role === "admin";
  // Make current user name available to activity log writes throughout the app
  currentUserName = user.name || user.company || user.email || "Admin";

  // ── Cart helpers ──
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const persistCart = async (newCart) => {
    if (!user) return;
    const customer = customers.find(c=>c.id===user.id)||user;
    const payload = {
      customer_id: user.id,
      customer_name: customer.company || user.name || user.email,
      customer_email: user.email,
      customer_type: user.customer_type || "standard",
      items: JSON.stringify(newCart),
      item_count: newCart.reduce((s,i)=>s+i.qty,0),
      subtotal: newCart.reduce((s,i)=>s+i.price*i.qty,0),
      updated_at: new Date().toISOString(),
      status: newCart.length > 0 ? "active" : "cleared"
    };
    try { await supabase.from("customer_carts").upsert(payload, {onConflict:"customer_id"}); } catch(e) {}
    if(user.role==="admin") return;
    setCustomerCarts(prev=>{
      const idx=prev.findIndex(c=>c.customer_id===user.id);
      if(idx>=0){ const n=[...prev]; n[idx]={...n[idx],...payload}; return n; }
      return [...prev,payload];
    });
  };

  const addToCart = (product, qty) => {
    setCart(prev=>{
      const ex = prev.find(i=>i.pid===product.id);
      const newCart = ex
        ? prev.map(i=>i.pid===product.id?{...i,qty:i.qty+qty}:i)
        : [...prev,{pid:product.id,name:product.name,barcode:product.barcode,sku:product.sku,price:applyDiscount(product.wholesale_price,user.discount_pct||0),image:"📱",qty,min:product.min_order||1}];
      persistCart(newCart);
      return newCart;
    });
  };
  const updateQty = (pid,qty)=>{
    setCart(prev=>{
      const newCart = qty<=0 ? prev.filter(i=>i.pid!==pid) : prev.map(i=>i.pid===pid?{...i,qty}:i);
      persistCart(newCart);
      return newCart;
    });
  };
  const cartSubtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartTax = Math.round(cartSubtotal*settings.tax_rate/100);
  const cartTotal = cartSubtotal + cartTax;

  const placeOrder = async (payMethod, notes, orderType, consignmentDue) => {
    const customer = customers.find(c=>c.id===user.id) || user;
    const minVal = customer.min_order_value||0;
    if (cartSubtotal < minVal) { showToast(`Minimum order value is ${fmt(minVal)}`,"err"); return; }
    const id = genId("ORD", orders);
    const orderData = {
      id, customer_id: user.id,
      customer_name: customer.company || user.name,
      date: today(), status: "order",
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
    // Mark cart as converted in Supabase
    try { await supabase.from("customer_carts").upsert({customer_id:user.id,items:"[]",item_count:0,subtotal:0,status:"converted",updated_at:new Date().toISOString()},{onConflict:"customer_id"}); } catch(e) {}
    setCustomerCarts(prev=>prev.map(c=>c.customer_id===user.id?{...c,items:"[]",item_count:0,status:"converted"}:c));
    try {
      fetch(`${SUPABASE_URL}/functions/v1/notify-admin`,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${SUPABASE_ANON_KEY}`},
        body:JSON.stringify({type:"new_order",orderId:id,customerName:customer?.company||user.name,customerEmail:user.email,orderType:orderType||"standard",total:(orderType==="consignment")?"Consignment":("J$"+cartTotal.toLocaleString()),items:cart.map(i=>i.qty+"x "+i.name).join(", "),notes:notes||""})
      }).catch(()=>{});
    } catch(e){}
    // Send order confirmation email to customer
    if (user.email) {
      try {
        fetch(`${SUPABASE_URL}/functions/v1/order-confirmation`,{
          method:"POST",
          headers:{"Content-Type":"application/json","Authorization":`Bearer ${SUPABASE_ANON_KEY}`},
          body:JSON.stringify({
            orderId: id,
            customerName: customer?.company||user.name,
            customerEmail: user.email,
            orderType: orderType||"standard",
            isConsignment: orderType==="consignment",
            paymentMethod: payMethod,
            items: cart.map(i=>({name:i.name,qty:i.qty,unit_price:i.price,barcode:i.barcode||""})),
            subtotal: cartSubtotal,
            taxRate: settings.tax_rate||0,
            taxAmount: cartTax,
            total: cartTotal,
            notes: notes||"",
          })
        }).catch(()=>{});
      } catch(e){}
    }
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
      {id:"orders",icon:"📋",label:"Orders"},
      {id:"backorders",icon:"⏳",label:"Back Orders"},
      {id:"invoices",icon:"🧾",label:"Invoices"},
      {id:"carts",icon:"🛒",label:"Customer Carts"},
      {id:"clearance",icon:"🔥",label:"Clearance"},
      {id:"hot-sellers-admin",icon:"⭐",label:"Hot Sellers"},
    ]},
    {section:"Accounts", items:[
      {id:"customers",icon:"👥",label:"Customers"},
      {id:"salesreps",icon:"🤝",label:"Sales Reps"},
    ]},
    {section:"Reports", items:[
      {id:"analytics",icon:"📈",label:"Analytics"},
      {id:"activitylog",icon:"🕐",label:"Activity Log"},
    ]},
    {section:"System", items:[
      {id:"settings",icon:"⚙️",label:"Settings"},

      {id:"staff",icon:"🔑",label:"Staff Accounts"},
      {id:"account",icon:"👤",label:"My Account"},
    ]},
  ];

  const buyerNav = [
    {section:"Shop", items:[
      {id:"catalog",icon:"🏪",label:"Catalog"},
      {id:"incoming",icon:"📬",label:"Arriving Soon"},
      {id:"clearance",icon:"🔥",label:"Clearance"},
      {id:"hot-sellers",icon:"⭐",label:"Hot Sellers"},
      {id:"my-orders",icon:"🧾",label:"My Orders"},
    ]},
    {section:"Account", items:[{id:"account",icon:"👤",label:"Account"}]},
  ];

  const titles = { dashboard:"Dashboard",products:"Products",categories:"Categories",suppliers:"Suppliers",stocktake:"Stock Take",transfers:"Store Transfers",orders:"Orders",backorders:"Back Orders",invoices:"Invoices",clearance:"Clearance",customers:"Customers",analytics:"Analytics & Reports",activitylog:"Activity Log",settings:"Settings",stores:"Store Locations",catalog:"Wholesale Catalog","my-orders":"My Orders","hot-sellers":"Hot Sellers","hot-sellers-admin":"Hot Sellers",account:"My Account",salesreps:"Sales Reps",staff:"Staff Accounts" };

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
            {page==="products" && <ProductsErrorBoundary><ProductsPage products={products} setProducts={setProducts} suppliers={suppliers} setSuppliers={setSuppliers} orders={orders} transfers={transfers} purchaseOrders={purchaseOrders} settings={settings} showToast={showToast} isAdmin={isAdmin}/></ProductsErrorBoundary>}
            {page==="categories" && <CategoriesPage products={products} extraCategories={settings.extra_categories?JSON.parse(settings.extra_categories):[]} setExtraCategories={(v)=>setSettings(p=>({...p,extra_categories:JSON.stringify(v)}))} showToast={showToast}/>}
            {page==="suppliers" && <SuppliersPage suppliers={suppliers} setSuppliers={setSuppliers} products={products} showToast={showToast}/>}
            {page==="stocktake" && <StockTakePage products={products} setProducts={setProducts} stockTakes={stockTakes} setStockTakes={setStockTakes} showToast={showToast}/>}
            {page==="transfers" && <TransfersPage products={products} setProducts={setProducts} transfers={transfers} setTransfers={setTransfers} stores={stores} setStores={setStores} settings={settings} showToast={showToast}/>}
            {page==="purchaseorders" && <PurchaseOrdersPage purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} products={products} setProducts={setProducts} suppliers={suppliers} setSuppliers={setSuppliers} settings={settings} showToast={showToast}/>}
            {page==="incoming" && <IncomingStockPage purchaseOrders={purchaseOrders} products={products}/>}
            {page==="orders" && <OrdersPage orders={orders} setOrders={setOrders} backorders={backorders} setBackorders={setBackorders} customers={customers} settings={settings} showToast={showToast} products={products} setProducts={setProducts}/>}
            {page==="backorders" && <BackordersPage backorders={backorders} setBackorders={setBackorders} orders={orders} setOrders={setOrders} customers={customers} settings={settings} showToast={showToast} products={products} setProducts={setProducts}/>}
            {page==="invoices" && <InvoicesPage orders={orders} setOrders={setOrders} customers={customers} settings={settings} showToast={showToast} setModal={setModal} products={products} setProducts={setProducts}/>}
            {page==="clearance" && (isAdmin
              ? <AdminClearancePage products={products} setProducts={setProducts} settings={settings} showToast={showToast}/>
              : <ClearancePage products={products} isAdmin={false} addToCart={addToCart} user={user} cart={cart}/>
            )}
            {page==="hot-sellers" && <HotSellersPage products={products} user={user} addToCart={addToCart} cart={cart}/>}
            {page==="hot-sellers-admin" && <AdminHotSellersPage products={products} setProducts={setProducts} settings={settings} showToast={showToast}/>}
            {page==="customers" && <CustomersPage customers={customers} setCustomers={setCustomers} orders={orders} salesReps={salesReps} showToast={showToast}/>}
            {page==="carts" && <CustomerCartsPage customerCarts={customerCarts} setCustomerCarts={setCustomerCarts} customers={customers} orders={orders} products={products} showToast={showToast}/>}
            {page==="analytics" && <AnalyticsPage products={products} orders={orders} customers={customers} transfers={transfers}/>}
            {page==="activitylog" && <ActivityLogPage activityLog={activityLog} setActivityLog={setActivityLog} products={products}/>}
            {page==="settings" && <SettingsPage settings={settings} setSettings={setSettings} showToast={showToast}/>}

            {page==="salesreps" && <SalesRepsPage salesReps={salesReps} setSalesReps={setSalesReps} showToast={showToast}/>}
            {page==="staff" && <StaffPage showToast={showToast}/>}
            {page==="catalog" && <CatalogPage products={products} user={user} addToCart={addToCart} cart={cart} settings={settings}/>}
            {page==="my-orders" && <MyOrdersPage orders={orders.filter(o=>o.customer_id===user.id)} settings={settings} customers={customers} setModal={setModal} user={user}/>}
            {page==="account" && <AccountPage user={user} customers={customers} salesReps={salesReps} showToast={showToast} isAdmin={isAdmin}/>}
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
        {modal?.type==="viewInvoice" && <InvoiceViewModal order={modal.data} settings={settings} customers={customers} products={products} onClose={()=>setModal(null)}/>}

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
  const [reg,setReg]=useState({name:"",company:"",taxId:"",email:"",password:"",confirm:"",salesRepId:""});
  const [showForgot,setShowForgot]=useState(false);
  const [forgotEmail,setForgotEmail]=useState("");
  const [repsList,setRepsList]=useState([]);

  useEffect(()=>{
    supabase.from("sales_reps").select("*").order("name").then(({data})=>{ if(data) setRepsList(data); });
  },[]);

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
      options: { data: { name: reg.name, company: reg.company, tax_id: reg.taxId, role: "buyer", sales_rep_id: reg.salesRepId||null } }
    });
    if (error) { setErr(error.message); setBusy(false); return; }
    // Send email notification
    fetch(`${SUPABASE_URL}/functions/v1/notify-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ type:"new_account", customerName: reg.name, company: reg.company, email: reg.email })
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
            <div className="form-group"><label>Do you know a member of our team? (Optional)</label>
              <select value={reg.salesRepId||""} onChange={e=>setReg(p=>({...p,salesRepId:e.target.value}))}>
                <option value="">— I don't know anyone from your team —</option>
                {repsList.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
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
  const totalCost      = activeProducts.reduce((s,p)=>s+p.cost*p.stock,0);
  const totalRetail    = activeProducts.reduce((s,p)=>s+p.retail_price*p.stock,0);
  const totalWholesale = activeProducts.reduce((s,p)=>s+p.wholesale_price*p.stock,0);
  const totalItems     = activeProducts.reduce((s,p)=>s+p.stock,0);
  const totalSKUs      = activeProducts.length;
  const lowStock       = activeProducts.filter(p=>p.stock>0&&p.stock<=p.low_stock_threshold).length;
  const outOfStock     = activeProducts.filter(p=>p.stock===0).length;
  const pendingApprovals = customers.filter(c=>!c.approved).length;

  const thisMonth = today().slice(0,7);

  // Revenue = only paid/delivered upfront orders
  const paidOrders       = orders.filter(o=>o.type!=="consignment"&&(o.status==="paid"||o.status==="delivered"));
  const paidThisMonth    = paidOrders.filter(o=>o.date?.startsWith(thisMonth));
  const revenueThisMonth = paidThisMonth.reduce((s,o)=>s+(o.total||0),0);
  const taxThisMonth     = paidThisMonth.reduce((s,o)=>s+(o.tax_amount||0),0);

  // Awaiting payment = invoiced upfront orders
  const awaitingPayment      = orders.filter(o=>o.status==="invoiced"&&o.type!=="consignment");
  const awaitingTotal        = awaitingPayment.reduce((s,o)=>s+(o.total||0),0);
  const awaitingThisMonth    = awaitingPayment.filter(o=>o.date?.startsWith(thisMonth));
  const awaitingMonthTotal   = awaitingThisMonth.reduce((s,o)=>s+(o.total||0),0);

  // Active orders (pending shipment)
  const pendingOrders = orders.filter(o=>o.status==="order"||o.status==="partial_shipped");

  const newArrivals  = activeProducts.filter(p=>isNewArrival(p)&&p.stock>0).slice(0,5);
  const lowStockItems = activeProducts.filter(p=>p.stock>0&&p.stock<=p.low_stock_threshold).slice(0,5);

  return (
    <div>
      {/* Row 1: Financials */}
      <div style={{marginBottom:6,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text3)"}}>This Month</div>
      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat c1" style={{cursor:"pointer"}} onClick={()=>setPage("analytics")}>
          <div className="stat-label">Revenue Collected</div>
          <div className="stat-val" style={{fontSize:18}}>{fmt(revenueThisMonth)}</div>
          <div className="stat-sub">{paidThisMonth.length} paid orders</div>
        </div>
        <div className="stat c3">
          <div className="stat-label">GCT Collected</div>
          <div className="stat-val" style={{fontSize:18}}>{fmt(taxThisMonth)}</div>
          <div className="stat-sub">on paid orders</div>
        </div>
        <div className="stat c5" style={{cursor:"pointer"}} onClick={()=>setPage("invoices")}>
          <div className="stat-label">⏳ Awaiting Payment</div>
          <div className="stat-val" style={{fontSize:18,color:"var(--warn)"}}>{fmt(awaitingTotal)}</div>
          <div className="stat-sub">{awaitingPayment.length} invoice{awaitingPayment.length!==1?"s":""} outstanding · {fmt(awaitingMonthTotal)} this month</div>
        </div>
        <div className="stat c2" style={{cursor:"pointer"}} onClick={()=>setPage("orders")}>
          <div className="stat-label">Pending Orders</div>
          <div className="stat-val" style={{fontSize:18}}>{pendingOrders.length}</div>
          <div className="stat-sub">awaiting shipment</div>
        </div>
        <div className="stat c4">
          <div className="stat-label">Inventory Cost</div>
          <div className="stat-val" style={{fontSize:18}}>{fmt(totalCost)}</div>
          <div className="stat-sub">{fmtNum(totalSKUs)} SKUs · {fmtNum(totalItems)} units</div>
        </div>
        <div className="stat c6" style={{cursor:"pointer"}} onClick={()=>setPage("products")}>
          <div className="stat-label">Stock Alerts</div>
          <div className="stat-val" style={{fontSize:18,color:outOfStock>0?"var(--danger)":"var(--warn)"}}>{lowStock + outOfStock}</div>
          <div className="stat-sub">{lowStock} low · {outOfStock} out of stock</div>
        </div>
      </div>

      <div style={{marginBottom:6,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--text3)"}}>Inventory</div>
      <div className="stats-grid" style={{marginBottom:20,gridTemplateColumns:"repeat(3,1fr)"}}>
        <div className="stat c4"><div className="stat-label">Inventory Cost</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalCost)}</div><div className="stat-sub">{fmtNum(totalSKUs)} SKUs · {fmtNum(totalItems)} units</div></div>
        <div className="stat c2"><div className="stat-label">Wholesale Value</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalWholesale)}</div><div className="stat-sub">at wholesale prices</div></div>
        <div className="stat c3"><div className="stat-label">Retail Value</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalRetail)}</div><div className="stat-sub">at retail prices</div></div>
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
          <div className="card-header"><h3>Recent Invoices</h3><button className="btn btn-ghost btn-sm" onClick={()=>setPage("invoices")}>View All</button></div>
          <div className="tbl-wrap">
            <table><thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>{orders.slice(0,5).map(o=>(
                <tr key={o.id}>
                  <td><code>{o.id}</code></td>
                  <td style={{fontSize:12}}>{o.customer_name}</td>
                  <td style={{fontWeight:600,color:"var(--accent)"}}>
                    {o.type==="consignment"?<span style={{fontSize:11,color:"var(--text3)",fontStyle:"italic"}}>Consignment</span>:fmt(o.total)}
                  </td>
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

function ProductsPage({ products, setProducts, suppliers, setSuppliers, orders, transfers, purchaseOrders, settings, showToast, isAdmin }) {
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

  const batchArchive = async () => {
    const toArchive = products.filter(p=>selected.includes(p.id));
    const blocked = toArchive.filter(p=>p.stock>0||((purchaseOrders||[]).filter(po=>po.status==="open"||po.status==="partial").flatMap(po=>po.items||[]).filter(i=>i.product_id===p.id).reduce((s,i)=>s+((i.ordered_qty||0)-(i.received_qty||0)),0))>0);
    if(blocked.length>0){showToast(`Cannot archive ${blocked.length} product(s) with stock or incoming orders`,"err");return;}
    for(const p of toArchive){
      await supabase.from("products").update({active:false}).eq("id",p.id);
      try{await supabase.from("activity_log").insert({action:"product_archived",details:`Archived: ${p.name}`,entity_type:"product",entity_id:p.id,user_name:currentUserName,timestamp:new Date().toISOString()});}catch(e){}
    }
    setProducts(p=>p.map(x=>selected.includes(x.id)?{...x,active:false}:x));
    showToast(`${toArchive.length} products archived`); clearSelect();
  };
  const restore = async (id) => {
    await supabase.from("products").update({active:true}).eq("id",id);
    try{const p=products.find(x=>x.id===id);await supabase.from("activity_log").insert({action:"product_updated",details:`Unarchived: ${p?.name}`,entity_type:"product",entity_id:id,user_name:currentUserName,timestamp:new Date().toISOString()});}catch(e){}
    setProducts(p=>p.map(x=>x.id===id?{...x,active:true}:x)); showToast("Product unarchived");
  };

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
    const skipped = [];
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
      // Duplicate check before insert
      const dupName = products.find(p=>p.name?.toLowerCase()===prod.name?.toLowerCase());
      const dupBarcode = prod.barcode && products.find(p=>p.barcode&&p.barcode===prod.barcode);
      if(dupName||dupBarcode) {
        skipped.push(prod.name + (dupBarcode&&!dupName?` (barcode ${prod.barcode} duplicate)`:""));
        continue;
      }
      const {data, error} = await supabase.from("products").insert(prod).select().single();
      if (data) {
        imported.push(data);
        try { await supabase.from("activity_log").insert({action:"product_added",details:`Imported: ${prod.name}`,entity_type:"product",entity_id:String(data.id||""),user_name:currentUserName,timestamp:new Date().toISOString()}); } catch(e) {}
      }
      else if (error) { lastError = error.message; console.error("Import error:", prod.name, error.message); }
    }
    if (imported.length > 0) {
      setProducts(p=>[...imported,...p]);
      const msg = skipped.length>0
        ? `${imported.length} imported, ${skipped.length} skipped (duplicates)`
        : `${imported.length} products imported`;
      showToast(msg);
      setShowImport(false);
    } else if (skipped.length > 0) {
      showToast(`All ${skipped.length} products skipped — already exist (duplicate name or barcode)`, "err");
    } else {
      showToast("Import failed: " + (lastError||"Unknown error"), "err");
    }
  };

  const extraCats = settings.extra_categories ? (() => { try { return JSON.parse(settings.extra_categories); } catch { return []; } })() : [];
  const allCats = ["All",...new Set([...products.map(p=>p.category).filter(Boolean),...extraCats])].sort((a,b)=>a==="All"?-1:b==="All"?1:a.localeCompare(b));
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

        <button className="btn btn-primary btn-sm" onClick={()=>{setEditing(null);setShowModal(true);}}>+ Add Product</button>
      </div>

      {selected.length>0&&(
        <div className="alert alert-info" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span>{selected.length} selected</span>
          <div className="btn-group">
            <button className="btn btn-warn btn-xs" onClick={batchArchive}>Archive Selected</button>
            <button className="btn btn-ghost btn-xs" onClick={clearSelect}>Clear</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th><input type="checkbox" onChange={e=>e.target.checked?selectAll():clearSelect()}/></th>
              <th style={{width:44}}>Photo</th>
              <th>Barcode</th>
              <SortTh label="Brand" sortKey="brand" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Name" sortKey="name" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Category" sortKey="category" current={key} dir={dir} onToggle={toggle}/>
              <th>Supplier</th>
              <SortTh label="Cost" sortKey="cost" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Wholesale" sortKey="wholesale_price" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="SRP" sortKey="retail_price" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Stock" sortKey="stock" current={key} dir={dir} onToggle={toggle}/>
              <th style={{color:"var(--accent2)"}}>Incoming</th>
              <th>Low Threshold</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {pg.sliced.map(p=>{
                const sup = suppliers.find(s=>s.id===p.supplier_id);
                // Sum unreceived qty across all open/partial POs for this product
                const incomingQty = (purchaseOrders||[])
                  .filter(po=>po.status==="open"||po.status==="partial")
                  .flatMap(po=>(po.items||[]))
                  .filter(i=>i.product_id===p.id)
                  .reduce((s,i)=>s+((i.ordered_qty||0)-(i.received_qty||0)),0);
                return (
                  <tr key={p.id} style={{opacity:p.active?1:.5}}>
                    <td><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggleSelect(p.id)}/></td>
                    <td>{p.image_url?<img src={p.image_url} alt="" style={{width:36,height:36,objectFit:"cover",borderRadius:6,border:"1px solid var(--border)"}} onError={e=>{e.target.style.display="none";}}/>:<div style={{width:36,height:36,borderRadius:6,border:"1px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>📷</div>}</td>
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
                    <td style={{fontWeight:600,color:incomingQty>0?"var(--accent2)":"var(--text3)"}}>{incomingQty>0?`+${incomingQty}`:"—"}</td>
                    <td style={{color:"var(--text3)"}}>{p.low_stock_threshold}</td>
                    <td>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {p.is_new_arrival&&<span className="badge bg" style={{fontSize:9}}>NEW</span>}
                        {p.is_clearance&&<span className="badge bo" style={{fontSize:9}}>🔥 CLEARANCE</span>}
                        {p.is_hot_seller&&<span className="badge" style={{fontSize:9,background:"#fef9c3",color:"#854d0e",border:"1px solid #fde047"}}>⭐ HOT</span>}
                        {!p.active&&<span className="badge br" style={{fontSize:9}}>ARCHIVED</span>}
                        {p.wholesale_visible===false&&<span className="badge" style={{fontSize:9,background:"var(--warn)22",color:"var(--warn)"}}>HIDDEN</span>}
                      </div>
                    </td>
                    <td>
                      <div className="tbl-actions">
                        <button className="btn btn-ghost btn-xs" onClick={()=>setShowHistory(p)}>History</button>
                        <button className="btn btn-secondary btn-xs" onClick={()=>{setEditing(p);setShowModal(true);}}>Edit</button>
                        {!p.active
                          ? <button className="btn btn-secondary btn-xs" onClick={()=>restore(p.id)}>Unarchive</button>
                          : <button className="btn btn-warn btn-xs" title={p.stock>0||incomingQty>0?"Cannot archive: has stock or incoming orders":""} onClick={async()=>{
                              if(p.stock>0){showToast("Cannot archive — product has stock on hand","err");return;}
                              if(incomingQty>0){showToast("Cannot archive — product has incoming stock on open POs","err");return;}
                              await supabase.from("products").update({active:false}).eq("id",p.id);
                              try{await supabase.from("activity_log").insert({action:"product_archived",details:`Archived: ${p.name}`,entity_type:"product",entity_id:p.id,user_name:currentUserName,timestamp:new Date().toISOString()});}catch(e){}
                              setProducts(prev=>prev.map(x=>x.id===p.id?{...x,active:false}:x));showToast("Archived");
                            }} style={{opacity:p.stock>0||incomingQty>0?0.45:1}}>Archive</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pg.sliced.length===0&&<tr><td colSpan={14} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No products found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:12,color:"var(--text3)"}}>{pg.total} products</span>
          <Pagination page={pg.page} totalPages={pg.totalPages} setPage={pg.setPage}/>
        </div>
      </div>

      {showHistory&&<ProductHistoryModal product={showHistory} orders={orders} transfers={transfers} onClose={()=>setShowHistory(null)}/>}
      {showModal&&<ProductModal product={editing} categories={allCats.filter(c=>c!=="All")} onSave={async(data)=>{
  if(editing){
    // Build clean update payload (only columns that exist in DB)
    const payload = {
      name:data.name, barcode:data.barcode||"", brand:data.brand||"",
      category:data.category||"",
      wholesale_price:data.wholesale_price||0, retail_price:data.retail_price||0,
      low_stock_threshold:data.low_stock_threshold||5, min_order:data.min_order||1,
      description:data.description||"", image_url:data.image_url||null,
      is_clearance:data.is_clearance||false,
      clearance_price:data.clearance_price||null,
      wholesale_visible:data.wholesale_visible!==false,
      is_hot_seller:data.is_hot_seller||false
    };
    // Duplicate barcode check — exclude this product from check
    if(payload.barcode){
      const dupBarcode = products.find(p=>p.active&&p.barcode&&p.barcode===payload.barcode&&p.id!==editing.id);
      if(dupBarcode){ showToast(`Barcode ${payload.barcode} is already used by "${dupBarcode.name}"`,"err"); return; }
    }
    const {error} = await supabase.from("products").update(payload).eq("id",editing.id);
    if(error){ showToast("Save failed: "+error.message,"err"); return; }
    try { await supabase.from("activity_log").insert({action:"product_updated",details:`Updated: ${data.name}`,entity_type:"product",entity_id:editing.id,user_name:currentUserName,timestamp:new Date().toISOString()}); } catch(e) {}
    setProducts(p=>p.map(x=>x.id===editing.id?{...x,...payload}:x));
    showToast("Product updated");
  } else {
    // Duplicate check for new products
    const dupName = products.find(p=>p.active&&p.name?.toLowerCase()===data.name?.toLowerCase());
    const dupBarcode = data.barcode&&products.find(p=>p.active&&p.barcode&&p.barcode===data.barcode);
    if(dupName){ showToast(`A product named "${data.name}" already exists`,"err"); return; }
    if(dupBarcode){ showToast(`Barcode ${data.barcode} is already used by "${dupBarcode.name}"`,"err"); return; }
    const prod={
      name:data.name, barcode:data.barcode||"", brand:data.brand||"",
      category:data.category||"Uncategorized",
      wholesale_price:data.wholesale_price||0, retail_price:data.retail_price||0,
      cost:0, stock:0,
      low_stock_threshold:data.low_stock_threshold||5, min_order:data.min_order||1,
      description:data.description||"", image_url:data.image_url||null,
      is_clearance:data.is_clearance||false, clearance_price:data.clearance_price||null,
      wholesale_visible:data.wholesale_visible!==false,
      is_hot_seller:data.is_hot_seller||false,
      active:true, created_at:new Date().toISOString()
    };
    const {data:saved,error} = await supabase.from("products").insert(prod).select().single();
    if(error){ showToast("Save failed: "+error.message,"err"); return; }
    if(saved){
      try { await supabase.from("activity_log").insert({action:"product_added",details:`Added: ${data.name}`,entity_type:"product",entity_id:saved.id,user_name:currentUserName,timestamp:new Date().toISOString()}); } catch(e) {}
      setProducts(p=>[saved,...p]);
      showToast("Product added");
    }
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
      detail:`${i.qty} units @ ${fmt(i.unit_price)} — Order ${o.id} (${o.customer_name||""})`,
      user: o.customer_name||""
    }))
  );

  const transferEvents = transfers.flatMap(t=>
    (t.items||[]).filter(i=>i.product_id===product.id).map(i=>({
      type:"transfer", date:t.created_at||t.date, icon:"🏬",
      label:"Transferred to store", color:"var(--accent3)",
      detail:`${i.qty} units → ${t.store_name} — Transfer ${t.id}`,
      user: t.created_by||""
    }))
  );

  const iconMap = {
    product_added:"➕", product_updated:"✏️", product_archived:"📦",
    stock_received:"📥", stock_adjusted:"🔧", stock_take:"🔢",
    refund_processed:"↩️", product_imported:"📂"
  };
  const colorMap = {
    product_added:"var(--success)", product_updated:"var(--accent)",
    product_archived:"var(--warn)", stock_received:"var(--success)",
    stock_adjusted:"var(--accent3)", stock_take:"var(--accent)",
    refund_processed:"var(--danger)"
  };
  const logEvents = logs.map(l=>({
    type:l.action, date:l.timestamp,
    icon: iconMap[l.action]||"📋",
    label: l.action?.replace(/_/g," "),
    color: colorMap[l.action]||"var(--text2)",
    detail: l.details,
    user: l.user_name||""
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
                {e.user&&<div style={{fontSize:10,color:"var(--text3)",marginTop:2}}>👤 {e.user}</div>}
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

function ProductModal({ product, categories, onSave, onClose }) {
  const [f,setF]=useState({
    barcode:product?.barcode||"", brand:product?.brand||"", name:product?.name||"",
    category:product?.category||categories[0]||"",
    wholesale_price:product?.wholesale_price||"", retail_price:product?.retail_price||"",
    low_stock_threshold:product?.low_stock_threshold||5, min_order:product?.min_order||1,
    description:product?.description||"", image_url:product?.image_url||"",
    is_clearance:product?.is_clearance||false, clearance_price:product?.clearance_price||"",
    wholesale_visible:product?.wholesale_visible!==false  // default true
  });
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef();
  const s=(k,v)=>setF(p=>({...p,[k]:v}));

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);

    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large — please use an image under 5MB.");
      setUploading(false); return;
    }

    // Try Supabase storage first
    const ext = file.name.split('.').pop().toLowerCase();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      s("image_url", data.publicUrl);
      setUploading(false);
      return;
    }

    // Log actual error so we can see it in console
    console.error("Storage upload failed:", JSON.stringify(error));

    // Always fall back to base64 — works regardless of storage setup
    const reader = new FileReader();
    reader.onload = (e) => {
      s("image_url", e.target.result);
      setUploading(false);
    };
    reader.onerror = () => { alert("Failed to read image."); setUploading(false); };
    reader.readAsDataURL(file);
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
              <div className="form-group"><label>Category</label>
                <div style={{display:"flex",gap:6}}>
                  <select value={f.category} onChange={e=>{ if(e.target.value==="__new__"){return;} s("category",e.target.value); }} style={{flex:1}}>
                    {categories.map(c=><option key={c}>{c}</option>)}
                    <option value="__new__">+ New category…</option>
                  </select>
                </div>
                {(()=>{
                  const [showNew,setShowNew]=React.useState(false);
                  const [newCatVal,setNewCatVal]=React.useState("");
                  return showNew ? (
                    <div style={{display:"flex",gap:6,marginTop:4}}>
                      <input value={newCatVal} onChange={e=>setNewCatVal(e.target.value)} placeholder="New category name…" style={{flex:1}} autoFocus onKeyDown={e=>{if(e.key==="Enter"&&newCatVal.trim()){s("category",newCatVal.trim());setShowNew(false);setNewCatVal("");}if(e.key==="Escape")setShowNew(false);}}/>
                      <button className="btn btn-primary btn-xs" onClick={()=>{if(newCatVal.trim()){s("category",newCatVal.trim());setShowNew(false);setNewCatVal("");}}} >Add</button>
                      <button className="btn btn-ghost btn-xs" onClick={()=>setShowNew(false)}>✕</button>
                    </div>
                  ) : <button className="btn btn-ghost btn-xs" style={{marginTop:4,fontSize:11}} onClick={()=>setShowNew(true)}>+ New category</button>;
                })()}
              </div>
            </div>
          </div>
          <div className="form-group"><label>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2}/></div>
          <div className="form-row-3">
            <div className="form-group"><label>Wholesale Price (J$)</label><input type="number" value={f.wholesale_price} onChange={e=>s("wholesale_price",e.target.value)}/><div className="input-hint">Customer buying price</div></div>
            <div className="form-group"><label>Suggested Retail (J$)</label><input type="number" value={f.retail_price} onChange={e=>s("retail_price",e.target.value)}/><div className="input-hint">Recommended sell price</div></div>
            <div className="form-group"><label>Min Order Qty</label><input type="number" value={f.min_order} onChange={e=>s("min_order",e.target.value)}/></div>
          </div>
          <div className="form-row-2">
            <div className="form-group"><label>Low Stock Alert Threshold</label><input type="number" value={f.low_stock_threshold} onChange={e=>s("low_stock_threshold",e.target.value)}/><div className="input-hint">Alert when stock falls below this</div></div>
            <div className="form-group"><label>Clearance Price (J$)</label><input type="number" value={f.clearance_price} onChange={e=>s("clearance_price",e.target.value)} placeholder="Leave blank if not clearance"/></div>
          </div>
          <div style={{display:"flex",gap:24,marginTop:4,flexWrap:"wrap"}}>
            <label className="checkbox-row"><input type="checkbox" checked={f.is_clearance} onChange={e=>s("is_clearance",e.target.checked)}/> 🔥 Mark as Clearance</label>
            <label className="checkbox-row"><input type="checkbox" checked={f.is_hot_seller||false} onChange={e=>s("is_hot_seller",e.target.checked)}/> ⭐ Hot Seller</label>
            <label className="checkbox-row" title="Uncheck to hide this product from customer catalog, clearance, and arriving soon pages">
              <input type="checkbox" checked={f.wholesale_visible} onChange={e=>s("wholesale_visible",e.target.checked)}/>
              {f.wholesale_visible
                ? <span>Visible to Customers</span>
                : <span style={{color:"var(--warn)",fontWeight:600}}>⚠️ Hidden from Customers</span>}
            </label>
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
              clearance_price:f.clearance_price&&String(f.clearance_price).trim()!==""?parseFloat(f.clearance_price):null,
              wholesale_visible:f.wholesale_visible!==false
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
          <div style={{fontSize:11,color:"var(--text3)"}}>Use the PO Import template (on Purchase Orders page) to add new products.</div>
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
  const [tab,setTab]=useState("active");
  // Persist draft stock take in localStorage so it survives navigation
  const [draftST, setDraftST] = useState(() => {
    try { const s = localStorage.getItem("pinglinks_st_draft"); return s ? JSON.parse(s) : null; } catch(e) { return null; }
  });
  const [counts,setCounts]=useState(() => {
    try { const s = localStorage.getItem("pinglinks_st_counts"); return s ? JSON.parse(s) : {}; } catch(e) { return {}; }
  });
  const [notes,setNotes]=useState(() => {
    try { return localStorage.getItem("pinglinks_st_notes")||""; } catch(e) { return ""; }
  });
  const [search,setSearch]=useState("");
  const [filterCat,setFilterCat]=useState("Category");
  const [filterBrand,setFilterBrand]=useState("Brand");
  const [filterAvailable,setFilterAvailable]=useState(false);
  const [sortKey,setSortKey]=useState("name");

  // Autosave counts + notes whenever they change
  const saveCounts = (newCounts) => {
    setCounts(newCounts);
    try { localStorage.setItem("pinglinks_st_counts", JSON.stringify(newCounts)); } catch(e) {}
  };
  const saveNotes = (v) => {
    setNotes(v);
    try { localStorage.setItem("pinglinks_st_notes", v); } catch(e) {}
  };
  const startNewTake = () => {
    const id = genId("ST", stockTakes);
    const draft = { id, date: today(), status: "draft", started_at: new Date().toISOString() };
    setDraftST(draft);
    saveCounts({});
    saveNotes("");
    try { localStorage.setItem("pinglinks_st_draft", JSON.stringify(draft)); } catch(e) {}
    setTab("active");
    showToast(`Stock take ${id} started — counts autosave as you go`);
  };
  const clearDraft = () => {
    setDraftST(null);
    saveCounts({});
    saveNotes("");
    try { localStorage.removeItem("pinglinks_st_draft"); localStorage.removeItem("pinglinks_st_counts"); localStorage.removeItem("pinglinks_st_notes"); } catch(e) {}
  };

  const activeProducts = products.filter(p=>p.active);
  const allCats=["Category",...[...new Set(activeProducts.map(p=>p.category).filter(Boolean))].sort()];
  const allBrands=["Brand",...[...new Set(activeProducts.map(p=>p.brand).filter(Boolean))].sort()];
  const filtered = activeProducts.filter(p=>{
    const q=search.toLowerCase();
    if(q&&!p.name?.toLowerCase().includes(q)&&!p.barcode?.includes(q)&&!p.brand?.toLowerCase().includes(q)) return false;
    if(filterCat!=="Category"&&p.category!==filterCat) return false;
    if(filterBrand!=="Brand"&&p.brand!==filterBrand) return false;
    if(filterAvailable&&p.stock<1) return false;
    return true;
  }).sort((a,b)=>{
    if(sortKey==="name") return a.name.localeCompare(b.name);
    if(sortKey==="stock_asc") return a.stock-b.stock;
    if(sortKey==="stock_desc") return b.stock-a.stock;
    if(sortKey==="brand") return (a.brand||"").localeCompare(b.brand||"");
    if(sortKey==="category") return (a.category||"").localeCompare(b.category||"");
    if(sortKey==="low_stock") return (a.stock-a.low_stock_threshold)-(b.stock-b.low_stock_threshold);
    return 0;
  });

  const downloadCountSheet = () => {
    const rows=[["Barcode","Brand","Name","Category","System Count","Physical Count","Variance"],...activeProducts.map(p=>[p.barcode||"",p.brand||"",p.name,p.category,p.stock,"",""])];
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
    const stId=draftST?.id||genId("ST",stockTakes);
    const completedAt = new Date().toISOString();
    const stRow = {id:stId, date:today(), status:"completed", notes, started_at: draftST?.started_at||completedAt, completed_at: completedAt};
    // Save stock take to Supabase — always continue even if table/RLS doesn't exist
    try {
      const {error:stErr} = await supabase.from("stock_takes").insert(stRow);
      if(!stErr){
        try { await supabase.from("stock_take_items").insert(items.map(i=>({...i,stock_take_id:stId}))); } catch(e) {}
      } else {
        console.warn("Stock take insert skipped:", stErr?.code, stErr?.message?.slice(0,80));
      }
    } catch(e) {
      console.warn("Stock take DB error (stock still updated):", e?.message);
    }
    // Always update local state regardless
    setStockTakes(p=>[{...stRow, items},...p]);
    // Update stock levels in Supabase + log each change
    for(const [id,c] of Object.entries(counts)){
      if(c==="") continue;
      const prod = products.find(p=>p.id===id);
      const variance = +c - (prod?.stock||0);
      await supabase.from("products").update({stock:+c}).eq("id",id);
      try { await supabase.from("activity_log").insert({
        action:"stock_take",
        details:`Stock take: counted ${c} (was ${prod?.stock||0}, variance ${variance>0?"+":""}${variance}) — ${stId}`,
        entity_type:"product", entity_id:String(id),
        user_name:currentUserName, timestamp:new Date().toISOString()
      }); } catch(e) {}
    }
    setProducts(p=>p.map(x=>{const c=counts[x.id];return c!==undefined&&c!==""?{...x,stock:+c}:x;}));
    clearDraft();
    showToast(`Stock take completed — ${items.length} items adjusted`);
    setTab("history");
  };

  const totalVariance=Object.entries(counts).reduce((s,[id,v])=>{if(v==="")return s;const p=products.find(x=>x.id===id);return s+(+v-(p?.stock||0));},0);
  const adjCount=Object.values(counts).filter(v=>v!=="").length;

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div className="tabs" style={{margin:0}}>
          <button className={`tab ${tab==="active"?"active":""}`} onClick={()=>setTab("active")}>
            Active Stock Take {draftST?<span className="badge bb" style={{fontSize:9,marginLeft:4}}>{adjCount} counted</span>:null}
          </button>
          <button className={`tab ${tab==="history"?"active":""}`} onClick={()=>setTab("history")}>History ({stockTakes.length})</button>
        </div>
        {!draftST&&tab==="active"&&(
          <button className="btn btn-primary btn-sm" onClick={startNewTake}>📋 New Stock Take</button>
        )}
      </div>

      {tab==="active"&&(
        <>
          {!draftST&&(
            <div className="empty"><div className="ei">📋</div><p>No open stock take. Click <strong>New Stock Take</strong> to begin.</p></div>
          )}
          {draftST&&(
            <>
              <div className="card" style={{marginBottom:12,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontFamily:"Syne",fontWeight:700}}>{draftST.id}</span>
                  <span className="badge bo" style={{fontSize:10,marginLeft:8}}>In Progress</span>
                  <span style={{fontSize:12,color:"var(--text2)",marginLeft:8}}>Started {draftST.date} · counts autosaved</span>
                </div>
                <button className="btn btn-ghost btn-xs" style={{color:"var(--danger)"}} onClick={()=>{if(window.confirm("Discard this stock take? All entered counts will be lost."))clearDraft();}}>🗑 Discard</button>
              </div>

              <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
                <div className="search-wrap" style={{flex:2,minWidth:180}}>
                  <span className="search-icon">🔍</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, barcode, brand…"/>
                </div>
                <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
                  {allCats.map(c=><option key={c}>{c}</option>)}
                </select>
                <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
                  {allBrands.map(b=><option key={b}>{b}</option>)}
                </select>
                <select value={sortKey} onChange={e=>setSortKey(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
                  <option value="name">Sort: Name A–Z</option>
                  <option value="brand">Sort: Brand A–Z</option>
                  <option value="category">Sort: Category A–Z</option>
                  <option value="stock_asc">Sort: Stock Low→High</option>
                  <option value="stock_desc">Sort: Stock High→Low</option>
                  <option value="low_stock">Sort: Closest to Low Stock</option>
                </select>
                <label style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>
                  <input type="checkbox" checked={filterAvailable} onChange={e=>setFilterAvailable(e.target.checked)}/>
                  In stock only
                </label>
                <button className="btn btn-secondary btn-sm" onClick={downloadCountSheet}>⬇ Count Sheet</button>
              </div>
              {adjCount>0&&<div style={{marginBottom:10}}><span className="badge bw">{adjCount} items counted · Unit variance: {totalVariance>0?"+":""}{totalVariance} · Value: {fmt(Math.abs(Object.entries(counts).reduce((s,[id,v])=>{if(v==="")return s;const p=products.find(x=>x.id===id);return s+(+v-(p?.stock||0))*(p?.cost||0);},0)))}</span></div>}

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
                          <td><input type="number" min="0" value={counts[p.id]||""} onChange={e=>saveCounts({...counts,[p.id]:e.target.value})} style={{width:80,textAlign:"center"}} placeholder="—"/></td>
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
                  <div className="form-group"><label>Notes</label><textarea value={notes} onChange={e=>saveNotes(e.target.value)} placeholder="Stock take notes…" rows={2}/></div>
                  <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                    <button className="btn btn-secondary" onClick={()=>{if(window.confirm("Clear all counts?"))saveCounts({});}}>Clear Counts</button>
                    <button className="btn btn-primary" onClick={applyCount} disabled={!adjCount}>Complete Stock Take ({adjCount} items)</button>
                  </div>
                </div>
              </div>
            </>
          )}
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
                    {st.started_at&&<div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>🕐 Started: {new Date(st.started_at).toLocaleString("en-JM",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>}
                    {st.completed_at&&<div style={{fontSize:11,color:"var(--success)",marginTop:1}}>✅ Completed: {new Date(st.completed_at).toLocaleString("en-JM",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>}
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
function TransfersPage({ products, setProducts, transfers, setTransfers, stores, setStores, settings, showToast }) {
  // Multiple drafts — all transfers with status="draft"
  const normalizeDraft = (t) => ({
    ...t,
    items: (t.items||[]).map(i => ({
      pid: i.pid || i.product_id,
      name: i.name,
      sku: i.sku||"",
      barcode: i.barcode||"",
      qty: i.qty||1,
      cost: i.cost||0,
      maxQty: products.find(p=>p.id===(i.pid||i.product_id))?.stock ?? 999,
    }))
  });
  const draftTransfers = transfers.filter(t=>t.status==="draft").map(normalizeDraft);
  // activeDraftId: which draft is currently being edited
  const [activeDraftId, setActiveDraftId] = useState(() => draftTransfers[0]?.id || null);
  const draft = draftTransfers.find(d=>d.id===activeDraftId) || draftTransfers[0] || null;
  const [storeForm, setStoreForm] = useState({show:false,editing:null,name:"",address:"",phone:"",manager:""});
  const saveStore = async () => {
    const {name,address,phone,manager,editing} = storeForm;
    if(!name.trim()){return;}
    if(editing){
      await supabase.from("stores").update({name,address,phone,manager}).eq("id",editing.id);
      setStores(p=>p.map(s=>s.id===editing.id?{...s,name,address,phone,manager}:s));
      showToast("Store updated");
    } else {
      const {data} = await supabase.from("stores").insert({name,address,phone,manager}).select().single();
      if(data) setStores(p=>[...p,data]);
      showToast("Store added");
    }
    setStoreForm({show:false,editing:null,name:"",address:"",phone:"",manager:""});
  };
  const deleteStore = async (id) => {
    if(!window.confirm("Delete this store? This cannot be undone.")) return;
    await supabase.from("stores").delete().eq("id",id);
    setStores(p=>p.filter(s=>s.id!==id));
    showToast("Store deleted");
  };
  const [showNewForm, setShowNewForm] = useState(false);
  const [newStore, setNewStore] = useState(stores[0]?.id||"");
  const [newPO, setNewPO] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [creating, setCreating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("active");

  const activeProducts = products.filter(p=>p.active&&p.stock>0);
  const filteredProds = activeProducts.filter(p=>!search||
    p.name?.toLowerCase().includes(search.toLowerCase())||
    p.sku?.toLowerCase().includes(search.toLowerCase())||
    p.barcode?.includes(search));

  // ── Start a new draft transfer ──
  const startDraft = async () => {
    if(!newStore){showToast("Select a store","err");return;}
    setCreating(true);
    const store = stores.find(s=>s.id===newStore);
    const id = genId(settings.transfer_prefix||"TRF", transfers);
    // Save as draft (status="draft") — stock NOT yet deducted
    const {data:tr, error} = await supabase.from("transfers").insert({
      id, store_id:newStore, store_name:store?.name||"",
      date:today(), total_cost:0, notes:newNotes,
      po_number:newPO, status:"draft", created_at:new Date().toISOString()
    }).select().single();
    if(error){showToast("Failed to create draft: "+error.message,"err");setCreating(false);return;}
    const newDraft = {...tr, items:[]};
    setTransfers(p=>[newDraft,...p]);
    setActiveDraftId(newDraft.id);
    setShowNewForm(false);
    setNewPO(""); setNewNotes("");
    setCreating(false);
    setTab("active");
    showToast(`Transfer ${id} opened — add items then complete`);
  };

  // ── Add item to draft (persists to DB immediately) ──
  const addItem = async (product) => {
    if(!draft) return;
    if(draft.items.find(i=>i.pid===product.id)) return;
    const newItem = {pid:product.id,sku:product.sku||"",barcode:product.barcode||"",name:product.name,cost:product.cost,qty:1,maxQty:product.stock};
    // Persist to transfer_items so it survives navigation
    await supabase.from("transfer_items").upsert({transfer_id:draft.id,product_id:product.id,name:product.name,sku:product.sku||"",barcode:product.barcode||"",qty:1,cost:product.cost},{onConflict:"transfer_id,product_id",ignoreDuplicates:false});
    const updated = {...draft, items:[...draft.items, newItem]};
    setTransfers(p=>p.map(t=>t.id===draft.id?updated:t));
  };

  const updateItem = async (pid, qty) => {
    if(!draft) return;
    let updated;
    if(+qty<=0){
      await supabase.from("transfer_items").delete().eq("transfer_id",draft.id).eq("product_id",pid);
      updated = {...draft, items:draft.items.filter(i=>i.pid!==pid)};
    } else {
      const newQty = Math.min(+qty, draft.items.find(i=>i.pid===pid)?.maxQty||999);
      await supabase.from("transfer_items").update({qty:newQty}).eq("transfer_id",draft.id).eq("product_id",pid);
      updated = {...draft, items:draft.items.map(i=>i.pid===pid?{...i,qty:newQty}:i)};
    }
    setTransfers(p=>p.map(t=>t.id===draft.id?updated:t));
  };

  const removeItem = (pid) => updateItem(pid, 0);

  // ── Update draft header fields ──
  const updateDraftField = async (field, value) => {
    const updated = {...draft, [field]:value};
    setTransfers(p=>p.map(t=>t.id===draft.id?updated:t));
    await supabase.from("transfers").update({[field]:value}).eq("id",draft.id);
  };

  // ── Complete transfer — deduct stock, save items, mark complete ──
  const completeTransfer = async () => {
    if(!draft||!draft.items.length){showToast("Add items before completing","err");return;}
    setCompleting(true);
    const trItems = draft.items.map(i=>({product_id:i.pid,name:i.name,sku:i.sku||"",barcode:i.barcode,qty:i.qty,cost:i.cost}));
    const total = draft.items.reduce((s,i)=>s+i.cost*i.qty,0);

    // Save items
    await supabase.from("transfer_items").delete().eq("transfer_id",draft.id);
    await supabase.from("transfer_items").insert(trItems.map(i=>({...i,transfer_id:draft.id})));

    // Deduct stock
    for(const i of draft.items){
      const prod=products.find(x=>x.id===i.pid);
      const newStock=Math.max(0,(prod?.stock||0)-i.qty);
      await supabase.from("products").update({stock:newStock}).eq("id",i.pid);
    }
    setProducts(p=>p.map(x=>{const ci=draft.items.find(i=>i.pid===x.id);return ci?{...x,stock:Math.max(0,x.stock-ci.qty)}:x;}));

    // Mark transfer complete
    await supabase.from("transfers").update({status:"complete",total_cost:total}).eq("id",draft.id);
    const completed = {...draft, status:"complete", total_cost:total, items:trItems};
    setTransfers(p=>p.map(t=>t.id===draft.id?completed:t));
    setActiveDraftId(null);
    setCompleting(false);
    setTab("history");
    showToast(`Transfer ${draft.id} completed — stock deducted ✓`);
  };

  // ── Discard draft ──
  const discardDraft = async () => {
    if(!draft)return;
    if(!window.confirm("Discard this draft transfer? No stock will be affected."))return;
    await supabase.from("transfer_items").delete().eq("transfer_id",draft.id);
    await supabase.from("transfers").delete().eq("id",draft.id);
    setTransfers(p=>p.filter(t=>t.id!==draft.id));
    setActiveDraftId(null);
    showToast("Draft discarded");
  };

  const downloadTransfer = (tr) => {
    const rows=[
      ["Transfer ID",tr.id],["Store",tr.store_name],["PO #",tr.po_number||"—"],["Date",tr.date],["Total Cost",tr.total_cost],["Notes",tr.notes||""],[""],
      ["Barcode","Brand","Product","Qty","Unit Cost","Total Cost"],
      ...(tr.items||[]).map(i=>{ const p=undefined; return [i.barcode||"",i.brand||"",i.name,i.qty,i.cost,i.qty*i.cost]; })
    ];
    downloadCSV(rows,`${tr.id}.csv`);
    showToast("Transfer sheet downloaded");
  };

  const completedTransfers = transfers.filter(t=>t.status!=="draft");

  // Download a draft transfer as CSV
  const downloadDraftCSV = (tr) => {
    const rows=[
      ["Transfer ID",tr.id],["Store",tr.store_name],["PO #",tr.po_number||"—"],["Date",tr.date],["Status","Draft"],["Notes",tr.notes||""],[""],
      ["Barcode","Product","Qty","Unit Cost","Total Cost"],
      ...(tr.items||[]).map(i=>[i.barcode||"",i.name,i.qty,i.cost,i.qty*i.cost])
    ];
    downloadCSV(rows,`${tr.id}_draft.csv`);
    showToast("Draft transfer downloaded");
  };

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div className="tabs" style={{margin:0}}>
          <button className={`tab ${tab==="active"?"active":""}`} onClick={()=>setTab("active")}>
            Active Drafts {draftTransfers.length>0?<span className="badge bb" style={{fontSize:9,marginLeft:4}}>{draftTransfers.length} open</span>:null}
          </button>
          <button className={`tab ${tab==="history"?"active":""}`} onClick={()=>setTab("history")}>Transfer History ({completedTransfers.length})</button>
          <button className={`tab ${tab==="stores"?"active":""}`} onClick={()=>setTab("stores")}>🏬 Store Locations ({stores.length})</button>
        </div>
        {tab!=="stores"&&!showNewForm&&(
          <button className="btn btn-primary btn-sm" onClick={()=>setShowNewForm(true)}>+ New Transfer</button>
        )}
        {tab==="stores"&&(
          <button className="btn btn-primary btn-sm" onClick={()=>setStoreForm({show:true,editing:null,name:"",address:"",phone:"",manager:""})}>+ Add Store</button>
        )}
      </div>

      {/* New transfer form */}
      {showNewForm&&(
        <div className="card" style={{marginBottom:16}}>
          <div className="card-header"><h3>🏪 Start New Transfer</h3></div>
          <div className="card-body">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              <div className="form-group" style={{margin:0}}>
                <label>Destination Store *</label>
                <select value={newStore} onChange={e=>setNewStore(e.target.value)}>
                  {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Purchase Order #</label>
                <input value={newPO} onChange={e=>setNewPO(e.target.value)} placeholder="e.g. PO-2026-001"/>
              </div>
              <div className="form-group" style={{margin:0}}>
                <label>Notes</label>
                <input value={newNotes} onChange={e=>setNewNotes(e.target.value)} placeholder="Optional notes…"/>
              </div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button className="btn btn-secondary" onClick={()=>setShowNewForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={startDraft} disabled={creating}>
                {creating?"Creating…":"Create Transfer →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active draft */}
      {tab==="active"&&(
        <>
          {/* Draft selector tabs when multiple drafts exist */}
          {draftTransfers.length>1&&(
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {draftTransfers.map(d=>(
                <button key={d.id}
                  className={`btn btn-sm ${activeDraftId===d.id?"btn-primary":"btn-secondary"}`}
                  onClick={()=>setActiveDraftId(d.id)}>
                  {d.id} → {d.store_name||"?"}
                  <span className="badge bb" style={{fontSize:9,marginLeft:6}}>{d.items.length} items</span>
                </button>
              ))}
            </div>
          )}
          {draftTransfers.length===0&&!showNewForm&&(
            <div className="empty"><div className="ei">🏪</div><p>No open transfers. Click <strong>+ New Transfer</strong> to start.</p></div>
          )}
          {draft&&(
            <div className="two-col" style={{gap:18,alignItems:"start"}}>
              <div>
                {/* Draft header */}
                <div className="card mb-3">
                  <div className="card-header" style={{justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontFamily:"Syne",fontWeight:700}}>{draft.id}</div>
                      <span className="badge bo" style={{fontSize:10,marginTop:3}}>Draft — not yet complete</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {draft.items.length>0&&<button className="btn btn-secondary btn-xs" onClick={()=>downloadDraftCSV(draft)}>⬇ CSV</button>}
                      {draft.items.length>0&&<button className="btn btn-secondary btn-xs" onClick={()=>printInvoice({...draft,items:draft.items.map(i=>({...i,unit_price:i.cost,qty_ordered:i.qty}))},{name:draft.store_name},{},false)}>🖨 PDF</button>}
                      <button className="btn btn-ghost btn-xs" style={{color:"var(--danger)"}} onClick={discardDraft}>🗑 Discard</button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                      <div className="form-group" style={{margin:0}}>
                        <label>Destination Store</label>
                        <select value={draft.store_id} onChange={e=>{const s=stores.find(x=>x.id===e.target.value);updateDraftField("store_id",e.target.value);updateDraftField("store_name",s?.name||"");}}>
                          {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group" style={{margin:0}}>
                        <label>Purchase Order #</label>
                        <input value={draft.po_number||""} onChange={e=>updateDraftField("po_number",e.target.value)} placeholder="e.g. PO-2026-001"/>
                      </div>
                      <div className="form-group" style={{margin:0}}>
                        <label>Notes</label>
                        <input value={draft.notes||""} onChange={e=>updateDraftField("notes",e.target.value)} placeholder="Optional notes…"/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Draft items */}
                <div className="card">
                  <div className="card-header"><h3>Items ({draft.items.length})</h3></div>
                  {draft.items.length===0
                    ?<div style={{padding:20,textAlign:"center",color:"var(--text3)"}}>Search and add products from the right →</div>
                    :<div className="tbl-wrap">
                      <table><thead><tr><th>Barcode</th><th>Product</th><th>Cost</th><th>Qty</th><th>Total</th><th></th></tr></thead>
                        <tbody>{draft.items.map(i=>(
                          <tr key={i.pid}>
                            <td><code style={{fontSize:10}}>{i.barcode||"—"}</code></td>
                            <td style={{fontSize:12}}>{i.name.slice(0,28)}{i.name.length>28?"…":""}</td>
                            <td style={{fontSize:12}}>{fmt(i.cost)}</td>
                            <td><input type="number" min={1} max={i.maxQty} value={i.qty} onChange={e=>updateItem(i.pid,e.target.value)} style={{width:60,textAlign:"center"}}/></td>
                            <td style={{fontWeight:600}}>{fmt(i.cost*i.qty)}</td>
                            <td><button className="btn btn-danger btn-xs" onClick={()=>removeItem(i.pid)}>✕</button></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  }
                  {draft.items.length>0&&(
                    <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontFamily:"Syne",fontWeight:700,color:"var(--accent)"}}>
                        Total Cost: {fmt(draft.items.reduce((s,i)=>s+i.cost*i.qty,0))}
                      </span>
                      <button className="btn btn-primary" onClick={completeTransfer} disabled={completing}>
                        {completing?"Processing…":"✅ Complete Transfer Order"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Product search */}
              <div className="card">
                <div className="card-header"><h3>Add Products</h3></div>
                <div style={{padding:"12px 16px"}}>
                  <div className="search-wrap"><span className="search-icon">🔍</span>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search inventory…"/>
                  </div>
                </div>
                <div className="tbl-wrap" style={{maxHeight:480,overflowY:"auto"}}>
                  <table><thead><tr><th>Barcode</th><th>Name</th><th>Stock</th><th></th></tr></thead>
                    <tbody>{filteredProds.slice(0,50).map(p=>(
                      <tr key={p.id}>
                        <td><code style={{fontSize:11}}>{p.barcode||"—"}</code></td>
                        <td style={{fontSize:12}}>{p.name}</td>
                        <td style={{fontWeight:700}}>{p.stock}</td>
                        <td><button className="btn btn-primary btn-xs"
                          disabled={!!draft.items.find(i=>i.pid===p.id)}
                          onClick={()=>addItem(p)}>
                          {draft.items.find(i=>i.pid===p.id)?"✓":"Add"}
                        </button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* History */}
      {tab==="history"&&(
        <div>
          {completedTransfers.map(tr=>(
            <div key={tr.id} className="card mb-3">
              <div className="card-header">
                <div>
                  <div style={{fontFamily:"Syne",fontWeight:700}}>{tr.id}</div>
                  <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>→ {tr.store_name} · {tr.date} · {(tr.items||[]).length} items</div>
                  {tr.po_number&&<div style={{fontSize:11,color:"var(--accent)",marginTop:2}}>PO #: {tr.po_number}</div>}
                  {tr.notes&&<div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{tr.notes}</div>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{fontFamily:"Syne",fontWeight:700,fontSize:17,color:"var(--accent)"}}>{fmt(tr.total_cost)}</div>
                  <button className="btn btn-secondary btn-sm" onClick={()=>downloadTransfer(tr)}>⬇ Download</button>
                </div>
              </div>
              <div className="tbl-wrap">
                <table><thead><tr><th>Barcode</th><th>Product</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead>
                  <tbody>{(tr.items||[]).map((item,i)=>(
                    <tr key={i}><td><code style={{fontSize:10}}>{item.barcode||"—"}</code></td><td style={{fontSize:12}}>{item.name}</td><td>{item.qty}</td><td>{fmt(item.cost)}</td><td style={{fontWeight:600}}>{fmt(item.qty*item.cost)}</td></tr>
                  ))}
                  {(tr.items||[]).length>1&&<tr style={{borderTop:"2px solid var(--border)",background:"var(--bg3)",fontWeight:700}}>
                    <td colSpan={2}>TOTALS</td>
                    <td style={{color:"var(--accent)"}}>{(tr.items||[]).reduce((s,i)=>s+i.qty,0)}</td>
                    <td></td>
                    <td style={{color:"var(--accent)"}}>{fmt((tr.items||[]).reduce((s,i)=>s+i.qty*i.cost,0))}</td>
                  </tr>}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {completedTransfers.length===0&&<div className="empty"><div className="ei">🏪</div><p>No completed transfers yet.</p></div>}
        </div>
      )}

      {/* ── Stores tab ── */}
      {tab==="stores"&&(
        <div className="card">
          <div className="tbl-wrap">
            <table>
              <thead><tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Manager</th>
                <th>Actions</th>
              </tr></thead>
              <tbody>
                {stores.length===0&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No stores yet. Add your first store.</td></tr>}
                {stores.map(s=>(
                  <tr key={s.id}>
                    <td style={{fontWeight:600}}>{s.name}</td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{s.address||"—"}</td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{s.phone||"—"}</td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{s.manager||"—"}</td>
                    <td><div className="tbl-actions">
                      <button className="btn btn-secondary btn-xs" onClick={()=>setStoreForm({show:true,editing:s,name:s.name,address:s.address||"",phone:s.phone||"",manager:s.manager||""})}>Edit</button>
                      <button className="btn btn-danger btn-xs" onClick={()=>deleteStore(s.id)}>Del</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Store add/edit modal ── */}
      {storeForm.show&&(
        <div className="overlay"><div className="modal modal-sm">
          <div className="modal-head">
            <h2>{storeForm.editing?"Edit Store":"Add Store"}</h2>
            <button className="xbtn" onClick={()=>setStoreForm(f=>({...f,show:false}))}>✕</button>
          </div>
          <div className="modal-body">
            <div className="form-group"><label>Store Name *</label><input value={storeForm.name} onChange={e=>setStoreForm(f=>({...f,name:e.target.value}))}/></div>
            <div className="form-group"><label>Address</label><input value={storeForm.address} onChange={e=>setStoreForm(f=>({...f,address:e.target.value}))}/></div>
            <div className="form-group"><label>Phone</label><input value={storeForm.phone} onChange={e=>setStoreForm(f=>({...f,phone:e.target.value}))}/></div>
            <div className="form-group"><label>Manager / Contact</label><input value={storeForm.manager} onChange={e=>setStoreForm(f=>({...f,manager:e.target.value}))}/></div>
          </div>
          <div className="modal-foot">
            <button className="btn btn-secondary" onClick={()=>setStoreForm(f=>({...f,show:false}))}>Cancel</button>
            <button className="btn btn-primary" onClick={saveStore} disabled={!storeForm.name.trim()}>Save</button>
          </div>
        </div></div>
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

    const isConsignment = order.type==="consignment";

    // Determine new status
    const allItemsReturned = (order.items||[]).every(oi => {
      const ri = refundItems.find(r=>r.product_id===oi.product_id);
      return ri && ri.qty >= oi.qty;
    });
    const newStatus = allItemsReturned ? "refunded" : "partial_refund";

    // Return items to stock
    for (const item of refundItems) {
      const prod = products.find(p=>p.id===item.product_id);
      if (prod) {
        const newStock = prod.stock + item.qty;
        await supabase.from("products").update({stock:newStock}).eq("id",item.product_id);
        setProducts(prev=>prev.map(p=>p.id===item.product_id?{...p,stock:newStock}:p));
      }
    }

    let updatePayload = { status: newStatus };
    let toastMsg = `${refundItems.length} item(s) returned to stock`;

    if (!isConsignment) {
      // Only adjust financials for non-consignment orders
      const refundSubtotal = refundItems.reduce((s,i) => s + i.qty * i.unit_price, 0);
      const taxRate = order.tax_rate || 0;
      const refundTax = Math.round(refundSubtotal * taxRate / 100);
      const refundTotal = refundSubtotal + refundTax;
      const alreadyRefunded = order.refunded_total || 0;
      const newTotal = Math.max(0, (order.total||0) - refundTotal);
      const newSubtotal = Math.max(0, (order.subtotal||0) - refundSubtotal);
      const newTaxAmount = Math.max(0, (order.tax_amount||0) - refundTax);
      updatePayload = { ...updatePayload, total:newTotal, subtotal:newSubtotal, tax_amount:newTaxAmount, refunded_total:alreadyRefunded+refundTotal };
      toastMsg = `Refund processed — ${fmt(refundTotal)} deducted, ` + toastMsg;
      setOrders(prev=>prev.map(o=>o.id===order.id?{...o,...updatePayload,total:newTotal,subtotal:newSubtotal,tax_amount:newTaxAmount,refunded_total:alreadyRefunded+refundTotal}:o));
    } else {
      toastMsg = "Consignment return — " + toastMsg + " (no financial adjustment)";
      setOrders(prev=>prev.map(o=>o.id===order.id?{...o,status:newStatus}:o));
    }

    await supabase.from("orders").update(updatePayload).eq("id", order.id);

    // Log
    try { await supabase.from("activity_log").insert({
      action:"refund_processed",
      details:`${isConsignment?"Consignment return":"Refund"} of ${refundItems.length} item(s) on order ${order.id}.${isConsignment?"":" Order total adjusted."}`,
      entity_type:"order", entity_id:String(order.id),
      user_name:currentUserName, timestamp:new Date().toISOString()
    }); } catch(e) {}

    setProcessing(false);
    showToast(toastMsg);
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

// ─────────────────────────────────────────────────────────────────────────────
// ─── ORDERS PAGE (Admin - active orders before invoicing) ─────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function OrdersPage({ orders, setOrders, backorders, setBackorders, customers, settings, showToast, products, setProducts }) {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [shipModal, setShipModal] = useState(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [tab, setTab] = useState("active");

  const activeOrders = useMemo(() => orders.filter(o => {
    if (o.status !== "order") return false;
    if (filterDate && !o.date?.startsWith(filterDate)) return false;
    const q = search.toLowerCase();
    if (q && !o.id.toLowerCase().includes(q) && !o.customer_name?.toLowerCase().includes(q)) return false;
    return true;
  }), [orders, search, filterDate]);

  const cancelledOrders = useMemo(() => orders.filter(o => {
    if (o.status !== "cancelled") return false;
    const q = search.toLowerCase();
    if (q && !o.id.toLowerCase().includes(q) && !o.customer_name?.toLowerCase().includes(q)) return false;
    return true;
  }), [orders, search]);

  const { sorted, key, dir, toggle } = useSort(activeOrders, "date");
  const pg = usePagination(sorted, 20);
  const { sorted: sortedCancelled } = useSort(cancelledOrders, "date");
  const pgC = usePagination(sortedCancelled, 20);

  const doCancel = async (order, reason) => {
    const note = reason ? `Cancelled: ${reason}` : "Cancelled by admin";
    const newNotes = order.notes ? order.notes + "\n" + note : note;
    const { error } = await supabase.from("orders").update({ status: "cancelled", notes: newNotes }).eq("id", order.id);
    if (error) { showToast("Failed to cancel: " + error.message, "err"); return; }
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: "cancelled", notes: newNotes } : o));
    try { await supabase.from("activity_log").insert({ action: "order_status", details: `Order ${order.id} cancelled${reason ? ": " + reason : ""}`, entity_type: "order", entity_id: order.id, user_name: currentUserName, timestamp: new Date().toISOString() }); } catch(e) {}
    showToast(`Order ${order.id} cancelled`);
    setCancelModal(null);
  };

  const tableHeaders = (
    <thead><tr>
      <SortTh label="Order #" sortKey="id" current={key} dir={dir} onToggle={toggle}/>
      <SortTh label="Customer" sortKey="customer_name" current={key} dir={dir} onToggle={toggle}/>
      <SortTh label="Date" sortKey="date" current={key} dir={dir} onToggle={toggle}/>
      <th>Type</th><th>Payment</th>
      <SortTh label="Total" sortKey="total" current={key} dir={dir} onToggle={toggle}/>
      <th>Status</th><th>Actions</th>
    </tr></thead>
  );

  const renderRow = (o, isActive) => (
    <tr key={o.id}>
      <td><code>{o.id}</code></td>
      <td style={{fontWeight:500}}>{o.customer_name}</td>
      <td style={{fontSize:12,color:"var(--text2)"}}>{o.date}</td>
      <td><span className={`badge ${o.type==="consignment"?"bo":"bb"}`}>{o.type||"standard"}</span></td>
      <td style={{fontSize:12,color:"var(--text2)"}}>{o.payment_method||"\u2014"}</td>
      <td style={{fontWeight:600,color:"var(--accent)"}}>
        {o.type==="consignment"?<span style={{fontSize:11,color:"var(--text3)",fontStyle:"italic"}}>Consignment</span>:fmt(o.total)}
      </td>
      <td><StatusBadge status={o.status}/></td>
      <td><div className="tbl-actions">
        {isActive&&<button className="btn btn-primary btn-xs" onClick={()=>setShipModal(o)}>View & Ship</button>}
        {isActive&&<button className="btn btn-ghost btn-xs" onClick={()=>setShowEmailModal(o)}>\u{1F4E7}</button>}
        {isActive&&<button className="btn btn-danger btn-xs" onClick={()=>setCancelModal(o)}>\u2715</button>}
        {!isActive&&o.notes&&<span style={{fontSize:11,color:"var(--text3)",maxWidth:220,display:"inline-block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={o.notes}>{o.notes}</span>}
      </div></td>
    </tr>
  );

  return (
    <>
      <div className="filter-bar">
        <div className="search-wrap" style={{flex:2}}>
          <span className="search-icon">\u{1F50D}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by order # or customer\u2026"/>
        </div>
        <input type="month" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{width:"auto",padding:"6px 10px"}}/>
        <PageSizeSelect perPage={pg.perPage} setPerPage={pg.setPerPage} reset={pg.reset}/>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowCreateOrder(true)}>+ Create Order</button>
      </div>

      <div className="tabs" style={{marginBottom:0}}>
        <button className={`tab ${tab==="active"?"active":""}`} onClick={()=>setTab("active")}>
          Active {activeOrders.length>0&&<span className="badge bb" style={{fontSize:9,marginLeft:4}}>{activeOrders.length}</span>}
        </button>
        <button className={`tab ${tab==="cancelled"?"active":""}`} onClick={()=>setTab("cancelled")}>
          Cancelled {cancelledOrders.length>0&&<span className="badge br" style={{fontSize:9,marginLeft:4}}>{cancelledOrders.length}</span>}
        </button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            {tableHeaders}
            <tbody>
              {tab==="active"&&<>
                {pg.sliced.map(o=>renderRow(o,true))}
                {pg.sliced.length===0&&<tr><td colSpan={8} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No active orders.</td></tr>}
              </>}
              {tab==="cancelled"&&<>
                {pgC.sliced.map(o=>renderRow(o,false))}
                {pgC.sliced.length===0&&<tr><td colSpan={8} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No cancelled orders.</td></tr>}
              </>}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:12,color:"var(--text3)"}}>{tab==="active"?pg.total:pgC.total} order{(tab==="active"?pg.total:pgC.total)!==1?"s":""}</span>
          <Pagination page={tab==="active"?pg.page:pgC.page} totalPages={tab==="active"?pg.totalPages:pgC.totalPages} setPage={tab==="active"?pg.setPage:pgC.setPage}/>
        </div>
      </div>

      {shipModal&&<ShipOrderModal order={shipModal} orders={orders} setOrders={setOrders} backorders={backorders} setBackorders={setBackorders} products={products} setProducts={setProducts} settings={settings} showToast={showToast} onClose={()=>setShipModal(null)}/>}
      {showEmailModal&&<OrderEmailModal order={showEmailModal} customers={customers} settings={settings} onClose={()=>setShowEmailModal(null)} showToast={showToast}/>}
      {cancelModal&&<CancelReasonModal title="Cancel Order" itemLabel={`${cancelModal.id} \u2014 ${cancelModal.customer_name}`} onConfirm={r=>doCancel(cancelModal,r)} onClose={()=>setCancelModal(null)}/>}
      {showCreateOrder&&<AdminCreateOrderModal customers={customers} products={products} orders={orders} setOrders={setOrders} settings={settings} showToast={showToast} onClose={()=>setShowCreateOrder(false)}/>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── ADMIN CREATE ORDER MODAL ────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AdminCreateOrderModal({ customers, products, orders, setOrders, settings, showToast, onClose }) {
  const approvedCustomers = customers.filter(c=>c.approved&&c.role==="buyer");

  // Customer selection or new customer creation
  const [custMode, setCustMode] = useState("existing"); // "existing" | "new"
  const [selectedCustId, setSelectedCustId] = useState(approvedCustomers[0]?.id||"");
  const [newCust, setNewCust] = useState({name:"",company:"",email:"",phone:"",tax_id:"",customer_type:"upfront"});

  // Order items
  const [items, setItems] = useState([]); // [{product_id, name, barcode, qty, unit_price}]
  const [productSearch, setProductSearch] = useState("");
  const [payMethod, setPayMethod] = useState("Bank Transfer");
  const [orderType, setOrderType] = useState("standard");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const [prodFilterBrand, setProdFilterBrand] = useState("Brand");
  const [prodFilterCat, setProdFilterCat] = useState("Category");
  const [prodSortKey, setProdSortKey] = useState("name");

  const activeProducts = products.filter(p=>p.active&&p.wholesale_visible!==false);
  const prodBrands = ["Brand",...[...new Set(activeProducts.map(p=>p.brand).filter(Boolean))].sort()];
  const prodCats   = ["Category",...[...new Set(activeProducts.map(p=>p.category).filter(Boolean))].sort()];

  const searchedProducts = activeProducts.filter(p => {
    const q = productSearch.toLowerCase();
    if (q && !p.name?.toLowerCase().includes(q) && !p.barcode?.includes(q) && !p.brand?.toLowerCase().includes(q)) return false;
    if (prodFilterBrand !== "Brand" && p.brand !== prodFilterBrand) return false;
    if (prodFilterCat   !== "Category" && p.category !== prodFilterCat) return false;
    return true;
  }).sort((a,b) => {
    if (prodSortKey==="stock_asc")  return (a.stock||0)-(b.stock||0);
    if (prodSortKey==="stock_desc") return (b.stock||0)-(a.stock||0);
    if (prodSortKey==="price_asc")  return (a.wholesale_price||0)-(b.wholesale_price||0);
    if (prodSortKey==="price_desc") return (b.wholesale_price||0)-(a.wholesale_price||0);
    return (a.name||"").localeCompare(b.name||"");
  });

  const addProduct = (p) => {
    if (items.find(i=>i.product_id===p.id)) return;
    setItems(prev=>[...prev,{product_id:p.id,name:p.name,barcode:p.barcode||"",sku:p.sku||"",unit_price:p.wholesale_price||0,qty:1,stock:p.stock}]);
  };
  const removeItem = (pid) => setItems(prev=>prev.filter(i=>i.product_id!==pid));
  const updateItem = (pid, field, val) => setItems(prev=>prev.map(i=>i.product_id===pid?{...i,[field]:field==="qty"||field==="unit_price"?Number(val)||0:val}:i));

  const isConsignment = orderType==="consignment";
  const taxRate = settings?.tax_rate||0;
  const subtotal = isConsignment ? 0 : items.reduce((s,i)=>s+i.qty*(i.unit_price||0),0);
  const taxAmt = isConsignment ? 0 : Math.round(subtotal*taxRate/100);
  const total = subtotal + taxAmt;
  const fmt = n => "J$"+Number(n||0).toLocaleString();

  const handleSubmit = async () => {
    if (!items.length) { showToast("Add at least one item","err"); return; }
    setBusy(true);
    try {
      let custId = selectedCustId;
      let custName = approvedCustomers.find(c=>c.id===custId)?.company || approvedCustomers.find(c=>c.id===custId)?.name || "";

      // Create new customer profile if needed
      if (custMode==="new") {
        if (!newCust.name.trim()&&!newCust.company.trim()) { showToast("Enter customer name or company","err"); setBusy(false); return; }
        const profileData = {
          name: newCust.name.trim()||newCust.company.trim(),
          company: newCust.company.trim()||newCust.name.trim(),
          email: newCust.email.trim()||null,
          phone: newCust.phone.trim()||null,
          tax_id: newCust.tax_id.trim()||null,
          customer_type: newCust.customer_type,
          role: "buyer",
          approved: true,
          discount_pct: 0,
          min_order_value: 0,
          created_at: new Date().toISOString(),
        };
        const { data: newProfile, error: profErr } = await supabase.from("profiles").insert(profileData).select().single();
        if (profErr) {
          // If profiles requires auth uid we can't auto-create — store as manual customer
          custId = "MANUAL-" + Date.now();
          custName = profileData.company||profileData.name;
          showToast("Note: customer saved on order only (no portal login created)","warn");
        } else {
          custId = newProfile.id;
          custName = newProfile.company||newProfile.name;
          showToast(`Customer "${custName}" created`);
        }
      }

      const id = genId("ORD", orders);
      const orderData = {
        id, customer_id: custId, customer_name: custName,
        date: today(), status: "order",
        payment_method: payMethod,
        subtotal, tax_rate: taxRate, tax_amount: taxAmt, total,
        notes: notes||(custMode==="new"?"Admin-created order":"Admin-created order on behalf of customer"),
        type: orderType,
        created_at: new Date().toISOString(),
      };
      const { error: orderErr } = await supabase.from("orders").insert(orderData);
      if (orderErr) { showToast("Failed to create order: "+orderErr.message,"err"); setBusy(false); return; }
      const orderItems = items.map(i=>({order_id:id,product_id:i.product_id,name:i.name,qty:i.qty,unit_price:i.unit_price,barcode:i.barcode||"",sku:i.sku||""}));
      await supabase.from("order_items").insert(orderItems);
      setOrders(prev=>[{...orderData,items:orderItems},...prev]);
      showToast(`Order ${id} created for ${custName} ✓`);
      onClose();
    } catch(e) {
      showToast("Error: "+e.message,"err");
    }
    setBusy(false);
  };

  return (
    <div className="overlay"><div className="modal modal-lg">
      <div className="modal-head">
        <h2>📋 Create Order on Behalf of Customer</h2>
        <button className="xbtn" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

        {/* LEFT: Customer + order details */}
        <div>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1}}>Customer</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <button className={`btn btn-sm ${custMode==="existing"?"btn-primary":"btn-secondary"}`} onClick={()=>setCustMode("existing")}>Existing Customer</button>
            <button className={`btn btn-sm ${custMode==="new"?"btn-primary":"btn-secondary"}`} onClick={()=>setCustMode("new")}>New Customer</button>
          </div>

          {custMode==="existing"&&(
            <div className="form-group">
              <label>Select Customer</label>
              <select value={selectedCustId} onChange={e=>setSelectedCustId(e.target.value)}>
                {approvedCustomers.map(c=><option key={c.id} value={c.id}>{c.company||c.name} — {c.email||"no email"}</option>)}
              </select>
            </div>
          )}

          {custMode==="new"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div className="form-group" style={{margin:0}}><label>Name</label><input value={newCust.name} onChange={e=>setNewCust(p=>({...p,name:e.target.value}))} placeholder="Contact name"/></div>
              <div className="form-group" style={{margin:0}}><label>Company</label><input value={newCust.company} onChange={e=>setNewCust(p=>({...p,company:e.target.value}))} placeholder="Business name"/></div>
              <div className="form-group" style={{margin:0}}><label>Email</label><input type="email" value={newCust.email} onChange={e=>setNewCust(p=>({...p,email:e.target.value}))} placeholder="email@example.com"/></div>
              <div className="form-group" style={{margin:0}}><label>Phone</label><input value={newCust.phone} onChange={e=>setNewCust(p=>({...p,phone:e.target.value}))} placeholder="876-xxx-xxxx"/></div>
              <div className="form-group" style={{margin:0}}><label>TRN</label><input value={newCust.tax_id} onChange={e=>setNewCust(p=>({...p,tax_id:e.target.value}))} placeholder="Tax Registration #"/></div>
              <div className="form-group" style={{margin:0}}>
                <label>Customer Type</label>
                <select value={newCust.customer_type} onChange={e=>setNewCust(p=>({...p,customer_type:e.target.value}))}>
                  <option value="upfront">Upfront</option>
                  <option value="consignment">Consignment</option>
                </select>
              </div>
            </div>
          )}

          <div style={{marginTop:16,fontWeight:700,fontSize:13,marginBottom:10,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1}}>Order Details</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="form-group" style={{margin:0}}>
              <label>Order Type</label>
              <select value={orderType} onChange={e=>setOrderType(e.target.value)}>
                <option value="standard">Standard</option>
                <option value="consignment">Consignment</option>
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Payment Method</label>
              <select value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Cheque</option>
                <option>Credit</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{marginTop:10}}>
            <label>Notes</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Order notes (via phone, email, etc.)…"/>
          </div>
        </div>

        {/* RIGHT: Product picker + items */}
        <div style={{display:"flex",flexDirection:"column",minHeight:0}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:"var(--text2)",textTransform:"uppercase",letterSpacing:1}}>Products</div>

          {/* Filters row */}
          <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            <div className="search-wrap" style={{flex:2,minWidth:120}}>
              <span className="search-icon">🔍</span>
              <input value={productSearch} onChange={e=>setProductSearch(e.target.value)} placeholder="Search…"/>
            </div>
            <select value={prodFilterBrand} onChange={e=>setProdFilterBrand(e.target.value)} style={{padding:"5px 8px",borderRadius:6,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:12}}>
              {prodBrands.map(b=><option key={b}>{b}</option>)}
            </select>
            <select value={prodFilterCat} onChange={e=>setProdFilterCat(e.target.value)} style={{padding:"5px 8px",borderRadius:6,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:12}}>
              {prodCats.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={prodSortKey} onChange={e=>setProdSortKey(e.target.value)} style={{padding:"5px 8px",borderRadius:6,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:12}}>
              <option value="name">A–Z</option>
              <option value="stock_desc">Stock ↓</option>
              <option value="stock_asc">Stock ↑</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
          </div>

          {/* Scrollable product list */}
          <div style={{border:"1px solid var(--border)",borderRadius:8,overflowY:"auto",maxHeight:200,marginBottom:10,background:"var(--bg)"}}>
            {searchedProducts.length===0
              ? <div style={{padding:"14px",textAlign:"center",color:"var(--text3)",fontSize:13}}>No products match filters</div>
              : searchedProducts.map(p=>{
                  const alreadyAdded = !!items.find(i=>i.product_id===p.id);
                  const stockColor = p.stock===0?"var(--danger)":p.stock<=5?"var(--warn)":"var(--success)";
                  return (
                    <div key={p.id}
                      onClick={()=>!alreadyAdded&&addProduct(p)}
                      style={{display:"grid",gridTemplateColumns:"1fr auto auto",alignItems:"center",gap:8,padding:"7px 12px",borderBottom:"1px solid var(--border)",cursor:alreadyAdded?"default":"pointer",opacity:alreadyAdded?0.45:1,fontSize:13,background:alreadyAdded?"var(--bg2)":"transparent"}}
                      onMouseEnter={e=>{if(!alreadyAdded)e.currentTarget.style.background="var(--bg3)"}}
                      onMouseLeave={e=>{if(!alreadyAdded)e.currentTarget.style.background="transparent"}}>
                      <div>
                        <div style={{fontWeight:500,lineHeight:1.3}}>{p.name}</div>
                        <div style={{fontSize:10,color:"var(--text3)"}}>{p.brand||""}{p.barcode?" · "+p.barcode:""}</div>
                      </div>
                      <div style={{textAlign:"right",minWidth:54}}>
                        <div style={{fontWeight:600,fontSize:12,color:stockColor}}>{p.stock??0}</div>
                        <div style={{fontSize:9,color:"var(--text3)"}}>in stock</div>
                      </div>
                      <div style={{minWidth:60,textAlign:"right"}}>
                        {alreadyAdded
                          ? <span style={{fontSize:10,color:"var(--success)",fontWeight:600}}>✓ Added</span>
                          : <span style={{fontSize:11,color:"var(--accent)",fontWeight:600}}>{fmt(p.wholesale_price)}</span>}
                      </div>
                    </div>
                  );
                })
            }
          </div>

          {/* Items already added */}
          {items.length===0
            ? <div style={{textAlign:"center",color:"var(--text3)",padding:"12px 0",fontSize:12}}>Click a product above to add it</div>
            : <div className="tbl-wrap" style={{maxHeight:200,overflowY:"auto",marginBottom:10}}>
                <table>
                  <thead><tr>
                    <th>Product</th>
                    <th style={{textAlign:"center"}}>Stock</th>
                    {!isConsignment&&<th style={{textAlign:"right"}}>Price</th>}
                    <th style={{textAlign:"center"}}>Qty</th>
                    <th></th>
                  </tr></thead>
                  <tbody>{items.map(i=>{
                    const stockColor = i.stock===0?"var(--danger)":i.stock<=5?"var(--warn)":"var(--success)";
                    return (
                      <tr key={i.product_id}>
                        <td style={{fontSize:12}}>
                          <div style={{fontWeight:500}}>{i.name.slice(0,26)}{i.name.length>26?"…":""}</div>
                          {i.barcode&&<div style={{fontSize:10,color:"var(--text3)"}}>{i.barcode}</div>}
                        </td>
                        <td style={{textAlign:"center",fontWeight:600,fontSize:12,color:stockColor}}>{i.stock??0}</td>
                        {!isConsignment&&<td style={{textAlign:"right"}}><input type="number" value={i.unit_price} onChange={e=>updateItem(i.product_id,"unit_price",e.target.value)} style={{width:72,textAlign:"right"}}/></td>}
                        <td style={{textAlign:"center"}}><input type="number" min={1} value={i.qty} onChange={e=>updateItem(i.product_id,"qty",e.target.value)} style={{width:52,textAlign:"center"}}/></td>
                        <td><button className="btn btn-danger btn-xs" onClick={()=>removeItem(i.product_id)}>✕</button></td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
          }

          {items.length>0&&!isConsignment&&(
            <div style={{background:"var(--bg3)",borderRadius:8,padding:"10px 14px",fontSize:13,marginTop:"auto"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {taxRate>0&&<div style={{display:"flex",justifyContent:"space-between",color:"var(--text2)"}}><span>GCT ({taxRate}%)</span><span>{fmt(taxAmt)}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,marginTop:6,fontSize:15,color:"var(--accent)"}}><span>Total</span><span>{fmt(total)}</span></div>
            </div>
          )}
        </div>
      </div>

      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={busy||!items.length}>
          {busy?"Creating…":"✓ Create Order"}
        </button>
      </div>
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── SHIP ORDER MODAL ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ShipOrderModal({ order, orders, setOrders, backorders, setBackorders, products, setProducts, settings, showToast, onClose, isBackorder=false, backorderRecord=null }) {
  // Build line items - for backorders show remaining qty; for orders subtract already-backordered
  const lineItems = isBackorder
    ? (backorderRecord ? [{
        product_id: backorderRecord.product_id,
        name: backorderRecord.product_name,
        qty: backorderRecord.qty_remaining,
        unit_price: backorderRecord.unit_price,
        barcode: backorderRecord.barcode || "",
      }] : [])
    : (order?.items || []).map(item => {
        // Sum qty already shipped (open backorders for this product on this order)
        const alreadyBackordered = (backorders||[])
          .filter(b => b.order_id === order.id && b.product_id === item.product_id && b.status === "open")
          .reduce((s,b) => s + (b.qty_remaining||0), 0);
        const remaining = Math.max(0, item.qty - alreadyBackordered);
        return { ...item, qty: remaining, qty_original: item.qty };
      }).filter(item => item.qty > 0);

  const [shipQtys, setShipQtys] = useState(() => {
    const init = {};
    lineItems.forEach(item => { init[item.product_id] = item.qty; });
    return init;
  });
  const [busy, setBusy] = useState(false);
  const [hideCost, setHideCost] = useState(false);
  const [docLabel, setDocLabel] = useState("Order");

  const downloadOrderCSV = () => {
    const rows = [
      ["Order", order.id], ["Customer", order.customer_name], ["Date", order.date],
      ["Type", order.type||"standard"], ["Payment", order.payment_method||"—"], [""],
      ["Product","Brand","Barcode","Qty Ordered","Ship Qty","Backorder","Unit Cost","Unit Price","Line Total"],
      ...lineItems.map(item => {
        const prod = (typeof products!=="undefined"?products:[]).find(p=>p.id===item.product_id);
        const toShip = Math.max(0, Math.min(parseInt(shipQtys[item.product_id])||0, item.qty));
        return [
          item.name, prod?.brand||"", item.barcode||"", item.qty, toShip, item.qty-toShip,
          Number(prod?.cost||0), Number(item.unit_price||0),
          Number(((item.unit_price||0)*toShip).toFixed(2))
        ];
      }),
      [""],
      ["Subtotal","","","","","","",order.subtotal||0],
      [`GCT (${order.tax_rate||0}%)`, "","","","","","",order.tax_amount||0],
      ["Total","","","","","","",order.total||0],
    ];
    downloadCSV(rows, `${order.id}.csv`);
  };

  const printOrderPDF = () => {
    const customer = { company: order.customer_name };
    const html = buildInvoiceHTML(order, customer, typeof settings!=="undefined"?settings:{}, order.type==="consignment", docLabel);
    const w = window.open("","_blank","width=800,height=600");
    w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(),400);
  };

  const handleShip = async () => {
    setBusy(true);
    try {
      const newBackorders = [];
      const shippedItems = [];

      for (const item of lineItems) {
        const toShip = Math.max(0, Math.min(parseInt(shipQtys[item.product_id]) || 0, item.qty));
        const remaining = item.qty - toShip;

        if (toShip > 0) {
          // Deduct stock
          const { data: prod } = await supabase.from("products").select("stock").eq("id", item.product_id).single();
          if (prod) {
            const newStock = Math.max(0, prod.stock - toShip);
            await supabase.from("products").update({ stock: newStock }).eq("id", item.product_id);
            setProducts(prev => prev.map(p => p.id === item.product_id ? {...p, stock: newStock} : p));
          }
          shippedItems.push({ ...item, qty_shipped: toShip });
        }

        if (remaining > 0) {
          newBackorders.push({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.name,
            qty_ordered: item.qty,
            qty_shipped: toShip,
            qty_remaining: remaining,
            unit_price: item.unit_price,
            barcode: item.barcode || "",
            status: "open",
            created_at: new Date().toISOString(),
          });
        }
      }

      // Insert backorders if any
      if (newBackorders.length > 0) {
        const { data: insertedBOs } = await supabase.from("backorders").insert(newBackorders).select();
        if (insertedBOs) setBackorders(prev => [...prev, ...insertedBOs]);
      }

      // If this is fulfilling a backorder record, mark it fulfilled
      if (isBackorder && backorderRecord) {
        await supabase.from("backorders").update({ status: "fulfilled", qty_shipped: backorderRecord.qty_ordered }).eq("id", backorderRecord.id);
        setBackorders(prev => prev.map(b => b.id === backorderRecord.id ? {...b, status:"fulfilled", qty_shipped: backorderRecord.qty_ordered} : b));
      }

      // Check if all backorders for this order are now fulfilled (none remaining open)
      const allBackordersRes = await supabase.from("backorders").select("*").eq("order_id", order.id).eq("status","open");
      const remainingOpen = (allBackordersRes.data || []).filter(b => !isBackorder || b.id !== backorderRecord?.id);
      const fullyComplete = newBackorders.length === 0 && remainingOpen.length === 0;

      // Always create an invoice for whatever was shipped (partial or full)
      if (shippedItems.length > 0) {
        const suffix = isBackorder ? "-B" + Date.now().toString().slice(-4) : newBackorders.length > 0 ? "-P" + Date.now().toString().slice(-4) : "";
        const invId = isBackorder || newBackorders.length > 0 ? order.id + suffix : order.id;
        const invSubtotal = shippedItems.reduce((s,i)=>s+(i.unit_price||0)*i.qty_shipped,0);
        const taxRate = order.tax_rate || 0;
        const invTax = Math.round(invSubtotal * taxRate / 100);
        const invTotal = invSubtotal + invTax;
        const invItems = shippedItems.map(i=>({product_id:i.product_id,name:i.name,qty:i.qty_shipped,unit_price:i.unit_price||0,barcode:i.barcode||""}));
        const noteLabel = isBackorder ? `Backorder shipment from ${order.id}` : newBackorders.length > 0 ? `Partial shipment — ${order.id}` : "";
        const newInv = {
          id: invId,
          customer_id: order.customer_id,
          customer_name: order.customer_name,
          date: today(),
          status: (order.type==="consignment") ? "delivery_note" : "invoiced",
          type: order.type||"standard",
          payment_method: order.payment_method||"",
          tax_rate: taxRate,
          subtotal: invSubtotal,
          tax_amount: invTax,
          total: invTotal,
          notes: noteLabel,
          items: invItems,
          created_at: new Date().toISOString()
        };
        const {data:savedInv} = await supabase.from("orders").insert({...newInv,items:undefined}).select().single();
        if (savedInv) {
          const savedId = savedInv.id || invId;
          await supabase.from("order_items").insert(invItems.map(i=>({...i,order_id:savedId})));
          setOrders(prev=>[{...newInv,id:savedId,items:invItems},...prev]);
        }

        // Update original order status
        const completedStatus = (order.type==="consignment") ? "delivery_note" : "invoiced";
        const newOrderStatus = fullyComplete ? completedStatus : "partial_shipped";
        await supabase.from("orders").update({ status: newOrderStatus }).eq("id", order.id);
        setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: newOrderStatus} : o));

        // Toast
        if (fullyComplete) {
          showToast(`Order ${order.id} fully shipped → Invoice ${invId} created ✓`);
        } else if (isBackorder) {
          showToast(`Backorder shipped → Invoice ${invId} created ✓`);
        } else {
          showToast(`Partial shipment → Invoice ${invId} created · ${newBackorders.length} item(s) backordered`);
        }
      } else {
        showToast("No items shipped", "warn");
      }

      onClose();
    } catch(e) {
      console.error(e);
      showToast("Error processing shipment", "err");
    }
    setBusy(false);
  };

  const allZero = lineItems.every(item => !parseInt(shipQtys[item.product_id]));

  return (
    <div className="overlay"><div className="modal modal-md">
      <div className="modal-head">
        <h2>🚚 Ship {isBackorder ? "Backorder" : "Order"} — {order.id}</h2>
        <button className="xbtn" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <p style={{fontSize:13,color:"var(--text2)",marginBottom:16}}>
          Enter the quantity to ship for each item. Any remainder will be placed in <strong>Back Orders</strong>.
          When all items are shipped, the order converts to an <strong>Invoice</strong>.
        </p>
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th>Product</th>
              <th style={{textAlign:"center"}}>Ordered</th>
              <th style={{textAlign:"center"}}>Ship Qty</th>
              <th style={{textAlign:"center"}}>Backorder</th>
              {!hideCost&&<th style={{textAlign:"right",color:"var(--text3)"}}>Unit Cost</th>}
              <th style={{textAlign:"right"}}>Unit Price</th>
            </tr></thead>
            <tbody>{lineItems.map(item => {
              const toShip = Math.max(0, Math.min(parseInt(shipQtys[item.product_id]) || 0, item.qty));
              const bo = item.qty - toShip;
              return (
                <tr key={item.product_id}>
                  <td>
                    <div style={{fontWeight:500}}>{item.name}</div>
                    {(()=>{const p=products?.find(x=>x.id===item.product_id);return p!=null?<div style={{fontSize:10,color:"var(--text3)",marginTop:2}}>Current stock: <strong style={{color:p.stock===0?"var(--danger)":p.stock<=p.low_stock_threshold?"var(--warn)":"var(--success)"}}>{p.stock}</strong></div>:null;})()}
                  </td>
                  <td style={{textAlign:"center"}}>{item.qty}</td>
                  <td style={{textAlign:"center"}}>
                    <input
                      type="number" min={0} max={item.qty}
                      value={shipQtys[item.product_id] ?? item.qty}
                      onChange={e => setShipQtys(prev => ({...prev, [item.product_id]: e.target.value}))}
                      style={{width:70,textAlign:"center",padding:"4px 6px",borderRadius:6,border:"1px solid var(--border)",background:"var(--bg3)"}}
                    />
                  </td>
                  <td style={{textAlign:"center",color: bo > 0 ? "var(--warn)" : "var(--text3)", fontWeight: bo > 0 ? 600 : 400}}>
                    {bo > 0 ? bo : "—"}
                  </td>
                  {!hideCost&&<td style={{textAlign:"right",fontSize:12,color:"var(--text3)"}}>{fmt(products?.find(p=>p.id===item.product_id)?.cost||0)}</td>}
                  <td style={{textAlign:"right",fontSize:12,fontWeight:600,color:"var(--accent)"}}>{fmt(item.unit_price||0)}</td>
                </tr>
              );
            })}
            {lineItems.length>1&&<tr style={{borderTop:"2px solid var(--border)",background:"var(--bg3)",fontWeight:700}}>
              <td>TOTALS</td>
              <td style={{textAlign:"center",color:"var(--accent)"}}>{lineItems.reduce((s,i)=>s+i.qty,0)}</td>
              <td style={{textAlign:"center",color:"var(--accent)"}}>{lineItems.reduce((s,i)=>s+Math.max(0,Math.min(parseInt(shipQtys[i.product_id])||0,i.qty)),0)}</td>
              <td style={{textAlign:"center",color:"var(--warn)"}}>{lineItems.reduce((s,i)=>s+(i.qty-Math.max(0,Math.min(parseInt(shipQtys[i.product_id])||0,i.qty))),0)||"—"}</td>
              {!hideCost&&<td></td>}
              <td style={{textAlign:"right",color:"var(--accent)"}}>{fmt(lineItems.reduce((s,i)=>s+(i.unit_price||0)*i.qty,0))}</td>
            </tr>}
            </tbody>
          </table>
        </div>
      </div>
      <div className="modal-foot" style={{flexWrap:"wrap",gap:8}}>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--text2)",cursor:"pointer"}}>
          <input type="checkbox" checked={hideCost} onChange={e=>setHideCost(e.target.checked)}/>
          Hide cost prices
        </label>
        <select value={docLabel} onChange={e=>setDocLabel(e.target.value)} style={{padding:"4px 8px",borderRadius:6,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:12}}>
          <option value="Order">PDF Label: Order</option>
          <option value="Quotation">PDF Label: Quotation</option>
        </select>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button className="btn btn-secondary btn-sm" onClick={downloadOrderCSV}>⬇ CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={printOrderPDF}>🖨 PDF</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleShip} disabled={busy || allZero}>
            {busy ? "Processing…" : "Confirm Shipment"}
          </button>
        </div>
      </div>
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── BACKORDERS PAGE ──────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ─── BACKORDER STATEMENT PDF ──────────────────────────────────────────────────
function printBackorderStatement(orderId, items, order, settings, isConsignment=false) {
  const NAVY = "#1a3a6b";
  const WARN = "#b45309";
  const today_str = new Date().toLocaleDateString("en-JM", {year:"numeric",month:"long",day:"numeric"});
  const totalQty = items.reduce((s,b)=>s+b.qty_remaining,0);
  const totalValue = isConsignment ? 0 : items.reduce((s,b)=>s+b.qty_remaining*(b.unit_price||0),0);
  const fmt = n => "J$" + Number(n||0).toLocaleString();

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Backorder Statement — ${orderId}</title>
<style>
body{font-family:Arial,sans-serif;padding:40px;color:#1a202c;font-size:13px}
.header{display:flex;justify-content:space-between;margin-bottom:32px}
.stamp{display:inline-block;border:3px solid ${WARN};color:${WARN};font-size:20px;font-weight:700;
  letter-spacing:2px;padding:6px 18px;border-radius:4px;transform:rotate(-3deg);
  position:absolute;top:48px;right:48px;opacity:0.85}
.section{margin-bottom:20px}
.section h4{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#4a5568;margin-bottom:6px}
table{width:100%;border-collapse:collapse;margin-bottom:16px}
th{background:#fef3c7;padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${WARN};border-bottom:2px solid #fde68a}
td{padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px}
.totals-table{width:300px;margin-left:auto}
.grand-total td{font-weight:700;font-size:15px;color:${NAVY};border-top:2px solid #c8d6e8}
.notice{background:#fef3c7;border:1px solid #fde68a;border-left:4px solid ${WARN};padding:12px 16px;border-radius:4px;font-size:12px;color:#78350f;margin-bottom:24px}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#4a5568}
</style></head><body>
<div style="position:relative">
  <div class="stamp">BACK ORDER</div>
  <div class="header">
    <div>
      <img src="${LOGO_SRC}" alt="Pinglinks Cellular" style="height:52px;width:auto;display:block;margin-bottom:8px"/>
      <div style="font-size:12px;color:#4a5568;line-height:1.6">
        Pinglinks Cellular Limited<br>
        20A South Avenue<br>
        Kingston 10, Jamaica<br>
        info@pinglinkscellular.com
      </div>
    </div>
    <div style="text-align:right">
      <div style="font-size:26px;font-weight:700;color:${WARN}">BACKORDER STATEMENT</div>
      <div style="font-size:14px;color:#4a5568;margin-top:4px">Ref: ${orderId}</div>
      <div style="font-size:12px;color:#4a5568">Date: ${today_str}</div>
      <div style="font-size:12px;color:#4a5568">Original Order: ${order?.date||"—"}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px">
    <div class="section"><h4>Customer</h4>
      <div style="font-weight:600;font-size:14px">${order?.customer_name||"—"}</div>
    </div>
    <div class="section" style="text-align:right"><h4>Document Info</h4>
      <div>Type: Backorder Statement</div>
      <div>Status: Items Pending Fulfillment</div>
    </div>
  </div>

  <div class="notice">
    ⚠️ The items listed below could not be fulfilled at the time of your original order
    (<strong>${orderId}</strong>). We will ship these items as soon as stock becomes available.
    Please retain this statement for your records.
  </div>

  <table>
    <thead><tr>
      <th>Barcode</th><th>Brand</th><th>Product</th>
      <th style="text-align:center">Ordered</th>
      <th style="text-align:center">Shipped</th>
      <th style="text-align:center">Outstanding</th>
      ${!isConsignment?`<th style="text-align:right">Unit Price</th><th style="text-align:right">Est. Value</th>`:""}
    </tr></thead>
    <tbody>
      ${items.map(b=>`
        <tr>
          <td><code style="font-size:11px">${b.barcode||"—"}</code></td>
          <td style="color:#4a5568">${b.brand||"—"}</td>
          <td style="font-weight:500">${b.product_name}</td>
          <td style="text-align:center">${b.qty_ordered}</td>
          <td style="text-align:center">${b.qty_shipped}</td>
          <td style="text-align:center;font-weight:700;color:${WARN}">${b.qty_remaining}</td>
          ${!isConsignment?`<td style="text-align:right">${fmt(b.unit_price||0)}</td><td style="text-align:right;font-weight:600">${fmt(b.qty_remaining*(b.unit_price||0))}</td>`:""}
        </tr>`).join("")}
    </tbody>
  </table>

  ${!isConsignment?`<table class="totals-table">
    <tr><td>Total Outstanding Units</td><td style="text-align:right;font-weight:700">${totalQty}</td></tr>
    <tr class="grand-total"><td><strong>Est. Total Value</strong></td><td style="text-align:right"><strong>${fmt(totalValue)}</strong></td></tr>
  </table>`:`<table class="totals-table">
    <tr class="grand-total"><td><strong>Total Outstanding Units</strong></td><td style="text-align:right;font-weight:700">${totalQty}</td></tr>
  </table>`}

  ${settings?.bank_name||settings?.company_phone?`
  <div style="margin-top:24px;padding:12px 16px;background:#f7fafc;border-radius:6px;font-size:12px;color:#4a5568">
    For enquiries about this backorder, contact us at ${settings?.company_phone||""} or ${settings?.company_email||"info@pinglinkscellular.com"}.
  </div>`:""}

  <div class="footer">Pinglinks Cellular Limited · 20A South Avenue, Kingston 10, Jamaica · info@pinglinkscellular.com</div>
</div>
</body></html>`;

  const w = window.open("","_blank","width=900,height=700");
  w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(),400);
}


function BackordersPage({ backorders, setBackorders, orders, setOrders, customers, settings, showToast, products, setProducts }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("open");
  const [shipModal, setShipModal] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(null);
  const [cancelBOModal, setCancelBOModal] = useState(null);

  const cancelBackorder = async (b, reason) => {
    const note = reason ? `Cancelled: ${reason}` : undefined;
    await supabase.from("backorders").update({status:"cancelled",...(note?{notes:note}:{})}).eq("id",b.id);
    setBackorders(prev=>prev.map(x=>x.id===b.id?{...x,status:"cancelled",...(note?{notes:note}:{})}:x));
    const remaining = backorders.filter(x=>x.order_id===b.order_id&&x.id!==b.id&&x.status==="open");
    if(remaining.length===0){
      const parentOrder = orders.find(o=>o.id===b.order_id);
      const completedStatus = (parentOrder?.type==="consignment") ? "delivery_note" : "invoiced";
      await supabase.from("orders").update({status:completedStatus}).eq("id",b.order_id);
      setOrders(prev=>prev.map(o=>o.id===b.order_id?{...o,status:completedStatus}:o));
    }
    try{await supabase.from("activity_log").insert({action:"order_status",details:`Backorder cancelled for ${b.product_name} on order ${b.order_id}${reason?": "+reason:""}`,entity_type:"order",entity_id:b.order_id,user_name:currentUserName,timestamp:new Date().toISOString()});}catch(e){}
    showToast("Backorder cancelled");
    setCancelBOModal(null);
  };

  const openBackorders = useMemo(() => backorders.filter(b => {
    if (b.status !== "open") return false;
    const q = search.toLowerCase();
    if (q && !b.order_id?.toLowerCase().includes(q) && !b.product_name?.toLowerCase().includes(q)) return false;
    return true;
  }), [backorders, search]);

  const cancelledBackorders = useMemo(() => backorders.filter(b => {
    if (b.status !== "cancelled") return false;
    const q = search.toLowerCase();
    if (q && !b.order_id?.toLowerCase().includes(q) && !b.product_name?.toLowerCase().includes(q)) return false;
    return true;
  }), [backorders, search]);

  // Group by order_id
  const grouped = useMemo(() => {
    const map = {};
    openBackorders.forEach(b => {
      if (!map[b.order_id]) map[b.order_id] = [];
      map[b.order_id].push(b);
    });
    return map;
  }, [openBackorders]);

  const groupedCancelled = useMemo(() => {
    const map = {};
    cancelledBackorders.forEach(b => {
      if (!map[b.order_id]) map[b.order_id] = [];
      map[b.order_id].push(b);
    });
    return map;
  }, [cancelledBackorders]);

  return (
    <>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div className="tabs" style={{margin:0}}>
          <button className={`tab ${tab==="open"?"active":""}`} onClick={()=>setTab("open")}>
            Open {openBackorders.length>0&&<span className="badge bb" style={{fontSize:9,marginLeft:4}}>{openBackorders.length}</span>}
          </button>
          <button className={`tab ${tab==="cancelled"?"active":""}`} onClick={()=>setTab("cancelled")}>
            Cancelled {cancelledBackorders.length>0&&<span className="badge br" style={{fontSize:9,marginLeft:4}}>{cancelledBackorders.length}</span>}
          </button>
        </div>
        <div className="search-wrap" style={{flex:2,maxWidth:320}}>
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by order # or product…"/>
        </div>
      </div>

      {tab==="open"&&<>
      {Object.keys(grouped).length === 0 && (
        <div className="empty"><div className="ei">📭</div><p>No open back orders.</p></div>
      )}

      {Object.entries(grouped).map(([orderId, items]) => {
        const order = orders.find(o => o.id === orderId);
        return (
          <div key={orderId} className="card" style={{marginBottom:14}}>
            <div className="card-header">
              <div>
                <div style={{fontFamily:"Syne",fontWeight:700}}>{orderId}</div>
                <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>{order?.customer_name} · Ordered {order?.date}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <button className="btn btn-secondary btn-sm" onClick={()=>{
                  const enriched=items.map(b=>({...b,brand:products?.find(p=>p.id===b.product_id)?.brand||""}));
                  const cust = customers?.find(c=>c.id===order?.customer_id);
                  const isCons = cust?.customer_type==="consignment" || order?.type==="consignment";
                  printBackorderStatement(orderId,enriched,order,settings,isCons);
                }}>🖨 Backorder Statement</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setShowEmailModal(order)}>📧 Email</button>
                <StatusBadge status={order?.status||"partial_shipped"}/>
              </div>
            </div>
            <div className="card-body" style={{padding:0}}>
              <div className="tbl-wrap">
                <table>
                  <thead><tr>
                    <th>Product</th>
                    <th style={{textAlign:"center"}}>Ordered</th>
                    <th style={{textAlign:"center"}}>Shipped</th>
                    <th style={{textAlign:"center"}}>Remaining</th>
                    <th>Actions</th>
                  </tr></thead>
                  <tbody>{items.map(b => (
                    <tr key={b.id}>
                      <td style={{fontWeight:500}}>{b.product_name}</td>
                      <td style={{textAlign:"center"}}>{b.qty_ordered}</td>
                      <td style={{textAlign:"center"}}>{b.qty_shipped}</td>
                      <td style={{textAlign:"center",color:"var(--warn)",fontWeight:600}}>{b.qty_remaining}</td>
                      <td>
                        <div className="tbl-actions">
                          <button className="btn btn-primary btn-xs" onClick={()=>setShipModal({order, backorderRecord: b})}>🚚 Ship</button>
                          <button className="btn btn-warn btn-xs" onClick={()=>setCancelBOModal(b)}>✕ Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
      </>}

      {tab==="cancelled"&&<>
        {Object.keys(groupedCancelled).length===0&&<div className="empty"><div className="ei">✓</div><p>No cancelled back orders.</p></div>}
        {Object.entries(groupedCancelled).map(([orderId, items]) => {
          const order = orders.find(o=>o.id===orderId);
          return (
            <div key={orderId} className="card" style={{marginBottom:14,opacity:0.8}}>
              <div className="card-header">
                <div>
                  <div style={{fontFamily:"Syne",fontWeight:700}}>{orderId}</div>
                  <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>{order?.customer_name} · Ordered {order?.date}</div>
                </div>
                <span className="badge br">Cancelled</span>
              </div>
              <div className="card-body" style={{padding:0}}>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr>
                      <th>Product</th>
                      <th style={{textAlign:"center"}}>Ordered</th>
                      <th style={{textAlign:"center"}}>Shipped</th>
                      <th style={{textAlign:"center"}}>Cancelled Qty</th>
                    </tr></thead>
                    <tbody>{items.map(b=>(
                      <tr key={b.id} style={{opacity:0.75}}>
                        <td style={{fontWeight:500}}>{b.product_name}</td>
                        <td style={{textAlign:"center"}}>{b.qty_ordered}</td>
                        <td style={{textAlign:"center"}}>{b.qty_shipped}</td>
                        <td style={{textAlign:"center",color:"var(--danger)",fontWeight:600}}>{b.qty_remaining}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </>}

      {shipModal && (
        <ShipOrderModal
          order={shipModal.order}
          orders={orders}
          setOrders={setOrders}
          backorders={backorders}
          setBackorders={setBackorders}
          products={products}
          setProducts={setProducts}
          settings={settings}
          showToast={showToast}
          isBackorder={true}
          backorderRecord={shipModal.backorderRecord}
          onClose={()=>setShipModal(null)}
        />
      )}
      {showEmailModal&&<OrderEmailModal order={showEmailModal} customers={customers} settings={settings} onClose={()=>setShowEmailModal(null)} showToast={showToast}/>}
      {cancelBOModal&&<CancelReasonModal title="Cancel Backorder" itemLabel={`${cancelBOModal.product_name} (${cancelBOModal.qty_remaining} remaining) — Order ${cancelBOModal.order_id}`} onConfirm={r=>cancelBackorder(cancelBOModal,r)} onClose={()=>setCancelBOModal(null)}/>}
    </>
  );
}


// ─── APPLY PAYMENT MODAL ─────────────────────────────────────────────────────
function ApplyPaymentModal({ order, onSave, onClose }) {
  const METHODS = [
    "BNS Bank Transfer",
    "NCB Bank Transfer",
    "Sagicor Bank Transfer",
    "Cash",
    "Cheque",
    "Fygaro",
    "Other",
  ];
  const [method, setMethod] = useState(() => {
    // Pre-select if order already has a method that matches our list
    return METHODS.includes(order.payment_method) ? order.payment_method : "BNS Bank Transfer";
  });
  const [chequeBank, setChequeBank]     = useState("");
  const [chequeNum,  setChequeNum]      = useState("");
  const [otherDesc,  setOtherDesc]      = useState("");
  const [ref,        setRef]            = useState("");
  const [busy,       setBusy]           = useState(false);

  const isCheque = method === "Cheque";
  const isOther  = method === "Other";

  const buildLabel = () => {
    if (isCheque) {
      const parts = [];
      if (chequeBank) parts.push(chequeBank);
      if (chequeNum)  parts.push(`#${chequeNum}`);
      return `Cheque${parts.length ? " — " + parts.join(" / ") : ""}`;
    }
    if (isOther) return otherDesc.trim() || "Other";
    return method;
  };

  const canSave = !isOther || otherDesc.trim().length > 0;

  return (
    <div className="overlay" style={{zIndex:9999}}><div className="modal" style={{maxWidth:440}}>
      <div className="modal-head">
        <h2>✓ Apply Payment</h2>
        <button className="xbtn" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <div style={{padding:"10px 14px",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:8,fontSize:13,marginBottom:16}}>
          <div style={{fontWeight:700}}>{order.customer_name}</div>
          <div style={{color:"var(--text2)",marginTop:2}}>Invoice {order.id} · <strong style={{color:"var(--accent)"}}>{fmt(order.total)}</strong></div>
        </div>

        <div className="form-group">
          <label>Payment Method Received</label>
          <select value={method} onChange={e=>setMethod(e.target.value)}>
            {METHODS.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>

        {isCheque && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="form-group" style={{margin:0}}>
              <label>Bank Cheque Is From</label>
              <input value={chequeBank} onChange={e=>setChequeBank(e.target.value)} placeholder="e.g. NCB, Scotiabank…"/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Cheque Number</label>
              <input value={chequeNum} onChange={e=>setChequeNum(e.target.value)} placeholder="e.g. 001234"/>
            </div>
          </div>
        )}

        {isOther && (
          <div className="form-group">
            <label>Describe Payment Method <span style={{color:"var(--danger)"}}>*</span></label>
            <input value={otherDesc} onChange={e=>setOtherDesc(e.target.value)} placeholder="e.g. WiPay, Wire transfer…"/>
          </div>
        )}

        <div className="form-group">
          <label>Additional Reference <span style={{color:"var(--text3)",fontWeight:400}}>(optional)</span></label>
          <input value={ref} onChange={e=>setRef(e.target.value)} placeholder="Transaction ID, confirmation #…"/>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={busy||!canSave} onClick={async()=>{
          setBusy(true);
          await onSave(buildLabel(), ref);
          setBusy(false);
        }}>
          {busy ? "Saving…" : "✓ Mark as Paid"}
        </button>
      </div>
    </div></div>
  );
}

function InvoicesPage({ orders, setOrders, customers, settings, showToast, setModal, setProducts, products }) {
  const [search,       setSearch]       = useState("");
  const [filterTab,    setFilterTab]    = useState("all");
  const [filterDate,   setFilterDate]   = useState("");
  const [showEmailModal,setShowEmailModal] = useState(null);
  const [showRefund,   setShowRefund]   = useState(null);
  const [payModal,     setPayModal]     = useState(null);

  // Helper: is this order a consignment order?
  const isCons = (o) => o.type==="consignment" || customers.find(c=>c.id===o.customer_id)?.customer_type==="consignment";

  const ALL_INVOICE_STATUSES = ["invoiced","delivery_note","paid","delivered","cancelled","refunded","partial_refund"];

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (!ALL_INVOICE_STATUSES.includes(o.status)) return false;
      // Tab filter
      if (filterTab==="delivery")  { if (!isCons(o)) return false; }
      else if (filterTab==="awaiting") { if (isCons(o) || o.status!=="invoiced") return false; }
      else if (filterTab==="paid")     { if (isCons(o) || (o.status!=="paid"&&o.status!=="delivered")) return false; }
      else if (filterTab==="refunded") { if (o.status!=="refunded"&&o.status!=="partial_refund") return false; }
      // Date filter
      if (filterDate && !o.date?.startsWith(filterDate)) return false;
      // Search
      const q = search.toLowerCase();
      if (q && !o.id.toLowerCase().includes(q) && !o.customer_name?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, search, filterTab, filterDate, customers]);

  const {sorted,key,dir,toggle} = useSort(filtered,"created_at","desc");
  const pg = usePagination(sorted,20);

  // Tab badge counts (from full orders list, no date/search filter)
  const countDelivery  = useMemo(()=>orders.filter(o=>ALL_INVOICE_STATUSES.includes(o.status)&&isCons(o)).length,[orders,customers]);
  const countAwaiting  = useMemo(()=>orders.filter(o=>!isCons(o)&&o.status==="invoiced").length,[orders,customers]);
  const countPaid      = useMemo(()=>orders.filter(o=>!isCons(o)&&(o.status==="paid"||o.status==="delivered")).length,[orders,customers]);
  const countRefunded  = useMemo(()=>orders.filter(o=>o.status==="refunded"||o.status==="partial_refund").length,[orders]);

  const applyPayment = async (order, method, ref) => {
    const addNote = ref ? (order.notes ? order.notes+"\n"+ref : ref) : order.notes;
    const update = {status:"paid", payment_method:method, ...(addNote?{notes:addNote}:{})};
    const {error} = await supabase.from("orders").update(update).eq("id",order.id);
    if (error) { showToast("Failed: "+error.message,"err"); return; }
    setOrders(p=>p.map(o=>o.id===order.id?{...o,...update}:o));
    try { await supabase.from("activity_log").insert({action:"order_status",details:`Payment applied to ${order.id} via ${method}${ref?": "+ref:""}`,entity_type:"order",entity_id:order.id,user_name:currentUserName,timestamp:new Date().toISOString()}); } catch(e){}
    showToast(`${order.id} marked as Paid ✓`);
    setPayModal(null);
  };

  const updateStatus = async (id,status) => {
    const order = orders.find(o=>o.id===id);
    if (status==="shipped"&&order?.status!=="shipped"&&order?.status!=="delivered") {
      for (const item of (order?.items||[])) {
        const {data:prod} = await supabase.from("products").select("stock").eq("id",item.product_id).single();
        if (prod) {
          const ns = Math.max(0,prod.stock-item.qty);
          await supabase.from("products").update({stock:ns}).eq("id",item.product_id);
          setProducts(prev=>prev.map(p=>p.id===item.product_id?{...p,stock:ns}:p));
        }
      }
      showToast("Order shipped — inventory deducted");
    }
    await supabase.from("orders").update({status}).eq("id",id);
    setOrders(p=>p.map(o=>o.id===id?{...o,status}:o));
    if (status!=="shipped") showToast("Status updated");
  };

  const exportCSV = () => {
    const rows = [
      ["Ref","Customer","Date","Doc Type","Status","Payment Method","Subtotal","Tax","Total"],
      ...filtered.map(o=>[o.id,o.customer_name,o.date,isCons(o)?"Delivery Note":"Invoice",o.status,o.payment_method||"—",o.subtotal||0,o.tax_amount||0,o.total||0])
    ];
    downloadCSV(rows,`invoices_${today()}.csv`);
    showToast("Exported");
  };

  const TABS = [
    {k:"all",       label:"All"},
    {k:"delivery",  label:"📦 Delivery Notes", count:countDelivery},
    {k:"awaiting",  label:"🧾 Awaiting Payment", count:countAwaiting, warn:true},
    {k:"paid",      label:"✓ Paid", count:countPaid},
    {k:"refunded",  label:"↩ Refunded", count:countRefunded},
  ];

  return (
    <>
      {/* Tab bar + controls row */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <div className="tabs" style={{margin:0,flexWrap:"wrap",flex:"1 1 auto"}}>
          {TABS.map(t=>(
            <button key={t.k} className={`tab ${filterTab===t.k?"active":""}`} onClick={()=>setFilterTab(t.k)}>
              {t.label}
              {t.count>0&&<span className={`badge ${t.warn?"bo":"bb"}`} style={{fontSize:9,marginLeft:4,verticalAlign:"middle"}}>{t.count}</span>}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
          <div className="search-wrap" style={{minWidth:190}}>
            <span className="search-icon">🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"/>
          </div>
          <input type="month" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{width:"auto",padding:"6px 10px"}}/>
          <PageSizeSelect perPage={pg.perPage} setPerPage={pg.setPerPage} reset={pg.reset}/>
          <button className="btn btn-secondary btn-sm" onClick={exportCSV}>⬇ CSV</button>
        </div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <SortTh label="Ref #"     sortKey="id"            current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Customer"  sortKey="customer_name" current={key} dir={dir} onToggle={toggle}/>
              <SortTh label="Date"      sortKey="date"          current={key} dir={dir} onToggle={toggle}/>
              <th>Doc Type</th>
              <th>Payment</th>
              <SortTh label="Amount"    sortKey="total"         current={key} dir={dir} onToggle={toggle}/>
              <th>Status</th>
              <th>Actions</th>
            </tr></thead>
            <tbody>{pg.sliced.map(o => {
              const cons = isCons(o);
              return (
                <tr key={o.id}>
                  <td><code>{o.id}</code></td>
                  <td style={{fontWeight:500}}>{o.customer_name}</td>
                  <td style={{fontSize:12,color:"var(--text2)"}}>{o.date}</td>
                  <td>
                    {cons
                      ? <span className="badge bb" style={{fontSize:10}}>📦 Delivery Note</span>
                      : <span className="badge bb" style={{fontSize:10}}>🧾 Invoice</span>}
                  </td>
                  <td style={{fontSize:12,color:"var(--text2)"}}>{o.payment_method||"—"}</td>
                  <td style={{fontWeight:600,color:"var(--accent)"}}>
                    {cons
                      ? <span style={{fontSize:11,color:"var(--text3)",fontStyle:"italic"}}>Consignment</span>
                      : <span>{fmt(o.total)}</span>}
                  </td>
                  <td><StatusBadge status={o.status}/></td>
                  <td><div className="tbl-actions">
                    <button className="btn btn-secondary btn-xs" onClick={()=>setModal({type:"viewInvoice",data:o})}>{cons?"📦 View":"🧾 View"}</button>
                    <button className="btn btn-ghost btn-xs" onClick={()=>{ const c=customers.find(x=>x.id===o.customer_id); printInvoice(o,c,settings,cons); }}>🖨</button>
                    <button className="btn btn-ghost btn-xs" onClick={()=>setShowEmailModal(o)}>📧</button>
                    {!cons && o.status==="invoiced" &&
                      <button className="btn btn-primary btn-xs" onClick={()=>setPayModal(o)}>✓ Apply Payment</button>}
                    {(o.status==="invoiced"||o.status==="delivery_note"||o.status==="paid"||o.status==="delivered") &&
                      <button className="btn btn-warn btn-xs" onClick={()=>setShowRefund(o)}>↩ Refund</button>}
                  </div></td>
                </tr>
              );
            })}
            {pg.sliced.length===0&&<tr><td colSpan={8} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No records found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)"}}>
          <span style={{fontSize:12,color:"var(--text3)"}}>
            {pg.total} record{pg.total!==1?"s":""}{" · "}
            Upfront total: {fmt(filtered.filter(o=>!isCons(o)&&o.status!=="refunded").reduce((s,o)=>s+(o.total||0),0))}
          </span>
          <Pagination page={pg.page} totalPages={pg.totalPages} setPage={pg.setPage}/>
        </div>
      </div>

      {showEmailModal&&<EmailModal order={showEmailModal} customers={customers} settings={settings} onClose={()=>setShowEmailModal(null)} showToast={showToast}/>}
      {showRefund&&<RefundModal order={showRefund} onClose={()=>setShowRefund(null)} showToast={showToast} setOrders={setOrders} setProducts={setProducts} products={products}/>}
      {payModal&&<ApplyPaymentModal order={payModal} onSave={(m,r)=>applyPayment(payModal,m,r)} onClose={()=>setPayModal(null)}/>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── CLEARANCE PAGE ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// ─── ADMIN CLEARANCE PAGE ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AdminClearancePage({ products, setProducts, settings, showToast }) {
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("Brand");
  const [filterCat, setFilterCat] = useState("Category");
  const [sortBy, setSortBy] = useState("name");
  const [busy, setBusy] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null); // product id being edited
  const [priceInput, setPriceInput] = useState("");

  const active = products.filter(p => p.active);
  const clearanceItems = active.filter(p => p.is_clearance);
  const allBrands = ["Brand", ...[...new Set(active.map(p=>p.brand).filter(Boolean))].sort()];
  const allCats = ["Category", ...[...new Set(active.map(p=>p.category).filter(Boolean))].sort()];

  const eligible = active.filter(p => !p.is_clearance).filter(p => {
    const q = search.toLowerCase();
    if (filterBrand !== "Brand" && p.brand !== filterBrand) return false;
    if (filterCat !== "Category" && p.category !== filterCat) return false;
    if (q && !p.name?.toLowerCase().includes(q) && !p.barcode?.includes(q) && !p.brand?.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a,b) => {
    if (sortBy === "stock_desc") return b.stock - a.stock;
    if (sortBy === "stock_asc") return a.stock - b.stock;
    if (sortBy === "price_asc") return (a.wholesale_price||0) - (b.wholesale_price||0);
    if (sortBy === "price_desc") return (b.wholesale_price||0) - (a.wholesale_price||0);
    return (a.name||"").localeCompare(b.name||"");
  });

  const toggle = async (product, val) => {
    setBusy(product.id);
    const updates = val ? { is_clearance: true } : { is_clearance: false, clearance_price: null };
    const { error } = await supabase.from("products").update(updates).eq("id", product.id);
    if (error) { showToast("Failed to update: " + error.message, "err"); setBusy(null); return; }
    setProducts(prev => prev.map(p => p.id === product.id ? {...p, ...updates} : p));
    showToast(val ? `🔥 "${product.name}" added to Clearance` : `Removed "${product.name}" from Clearance`);
    setBusy(null);
  };

  const savePrice = async (product) => {
    const price = priceInput === "" ? null : parseFloat(priceInput);
    const { error } = await supabase.from("products").update({ clearance_price: price }).eq("id", product.id);
    if (error) { showToast("Failed to save price: " + error.message, "err"); return; }
    setProducts(prev => prev.map(p => p.id === product.id ? {...p, clearance_price: price} : p));
    setEditingPrice(null);
    showToast("Clearance price updated");
  };

  const fmt = n => "J$" + Number(n||0).toLocaleString();
  const discountPct = (p) => p.clearance_price && p.wholesale_price ? Math.round((1 - p.clearance_price / p.wholesale_price) * 100) : 0;

  return (
    <div>
      {/* Current clearance items */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header">
          <h3>🔥 Current Clearance Items ({clearanceItems.length})</h3>
        </div>
        {clearanceItems.length === 0
          ? <div style={{padding:"24px",textAlign:"center",color:"var(--text3)"}}>No clearance items yet — add some below.</div>
          : <div className="tbl-wrap">
              <table>
                <thead><tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th style={{textAlign:"right"}}>Wholesale</th>
                  <th style={{textAlign:"right"}}>Clearance Price</th>
                  <th style={{textAlign:"center"}}>Discount</th>
                  <th style={{textAlign:"center"}}>Stock</th>
                  <th></th>
                </tr></thead>
                <tbody>{clearanceItems.sort((a,b)=>a.name.localeCompare(b.name)).map(p=>(
                  <tr key={p.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {p.image_url
                          ? <img src={p.image_url} style={{width:32,height:32,objectFit:"cover",borderRadius:4,flexShrink:0}} alt=""/>
                          : <div style={{width:32,height:32,background:"var(--bg3)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔥</div>}
                        <div>
                          <div style={{fontWeight:500,fontSize:13}}>{p.name}</div>
                          {p.barcode&&<div style={{fontSize:10,color:"var(--text3)"}}>{p.barcode}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{p.brand||"—"}</td>
                    <td><span className="badge bb" style={{fontSize:10}}>{p.category}</span></td>
                    <td style={{textAlign:"right",fontSize:12,color:"var(--text2)"}}>{fmt(p.wholesale_price)}</td>
                    <td style={{textAlign:"right"}}>
                      {editingPrice === p.id
                        ? <div style={{display:"flex",gap:4,justifyContent:"flex-end",alignItems:"center"}}>
                            <input type="number" value={priceInput} onChange={e=>setPriceInput(e.target.value)}
                              style={{width:90,textAlign:"right"}} autoFocus
                              onKeyDown={e=>{ if(e.key==="Enter") savePrice(p); if(e.key==="Escape") setEditingPrice(null); }}/>
                            <button className="btn btn-primary btn-xs" onClick={()=>savePrice(p)}>✓</button>
                            <button className="btn btn-ghost btn-xs" onClick={()=>setEditingPrice(null)}>✕</button>
                          </div>
                        : <div style={{display:"flex",gap:4,justifyContent:"flex-end",alignItems:"center"}}>
                            <span style={{fontWeight:600,color:"var(--accent)"}}>{p.clearance_price?fmt(p.clearance_price):"—"}</span>
                            <button className="btn btn-ghost btn-xs" onClick={()=>{setEditingPrice(p.id);setPriceInput(p.clearance_price||"");}}>✏</button>
                          </div>
                      }
                    </td>
                    <td style={{textAlign:"center"}}>
                      {discountPct(p)>0
                        ? <span className="clearance-badge">-{discountPct(p)}%</span>
                        : <span style={{color:"var(--text3)",fontSize:12}}>—</span>}
                    </td>
                    <td style={{textAlign:"center",fontWeight:700,color:p.stock===0?"var(--danger)":p.stock<=p.low_stock_threshold?"var(--warn)":"var(--success)"}}>{p.stock}</td>
                    <td>
                      <button className="btn btn-danger btn-xs" disabled={busy===p.id}
                        onClick={()=>toggle(p,false)}>
                        {busy===p.id?"…":"✕ Remove"}
                      </button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
        }
      </div>

      {/* Add products to clearance */}
      <div className="card">
        <div className="card-header">
          <h3>➕ Add Products to Clearance</h3>
        </div>
        <div className="card-body" style={{paddingBottom:8}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <div className="search-wrap" style={{flex:2,minWidth:180}}>
              <span className="search-icon">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…"/>
            </div>
            <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
              {allBrands.map(b=><option key={b}>{b}</option>)}
            </select>
            <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
              {allCats.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
              <option value="name">Sort: A–Z</option>
              <option value="stock_desc">Stock: High–Low</option>
              <option value="stock_asc">Stock: Low–High</option>
              <option value="price_asc">Price: Low–High</option>
              <option value="price_desc">Price: High–Low</option>
            </select>
          </div>
        </div>
        {eligible.length === 0
          ? <div style={{padding:"24px",textAlign:"center",color:"var(--text3)"}}>
              {search||filterBrand!=="Brand"||filterCat!=="Category" ? "No products match your filters." : "All active products are already in Clearance."}
            </div>
          : <div className="tbl-wrap">
              <table>
                <thead><tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th style={{textAlign:"right"}}>Wholesale</th>
                  <th style={{textAlign:"center"}}>Stock</th>
                  <th></th>
                </tr></thead>
                <tbody>{eligible.map(p=>(
                  <tr key={p.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {p.image_url
                          ? <img src={p.image_url} style={{width:32,height:32,objectFit:"cover",borderRadius:4,flexShrink:0}} alt=""/>
                          : <div style={{width:32,height:32,background:"var(--bg3)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>📦</div>}
                        <div>
                          <div style={{fontWeight:500,fontSize:13}}>{p.name}</div>
                          {p.barcode&&<div style={{fontSize:10,color:"var(--text3)"}}>{p.barcode}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{p.brand||"—"}</td>
                    <td><span className="badge bb" style={{fontSize:10}}>{p.category}</span></td>
                    <td style={{textAlign:"right",fontWeight:600,color:"var(--accent)"}}>{fmt(p.wholesale_price)}</td>
                    <td style={{textAlign:"center",fontWeight:700,color:p.stock===0?"var(--danger)":p.stock<=p.low_stock_threshold?"var(--warn)":"var(--success)"}}>{p.stock}</td>
                    <td>
                      <button className="btn btn-primary btn-xs" disabled={busy===p.id}
                        onClick={()=>toggle(p,true)}>
                        {busy===p.id?"…":"🔥 Add"}
                      </button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

function ClearancePage({ products, isAdmin, addToCart, user, cart }) {
  const [search,setSearch]=useState("");
  const [sortBy,setSortBy]=useState("name");
  const isConsignment=user?.customer_type==="consignment";
  const base=products.filter(p=>p.is_clearance&&p.active&&(isAdmin||p.stock>0)&&(isAdmin||p.wholesale_visible!==false));
  const items=base.filter(p=>!search||p.name?.toLowerCase().includes(search.toLowerCase())||p.barcode?.includes(search)||p.brand?.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>{
    if(sortBy==="price_asc") return (a.clearance_price||a.wholesale_price)-(b.clearance_price||b.wholesale_price);
    if(sortBy==="price_desc") return (b.clearance_price||b.wholesale_price)-(a.clearance_price||a.wholesale_price);
    if(sortBy==="stock") return b.stock-a.stock;
    return (a.name||"").localeCompare(b.name||"");
  });
  const inCart=id=>cart?.find(i=>i.pid===id)?.qty||0;

  return (
    <div>
      <div className="alert alert-warn mb-4">🔥 Clearance items — discounted prices while stock lasts!</div>
      <div className="filter-bar" style={{gap:8,marginBottom:12}}>
        <div className="search-wrap" style={{flex:1}}><span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clearance…"/>
        </div>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:"auto"}}>
          <option value="name">Sort: A–Z</option>
          <option value="price_asc">Price: Low–High</option>
          <option value="price_desc">Price: High–Low</option>
          <option value="stock">Most Stock</option>
        </select>
        <span style={{fontSize:12,color:"var(--text3)",alignSelf:"center"}}>{items.length} items</span>
      </div>
      {items.length===0&&<div className="empty"><div className="ei">🔥</div><p>No clearance items match your search.</p></div>}
      <div className="prod-grid">
        {items.map(p=>{
          const discountPct=p.clearance_price&&p.wholesale_price?Math.round((1-p.clearance_price/p.wholesale_price)*100):0;
          const price=isConsignment?0:(p.clearance_price||p.wholesale_price);
          const qty=inCart(p.id);
          return (
            <div key={p.id} className="prod-card">
              <div className="prod-tag"><span className="clearance-badge">CLEARANCE {discountPct>0?`-${discountPct}%`:""}</span></div>
              <div className="prod-card-img">
                {p.image_url?<img src={p.image_url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:40}}>🏷️</span>}
              </div>
              <div className="prod-card-body">
                <div className="prod-card-brand">{p.brand}</div>
                <div className="prod-card-name">{p.name}</div>
                {p.barcode&&<div className="prod-card-sku">Barcode: {p.barcode}</div>}
                {!isConsignment&&<div className="prod-price-row">
                  <span className="prod-ws">{fmt(price)}</span>
                  {p.clearance_price&&<span className="prod-retail">{fmt(p.wholesale_price)}</span>}
                </div>}
                {!isConsignment&&p.retail_price>0&&<div className="prod-srp">SRP: {fmt(p.retail_price)}</div>}
                <div className="prod-stock">{p.stock} in stock · MOQ: {p.min_order||1}{qty>0?` · ${qty} in cart`:""}</div>
                {!isAdmin&&user?.approved&&<>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,marginTop:8}}>
                    <div style={{fontSize:11,color:"var(--text3)",whiteSpace:"nowrap"}}>Qty:</div>
                    <input
                      type="number"
                      min={p.min_order||1}
                      max={p.stock}
                      defaultValue={p.min_order||1}
                      id={`cl-qty-${p.id}`}
                      style={{width:"70px",textAlign:"center",padding:"4px 6px",border:"1px solid var(--border)",borderRadius:6,fontSize:13,fontWeight:600}}
                      onClick={e=>e.stopPropagation()}
                    />
                    <div style={{fontSize:10,color:"var(--text3)"}}>MOQ: {p.min_order||1}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} disabled={p.stock===0}
                    onClick={()=>{
                      const inp=document.getElementById(`cl-qty-${p.id}`);
                      const val=Math.max(p.min_order||1, Math.min(p.stock, parseInt(inp?.value)||p.min_order||1));
                      addToCart({...p, wholesale_price:price}, val);
                    }}>
                    {qty>0?"➕ Add More":"Add to Cart"}
                  </button>
                  {isConsignment&&<div className="alert alert-info" style={{padding:"6px 10px",fontSize:11,marginTop:8}}>Contact us for pricing</div>}
                </>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── ADMIN HOT SELLERS PAGE ───────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AdminHotSellersPage({ products, setProducts, settings, showToast }) {
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("Brand");
  const [filterCat, setFilterCat] = useState("Category");
  const [sortBy, setSortBy] = useState("name");
  const [busy, setBusy] = useState(null);

  const active = products.filter(p => p.active);
  const hotItems = active.filter(p => p.is_hot_seller);
  const allBrands = ["Brand", ...[...new Set(active.map(p=>p.brand).filter(Boolean))].sort()];
  const allCats = ["Category", ...[...new Set(active.map(p=>p.category).filter(Boolean))].sort()];

  // All products tab (for adding)
  const eligible = active.filter(p => !p.is_hot_seller).filter(p => {
    const q = search.toLowerCase();
    if (filterBrand !== "Brand" && p.brand !== filterBrand) return false;
    if (filterCat !== "Category" && p.category !== filterCat) return false;
    if (q && !p.name?.toLowerCase().includes(q) && !p.barcode?.includes(q) && !p.brand?.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a,b) => {
    if (sortBy === "stock_desc") return b.stock - a.stock;
    if (sortBy === "stock_asc") return a.stock - b.stock;
    if (sortBy === "price_asc") return (a.wholesale_price||0) - (b.wholesale_price||0);
    if (sortBy === "price_desc") return (b.wholesale_price||0) - (a.wholesale_price||0);
    return (a.name||"").localeCompare(b.name||"");
  });

  const toggle = async (product, val) => {
    setBusy(product.id);
    const { error } = await supabase.from("products").update({ is_hot_seller: val }).eq("id", product.id);
    if (error) { showToast("Failed to update: " + error.message, "err"); setBusy(null); return; }
    setProducts(prev => prev.map(p => p.id === product.id ? {...p, is_hot_seller: val} : p));
    showToast(val ? `⭐ "${product.name}" added to Hot Sellers` : `Removed "${product.name}" from Hot Sellers`);
    setBusy(null);
  };

  const fmt = n => "J$" + Number(n||0).toLocaleString();

  return (
    <div>
      {/* Current hot sellers */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header">
          <h3>⭐ Current Hot Sellers ({hotItems.length})</h3>
        </div>
        {hotItems.length === 0
          ? <div style={{padding:"24px",textAlign:"center",color:"var(--text3)"}}>No hot sellers tagged yet — add some below.</div>
          : <div className="tbl-wrap">
              <table>
                <thead><tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th style={{textAlign:"right"}}>Wholesale</th>
                  <th style={{textAlign:"center"}}>Stock</th>
                  <th style={{textAlign:"center"}}>Visible</th>
                  <th></th>
                </tr></thead>
                <tbody>{hotItems.sort((a,b)=>a.name.localeCompare(b.name)).map(p=>(
                  <tr key={p.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {p.image_url
                          ? <img src={p.image_url} style={{width:32,height:32,objectFit:"cover",borderRadius:4,flexShrink:0}} alt=""/>
                          : <div style={{width:32,height:32,background:"var(--bg3)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⭐</div>}
                        <div>
                          <div style={{fontWeight:500,fontSize:13}}>{p.name}</div>
                          {p.barcode&&<div style={{fontSize:10,color:"var(--text3)"}}>{p.barcode}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{p.brand||"—"}</td>
                    <td><span className="badge bb" style={{fontSize:10}}>{p.category}</span></td>
                    <td style={{textAlign:"right",fontWeight:600,color:"var(--accent)"}}>{fmt(p.wholesale_price)}</td>
                    <td style={{textAlign:"center",fontWeight:700,color:p.stock===0?"var(--danger)":p.stock<=p.low_stock_threshold?"var(--warn)":"var(--success)"}}>{p.stock}</td>
                    <td style={{textAlign:"center"}}>
                      {p.wholesale_visible===false
                        ? <span className="badge" style={{background:"var(--warn)22",color:"var(--warn)",fontSize:10}}>Hidden</span>
                        : <span className="badge bg" style={{fontSize:10}}>Visible</span>}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-xs" disabled={busy===p.id}
                        onClick={()=>toggle(p,false)}>
                        {busy===p.id?"…":"✕ Remove"}
                      </button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
        }
      </div>

      {/* Add products */}
      <div className="card">
        <div className="card-header">
          <h3>➕ Add Products to Hot Sellers</h3>
        </div>
        <div className="card-body" style={{paddingBottom:8}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <div className="search-wrap" style={{flex:2,minWidth:180}}>
              <span className="search-icon">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…"/>
            </div>
            <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
              {allBrands.map(b=><option key={b}>{b}</option>)}
            </select>
            <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
              {allCats.map(c=><option key={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:"6px 10px",borderRadius:7,border:"1px solid var(--border)",background:"var(--bg2)",fontSize:13}}>
              <option value="name">Sort: A–Z</option>
              <option value="stock_desc">Stock: High–Low</option>
              <option value="stock_asc">Stock: Low–High</option>
              <option value="price_asc">Price: Low–High</option>
              <option value="price_desc">Price: High–Low</option>
            </select>
          </div>
        </div>
        {eligible.length === 0
          ? <div style={{padding:"24px",textAlign:"center",color:"var(--text3)"}}>
              {search||filterBrand!=="Brand"||filterCat!=="Category" ? "No products match your filters." : "All active products are already in Hot Sellers."}
            </div>
          : <div className="tbl-wrap">
              <table>
                <thead><tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th style={{textAlign:"right"}}>Wholesale</th>
                  <th style={{textAlign:"center"}}>Stock</th>
                  <th></th>
                </tr></thead>
                <tbody>{eligible.map(p=>(
                  <tr key={p.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {p.image_url
                          ? <img src={p.image_url} style={{width:32,height:32,objectFit:"cover",borderRadius:4,flexShrink:0}} alt=""/>
                          : <div style={{width:32,height:32,background:"var(--bg3)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>📦</div>}
                        <div>
                          <div style={{fontWeight:500,fontSize:13}}>{p.name}</div>
                          {p.barcode&&<div style={{fontSize:10,color:"var(--text3)"}}>{p.barcode}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{p.brand||"—"}</td>
                    <td><span className="badge bb" style={{fontSize:10}}>{p.category}</span></td>
                    <td style={{textAlign:"right",fontWeight:600,color:"var(--accent)"}}>{fmt(p.wholesale_price)}</td>
                    <td style={{textAlign:"center",fontWeight:700,color:p.stock===0?"var(--danger)":p.stock<=p.low_stock_threshold?"var(--warn)":"var(--success)"}}>{p.stock}</td>
                    <td>
                      <button className="btn btn-primary btn-xs" disabled={busy===p.id}
                        onClick={()=>toggle(p,true)}>
                        {busy===p.id?"…":"⭐ Add"}
                      </button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ─── HOT SELLERS PAGE ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function HotSellersPage({ products, user, addToCart, cart }) {
  const [search,setSearch]=useState("");
  const [sortBy,setSortBy]=useState("name");
  const isConsignment=user?.customer_type==="consignment";
  const base=products.filter(p=>p.is_hot_seller&&p.active&&p.stock>0&&p.wholesale_visible!==false);
  const items=base.filter(p=>!search||p.name?.toLowerCase().includes(search.toLowerCase())||p.barcode?.includes(search)).sort((a,b)=>{
    if(sortBy==="price_asc") return (a.wholesale_price||0)-(b.wholesale_price||0);
    if(sortBy==="price_desc") return (b.wholesale_price||0)-(a.wholesale_price||0);
    if(sortBy==="stock") return b.stock-a.stock;
    return (a.name||"").localeCompare(b.name||"");
  });
  const inCart=id=>cart?.find(i=>i.pid===id)?.qty||0;
  if(!user?.approved) return <div className="empty"><div className="ei">⏳</div><h3>Account Pending Approval</h3></div>;
  return (
    <div>
      <div style={{background:"#fef9c3",border:"1px solid #fde047",color:"#854d0e",padding:"10px 14px",borderRadius:8,marginBottom:12,fontSize:13}}>
        ⭐ {items.length} hot seller{items.length!==1?"s":""} — our most popular items!
      </div>
      <div className="filter-bar" style={{gap:8,marginBottom:12}}>
        <div className="search-wrap" style={{flex:1}}><span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search hot sellers…"/>
        </div>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:"auto"}}>
          <option value="name">Sort: A–Z</option>
          <option value="price_asc">Price: Low–High</option>
          <option value="price_desc">Price: High–Low</option>
          <option value="stock">Most Stock</option>
        </select>
      </div>
      {items.length===0&&<div className="empty"><div className="ei">⭐</div><p>No hot sellers match your search.</p></div>}
      <div className="prod-grid">
        {items.map(p=>{
          const qty=inCart(p.id);
          const price=applyDiscount(p.wholesale_price,user.discount_pct||0);
          return (
            <div key={p.id} className="prod-card">
              <div className="prod-tag"><span className="new-badge" style={{background:"#f59e0b",color:"#fff"}}>⭐ HOT</span></div>
              <div className="prod-card-img">
                {p.image_url?<img src={p.image_url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:40}}>📱</span>}
              </div>
              <div className="prod-card-body">
                <div className="prod-card-brand">{p.brand}</div>
                <div className="prod-card-name">{p.name}</div>
                {!isConsignment&&<div className="prod-price-row"><span className="prod-ws">{fmt(price)}</span></div>}
                <div className="prod-stock">{p.stock} in stock · MOQ: {p.min_order||1}{qty>0?` · ${qty} in cart`:""}</div>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,marginTop:8}}>
                  <div style={{fontSize:11,color:"var(--text3)"}}>Qty:</div>
                  <input type="number" min={p.min_order||1} max={p.stock} defaultValue={p.min_order||1}
                    id={"hs-"+p.id} style={{width:70,textAlign:"center",padding:"4px 6px",border:"1px solid var(--border)",borderRadius:6,fontSize:13,fontWeight:600}}/>
                </div>
                <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>{
                  const inp=document.getElementById("hs-"+p.id);
                  const val=Math.max(p.min_order||1,Math.min(p.stock,parseInt(inp?.value)||p.min_order||1));
                  addToCart(p,val);
                }}>{qty>0?"➕ Add More":"Add to Cart"}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function CustomersPage({ customers, setCustomers, orders, salesReps, showToast }) {
  const [tab,setTab]=useState("all");
  const [search,setSearch]=useState("");
  const [editing,setEditing]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [showCreateModal,setShowCreateModal]=useState(false);

  const filtered=customers.filter(c=>{
    if(tab==="pending"&&c.approved)return false;
    if(tab==="upfront"&&c.customer_type!=="upfront")return false;
    if(tab==="consignment"&&c.customer_type!=="consignment")return false;
    if(tab==="unassigned"&&(!c.approved||c.sales_rep_id))return false;
    const q=search.toLowerCase();
    if(q&&!c.name.toLowerCase().includes(q)&&!c.company?.toLowerCase().includes(q)&&!c.email?.toLowerCase().includes(q))return false;
    return true;
  });

  const logAct = async(action,details,entity_type="",entity_id="") => {
    try { await supabase.from("activity_log").insert({action,details,entity_type,entity_id:String(entity_id||""),user_name:currentUserName,timestamp:new Date().toISOString()}); } catch(e) { console.warn("Log err:",e); }
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
      discount_pct: data.discount_pct||0, min_order_value: data.min_order_value||0,
      sales_rep_id: data.sales_rep_id||null
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
        {[["all","All"],["pending","Pending"],["upfront","Upfront Buyers"],["consignment","Consignment"],["unassigned","No Rep"]].map(([v,l])=>(
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
            <thead><tr><th>Company</th><th>Contact</th><th>TRN</th><th>Type</th><th>Discount</th><th>Min Order</th><th>Sales Rep</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
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
                  <td style={{fontSize:11}}>{(()=>{ const r=(salesReps||[]).find(x=>x.id===c.sales_rep_id); return r?<span style={{color:"var(--accent)",fontWeight:600}}>{r.name}</span>:<span style={{color:"var(--text3)"}}>—</span>; })()}</td>
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
            {filtered.length===0&&<tr><td colSpan={10} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No customers found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal&&editing&&<CustomerEditModal customer={editing} onSave={saveCustomer} onClose={()=>setShowModal(false)} salesReps={salesReps}/>}
      {showCreateModal&&<CreateCustomerModal onSave={createCustomer} onClose={()=>setShowCreateModal(false)} salesReps={salesReps}/>}
    </>
  );
}

function CreateCustomerModal({ onSave, onClose, salesReps }) {
  const [f,setF]=useState({name:"",company:"",email:"",password:"",tax_id:"",customer_type:"upfront",discount_pct:0,min_order_value:0,sales_rep_id:""});
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
          <div className="form-group"><label>Sales Rep</label>
            <select value={f.sales_rep_id} onChange={e=>setF(p=>({...p,sales_rep_id:e.target.value}))}>
              <option value="">— No sales rep assigned —</option>
              {(salesReps||[]).map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
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

function CustomerEditModal({ customer, onSave, onClose, salesReps }) {
  const [f,setF]=useState({
    name:customer.name||"", company:customer.company||"", email:customer.email||"",
    tax_id:customer.tax_id||"", customer_type:customer.customer_type||"upfront",
    discount_pct:customer.discount_pct||0, min_order_value:customer.min_order_value||0,
    approved:customer.approved||false, sales_rep_id:customer.sales_rep_id||""
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
        <div className="form-group" style={{marginTop:8}}><label>Sales Rep</label>
          <select value={f.sales_rep_id} onChange={e=>setF(p=>({...p,sales_rep_id:e.target.value}))}>
            <option value="">— No sales rep assigned —</option>
            {(salesReps||[]).map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
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
function PurchaseOrdersPage({ purchaseOrders, setPurchaseOrders, products, setProducts, suppliers, setSuppliers, settings, showToast }) {
  const [view, setView] = useState("list"); // "list" | "detail"
  const [activePO, setActivePO] = useState(null);
  const [poTab, setPoTab] = useState("open"); // "open" | "completed"
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [newPOForm, setNewPOForm] = useState({ supplier_id:"", supplier_name:"", expected_date:"", lot_ref:"", shipping_cost:"", notes:"" });

  const statusColor = { open:"var(--accent)", received:"var(--success)", partial:"var(--warn)", cancelled:"var(--danger)" };
  const statusLabel = { open:"Open", received:"Completed", partial:"Partial", cancelled:"Cancelled" };

  const openPOs = purchaseOrders.filter(po => po.status === "open" || po.status === "partial");
  const completedPOs = purchaseOrders.filter(po => po.status === "received" || po.status === "cancelled");

  const filtered = (poTab === "open" ? openPOs : completedPOs).filter(po => {
    if (search && !po.id?.toLowerCase().includes(search.toLowerCase()) && !po.supplier_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const [cancelPOModal, setCancelPOModal] = useState(null);

  const cancelPO = async (po, reason) => {
    const note = reason ? `Cancelled: ${reason}` : undefined;
    const update = {status:"cancelled",...(note?{notes:po.notes?po.notes+"\n"+note:note}:{})};
    const { error } = await supabase.from("purchase_orders").update(update).eq("id", po.id);
    if (error) { showToast("Failed to cancel: " + error.message, "err"); return; }
    setPurchaseOrders(prev => prev.map(p => p.id === po.id ? { ...p, ...update } : p));
    try { await supabase.from("activity_log").insert({ action:"po_cancelled", details:`PO ${po.id} cancelled (${po.supplier_name})${reason?": "+reason:""}`, entity_type:"purchase_order", entity_id:po.id, user_name:currentUserName, timestamp:new Date().toISOString() }); } catch(e) {}
    showToast(`PO ${po.id} cancelled`);
    setCancelPOModal(null);
  };

  // Create PO header immediately — no items needed yet
  const createPO = async () => {
    if (!newPOForm.supplier_name && !newPOForm.supplier_id) { showToast("Enter a supplier name","err"); return; }
    setCreating(true);

    // If a manual name was typed (no supplier_id selected), auto-create the supplier
    let supplierId = newPOForm.supplier_id||null;
    let supplierName = newPOForm.supplier_name||suppliers.find(s=>s.id===supplierId)?.name||"";
    if (!supplierId && supplierName) {
      const existing = suppliers.find(s=>s.name?.toLowerCase()===supplierName.toLowerCase());
      if (existing) {
        supplierId = existing.id;
      } else {
        const {data:newSupp} = await supabase.from("suppliers").insert({name:supplierName}).select().single();
        if (newSupp) {
          supplierId = newSupp.id;
          setSuppliers(prev=>[...prev,newSupp].sort((a,b)=>a.name.localeCompare(b.name)));
          showToast(`Supplier "${supplierName}" added`);
        }
      }
    }

    const id = "PO-" + Date.now();
    const poRow = {
      id, supplier_id: supplierId,
      supplier_name: supplierName,
      expected_date: newPOForm.expected_date||null,
      lot_ref: newPOForm.lot_ref||"",
      shipping_cost: parseFloat(newPOForm.shipping_cost)||0,
      notes: newPOForm.notes||"",
      status: "open",
      created_at: new Date().toISOString()
    };
    const { error } = await supabase.from("purchase_orders").insert(poRow);
    if (error) { showToast("Failed: "+error.message,"err"); setCreating(false); return; }
    const newPO = { ...poRow, items: [] };
    setPurchaseOrders(prev=>[newPO,...prev]);
    setActivePO(newPO);
    setView("detail");
    setCreating(false);
    setNewPOForm({ supplier_id:"", supplier_name:"", expected_date:"", lot_ref:"", shipping_cost:"", notes:"" });
    try { await supabase.from("activity_log").insert({
      action:"po_opened",
      details:`PO ${id} opened for ${supplierName}${newPOForm.lot_ref?" · Ref: "+newPOForm.lot_ref:""}${newPOForm.expected_date?" · Expected: "+newPOForm.expected_date:""}`,
      entity_type:"purchase_order", entity_id:id,
      user_name:currentUserName, timestamp:new Date().toISOString()
    }); } catch(e) {}
    showToast("PO created — now add items");
  };

  const openPO = (po) => { setActivePO(po); setView("detail"); };

  if (view==="detail" && activePO) {
    return <PODetailPage
      po={activePO}
      setPO={(updated)=>{ setActivePO(updated); setPurchaseOrders(prev=>prev.map(p=>p.id===updated.id?updated:p)); }}
      products={products} setProducts={setProducts}
      suppliers={suppliers} settings={settings} showToast={showToast}
      onBack={()=>{ setView("list"); setActivePO(null); }}
    />;
  }

  return (
    <>
      <div className="filter-bar" style={{marginBottom:16}}>
        <div className="search-wrap" style={{flex:2}}>
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by PO # or supplier…"/>
        </div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-header" style={{justifyContent:"space-between"}}>
          <h3>📥 Batch Import PO from Template</h3>
          <button className="btn btn-secondary btn-sm" onClick={()=>{
            const rows=[
                    ["supplier_name","expected_date","lot_ref","barcode","brand","product_name","category","ordered_qty","received_qty","unit_cost","wholesale_price","retail_price","low_stock_threshold","min_order","description","is_clearance","clearance_price","is_hot_seller","notes"],
                    ["Supplier ABC","2025-03-15","INV-001","123456","Apple","iPhone 16 Pro Case","Cases","50","0","850","1200","1800","10","5","Premium case for iPhone 16 Pro","false","","false",""],
                    ["Supplier ABC","2025-03-15","INV-001","789012","Anker","USB-C Cable 6ft","USB & AUX Cables","100","50","250","450","800","20","10","Fast charge USB-C cable","false","","false","Partial shipment"],
                  ];
            downloadCSV(rows,"po_import_template.csv");
            showToast("Template downloaded");
          }}>⬇ Download Template</button>
        </div>
        <div className="card-body">
          <div className="alert alert-info" style={{marginBottom:8,fontSize:12}}>
            Upload a CSV using the template format. Rows with the same supplier_name+lot_ref become one PO. Products matched by barcode then name — new products, suppliers are created automatically.
          </div>
          <input type="file" accept=".csv" onChange={async(e)=>{
            const file=e.target.files?.[0]; if(!file) return;
            try {
              const text=await file.text();
              const allLines=text.trim().split("\n");
              const headers=allLines[0].split(",").map(h=>h.replace(/"/g,"").trim().toLowerCase());
              const dataRows=allLines.slice(1).filter(l=>l.trim()).map(line=>{
                const vals=line.split(",").map(v=>v.replace(/^\s*"|"\s*$/g,"").trim());
                const obj={}; headers.forEach((h,idx)=>{ obj[h]=vals[idx]||""; }); return obj;
              });
              if(!dataRows.length){showToast("No data rows","err");e.target.value="";return;}
              const groups={};
              // Build groups keyed by supplier+lot_ref
              dataRows.forEach(r=>{
                const key=(r.supplier_name||"Unknown")+":::"+(r.lot_ref||"");
                if(!groups[key]) groups[key]={supplier_name:r.supplier_name||"Unknown",lot_ref:r.lot_ref||"",expected_date:r.expected_date||"",items:[]};
                groups[key].items.push({
                  barcode:r.barcode||"",
                  product_name:r.product_name||"Unknown",
                  brand:r.brand||"",
                  category:r.category||"Uncategorized",
                  ordered_qty:parseInt(r.ordered_qty)||0,
                  received_qty:parseInt(r.received_qty)||0,
                  unit_cost:parseFloat(r.unit_cost)||0,
                  wholesale_price:parseFloat(r.wholesale_price)||0,
                  retail_price:parseFloat(r.retail_price)||0,
                  low_stock_threshold:parseInt(r.low_stock_threshold)||5,
                  min_order:parseInt(r.min_order)||1,
                  description:r.description||"",
                  is_clearance:r.is_clearance?.toLowerCase()==="true",
                  clearance_price:parseFloat(r.clearance_price)||null,
                  is_hot_seller:r.is_hot_seller?.toLowerCase()==="true",
                  notes:r.notes||""
                });
              });

              const keys=Object.keys(groups);
              let created=0, newProds=0;
              // Local mutable copy of products for dedup within this import
              let localProducts=[...products];
              let localSuppliers=[...suppliers];

              for(let gi=0;gi<keys.length;gi++){
                const g=groups[keys[gi]];
                const poId="PO-"+Date.now()+"-"+gi;

                // Create supplier if missing
                let suppId=null;
                const es=localSuppliers.find(s=>s.name?.toLowerCase()===g.supplier_name.toLowerCase());
                if(es){suppId=es.id;}
                else{
                  const {data:ns}=await supabase.from("suppliers").insert({name:g.supplier_name}).select().single();
                  if(ns){suppId=ns.id;localSuppliers=[...localSuppliers,ns];setSuppliers(localSuppliers);}
                }

                // Resolve/create products and build PO items
                const iRows=[];
                for(const it of g.items){
                  // Match by barcode first, then name
                  let prod=localProducts.find(p=>p.barcode&&p.barcode===it.barcode&&it.barcode)
                         ||localProducts.find(p=>p.name?.toLowerCase()===it.product_name?.toLowerCase());
                  if(!prod){
                    // Create the product
                    const newProd={
                      barcode:it.barcode||"",
                      brand:it.brand||"",
                      name:it.product_name,
                      category:it.category||"Uncategorized",
                      supplier_id:suppId,
                      cost:it.unit_cost||0,
                      wholesale_price:it.wholesale_price||0,
                      retail_price:it.retail_price||0,
                      stock:0,
                      low_stock_threshold:it.low_stock_threshold||5,
                      min_order:it.min_order||1,
                      description:it.description||"",
                      is_clearance:it.is_clearance||false,
                      clearance_price:it.clearance_price||null,
                      is_hot_seller:it.is_hot_seller||false,
                      wholesale_visible:true,
                      active:true,
                      created_at:new Date().toISOString()
                    };
                    const {data:savedProd}=await supabase.from("products").insert(newProd).select().single();
                    if(savedProd){
                      prod=savedProd;
                      localProducts=[...localProducts,savedProd];
                      setProducts(localProducts);
                      newProds++;
                    }
                  }
                  iRows.push({purchase_order_id:poId,product_id:prod?.id||null,product_name:it.product_name,barcode:it.barcode,ordered_qty:it.ordered_qty,received_qty:it.received_qty,unit_cost:it.unit_cost,notes:it.notes});
                }

                const poRow={id:poId,supplier_id:suppId,supplier_name:g.supplier_name,expected_date:g.expected_date||null,lot_ref:g.lot_ref||"",shipping_cost:0,notes:"Imported from template",status:"open",created_at:new Date().toISOString()};
                const {error:pe}=await supabase.from("purchase_orders").insert(poRow);
                if(pe){showToast("PO failed: "+pe.message,"err");continue;}
                await supabase.from("purchase_order_items").insert(iRows);
                const status=g.items.every(it=>it.received_qty>=it.ordered_qty&&it.ordered_qty>0)?"received":g.items.some(it=>it.received_qty>0)?"partial":"open";
                if(status!=="open") await supabase.from("purchase_orders").update({status}).eq("id",poId);
                setPurchaseOrders(prev=>[{...poRow,status,items:g.items},...prev]);
                created++;
              }
              const msg=created+" PO"+(created!==1?"s":"")+" imported"+(newProds>0?` · ${newProds} new product${newProds!==1?"s":""} created`:"");
              showToast(msg);
            } catch(err){showToast("Import error: "+err.message,"err");}
            e.target.value="";
          }}/>
        </div>
      </div>

      {/* New PO inline form */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header"><h3>➕ New Purchase Order</h3></div>
        <div className="card-body">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
            <div className="form-group" style={{margin:0}}>
              <label>Supplier</label>
              <select value={newPOForm.supplier_id} onChange={e=>{const s=suppliers.find(x=>x.id===e.target.value);setNewPOForm(p=>({...p,supplier_id:e.target.value,supplier_name:s?.name||p.supplier_name}));}}>
                <option value="">— Select —</option>
                {suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Supplier Name (manual)</label>
              <input value={newPOForm.supplier_name} onChange={e=>setNewPOForm(p=>({...p,supplier_name:e.target.value}))} placeholder="Or type name…"/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Expected Date</label>
              <input type="date" value={newPOForm.expected_date} onChange={e=>setNewPOForm(p=>({...p,expected_date:e.target.value}))}/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label>Lot / Ref #</label>
              <input value={newPOForm.lot_ref} onChange={e=>setNewPOForm(p=>({...p,lot_ref:e.target.value}))} placeholder="Invoice # etc."/>
            </div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"flex-end"}}>
            <div className="form-group" style={{margin:0,flex:1}}>
              <label>Notes</label>
              <input value={newPOForm.notes} onChange={e=>setNewPOForm(p=>({...p,notes:e.target.value}))} placeholder="Optional notes…"/>
            </div>
            <div className="form-group" style={{margin:0,width:160}}>
              <label>Shipping Cost (J$)</label>
              <input type="number" value={newPOForm.shipping_cost} onChange={e=>setNewPOForm(p=>({...p,shipping_cost:e.target.value}))} placeholder="0"/>
            </div>
            <button className="btn btn-primary" disabled={creating} onClick={createPO} style={{flexShrink:0}}>
              {creating?"Creating…":"Create PO & Add Items →"}
            </button>
          </div>
        </div>
      </div>

      {/* PO list */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div className="tabs" style={{margin:0}}>
          <button className={`tab ${poTab==="open"?"active":""}`} onClick={()=>setPoTab("open")}>
            Open / Partial {openPOs.length>0&&<span className="badge bb" style={{fontSize:9,marginLeft:4}}>{openPOs.length}</span>}
          </button>
          <button className={`tab ${poTab==="completed"?"active":""}`} onClick={()=>setPoTab("completed")}>
            Completed / Cancelled {completedPOs.length>0&&<span className="badge bg" style={{fontSize:9,marginLeft:4}}>{completedPOs.length}</span>}
          </button>
        </div>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th>PO #</th><th>Supplier</th><th>Expected</th><th>Ref #</th><th>Items</th><th>Ordered</th><th>Received</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={9} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No purchase orders found.</td></tr>}
              {filtered.map(po=>{
                const totalOrdered = (po.items||[]).reduce((s,i)=>s+(i.ordered_qty||0),0);
                const totalReceived = (po.items||[]).reduce((s,i)=>s+(i.received_qty||0),0);
                return (
                  <tr key={po.id} style={{cursor:"pointer"}} onClick={()=>openPO(po)}>
                    <td><code style={{fontWeight:700,color:"var(--accent)"}}>{po.id}</code></td>
                    <td style={{fontWeight:500}}>{po.supplier_name||"—"}</td>
                    <td style={{fontSize:12,color:"var(--text2)"}}>{po.expected_date||"—"}</td>
                    <td style={{fontSize:12,color:"var(--text3)"}}>{po.lot_ref||"—"}</td>
                    <td>{(po.items||[]).length}</td>
                    <td style={{fontWeight:600}}>{totalOrdered}</td>
                    <td style={{fontWeight:600,color:totalReceived===totalOrdered&&totalOrdered>0?"var(--success)":totalReceived>0?"var(--warn)":"var(--text3)"}}>{totalReceived}</td>
                    <td><span className="badge" style={{background:`${statusColor[po.status]||"var(--accent)"}22`,color:statusColor[po.status]||"var(--accent)",fontSize:10}}>{statusLabel[po.status]||po.status}</span></td>
                    <td><div className="tbl-actions">
                      <button className="btn btn-secondary btn-xs" onClick={e=>{e.stopPropagation();openPO(po);}}>Open →</button>
                      {(po.status==="open"||po.status==="partial")&&<button className="btn btn-danger btn-xs" onClick={e=>{e.stopPropagation();setCancelPOModal(po);}}>✕ Cancel</button>}
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
      {cancelPOModal&&<CancelReasonModal title="Cancel Purchase Order" itemLabel={`${cancelPOModal.id} — ${cancelPOModal.supplier_name}`} onConfirm={r=>cancelPO(cancelPOModal,r)} onClose={()=>setCancelPOModal(null)}/>}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── PO DETAIL PAGE (persistent, item-by-item) ───────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function PODetailPage({ po, setPO, products, setProducts, suppliers, settings, showToast, onBack }) {
  const [editHeader, setEditHeader] = useState(false);
  const [cancelPODetailModal, setCancelPODetailModal] = useState(false);
  const [hf, setHf] = useState({ supplier_name:po.supplier_name||"", supplier_id:po.supplier_id||"", expected_date:po.expected_date||"", lot_ref:po.lot_ref||"", shipping_cost:po.shipping_cost||"", notes:po.notes||"", status:po.status||"open" });
  const [savingHeader, setSavingHeader] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showNewProd, setShowNewProd] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [receivingItem, setReceivingItem] = useState(null); // item being received
  const [editingItem, setEditingItem] = useState(null);

  const pickerResults = products.filter(p=>p.active&&(
    p.name?.toLowerCase().includes(productSearch.toLowerCase())||
    p.barcode?.includes(productSearch)||
    p.brand?.toLowerCase().includes(productSearch.toLowerCase())
  )).slice(0,20);

  const totalOrdered = (po.items||[]).reduce((s,i)=>s+(i.ordered_qty||0),0);
  const totalReceived = (po.items||[]).reduce((s,i)=>s+(i.received_qty||0),0);
  const totalValue = (po.items||[]).reduce((s,i)=>s+(i.ordered_qty||0)*(i.unit_cost||0),0);

  // Save header changes
  const saveHeader = async () => {
    setSavingHeader(true);
    const { error } = await supabase.from("purchase_orders").update({
      supplier_name: hf.supplier_name, supplier_id: hf.supplier_id||null,
      expected_date: hf.expected_date||null, lot_ref: hf.lot_ref||"",
      shipping_cost: parseFloat(hf.shipping_cost)||0,
      notes: hf.notes||"", status: hf.status
    }).eq("id", po.id);
    if (error) { showToast("Save failed: "+error.message,"err"); setSavingHeader(false); return; }
    setPO({...po,...hf});
    setEditHeader(false);
    setSavingHeader(false);
    showToast("PO details updated");
  };

  // Add existing product as item
  const addItem = async (p) => {
    if ((po.items||[]).find(i=>i.product_id===p.id)) { showToast("Already in this PO","err"); return; }
    setAddingItem(true);
    const newItem = { po_id:po.id, product_id:p.id, product_name:p.name, barcode:p.barcode||"", ordered_qty:1, received_qty:0, unit_cost:p.cost||0, note:"" };
    const { data:saved, error } = await supabase.from("purchase_order_items").insert(newItem).select().single();
    if (error) { showToast("Failed to add item","err"); setAddingItem(false); return; }
    const updatedItems = [...(po.items||[]), saved];
    setPO({...po, items:updatedItems});
    setProductSearch(""); setShowPicker(false); setAddingItem(false);
    showToast(`${p.name} added to PO`);
  };

  // Update item field inline (ordered_qty, unit_cost, note)
  const updateItemField = async (item, key, val) => {
    const numVal = (key==="ordered_qty"||key==="unit_cost") ? (parseFloat(val)||0) : val;
    await supabase.from("purchase_order_items").update({[key]:numVal}).eq("id",item.id);
    const updatedItems = (po.items||[]).map(i=>i.id===item.id?{...i,[key]:numVal}:i);
    setPO({...po, items:updatedItems});
  };

  // Receive stock for one item
  const receiveItem = async (item, receiveQty, newCost) => {
    receiveQty = parseInt(receiveQty)||0;
    newCost = parseFloat(newCost)||0;
    if (receiveQty<=0) { showToast("Enter a valid qty","err"); return; }
    const maxReceivable = (item.ordered_qty||0) - (item.received_qty||0);
    if (receiveQty > maxReceivable) { showToast(`Max receivable: ${maxReceivable}`,"err"); return; }

    const prod = products.find(p=>p.id===item.product_id);
    if (prod) {
      const existingValue = (prod.stock||0) * (prod.cost||0);
      const newStock = (prod.stock||0) + receiveQty;
      const avgCost = newStock > 0 ? Math.round((existingValue + receiveQty*newCost)/newStock) : newCost;
      await supabase.from("products").update({stock:newStock, cost:avgCost, active:true}).eq("id",prod.id);
      setProducts(prev=>prev.map(p=>p.id===prod.id?{...p,stock:newStock,cost:avgCost,active:true}:p));
      try { await supabase.from("activity_log").insert({
        action:"stock_received",
        details:`Received ${receiveQty} units @ ${fmt(newCost)} (avg cost now ${fmt(avgCost)}) via PO ${po.id}`,
        entity_type:"product", entity_id:String(prod.id),
        user_name:currentUserName, timestamp:new Date().toISOString()
      }); } catch(e) {}
    }

    const newReceived = (item.received_qty||0) + receiveQty;
    await supabase.from("purchase_order_items").update({received_qty:newReceived, unit_cost:newCost}).eq("id",item.id);
    const updatedItems = (po.items||[]).map(i=>i.id===item.id?{...i,received_qty:newReceived,unit_cost:newCost}:i);

    // Auto-update PO status — never auto-complete to "received", only track partial progress
    const anyDone = updatedItems.some(i=>(i.received_qty||0)>0);
    const autoStatus = anyDone?"partial":po.status==="cancelled"?"cancelled":"open";
    // Only update if not already completed/cancelled
    if (po.status!=="received"&&po.status!=="cancelled"&&autoStatus !== po.status){
      await supabase.from("purchase_orders").update({status:autoStatus}).eq("id",po.id);
    }
    const newStatus = po.status==="received"||po.status==="cancelled" ? po.status : autoStatus;
    setPO({...po, items:updatedItems, status:newStatus});
    setReceivingItem(null);
    showToast(`✓ ${receiveQty} units received into inventory`);
  };

  // Delete item
  const deleteItem = async (item) => {
    if (!confirm(`Remove ${item.product_name} from this PO?`)) return;
    await supabase.from("purchase_order_items").delete().eq("id",item.id);
    setPO({...po, items:(po.items||[]).filter(i=>i.id!==item.id)});
    showToast("Item removed");
  };

  const markCompleted = async () => {
    // Block if any item has unmatched ordered vs received qty
    const unmatched = (po.items||[]).filter(i => (i.ordered_qty||0) !== (i.received_qty||0));
    if (unmatched.length > 0) {
      const lines = unmatched.map(i => `• ${i.product_name}: ordered ${i.ordered_qty}, received ${i.received_qty}`).join("\n");
      alert(`Cannot complete — the following items have mismatched quantities:\n\n${lines}\n\nReceive the remaining items or adjust quantities before completing.`);
      return;
    }
    if (!confirm("Mark this PO as Completed? It will become view-only.")) return;
    await supabase.from("purchase_orders").update({status:"received"}).eq("id",po.id);
    setPO({...po, status:"received"});
    try { await supabase.from("activity_log").insert({
      action:"po_completed",
      details:`PO ${po.id} marked completed (${po.supplier_name} · ${(po.items||[]).length} items · ${(po.items||[]).reduce((s,i)=>s+(i.ordered_qty||0),0)} units)`,
      entity_type:"purchase_order", entity_id:po.id,
      user_name:currentUserName, timestamp:new Date().toISOString()
    }); } catch(e) {}
    showToast("PO marked as Completed ✓");
  };

  const reopenPO = async () => {
    if (!confirm("Reopen this PO for editing?")) return;
    const anyReceived = (po.items||[]).some(i=>(i.received_qty||0)>0);
    const newStatus = anyReceived ? "partial" : "open";
    await supabase.from("purchase_orders").update({status:newStatus}).eq("id",po.id);
    setPO({...po, status:newStatus});
    try { await supabase.from("activity_log").insert({
      action:"po_reopened",
      details:`PO ${po.id} reopened`,
      entity_type:"purchase_order", entity_id:po.id,
      user_name:currentUserName, timestamp:new Date().toISOString()
    }); } catch(e) {}
    showToast("PO reopened");
  };

  const isCompleted = po.status==="received";
  const statusColor = { open:"var(--accent)", received:"var(--success)", partial:"var(--warn)", cancelled:"var(--danger)" };
  const statusLabel = { open:"Open", received:"Completed", partial:"Partial", cancelled:"Cancelled" };

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <h2 style={{margin:0,fontSize:18}}>Purchase Order <code style={{color:"var(--accent)"}}>{po.id}</code></h2>
          <span className="badge" style={{background:`${statusColor[po.status]||"var(--accent)"}22`,color:statusColor[po.status]||"var(--accent)"}}>{statusLabel[po.status]||po.status}</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          {isCompleted&&<button className="btn btn-secondary btn-sm" onClick={reopenPO}>🔓 Reopen P.O.</button>}
          {!isCompleted&&po.status!=="cancelled"&&<button className="btn btn-secondary btn-sm" onClick={()=>setEditHeader(!editHeader)}>{editHeader?"✕ Cancel":"✏️ Edit Details"}</button>}
          {!isCompleted&&po.status!=="cancelled"&&<button className="btn btn-danger btn-sm" onClick={()=>setCancelPODetailModal(true)}>✕ Cancel PO</button>}
          {!isCompleted&&po.status!=="cancelled"&&<button className="btn btn-primary btn-sm" onClick={markCompleted}>✓ Mark Completed</button>}
        </div>
      </div>

      {/* Editable header */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-body">
          {!editHeader
            ? <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,fontSize:13}}>
                <div><span style={{color:"var(--text3)",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Supplier</span><div style={{fontWeight:600,marginTop:3}}>{po.supplier_name||"—"}</div></div>
                <div><span style={{color:"var(--text3)",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Expected</span><div style={{fontWeight:600,marginTop:3}}>{po.expected_date||"—"}</div></div>
                <div><span style={{color:"var(--text3)",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Lot / Ref #</span><div style={{fontWeight:600,marginTop:3}}>{po.lot_ref||"—"}</div></div>
                <div><span style={{color:"var(--text3)",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Shipping</span><div style={{fontWeight:600,marginTop:3}}>{fmt(po.shipping_cost||0)}</div></div>
                <div><span style={{color:"var(--text3)",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Notes</span><div style={{fontWeight:600,marginTop:3}}>{po.notes||"—"}</div></div>
                <div><span style={{color:"var(--text3)",fontSize:11,textTransform:"uppercase",letterSpacing:1}}>Created</span><div style={{fontWeight:600,marginTop:3}}>{po.created_at?new Date(po.created_at).toLocaleDateString():"—"}</div></div>
              </div>
            : <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
                  <div className="form-group" style={{margin:0}}><label>Supplier Name</label><input value={hf.supplier_name} onChange={e=>setHf(p=>({...p,supplier_name:e.target.value}))}/></div>
                  <div className="form-group" style={{margin:0}}><label>Expected Date</label><input type="date" value={hf.expected_date} onChange={e=>setHf(p=>({...p,expected_date:e.target.value}))}/></div>
                  <div className="form-group" style={{margin:0}}><label>Lot / Ref #</label><input value={hf.lot_ref} onChange={e=>setHf(p=>({...p,lot_ref:e.target.value}))}/></div>
                  <div className="form-group" style={{margin:0}}><label>Status</label>
                    <select value={hf.status} onChange={e=>setHf(p=>({...p,status:e.target.value}))}>
                      {["open","partial","received","cancelled"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 160px auto",gap:12,alignItems:"flex-end"}}>
                  <div className="form-group" style={{margin:0}}><label>Notes</label><input value={hf.notes} onChange={e=>setHf(p=>({...p,notes:e.target.value}))}/></div>
                  <div className="form-group" style={{margin:0}}><label>Shipping Cost</label><input type="number" value={hf.shipping_cost} onChange={e=>setHf(p=>({...p,shipping_cost:e.target.value}))}/></div>
                  <button className="btn btn-primary" disabled={savingHeader} onClick={saveHeader}>{savingHeader?"Saving…":"Save Details"}</button>
                </div>
              </div>
          }
        </div>
      </div>

      {/* Summary stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        <div className="card" style={{padding:14,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:"var(--accent)"}}>{(po.items||[]).length}</div><div style={{fontSize:11,color:"var(--text3)"}}>Line Items</div></div>
        <div className="card" style={{padding:14,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:"var(--accent)"}}>{totalOrdered}</div><div style={{fontSize:11,color:"var(--text3)"}}>Units Ordered</div></div>
        <div className="card" style={{padding:14,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:totalReceived===totalOrdered&&totalOrdered>0?"var(--success)":totalReceived>0?"var(--warn)":"var(--text3)"}}>{totalReceived}</div><div style={{fontSize:11,color:"var(--text3)"}}>Units Received</div></div>
        <div className="card" style={{padding:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"var(--accent)"}}>{fmt(totalValue)}</div><div style={{fontSize:11,color:"var(--text3)"}}>PO Value</div></div>
      </div>

      {/* Add item bar */}
      {!isCompleted&&po.status!=="cancelled"&&(
        <div className="card" style={{marginBottom:16,padding:"12px 16px"}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{position:"relative",flex:1}}>
              <input value={productSearch}
                onChange={e=>{setProductSearch(e.target.value);setShowPicker(true);}}
                onFocus={()=>setShowPicker(true)}
                placeholder="🔍 Search product to add to PO…"
                style={{width:"100%",padding:"8px 12px",border:"1px solid var(--border)",borderRadius:7,fontSize:13}}/>
              {showPicker&&productSearch&&pickerResults.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,.15)",zIndex:200,maxHeight:220,overflowY:"auto"}}>
                  {pickerResults.map(p=>(
                    <div key={p.id} style={{padding:"8px 12px",cursor:"pointer",fontSize:12,borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between"}}
                      onClick={()=>addItem(p)}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
                      onMouseLeave={e=>e.currentTarget.style.background=""}>
                      <div>
                        <div style={{fontWeight:600}}>{p.name}</div>
                        <div style={{color:"var(--text3)",fontSize:11}}>{p.barcode||"No barcode"} · Stock: {p.stock} · Cost: {fmt(p.cost)}</div>
                      </div>
                      <button className="btn btn-primary btn-xs" style={{flexShrink:0}}>+ Add</button>
                    </div>
                  ))}
                </div>
              )}
              {showPicker&&productSearch&&pickerResults.length===0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:12,fontSize:12,color:"var(--text3)",zIndex:200}}>No products found</div>}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={()=>setShowNewProd(true)}>+ New Product</button>
            {addingItem&&<span style={{fontSize:12,color:"var(--text3)"}}>Adding…</span>}
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr>
              <th>#</th>
              <th>Product</th>
              <th>Barcode</th>
              <th style={{textAlign:"center"}}>Ordered</th>
              <th style={{textAlign:"center"}}>Received</th>
              <th style={{textAlign:"center"}}>Remaining</th>
              <th style={{textAlign:"right"}}>Unit Cost</th>
              <th style={{textAlign:"right"}}>Total</th>
              <th>Note</th>
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {(po.items||[]).length===0&&(
                <tr><td colSpan={10} style={{textAlign:"center",color:"var(--text3)",padding:32}}>
                  No items yet — search for a product above to add it.
                </td></tr>
              )}
              {(po.items||[]).map((item,idx)=>{
                const prod = products.find(p=>p.id===item.product_id);
                const remaining = (item.ordered_qty||0) - (item.received_qty||0);
                const fullyReceived = remaining <= 0;
                return (
                  <tr key={item.id||idx} style={{background:fullyReceived?"rgba(34,197,94,.04)":""}}>
                    <td style={{color:"var(--text3)",fontWeight:600,fontSize:12}}>{idx+1}</td>
                    <td>
                      <div style={{fontSize:13,fontWeight:500}}>{item.product_name}</div>
                      {prod&&<div style={{fontSize:10,color:"var(--text3)"}}>Current stock: {prod.stock} · Avg cost: {fmt(prod.cost)}</div>}
                    </td>
                    <td><code style={{fontSize:11,color:"var(--text3)"}}>{item.barcode||"—"}</code></td>
                    <td style={{textAlign:"center"}}>
                      {isCompleted
                        ? <span style={{fontWeight:700}}>{item.ordered_qty}</span>
                        : <input type="number" min={1} defaultValue={item.ordered_qty}
                            onBlur={e=>{ if(+e.target.value!==item.ordered_qty) updateItemField(item,"ordered_qty",e.target.value); }}
                            style={{width:70,textAlign:"center"}}/>}
                    </td>
                    <td style={{textAlign:"center",fontWeight:700,color:fullyReceived?"var(--success)":item.received_qty>0?"var(--warn)":"var(--text3)"}}>{item.received_qty||0}</td>
                    <td style={{textAlign:"center",fontWeight:700,color:remaining>0?"var(--accent)":"var(--success)"}}>{remaining>0?remaining:"✓ Done"}</td>
                    <td style={{textAlign:"right"}}>
                      {isCompleted
                        ? <span style={{fontWeight:700}}>{fmt(item.unit_cost||0)}</span>
                        : <input type="number" min={0} defaultValue={item.unit_cost||0}
                            onBlur={e=>{ if(+e.target.value!==(item.unit_cost||0)) updateItemField(item,"unit_cost",e.target.value); }}
                            style={{width:90,textAlign:"right"}}/>}
                    </td>
                    <td style={{textAlign:"right",fontWeight:600,color:"var(--accent)"}}>{fmt((item.ordered_qty||0)*(item.unit_cost||0))}</td>
                    <td>
                      {isCompleted
                        ? <span style={{fontSize:11,color:"var(--text3)"}}>{item.note||"—"}</span>
                        : <input defaultValue={item.note||""} placeholder="—"
                            onBlur={e=>updateItemField(item,"note",e.target.value)}
                            style={{width:100,fontSize:11,padding:"2px 6px",border:"1px solid var(--border)",borderRadius:4}}/>}
                    </td>
                    <td>
                      <div style={{display:"flex",gap:4}}>
                        {isCompleted&&<span className="badge bg" style={{fontSize:10}}>✓ Done</span>}
                        {!isCompleted&&!fullyReceived&&po.status!=="cancelled"&&(
                          <button className="btn btn-primary btn-xs" onClick={()=>setReceivingItem(item)}>📥 Receive</button>
                        )}
                        {!isCompleted&&fullyReceived&&<span className="badge bg" style={{fontSize:10}}>✓ Received</span>}
                        {!isCompleted&&!item.received_qty&&<button className="btn btn-danger btn-xs" onClick={()=>deleteItem(item)}>✕</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(po.items||[]).length>0&&(
                <tr style={{background:"var(--bg3)",fontWeight:700}}>
                  <td colSpan={3} style={{textAlign:"right",paddingRight:12,fontSize:12,color:"var(--text3)"}}>Totals:</td>
                  <td style={{textAlign:"center"}}>{totalOrdered}</td>
                  <td style={{textAlign:"center",color:"var(--success)"}}>{totalReceived}</td>
                  <td style={{textAlign:"center",color:"var(--accent)"}}>{totalOrdered-totalReceived>0?totalOrdered-totalReceived:"—"}</td>
                  <td></td>
                  <td style={{textAlign:"right",color:"var(--accent)"}}>{fmt(totalValue)}</td>
                  <td colSpan={2}></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive item modal */}
      {receivingItem&&<ReceiveItemModal item={receivingItem} onReceive={receiveItem} onClose={()=>setReceivingItem(null)}/>}

      {/* New product modal */}
      {showNewProd&&<ProductModal
        product={null}
        categories={[...new Set([...products.map(p=>p.category).filter(Boolean),...(settings?.extra_categories?(() => { try { return JSON.parse(settings.extra_categories); } catch { return []; } })():[]) ])].sort((a,b)=>a.localeCompare(b))}
        onClose={()=>setShowNewProd(false)}
        onSave={async(data)=>{
          const dupName = products.find(p=>p.name?.toLowerCase()===data.name?.toLowerCase());
          const dupBarcode = data.barcode&&products.find(p=>p.barcode&&p.barcode===data.barcode);
          if(dupName){ alert(`"${data.name}" already exists — search for it instead.`); return; }
          if(dupBarcode){ alert(`Barcode ${data.barcode} already used by "${dupBarcode.name}".`); return; }
          const prod = {
            name:data.name, barcode:data.barcode||"", brand:data.brand||"",
            category:data.category||"Uncategorized",
            wholesale_price:data.wholesale_price||0, retail_price:data.retail_price||0,
            cost:0, stock:0, low_stock_threshold:data.low_stock_threshold||5,
            min_order:data.min_order||1, description:data.description||"",
            image_url:data.image_url||null, is_clearance:false, clearance_price:null,
            active:true, created_at:new Date().toISOString()
          };
          const {data:saved,error} = await supabase.from("products").insert(prod).select().single();
          if(error||!saved){ alert("Failed: "+(error?.message||"unknown")); return; }
          setProducts(prev=>[saved,...prev]);
          await addItem(saved);
          setShowNewProd(false);
        }}
      />}
      {cancelPODetailModal&&<CancelReasonModal title="Cancel Purchase Order" itemLabel={`${po.id} — ${po.supplier_name}`} onConfirm={async(reason)=>{ const note=reason?`Cancelled: ${reason}`:undefined; const update={status:"cancelled",...(note?{notes:po.notes?po.notes+"\n"+note:note}:{})}; const {error}=await supabase.from("purchase_orders").update(update).eq("id",po.id); if(error){showToast("Failed: "+error.message,"err");return;} setPO({...po,...update}); try{await supabase.from("activity_log").insert({action:"po_cancelled",details:`PO ${po.id} cancelled (${po.supplier_name})${reason?": "+reason:""}`,entity_type:"purchase_order",entity_id:po.id,user_name:currentUserName,timestamp:new Date().toISOString()});}catch(e){} showToast(`PO ${po.id} cancelled`); setCancelPODetailModal(false); }} onClose={()=>setCancelPODetailModal(false)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── RECEIVE ITEM MODAL ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ReceiveItemModal({ item, onReceive, onClose }) {
  const remaining = (item.ordered_qty||0) - (item.received_qty||0);
  const [qty, setQty] = useState(remaining);
  const [cost, setCost] = useState(item.unit_cost||"");
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    setBusy(true);
    try {
      await onReceive(item, qty, cost);
    } catch(e) {
      console.error("Receive error:", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overlay"><div className="modal modal-sm">
      <div className="modal-head">
        <h2>📥 Receive Stock</h2>
        <button className="xbtn" onClick={onClose}>✕</button>
      </div>
      <div className="modal-body">
        <div style={{marginBottom:14,padding:12,background:"var(--bg3)",borderRadius:8}}>
          <div style={{fontWeight:600,fontSize:14}}>{item.product_name}</div>
          <div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>Ordered: {item.ordered_qty} · Previously received: {item.received_qty||0} · <strong style={{color:"var(--accent)"}}>Remaining: {remaining}</strong></div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Qty Receiving Now <span style={{color:"var(--danger)"}}>*</span></label>
            <input type="number" min={1} max={remaining} value={qty} onChange={e=>setQty(Math.min(remaining,Math.max(1,+e.target.value)))} autoFocus/>
            <div className="input-hint">Max: {remaining}</div>
          </div>
          <div className="form-group">
            <label>Unit Cost (J$) <span style={{color:"var(--danger)"}}>*</span></label>
            <input type="number" min={0} value={cost} onChange={e=>setCost(e.target.value)} placeholder="0"/>
            <div className="input-hint">Used for weighted avg cost</div>
          </div>
        </div>
        {cost&&qty&&<div style={{padding:"10px 14px",background:"var(--bg3)",borderRadius:8,fontSize:13}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"var(--text3)"}}>Subtotal</span><span style={{fontWeight:700,color:"var(--accent)"}}>{fmt(+qty * +cost)}</span></div>
        </div>}
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={busy||!qty||!cost} onClick={handle}>{busy?"Receiving…":"Confirm Receipt →"}</button>
      </div>
    </div></div>
  );
}



// ─── INCOMING STOCK PAGE (CUSTOMER FACING) ───────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function IncomingStockPage({ purchaseOrders, products }) {
  const [liveItems, setLiveItems] = useState(null); // null = not yet loaded
  const [loadError, setLoadError] = useState(false);

  useEffect(()=>{
    // Always fetch fresh from DB so received qty is up to date
    Promise.all([
      supabase.from("purchase_orders").select("*").in("status",["open","partial"]),
      supabase.from("purchase_order_items").select("*"),
      supabase.from("products").select("id,image_url,brand")
    ]).then(([{data:pos,error:e1},{data:items,error:e2},{data:prods}])=>{
      if(e1||e2){ setLoadError(true); return; }
      const merged = (pos||[]).map(po=>({...po,items:(items||[]).filter(i=>i.po_id===po.id)}));
      const all = merged.flatMap(po=>(po.items||[])
        .filter(i=>(i.ordered_qty-(i.received_qty||0))>0)
        .map(i=>{
          const prod = (prods||[]).find(p=>p.id===i.product_id);
          return {...i, expected_date:po.expected_date, supplier_name:po.supplier_name, image_url:prod?.image_url||null, brand:prod?.brand||""};
        }));
      setLiveItems(all);
    }).catch(()=>setLoadError(true));
  },[]);

  // While loading, fall back to prop data (enriched with product image)
  const allItems = liveItems !== null ? liveItems :
    purchaseOrders.filter(po=>po.status==="open"||po.status==="partial")
      .flatMap(po=>(po.items||[]).filter(i=>(i.ordered_qty-(i.received_qty||0))>0)
      .map(i=>{
        const prod = (products||[]).find(p=>p.id===i.product_id);
        return {...i, expected_date:po.expected_date, supplier_name:po.supplier_name, image_url:prod?.image_url||null, brand:prod?.brand||""};
      }));

  const grouped = {};
  allItems.forEach(i=>{ const k=i.product_name||"Unknown"; if(!grouped[k])grouped[k]=[];grouped[k].push(i); });

  return (
    <div>
      <div className="alert alert-info" style={{marginBottom:16}}>📬 These items are on order and expected to arrive soon. Contact us to reserve or for more information.</div>
      {liveItems===null&&!loadError&&<div style={{textAlign:"center",padding:24,color:"var(--text3)"}}>Loading…</div>}
      {allItems.length===0&&liveItems!==null&&<div className="empty"><div className="ei">📬</div><h3>No Incoming Stock</h3><p>Check back soon for new arrivals.</p></div>}
      <div className="prod-grid">
        {Object.entries(grouped).map(([name,items])=>{
          const earliest = items.map(i=>i.expected_date).filter(Boolean).sort()[0];
          const totalQty = items.reduce((s,i)=>s+(i.ordered_qty-(i.received_qty||0)),0);
          return (
            <div key={name} className="prod-card">
              <div className="prod-card-img">
                {items[0]?.image_url
                  ? <img src={items[0].image_url} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <span style={{fontSize:40}}>📬</span>}
              </div>
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


// ─────────────────────────────────────────────────────────────────────────────
// ─── CUSTOMER CARTS PAGE ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function CustomerCartsPage({ customerCarts, setCustomerCarts, customers, orders, products, showToast }) {
  const [filter, setFilter] = useState("active");
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh carts from DB every time this page is opened, and every 60s while open
  const refreshCarts = async () => {
    setRefreshing(true);
    const { data } = await supabase.from("customer_carts").select("*").order("updated_at",{ascending:false});
    if (data) setCustomerCarts(data);
    setRefreshing(false);
  };

  useEffect(() => {
    refreshCarts();
    const interval = setInterval(refreshCarts, 60000);
    return () => clearInterval(interval);
  }, []);

  // Enrich carts with customer data and parse items
  const enriched = customerCarts.map(c => {
    const cust = customers.find(x=>x.id===c.customer_id);
    const items = (() => { try { return JSON.parse(c.items||"[]"); } catch { return []; } })();
    const lastOrder = orders.filter(o=>o.customer_id===c.customer_id).sort((a,b)=>b.date?.localeCompare(a.date||""))[0];
    const updatedAt = c.updated_at ? new Date(c.updated_at) : null;
    const minutesAgo = updatedAt ? Math.floor((Date.now()-updatedAt)/60000) : null;
    const hoursAgo = minutesAgo !== null ? Math.floor(minutesAgo/60) : null;
    // Abandoned = active cart with items, untouched for 24+ hours
    const isAbandoned = hoursAgo !== null && hoursAgo >= 24 && c.status === "active" && items.length > 0;
    return { ...c, items, cust, lastOrder, minutesAgo, hoursAgo, isAbandoned };
  });

  const filtered = enriched.filter(c => {
    if (filter === "active") return c.status === "active" && c.items.length > 0 && !c.isAbandoned;
    if (filter === "abandoned") return c.isAbandoned;
    // Converted = status flag OR customer has at least one order placed
    if (filter === "converted") return c.status === "converted" || (c.lastOrder != null);
    return true;
  });

  const totalActiveCarts = enriched.filter(c=>c.status==="active"&&c.items.length>0).length;
  const totalAbandoned = enriched.filter(c=>c.isAbandoned).length;
  const totalActiveValue = enriched.filter(c=>c.status==="active"&&c.items.length>0).reduce((s,c)=>s+(c.subtotal||0),0);

  const timeAgo = (c) => {
    if (c.minutesAgo === null) return "—";
    if (c.minutesAgo < 1) return "just now";
    if (c.minutesAgo < 60) return `${c.minutesAgo}m ago`;
    if (c.hoursAgo < 24) return `${c.hoursAgo}h ago`;
    return `${Math.floor(c.hoursAgo/24)}d ago`;
  };

  return (
    <div>
      {/* Summary stats */}
      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat c1">
          <div className="stat-label">Active Carts</div>
          <div className="stat-val">{totalActiveCarts}</div>
          <div className="stat-sub">customers browsing now</div>
        </div>
        <div className="stat c3">
          <div className="stat-label">Abandoned Carts</div>
          <div className="stat-val">{totalAbandoned}</div>
          <div className="stat-sub">inactive 2+ hours</div>
        </div>
        <div className="stat c2">
          <div className="stat-label">Active Cart Value</div>
          <div className="stat-val">{fmt(totalActiveValue)}</div>
          <div className="stat-sub">potential revenue</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[["active","🟢 Active Carts"],["abandoned","⚠️ Abandoned"],["converted","✓ Converted"],["all","All"]].map(([v,l])=>(
          <button key={v} className={`btn btn-sm ${filter===v?"btn-primary":"btn-secondary"}`} onClick={()=>setFilter(v)}>{l}</button>
        ))}
        <div style={{display:"flex",gap:8,marginLeft:"auto"}}>
          <button className="btn btn-secondary btn-sm" onClick={()=>{
            const active = enriched.filter(c=>c.status==="active"&&c.items.length>0);
            const rows = [["Customer","Email","Type","Product","Barcode","Qty","Cost","Unit Price","Line Total","Cart Subtotal","Last Updated"]];
            active.forEach(c=>{
              if(c.items.length===0){ rows.push([c.customer_name||c.customer_email,"","","(empty cart)","","","","","",0,c.updated_at||""]); return; }
              c.items.forEach((item,idx)=>{
                const prod = (products||[]).find(p=>p.id===item.pid);
                const cost = Number(prod?.cost||item.cost||0);
                const unitPrice = Number(item.price||0);
                const lineTotal = Number((unitPrice * item.qty).toFixed(2));
                rows.push([
                  idx===0?(c.customer_name||c.customer_email||""):"",
                  idx===0?(c.customer_email||""):"",
                  idx===0?(c.customer_type||"standard"):"",
                  item.name||"",
                  item.barcode||"",
                  item.qty,
                  cost,
                  unitPrice,
                  lineTotal,
                  idx===0?Number((c.subtotal||0).toFixed(2)):"",
                  idx===0?(c.updated_at?new Date(c.updated_at).toLocaleString("en-JM",{timeZone:"America/Jamaica"}):""):"",
                ]);
              });
            });
            downloadCSV(rows,`active_carts_${new Date().toISOString().slice(0,10)}.csv`);
            showToast("Active carts exported");
          }}>⬇ Export CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={refreshCarts} disabled={refreshing}>
            {refreshing?"⟳ Refreshing…":"⟳ Refresh"}
          </button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:selected?"1fr 380px":"1fr",gap:16}}>
        {/* Cart list */}
        <div className="card">
          <div className="tbl-wrap">
            <table>
              <thead><tr>
                <th>Customer</th>
                <th>Type</th>
                <th style={{textAlign:"center"}}>Items</th>
                <th style={{textAlign:"right"}}>Cart Value</th>
                <th>Last Activity</th>
                <th>Status</th>
                <th></th>
              </tr></thead>
              <tbody>
                {filtered.length===0&&(
                  <tr><td colSpan={7} style={{textAlign:"center",color:"var(--text3)",padding:32}}>
                    No {filter==="active"?"active":filter==="abandoned"?"abandoned":filter} carts found.
                  </td></tr>
                )}
                {filtered.map((c,i)=>(
                  <tr key={i} style={{cursor:"pointer",background:selected?.customer_id===c.customer_id?"var(--bg3)":""}}
                    onClick={()=>setSelected(selected?.customer_id===c.customer_id?null:c)}>
                    <td>
                      <div style={{fontWeight:600,fontSize:13}}>{c.customer_name||c.customer_email||"Unknown"}</div>
                      <div style={{fontSize:11,color:"var(--text3)"}}>{c.customer_email}</div>
                    </td>
                    <td>
                      <span className={`badge ${c.customer_type==="consignment"?"bo":"bb"}`} style={{fontSize:10}}>
                        {c.customer_type||"standard"}
                      </span>
                    </td>
                    <td style={{textAlign:"center",fontWeight:700}}>{c.items.length}</td>
                    <td style={{textAlign:"right",fontWeight:700,color:"var(--accent)"}}>
                      {c.customer_type==="consignment"?"—":fmt(c.subtotal||0)}
                    </td>
                    <td style={{fontSize:12,color:c.isAbandoned?"var(--warn)":"var(--text2)"}}>
                      {c.isAbandoned?"⚠️ ":""}{timeAgo(c)}
                    </td>
                    <td>
                      {c.status==="converted"
                        ? <span className="badge bg" style={{fontSize:10}}>✓ Ordered</span>
                        : c.isAbandoned
                          ? <span className="badge" style={{background:"rgba(255,170,0,.15)",color:"var(--warn)",fontSize:10}}>Abandoned</span>
                          : <span className="badge" style={{background:"rgba(34,197,94,.15)",color:"var(--success)",fontSize:10}}>● Active</span>
                      }
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-xs" onClick={e=>{e.stopPropagation();setSelected(selected?.customer_id===c.customer_id?null:c);}}>
                        {selected?.customer_id===c.customer_id?"Hide":"View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 16px",fontSize:12,color:"var(--text3)",borderTop:"1px solid var(--border)"}}>
            {filtered.length} cart{filtered.length!==1?"s":""}
          </div>
        </div>

        {/* Cart detail panel */}
        {selected&&(
          <div className="card" style={{alignSelf:"start",position:"sticky",top:16}}>
            <div className="card-header">
              <div>
                <h3 style={{margin:0}}>{selected.customer_name}</h3>
                <div style={{fontSize:11,color:"var(--text3)"}}>{selected.customer_email}</div>
              </div>
              <button className="xbtn" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="card-body" style={{padding:0}}>
              {/* Customer info */}
              <div style={{padding:"12px 16px",background:"var(--bg3)",borderBottom:"1px solid var(--border)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                <div><span style={{color:"var(--text3)"}}>Type: </span><strong>{selected.customer_type||"standard"}</strong></div>
                <div><span style={{color:"var(--text3)"}}>Last order: </span><strong>{selected.lastOrder?.date||"Never"}</strong></div>
                <div><span style={{color:"var(--text3)"}}>Updated: </span><strong>{timeAgo(selected)}</strong></div>
                <div><span style={{color:"var(--text3)"}}>Status: </span>
                  <strong style={{color:selected.isAbandoned?"var(--warn)":selected.status==="converted"?"var(--success)":"var(--accent)"}}>
                    {selected.status==="converted"?"Converted":selected.isAbandoned?"Abandoned":"Active"}
                  </strong>
                </div>
              </div>

              {/* Cart items */}
              {selected.items.length===0
                ? <div style={{padding:24,textAlign:"center",color:"var(--text3)"}}>Cart is empty</div>
                : <>
                  {selected.items.map((item,i)=>(
                    <div key={i} style={{padding:"10px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                        <div style={{fontSize:11,color:"var(--text3)"}}>Barcode: {item.barcode||"—"} · Min: {item.min}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:13,fontWeight:700}}>×{item.qty}</div>
                        {selected.customer_type!=="consignment"&&<div style={{fontSize:11,color:"var(--accent)"}}>{fmt(item.price*item.qty)}</div>}
                      </div>
                    </div>
                  ))}
                  {selected.customer_type!=="consignment"&&(
                    <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,borderTop:"2px solid var(--border)"}}>
                      <span>Subtotal</span>
                      <span style={{color:"var(--accent)"}}>{fmt(selected.subtotal||0)}</span>
                    </div>
                  )}
                </>
              }

              {/* Abandoned alert */}
              {selected.isAbandoned&&(
                <div style={{margin:12,padding:10,background:"rgba(255,170,0,.12)",borderRadius:8,fontSize:12,color:"var(--warn)",border:"1px solid rgba(255,170,0,.3)"}}>
                  ⚠️ This cart has been inactive for {selected.hoursAgo} hour{selected.hoursAgo!==1?"s":""}. Consider reaching out to {selected.customer_name}.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DATE RANGE PICKER ───────────────────────────────────────────────────────
function DateRangePicker({ dateFrom, dateTo, onChange }) {
  const [open, setOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [selecting, setSelecting] = useState(null); // null | "from"
  // Two calendar months shown
  const today = new Date(); today.setHours(0,0,0,0);
  const todayStr = today.toISOString().slice(0,10);
  const [leftYear,  setLeftYear]  = useState(dateFrom ? parseInt(dateFrom.slice(0,4)) : today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(dateFrom ? parseInt(dateFrom.slice(5,7))-1 : today.getMonth());

  // Right calendar = left + 1 month
  const rightDate = new Date(leftYear, leftMonth+1, 1);
  const rightYear  = rightDate.getFullYear();
  const rightMonth = rightDate.getMonth();

  const fmt = (s) => {
    if(!s) return "";
    const [y,m,d] = s.split("-");
    return `${d}-${m}-${y}`;
  };

  const displayLabel = () => {
    if(!dateFrom && !dateTo) return "All dates";
    if(dateFrom && dateTo) return `${fmt(dateFrom)} – ${fmt(dateTo)}`;
    if(dateFrom) return `From ${fmt(dateFrom)}`;
    return `To ${fmt(dateTo)}`;
  };

  const applyPreset = (preset) => {
    const now = new Date(); now.setHours(0,0,0,0);
    const iso = (d) => d.toISOString().slice(0,10);
    const offset = (n) => { const d=new Date(now); d.setDate(d.getDate()+n); return iso(d); };
    let f="", t="";
    if(preset==="today")     { f=todayStr; t=todayStr; }
    else if(preset==="yesterday") { f=offset(-1); t=offset(-1); }
    else if(preset==="7days")  { f=offset(-6); t=todayStr; }
    else if(preset==="30days") { f=offset(-29); t=todayStr; }
    else if(preset==="month")  { const d=new Date(now.getFullYear(),now.getMonth(),1); f=iso(d); t=todayStr; }
    else if(preset==="lastmonth") {
      const s=new Date(now.getFullYear(),now.getMonth()-1,1);
      const e=new Date(now.getFullYear(),now.getMonth(),0);
      f=iso(s); t=iso(e);
    }
    onChange(f,t);
    if(f){ setLeftYear(parseInt(f.slice(0,4))); setLeftMonth(parseInt(f.slice(5,7))-1); }
    setOpen(false);
    setSelecting(null);
  };

  const handleDayClick = (ds) => {
    if(!selecting || selecting==="from") {
      // start new selection
      onChange(ds,"");
      setSelecting("to");
    } else {
      // second click = end
      if(ds < dateFrom) { onChange(ds, dateFrom); }
      else              { onChange(dateFrom, ds); }
      setSelecting(null);
      setOpen(false);
    }
  };

  const isInRange = (ds) => {
    const anchor = dateFrom;
    const end = selecting==="to" ? (hoverDate||dateTo) : dateTo;
    if(!anchor || !end) return false;
    const [lo,hi] = anchor<=end ? [anchor,end] : [end,anchor];
    return ds>lo && ds<hi;
  };

  const isStart = (ds) => ds===dateFrom;
  const isEnd   = (ds) => ds===(selecting==="to"&&hoverDate ? hoverDate : dateTo);

  const renderCalendar = (year, month, onPrev, onNext, showPrev, showNext) => {
    const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const cells = [];
    for(let i=0;i<firstDay;i++) cells.push(null);
    for(let d=1;d<=daysInMonth;d++) cells.push(d);
    while(cells.length%7!==0) cells.push(null);

    return (
      <div style={{flex:1,minWidth:220}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,padding:"0 4px"}}>
          {showPrev
            ? <button onClick={onPrev} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,padding:"2px 6px",color:"var(--text2)"}}>‹</button>
            : <span style={{width:28}}/>}
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <select value={month} onChange={e=>{ const nm=parseInt(e.target.value); if(showPrev){setLeftMonth(nm);} }} style={{fontSize:12,border:"1px solid var(--border)",borderRadius:4,padding:"2px 4px",background:"var(--bg3)"}}>
              {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </select>
            <select value={year} onChange={e=>{ if(showPrev) setLeftYear(parseInt(e.target.value)); }} style={{fontSize:12,border:"1px solid var(--border)",borderRadius:4,padding:"2px 4px",background:"var(--bg3)"}}>
              {Array.from({length:6},(_,i)=>today.getFullYear()-2+i).map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {showNext
            ? <button onClick={onNext} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,padding:"2px 6px",color:"var(--text2)"}}>›</button>
            : <span style={{width:28}}/>}
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
          <thead><tr>{DAYS.map(d=><th key={d} style={{fontSize:11,color:"var(--text3)",padding:"2px 0",textAlign:"center",fontWeight:600}}>{d}</th>)}</tr></thead>
          <tbody>
            {Array.from({length:cells.length/7},(_,ri)=>(
              <tr key={ri}>
                {cells.slice(ri*7,ri*7+7).map((d,ci)=>{
                  if(!d) return <td key={ci}/>;
                  const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                  const start=isStart(ds), end=isEnd(ds), inRange=isInRange(ds), isToday=ds===todayStr;
                  const bg = start||end ? "var(--accent)" : inRange ? "var(--accent)22" : "transparent";
                  const color = start||end ? "#000" : inRange ? "var(--accent)" : isToday ? "var(--accent)" : "var(--text)";
                  const fontWeight = start||end||isToday ? 700 : 400;
                  return (
                    <td key={ci} style={{padding:"1px 0",textAlign:"center"}}>
                      <div
                        onClick={()=>handleDayClick(ds)}
                        onMouseEnter={()=>selecting==="to"&&setHoverDate(ds)}
                        onMouseLeave={()=>setHoverDate(null)}
                        style={{width:28,height:28,lineHeight:"28px",margin:"0 auto",borderRadius:"50%",cursor:"pointer",fontSize:12,background:bg,color,fontWeight,userSelect:"none"}}
                      >{d}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const prevMonth = () => { if(leftMonth===0){setLeftMonth(11);setLeftYear(y=>y-1);}else setLeftMonth(m=>m-1); };
  const nextMonth = () => { if(leftMonth===11){setLeftMonth(0);setLeftYear(y=>y+1);}else setLeftMonth(m=>m+1); };

  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <div
        onClick={()=>{setOpen(o=>!o); setSelecting("from");}}
        style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",border:"1px solid var(--border)",borderRadius:8,cursor:"pointer",background:"var(--bg2)",fontSize:13,minWidth:220,userSelect:"none"}}
      >
        <span style={{fontSize:14}}>📅</span>
        <span style={{flex:1,color:dateFrom||dateTo?"var(--text)":"var(--text3)"}}>{displayLabel()}</span>
        {(dateFrom||dateTo)&&<span onClick={e=>{e.stopPropagation();onChange("","");setSelecting(null);}} style={{fontSize:12,color:"var(--text3)",cursor:"pointer",padding:"0 2px"}}>✕</span>}
        <span style={{fontSize:10,color:"var(--text3)"}}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:999,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,boxShadow:"0 8px 32px rgba(0,0,0,.18)",padding:0,minWidth:560,display:"flex"}}>
          {/* Presets sidebar */}
          <div style={{borderRight:"1px solid var(--border)",padding:"12px 0",minWidth:120}}>
            {[
              ["today","Today"],["yesterday","Yesterday"],["7days","Last 7 Days"],
              ["30days","Last 30 Days"],["month","This Month"],["lastmonth","Last Month"]
            ].map(([k,label])=>(
              <div key={k} onClick={()=>applyPreset(k)}
                style={{padding:"8px 16px",fontSize:13,cursor:"pointer",color:"var(--text2)",whiteSpace:"nowrap"}}
                onMouseEnter={e=>e.target.style.color="var(--accent)"}
                onMouseLeave={e=>e.target.style.color="var(--text2)"}
              >{label}</div>
            ))}
            <div style={{margin:"8px 12px 4px",borderTop:"1px solid var(--border)"}}/>
            <div style={{padding:"6px 16px 4px",fontSize:11,color:"var(--text3)"}}>Custom</div>
            <div style={{display:"flex",gap:6,padding:"4px 12px 8px"}}>
              <button onClick={()=>{onChange(dateFrom,dateTo);setOpen(false);setSelecting(null);}}
                style={{padding:"5px 10px",background:"var(--accent)",color:"#000",border:"none",borderRadius:5,fontSize:12,cursor:"pointer",fontWeight:700}}>Submit</button>
              <button onClick={()=>{onChange("","");setSelecting("from");}}
                style={{padding:"5px 10px",background:"var(--bg3)",color:"var(--text2)",border:"1px solid var(--border)",borderRadius:5,fontSize:12,cursor:"pointer"}}>Clear</button>
            </div>
          </div>
          {/* Calendars */}
          <div style={{padding:16,display:"flex",gap:16}}>
            {renderCalendar(leftYear, leftMonth, prevMonth, nextMonth, true, false)}
            <div style={{width:1,background:"var(--border)"}}/>
            {renderCalendar(rightYear, rightMonth, prevMonth, nextMonth, false, true)}
          </div>
        </div>
      )}
      {open&&<div style={{position:"fixed",inset:0,zIndex:998}} onClick={()=>{setOpen(false);setSelecting(null);setHoverDate(null);}}/>}
    </div>
  );
}

function ActivityLogPage({ activityLog, setActivityLog, products }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [rlsBlocked, setRlsBlocked] = useState(false);

  useEffect(()=>{
    supabase.from("activity_log").select("*").order("timestamp",{ascending:false}).limit(500)
      .then(({data, error})=>{
        if(error){
          console.error("activity_log error:", error.code, error.hint);
          setRlsBlocked(true);
        } else {
          setLogs(data||[]);
        }
        setLoading(false);
      })
      .catch(()=>{ setRlsBlocked(true); setLoading(false); });
  },[]);

  const actionColors = {
    "product_added":"var(--success)","product_updated":"var(--accent)","product_archived":"var(--warn)",
    "product_deleted":"var(--danger)","customer_approved":"var(--success)","customer_created":"var(--accent2)",
    "customer_deleted":"var(--danger)","customer_revoked":"var(--warn)","order_placed":"var(--accent)",
    "order_status":"var(--accent2)","stock_take":"var(--accent4)","transfer":"var(--accent3)","po_opened":"var(--accent2)","po_completed":"var(--success)","po_reopened":"var(--warn)","user_login":"var(--success)","user_logout":"var(--text3)",
    "settings_updated":"var(--text3)"
  };

  const filtered = logs.filter(l=>{
    if(filter!=="all"&&l.entity_type!==filter)return false;
    if(dateFrom){const d=l.timestamp?.slice(0,10);if(!d||d<dateFrom)return false;}
    if(dateTo){const d=l.timestamp?.slice(0,10);if(!d||d>dateTo)return false;}
    return true;
  });

  return (
    <div>
      <div className="alert alert-info" style={{marginBottom:16}}>📋 Read-only activity log — all actions are recorded and cannot be edited.</div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
        <div className="filter-bar" style={{margin:0,flexWrap:"wrap",gap:6}}>
          {["all","product","customer","order","transfer","stock_take"].map(f=>(
            <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-secondary"}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1).replace("_"," ")}
            </button>
          ))}
        </div>
        <DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChange={(f,t)=>{setDateFrom(f);setDateTo(t);}}/>
        {(dateFrom||dateTo)&&<span style={{fontSize:12,color:"var(--text3)"}}>{filtered.length} results</span>}
        <button className="btn btn-secondary btn-sm" style={{marginLeft:"auto"}} onClick={()=>{
          const rows = [
            ["Time","Action","Details","User","Entity Type","Entity"],
            ...filtered.map(l => {
              let entityLabel = l.entity_id||"";
              if (l.entity_type==="product") {
                const prod = (products||[]).find(p=>String(p.id)===String(l.entity_id));
                entityLabel = prod ? `${prod.name}${prod.barcode?" · "+prod.barcode:""}` : (l.entity_id||"");
              }
              return [
                new Date(l.timestamp).toLocaleString(),
                l.action?.replace(/_/g," ")||"",
                l.details||"",
                l.user_name||"System",
                l.entity_type||"",
                entityLabel
              ];
            })
          ];
          downloadCSV(rows, `activity-log-${new Date().toISOString().slice(0,10)}.csv`);
        }}>⬇ Export CSV</button>
      </div>
      <div className="card">
        <div className="card-header"><h3>🕐 Activity Log ({filtered.length} entries)</h3></div>
        {loading?<div style={{padding:32,textAlign:"center",color:"var(--text3)"}}>Loading…</div>:(
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Time</th><th>Action</th><th>Details</th><th>User</th><th>Entity</th></tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text3)",padding:32}}>{rlsBlocked?"⚠️ Access blocked — run the fix-activity-log-rls.sql in Supabase to enable the activity log.":"No activity recorded yet."}</td></tr>}
              {filtered.map(l=>(
                <tr key={l.id}>
                  <td style={{fontSize:11,color:"var(--text3)",whiteSpace:"nowrap"}}>{new Date(l.timestamp).toLocaleString()}</td>
                  <td><span className="badge" style={{background:`${actionColors[l.action]||"var(--accent)"}22`,color:actionColors[l.action]||"var(--accent)",fontSize:10}}>{l.action?.replace(/_/g," ")}</span></td>
                  <td style={{fontSize:12,maxWidth:400}}>{l.details}</td>
                  <td style={{fontSize:12,fontWeight:500}}>{l.user_name||"System"}</td>
                  <td style={{fontSize:11,color:"var(--text3)"}}>
                    {l.entity_type==="product" ? (() => {
                      const prod = (products||[]).find(p=>String(p.id)===String(l.entity_id));
                      return prod
                        ? <span>{prod.name}{prod.barcode&&<span style={{color:"var(--text3)",marginLeft:4,fontSize:10}}>{prod.barcode}</span>}</span>
                        : <span>{l.entity_type}{l.entity_id?` · ${l.entity_id.slice(0,8)}…`:""}</span>;
                    })()
                    : <span>{l.entity_type}{l.entity_id?` · ${l.entity_id}`:""}</span>}
                  </td>
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
    if(o.type==="consignment") return false;
    // Only count revenue once payment is applied
    if(!["paid","delivered","refunded","partial_refund"].includes(o.status)) return false;
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

  // Awaiting payment — upfront invoiced but not yet paid (all time + in range)
  const awaitingOrders = useMemo(()=>orders.filter(o=>o.status==="invoiced"&&o.type!=="consignment"),[orders]);
  const awaitingTotal  = awaitingOrders.reduce((s,o)=>s+(o.total||0),0);
  const awaitingInRange = awaitingOrders.filter(o=>o.date>=fromDate&&o.date<=toDate);
  const awaitingInRangeTotal = awaitingInRange.reduce((s,o)=>s+(o.total||0),0);

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
      const unpaid=orders.filter(o=>(o.status==="invoiced"||o.status==="delivery_note")&&o.date>=fromDate&&o.date<=toDate);
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
        <div className="stat c1"><div className="stat-label">Revenue Collected</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalRevenue)}</div><div className="stat-sub">{filteredOrders.length} paid orders</div></div>
        <div className="stat c2"><div className="stat-label">Avg Order Value</div><div className="stat-val" style={{fontSize:18}}>{fmt(avgOrderVal)}</div><div className="stat-sub">paid orders in range</div></div>
        <div className="stat c3"><div className="stat-label">GCT Collected</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalTax)}</div><div className="stat-sub">on paid orders</div></div>
        <div className="stat c5" style={{cursor:"pointer"}} onClick={()=>{}}><div className="stat-label">⏳ Awaiting Payment</div><div className="stat-val" style={{fontSize:18,color:"var(--warn)"}}>{fmt(awaitingInRangeTotal)}</div><div className="stat-sub">{awaitingInRange.length} invoices in range · {fmt(awaitingTotal)} total outstanding</div></div>
        <div className="stat c4"><div className="stat-label">Inventory Cost</div><div className="stat-val" style={{fontSize:18}}>{fmt(totalInventoryCost)}</div></div>
        <div className="stat c6"><div className="stat-label">Potential Margin</div><div className="stat-val" style={{fontSize:18}}>{fmt(potentialMargin)}</div><div className="stat-sub">retail vs cost</div></div>
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

// ─────────────────────────────────────────────────────────────────────────────
// ─── STAFF ACCOUNTS PAGE ──────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const ALL_MODULES = [
  {id:"dashboard",label:"Dashboard"},{id:"products",label:"Products"},{id:"purchaseorders",label:"Purchase Orders"},
  {id:"categories",label:"Categories"},{id:"suppliers",label:"Suppliers"},{id:"stocktake",label:"Stock Take"},
  {id:"transfers",label:"Store Transfers"},{id:"orders",label:"Orders"},{id:"backorders",label:"Back Orders"},
  {id:"invoices",label:"Invoices"},{id:"carts",label:"Customer Carts"},{id:"clearance",label:"Clearance"},
  {id:"customers",label:"Customers"},{id:"salesreps",label:"Sales Reps"},{id:"analytics",label:"Analytics"},
  {id:"activitylog",label:"Activity Log"},
];
const PERM_PRESETS = {
  "Sales":["dashboard","orders","backorders","invoices","customers","carts"],
  "Inventory":["dashboard","products","purchaseorders","categories","suppliers","stocktake","transfers"],
  "Manager":["dashboard","products","purchaseorders","orders","backorders","invoices","customers","analytics"],
  "Full Access":ALL_MODULES.map(m=>m.id),
};
function StaffPage({ showToast }) {
  const [staffList,setStaffList]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showCreate,setShowCreate]=useState(false);
  const [form,setForm]=useState({name:"",email:"",password:"",permissions:["dashboard"]});
  const [editingId,setEditingId]=useState(null);
  const [editPerms,setEditPerms]=useState([]);
  const [busy,setBusy]=useState(false);
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const getPerms=s=>{ try{return JSON.parse(s.permissions||"[]");}catch{return[];} };

  useEffect(()=>{
    supabase.from("profiles").select("*").eq("role","staff").order("created_at",{ascending:false})
      .then(({data})=>{ setStaffList(data||[]); setLoading(false); });
  },[]);

  const createStaff=async()=>{
    if(!form.name||!form.email||!form.password){showToast("All fields required","err");return;}
    if(form.password.length<6){showToast("Password must be 6+ chars","err");return;}
    setBusy(true);
    const {data,error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{name:form.name,role:"staff"}}});
    if(error){showToast(error.message,"err");setBusy(false);return;}
    if(data?.user){
      const permsJson=JSON.stringify(form.permissions);
      await supabase.from("profiles").upsert({id:data.user.id,email:form.email,name:form.name,role:"staff",permissions:permsJson,approved:true,created_at:new Date().toISOString()});
      setStaffList(prev=>[{id:data.user.id,email:form.email,name:form.name,role:"staff",permissions:permsJson,approved:true},...prev]);
      showToast("Staff account created for "+form.name);
      setForm({name:"",email:"",password:"",permissions:["dashboard"]});
      setShowCreate(false);
    }
    setBusy(false);
  };

  const savePerms=async(id)=>{
    const permsJson=JSON.stringify(editPerms);
    await supabase.from("profiles").update({permissions:permsJson}).eq("id",id);
    setStaffList(prev=>prev.map(s=>s.id===id?{...s,permissions:permsJson}:s));
    setEditingId(null);
    showToast("Permissions updated");
  };

  return (
    <div style={{maxWidth:900}}>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header" style={{justifyContent:"space-between"}}>
          <h3>🔑 Staff Accounts</h3>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowCreate(v=>!v)}>{showCreate?"✕ Cancel":"+ New Staff Account"}</button>
        </div>
        {showCreate&&(
          <div style={{padding:20,borderBottom:"1px solid var(--border)",background:"var(--bg3)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              <div className="form-group" style={{margin:0}}><label>Name *</label><input value={form.name} onChange={e=>sf("name",e.target.value)}/></div>
              <div className="form-group" style={{margin:0}}><label>Email *</label><input type="email" value={form.email} onChange={e=>sf("email",e.target.value)}/></div>
              <div className="form-group" style={{margin:0}}><label>Password *</label><input type="password" value={form.password} onChange={e=>sf("password",e.target.value)}/></div>
            </div>
            <div style={{fontWeight:600,fontSize:13,marginBottom:6}}>Permissions</div>
            <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
              {Object.keys(PERM_PRESETS).map(p=><button key={p} className="btn btn-ghost btn-xs" onClick={()=>setForm(f=>({...f,permissions:PERM_PRESETS[p]}))}>{p}</button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginBottom:12}}>
              {ALL_MODULES.map(m=>(
                <label key={m.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,cursor:"pointer",padding:"3px 6px",borderRadius:5,border:"1px solid var(--border)",background:form.permissions.includes(m.id)?"var(--accent)22":"transparent"}}>
                  <input type="checkbox" checked={form.permissions.includes(m.id)} onChange={()=>setForm(f=>({...f,permissions:f.permissions.includes(m.id)?f.permissions.filter(x=>x!==m.id):[...f.permissions,m.id]}))} style={{width:13,height:13}}/>
                  {m.label}
                </label>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <button className="btn btn-secondary" onClick={()=>setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createStaff} disabled={busy}>{busy?"Creating…":"Create Account"}</button>
            </div>
          </div>
        )}
        {loading?<div style={{padding:32,textAlign:"center",color:"var(--text3)"}}>Loading…</div>:(
          <div className="tbl-wrap"><table>
            <thead><tr><th>Name</th><th>Email</th><th>Permissions</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {staffList.length===0&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--text3)",padding:32}}>No staff accounts yet.</td></tr>}
              {staffList.map(s=>{
                const perms=getPerms(s);
                const isEd=editingId===s.id;
                return (
                  <tr key={s.id}>
                    <td style={{fontWeight:600}}>{s.name}</td>
                    <td style={{fontSize:12}}>{s.email}</td>
                    <td>
                      {isEd?(
                        <div>
                          <div style={{display:"flex",gap:4,marginBottom:6,flexWrap:"wrap"}}>
                            {Object.keys(PERM_PRESETS).map(p=><button key={p} className="btn btn-ghost btn-xs" onClick={()=>setEditPerms(PERM_PRESETS[p])}>{p}</button>)}
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3,marginBottom:6}}>
                            {ALL_MODULES.map(m=>(
                              <label key={m.id} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,cursor:"pointer",padding:"2px 4px",borderRadius:4,border:"1px solid var(--border)",background:editPerms.includes(m.id)?"var(--accent)22":"transparent"}}>
                                <input type="checkbox" checked={editPerms.includes(m.id)} onChange={()=>setEditPerms(p=>p.includes(m.id)?p.filter(x=>x!==m.id):[...p,m.id])} style={{width:11,height:11}}/>
                                {m.label}
                              </label>
                            ))}
                          </div>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-primary btn-xs" onClick={()=>savePerms(s.id)}>Save</button>
                            <button className="btn btn-ghost btn-xs" onClick={()=>setEditingId(null)}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                          {perms.slice(0,4).map(p=>{const m=ALL_MODULES.find(x=>x.id===p);return m?<span key={p} className="badge bb" style={{fontSize:9}}>{m.label}</span>:null;})}
                          {perms.length>4&&<span className="badge bw" style={{fontSize:9}}>+{perms.length-4} more</span>}
                          {perms.length===0&&<span style={{fontSize:11,color:"var(--text3)"}}>None</span>}
                        </div>
                      )}
                    </td>
                    <td><span className={"badge "+(s.approved!==false?"bg":"br")} style={{fontSize:10}}>{s.approved!==false?"Active":"Disabled"}</span></td>
                    <td><div className="tbl-actions">
                      {!isEd&&<button className="btn btn-secondary btn-xs" onClick={()=>{setEditingId(s.id);setEditPerms(getPerms(s));}}>Edit</button>}
                      <button className={"btn btn-xs "+(s.approved!==false?"btn-warn":"btn-ghost")} onClick={async()=>{
                        const newVal=!(s.approved!==false);
                        await supabase.from("profiles").update({approved:newVal}).eq("id",s.id);
                        setStaffList(prev=>prev.map(x=>x.id===s.id?{...x,approved:newVal}:x));
                        showToast(newVal?"Account enabled":"Account disabled");
                      }}>{s.approved!==false?"Disable":"Enable"}</button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        )}
      </div>

    </div>
  );
}

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

// ─────────────────────────────────────────────────────────────────────────────
// ─── SALES REPS PAGE ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function SalesRepsPage({ salesReps, setSalesReps, showToast }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState(null);

  const startEdit = (r) => { setEditId(r.id); setName(r.name); setPhone(r.phone||""); setEmail(r.email||""); };
  const cancelEdit = () => { setEditId(null); setName(""); setPhone(""); setEmail(""); };

  const save = async () => {
    if (!name.trim()) { showToast("Name is required","err"); return; }
    setBusy(true);
    if (editId) {
      const { error } = await supabase.from("sales_reps").update({ name:name.trim(), phone:phone.trim(), email:email.trim() }).eq("id", editId);
      if (error) { showToast("Failed to update","err"); setBusy(false); return; }
      setSalesReps(prev => prev.map(r => r.id===editId ? {...r,name:name.trim(),phone:phone.trim(),email:email.trim()} : r));
      showToast("Sales rep updated");
      cancelEdit();
    } else {
      const { data, error } = await supabase.from("sales_reps").insert({ name:name.trim(), phone:phone.trim(), email:email.trim() }).select().single();
      if (error || !data) { showToast("Failed to add","err"); setBusy(false); return; }
      setSalesReps(prev => [...prev, data]);
      showToast("Sales rep added");
      setName(""); setPhone(""); setEmail("");
    }
    setBusy(false);
  };

  const remove = async (id, repName) => {
    if (!confirm(`Remove ${repName} from the sales reps list?`)) return;
    await supabase.from("sales_reps").delete().eq("id", id);
    setSalesReps(prev => prev.filter(r => r.id !== id));
    showToast("Removed");
  };

  return (
    <div style={{maxWidth:680}}>
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header"><h3>🤝 {editId ? "Edit Sales Rep" : "Add Sales Rep"}</h3></div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group"><label>Full Name *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Marcus Brown"/></div>
            <div className="form-group"><label>Phone</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Optional"/></div>
          </div>
          <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Optional"/></div>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="btn btn-primary" onClick={save} disabled={busy||!name.trim()}>{busy?"Saving…":editId?"Save Changes":"Add Sales Rep"}</button>
            {editId && <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Team ({salesReps.length})</h3></div>
        {salesReps.length===0
          ? <div className="empty"><div className="ei">🤝</div><h3>No sales reps yet</h3><p>Add your first team member above.</p></div>
          : <div className="tbl-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>{salesReps.map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:600}}>{r.name}</td>
                  <td style={{color:"var(--text2)"}}>{r.phone||"—"}</td>
                  <td style={{color:"var(--text2)"}}>{r.email||"—"}</td>
                  <td><div className="tbl-actions">
                    <button className="btn btn-secondary btn-xs" onClick={()=>startEdit(r)}>Edit</button>
                    <button className="btn btn-danger btn-xs" onClick={()=>remove(r.id,r.name)}>Remove</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>}
      </div>
    </div>
  );
}

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

  const visible=products.filter(p=>p.active&&p.stock>0&&!p.is_clearance&&p.wholesale_visible!==false);
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
                <div className="prod-stock">{p.stock} in stock · MOQ: {p.min_order}{qty>0?` · ${qty} in cart`:""}</div>
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
                  <div style={{fontSize:10,color:"var(--text3)"}}>MOQ: {p.min_order||1}</div>
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
function MyOrdersPage({ orders, settings, customers, setModal, user }) {
  const isConsignment = user?.customer_type === 'consignment';
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
              {!isConsignment&&<div style={{fontFamily:"Syne",fontWeight:700,fontSize:17,color:"var(--accent)"}}>{fmt(o.total)}</div>}
              <button className="btn btn-secondary btn-xs" onClick={()=>setModal({type:"viewInvoice",data:o})}>{o.status==="invoiced"||o.status==="delivery_note"||o.status==="paid"||o.status==="delivered" ? (o.status==="delivery_note" ? "View Delivery Note" : "View Invoice") : "View Order"}</button>
            </div>
          </div>
          <div className="card-body">
            {(o.items||[]).map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
                <span>{item.name}</span>
                {!isConsignment&&<span style={{color:"var(--text2)"}}>× {item.qty} = {fmt(item.qty*item.unit_price)}</span>}
                {isConsignment&&<span style={{color:"var(--text2)"}}>× {item.qty}</span>}
              </div>
            ))}
            {!isConsignment&&<div style={{marginTop:10,paddingTop:8,borderTop:"1px solid var(--border)",display:"flex",justifyContent:"flex-end",gap:16}}>
              <span style={{fontSize:12,color:"var(--text2)"}}>Subtotal: {fmt(o.subtotal)} · GCT ({o.tax_rate}%): {fmt(o.tax_amount)}</span>
            </div>}
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
function AccountPage({ user, customers, salesReps, showToast, isAdmin }) {
  const c=customers.find(x=>x.id===user.id)||user;
  const salesRep = (salesReps||[]).find(r=>r.id===c.sales_rep_id);
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
            <div className="form-group"><label>Your Sales Rep</label>
              {salesRep
                ? <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--bg3)",borderRadius:8}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:"var(--accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{salesRep.name[0]}</div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13}}>{salesRep.name}</div>
                      {salesRep.phone&&<div style={{fontSize:11,color:"var(--text2)"}}>{salesRep.phone}</div>}
                      {salesRep.email&&<div style={{fontSize:11,color:"var(--text2)"}}>{salesRep.email}</div>}
                    </div>
                  </div>
                : <div style={{padding:"10px 12px",background:"var(--bg3)",borderRadius:8,fontSize:12,color:"var(--text3)"}}>No sales rep assigned yet — contact us if you were referred by a team member.</div>}
            </div>
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
                {!isConsignment&&<div style={{fontSize:11,color:"var(--text2)"}}>{fmt(item.price)} each</div>}
              </div>
              <div className="qty-ctrl">
                <button className="qbtn" onClick={()=>updateQty(item.pid,item.qty-1)}>−</button>
                <input
                  type="number" min={item.min||1}
                  value={item.qty}
                  onChange={e=>{ const v=parseInt(e.target.value); if(!isNaN(v)&&v>0) updateQty(item.pid,v); }}
                  style={{width:48,textAlign:"center",fontWeight:600,fontSize:13,border:"1px solid var(--border)",borderRadius:6,padding:"2px 4px",background:"var(--bg2)"}}
                />
                <button className="qbtn" onClick={()=>updateQty(item.pid,item.qty+1)}>+</button>
              </div>
              {!isConsignment&&<div style={{minWidth:72,textAlign:"right",fontWeight:600,fontSize:13}}>{fmt(item.price*item.qty)}</div>}
              <button title="Remove item" onClick={()=>updateQty(item.pid,0)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--danger)",padding:"0 4px",lineHeight:1,opacity:0.7}} onMouseOver={e=>e.target.style.opacity=1} onMouseOut={e=>e.target.style.opacity=0.7}>🗑</button>
            </div>
          ))}
          <div className="divider"/>
          {isConsignment
            ? <div className="alert alert-info" style={{marginBottom:8}}>Pricing will be confirmed by our team before your order is processed.</div>
            : <>
                <div className="total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="total-row"><span>GCT ({taxRate}%)</span><span>{fmt(tax)}</span></div>
                <div className="total-row grand"><span>Total</span><span>{fmt(total)}</span></div>
                {!meetsMin&&<div className="alert alert-warn mt-3">Minimum order value is {fmt(minVal)}. Add {fmt(minVal-subtotal)} more to checkout.</div>}
              </>
          }
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
        <p style={{color:"var(--text2)",marginBottom:14,fontSize:13}}>Your order has been received. We'll notify you once it ships.</p>
        <div style={{background:"var(--bg3)",borderRadius:10,padding:"14px 18px",marginBottom:18,textAlign:"left"}}>
          <div style={{fontSize:11,color:"var(--text3)",marginBottom:3}}>ORDER #</div>
          <div style={{fontFamily:"Syne",fontWeight:700,fontSize:18}}>{order.id}</div>
          {order.type!=="consignment"&&<div style={{marginTop:6,fontSize:13,color:"var(--text2)"}}>Total: <strong style={{color:"var(--accent)"}}>{fmt(order.total)}</strong></div>}
          {order.type!=="consignment"&&<div style={{fontSize:12,color:"var(--text2)"}}>GCT ({order.tax_rate}%): {fmt(order.tax_amount)}</div>}
          {order.type==="consignment"&&order.consignment_due&&<div style={{marginTop:4,fontSize:12,color:"var(--warn)"}}>Consignment due: {order.consignment_due}</div>}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div></div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── INVOICE VIEW MODAL ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function InvoiceViewModal({ order, settings, customers, products, onClose }) {
  const customer   = customers.find(c=>c.id===order.customer_id);
  const isConsignment = customer?.customer_type==="consignment" || order.type==="consignment";
  const docLabel   = isConsignment ? "Delivery Note" : "Invoice";
  const [hideCost, setHideCost] = useState(true);

  const exportCSV = () => {
    const rows = [
      [docLabel, order.id],
      ["Customer", order.customer_name],
      ["Date", order.date],
      ["Status", order.status],
      ["Payment", order.payment_method||"—"],
      [],
      ["Product","Brand","Barcode","Qty","Unit Cost","Unit Price","Line Total"],
      ...(order.items||[]).map(i => {
        const prod = (products||[]).find(p=>p.id===i.product_id);
        return [i.name, prod?.brand||"", i.barcode||"—", i.qty,
                Number(prod?.cost||0), Number(i.unit_price||0),
                Number(((i.unit_price||0)*i.qty).toFixed(2))];
      }),
      [],
      ["Subtotal","","","","",order.subtotal||0],
      [`GCT (${order.tax_rate||0}%)`, "","","","", order.tax_amount||0],
      ["Total","","","","",order.total||0],
    ];
    downloadCSV(rows, `${order.id}.csv`);
  };

  return (
    <div className="overlay"><div className="modal modal-lg">
      <div className="modal-head">
        <h2>{isConsignment ? "📦" : "🧾"} {docLabel} {order.id}</h2>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <label style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--text2)",cursor:"pointer"}}>
            <input type="checkbox" checked={hideCost} onChange={e=>setHideCost(e.target.checked)}/>
            Hide cost
          </label>
          <button className="btn btn-secondary btn-sm" onClick={exportCSV}>⬇ CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>printInvoice(order,customer,settings,isConsignment,docLabel)}>🖨 PDF/Print</button>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="modal-body">
        <div className="two-col" style={{marginBottom:20}}>
          <div>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{isConsignment?"Delivered To":"Bill To"}</div>
            <div style={{fontWeight:700,fontSize:15}}>{customer?.company||order.customer_name}</div>
            <div style={{fontSize:12,color:"var(--text2)"}}>{customer?.tax_id?`TRN: ${customer.tax_id}`:""}</div>
            <div style={{fontSize:12,color:"var(--text2)"}}>{customer?.email||""}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>{docLabel} Details</div>
            <div style={{fontSize:12}}>Date: {order.date}</div>
            {order.created_at&&<div style={{fontSize:11,color:"var(--text3)"}}>Generated: {new Date(order.created_at).toLocaleString("en-JM",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>}
            {!isConsignment&&<div style={{fontSize:12}}>Payment: {order.payment_method||"—"}</div>}
            <div style={{fontSize:12,marginTop:4}}><StatusBadge status={order.status}/></div>
          </div>
        </div>

        {/* Consignment notice */}
        {isConsignment && (
          <div style={{marginBottom:16,padding:"10px 14px",background:"var(--accent)11",border:"1px solid var(--accent)44",borderRadius:8,fontSize:13}}>
            📋 <strong>Delivery Note only.</strong> No invoice has been generated. A commercial invoice will be issued once goods are sold and settled off-platform.
          </div>
        )}

        <div className="tbl-wrap" style={{marginBottom:16}}>
          <table>
            <thead><tr>
              <th>Barcode</th><th>Product</th><th>Qty</th>
              {!hideCost&&<th style={{textAlign:"right",color:"var(--text3)"}}>Unit Cost</th>}
              {!isConsignment&&<th style={{textAlign:"right"}}>Unit Price</th>}
              {!isConsignment&&<th style={{textAlign:"right"}}>Total</th>}
            </tr></thead>
            <tbody>{(order.items||[]).map((item,i)=>(
              <tr key={i}>
                <td><code style={{fontSize:10}}>{item.barcode||"—"}</code></td>
                <td style={{fontWeight:500}}>{item.name}</td>
                <td>{item.qty}</td>
                {!hideCost&&<td style={{textAlign:"right",fontSize:12,color:"var(--text3)"}}>{fmt((products||[]).find(p=>p.id===item.product_id)?.cost||0)}</td>}
                {!isConsignment&&<td style={{textAlign:"right"}}>{fmt(item.unit_price)}</td>}
                {!isConsignment&&<td style={{textAlign:"right",fontWeight:600}}>{fmt(item.qty*item.unit_price)}</td>}
              </tr>
            ))}
            {(order.items||[]).length>1&&<tr style={{borderTop:"2px solid var(--border)",background:"var(--bg3)",fontWeight:700}}>
              <td colSpan={2}>TOTALS</td>
              <td style={{color:"var(--accent)"}}>{(order.items||[]).reduce((s,i)=>s+i.qty,0)}</td>
              {!hideCost&&<td></td>}
              {!isConsignment&&<td></td>}
              {!isConsignment&&<td style={{textAlign:"right",color:"var(--accent)"}}>{fmt((order.items||[]).reduce((s,i)=>s+i.qty*(i.unit_price||0),0))}</td>}
            </tr>}
            </tbody>
          </table>
        </div>

        {!isConsignment&&<div style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{minWidth:240}}>
            <div className="total-row"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
            <div className="total-row"><span>GCT ({order.tax_rate}%)</span><span>{fmt(order.tax_amount)}</span></div>
            <div className="total-row grand"><span>Total</span><span>{fmt(order.total)}</span></div>
          </div>
        </div>}

        {order.notes&&<div style={{marginTop:12,padding:12,background:"var(--bg3)",borderRadius:7,fontSize:12,color:"var(--text2)"}}><strong>Notes:</strong> {order.notes}</div>}
        {isConsignment&&order.consignment_due&&<div style={{marginTop:8,fontSize:12,color:"var(--warn)"}}>📋 Consignment settlement due: {order.consignment_due}</div>}

        {/* Bank transfer + payment link — upfront only */}
        {!isConsignment&&(settings.bank_name||settings.payment_link)&&(
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
// ─── CANCEL REASON MODAL ─────────────────────────────────────────────────────
function CancelReasonModal({ title, itemLabel, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="overlay" style={{zIndex:9999}}><div className="modal" style={{maxWidth:420}}>
      <div className="modal-head"><h2>✕ {title}</h2><button className="xbtn" onClick={onClose}>✕</button></div>
      <div className="modal-body">
        <div style={{padding:"10px 14px",background:"var(--danger)11",border:"1px solid var(--danger)44",borderRadius:8,fontSize:13,color:"var(--danger)",marginBottom:14}}>
          You are about to cancel: <strong>{itemLabel}</strong>
        </div>
        <div className="form-group">
          <label>Reason for cancellation <span style={{color:"var(--text3)",fontWeight:400}}>(optional)</span></label>
          <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="e.g. Customer requested cancellation, stock issue, duplicate order…"/>
        </div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Keep</button>
        <button className="btn btn-danger" disabled={busy} onClick={async()=>{ setBusy(true); await onConfirm(reason); setBusy(false); }}>
          {busy?"Cancelling…":"✕ Confirm Cancellation"}
        </button>
      </div>
    </div></div>
  );
}

function OrderEmailModal({ order, customers, settings, onClose, showToast }) {
  const customer = customers.find(c=>c.id===order?.customer_id);
  const isConsignment = order?.type==="consignment" || customer?.customer_type==="consignment";
  const [to, setTo] = useState(customer?.email||"");
  const [subject, setSubject] = useState(`Order ${order?.id} — ${settings.company_name||"Pinglinks Cellular"}`);
  const [body, setBody] = useState(
    `Dear ${customer?.company||order?.customer_name||"Customer"},\n\nThis is regarding your order ${order?.id} placed on ${order?.date}.\n\n${!isConsignment&&order?.total?`Order Total: J$${(order.total||0).toLocaleString()}\n\n`:""
}Please contact us if you have any questions.\n\n${settings.company_name||"Pinglinks Cellular"}\n${settings.company_phone||""}`
  );
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!to) { showToast("Please enter a recipient email", "err"); return; }
    setSending(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-invoice-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          to, subject, bodyText: body,
          orderId: order.id,
          customerName: customer?.company||order.customer_name,
          customerTRN: customer?.tax_id||"",
          orderDate: order.date,
          paymentMethod: order.payment_method||"",
          orderStatus: order.status,
          orderType: order.type||"standard",
          items: order.items||[],
          subtotal: order.subtotal||0,
          taxRate: order.tax_rate||0,
          taxAmount: order.tax_amount||0,
          total: order.total||0,
          notes: order.notes||"",
          isConsignment,
          bankName: settings.bank_name||"",
          bankAccountName: settings.bank_account_name||"",
          bankAccountNumber: settings.bank_account_number||"",
          bankBranch: settings.bank_routing||"",
          bankNotes: settings.bank_notes||"",
          paymentLink: settings.payment_link||"",
          paymentLinkLabel: settings.payment_link_label||"Pay Now",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast("Failed to send: " + (data.error||"Unknown error"), "err");
      } else {
        showToast(`Email sent to ${to} ✓`);
        onClose();
      }
    } catch(e) {
      showToast("Send failed: " + e.message, "err");
    }
    setSending(false);
  };

  return (
    <div className="overlay"><div className="modal modal-md">
      <div className="modal-head"><h2>📧 Email Customer — {order?.id}</h2><button className="xbtn" onClick={onClose}>✕</button></div>
      <div className="modal-body">
        {!customer?.email&&<div className="alert alert-warn" style={{marginBottom:12}}>⚠️ No email on file for this customer — enter one below.</div>}
        <div className="form-group"><label>To</label><input value={to} onChange={e=>setTo(e.target.value)} placeholder="customer@email.com"/></div>
        <div className="form-group"><label>Subject</label><input value={subject} onChange={e=>setSubject(e.target.value)}/></div>
        <div className="form-group"><label>Message</label><textarea value={body} onChange={e=>setBody(e.target.value)} rows={7}/></div>
        <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>The order summary will be embedded below your message.</div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={send} disabled={sending||!to}>
          {sending?"Sending…":"📧 Send Email"}
        </button>
      </div>
    </div></div>
  );
}

function EmailModal({ order, customers, settings, onClose, showToast }) {
  const customer = customers.find(c=>c.id===order.customer_id);
  const isConsignment = order.type==="consignment" || customer?.customer_type==="consignment";
  const [to, setTo] = useState(customer?.email||"");
  const [subject, setSubject] = useState(`Invoice ${order.id} — ${settings.company_name||"Pinglinks Cellular"}`);
  const [body, setBody] = useState(
    `Dear ${customer?.company||order.customer_name},

Please find your invoice ${order.id} below.${!isConsignment&&order.total?`

Total: J$${order.total.toLocaleString()}`:""}

Thank you for your business.

${settings.company_name||"Pinglinks Cellular"}
${settings.company_phone||""}`
  );
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!to) { showToast("Please enter a recipient email", "err"); return; }
    setSending(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-invoice-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          to, subject, bodyText: body,
          orderId: order.id,
          customerName: customer?.company||order.customer_name,
          customerTRN: customer?.tax_id||"",
          orderDate: order.date,
          paymentMethod: order.payment_method||"",
          orderStatus: order.status,
          orderType: order.type||"standard",
          items: order.items||[],
          subtotal: order.subtotal||0,
          taxRate: order.tax_rate||0,
          taxAmount: order.tax_amount||0,
          total: order.total||0,
          notes: order.notes||"",
          isConsignment,
          bankName: settings.bank_name||"",
          bankAccountName: settings.bank_account_name||"",
          bankAccountNumber: settings.bank_account_number||"",
          bankBranch: settings.bank_routing||"",
          bankNotes: settings.bank_notes||"",
          paymentLink: settings.payment_link||"",
          paymentLinkLabel: settings.payment_link_label||"Pay Now",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        showToast("Failed to send: " + (data.error||"Unknown error"), "err");
      } else {
        showToast(`Invoice emailed to ${to} ✓`);
        onClose();
      }
    } catch(e) {
      showToast("Send failed: " + e.message, "err");
    }
    setSending(false);
  };

  return (
    <div className="overlay"><div className="modal modal-md">
      <div className="modal-head"><h2>📧 Email Invoice</h2><button className="xbtn" onClick={onClose}>✕</button></div>
      <div className="modal-body">
        {!customer?.email&&<div className="alert alert-warn" style={{marginBottom:12}}>⚠️ No email on file for this customer — enter one below.</div>}
        <div className="form-group"><label>To</label><input value={to} onChange={e=>setTo(e.target.value)} placeholder="customer@email.com"/></div>
        <div className="form-group"><label>Subject</label><input value={subject} onChange={e=>setSubject(e.target.value)}/></div>
        <div className="form-group"><label>Message</label><textarea value={body} onChange={e=>setBody(e.target.value)} rows={7}/></div>
        <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>The full invoice will be embedded below your message.</div>
      </div>
      <div className="modal-foot">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={send} disabled={sending||!to}>
          {sending?"Sending…":"📧 Send Invoice"}
        </button>
      </div>
    </div></div>
  );
}
