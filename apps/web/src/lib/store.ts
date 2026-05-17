'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'customer' | 'seller' | 'driver' | 'admin';
  token?: string;
}

export interface Order {
  id: number;
  status: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  bakery: string;
  time: number;
  driver?: { name: string; phone: string };
  userName?: string;
  userPhone?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  badge: string;
}

const BREAD_IMG = 'https://i.ibb.co/ksDcZym7/file-000000003cfc720aa9e546e0e03b390d.png';

export const products: Product[] = [
  {id:1,name:'Oq non',cat:'tandir',price:5000,desc:'Klassik oq non, har kuni yangi',badge:'💰 Arzon'},
  {id:2,name:'Tandir noni',cat:'tandir',price:8000,desc:'An\'anaviy tandirda pishgan',badge:'🔥 Best'},
  {id:3,name:'Patir non',cat:'tandir',price:10000,desc:'Qatlamli yog\'li patir',badge:''},
  {id:4,name:'Kulcha non',cat:'tandir',price:5000,desc:'Kichik yumaloq kulcha',badge:'💰 Arzon'},
  {id:5,name:'Samarqand noni',cat:'premium',price:20000,desc:'Mashhur Samarqand noni',badge:'⭐ Premium'},
  {id:6,name:'Buxoro noni',cat:'premium',price:18000,desc:'Buxorocha maxsus retsept',badge:'⭐ Premium'},
  {id:7,name:'Farg\'ona noni',cat:'tandir',price:8000,desc:'Farg\'ona usulida pishgan',badge:''},
  {id:8,name:'Qora non',cat:'sog-lom',price:7000,desc:'Kepakli foydali qora non',badge:'🌿 Organik'},
  {id:9,name:'Zog\'ora non',cat:'sog-lom',price:6000,desc:'Makkajo\'xori unidan',badge:'🌿 Organik'},
  {id:10,name:'Yupqa non',cat:'tandir',price:5000,desc:'Yupqa yoyilgan tez non',badge:'💰 Arzon'},
  {id:11,name:'Qalin non',cat:'tandir',price:7000,desc:'Qalin yumshoq non',badge:''},
  {id:12,name:'Suzma non',cat:'tandir',price:7000,desc:'Suzma qo\'shilgan',badge:''},
  {id:13,name:'Qatiqli non',cat:'qandol',price:8000,desc:'Nordonmaza non',badge:''},
  {id:14,name:'Yog\'li non',cat:'qandol',price:10000,desc:'Sariyog\' qo\'shilgan',badge:''},
  {id:15,name:'Pishloqli non',cat:'qandol',price:12000,desc:'Erigan pishloqli',badge:'🆕 Yangi'},
  {id:16,name:'Go\'shtli non',cat:'maxsus',price:25000,desc:'Go\'sht bilan to\'ldirilgan',badge:'🔥 Best'},
  {id:17,name:'Tuxumli non',cat:'qandol',price:10000,desc:'Tuxum qo\'shilgan',badge:''},
  {id:18,name:'Ziravorli non',cat:'maxsus',price:8000,desc:'Ziravorlar bilan',badge:''},
  {id:19,name:'Sedanali non',cat:'tandir',price:8000,desc:'Kunjut urug\'lari bilan',badge:'🆕 Yangi'},
  {id:20,name:'Qovoqli non',cat:'sog-lom',price:9000,desc:'Qovoq pyuresi bilan',badge:'🆕 Yangi'},
  {id:21,name:'Kartoshkali non',cat:'maxsus',price:8000,desc:'Kartoshka qo\'shilgan',badge:''},
  {id:22,name:'Piyozli non',cat:'maxsus',price:7000,desc:'Piyoz bilan xushbo\'y',badge:''},
  {id:23,name:'Ko\'k noni',cat:'sog-lom',price:8000,desc:'Ko\'katlar bilan',badge:'🌿 Organik'},
  {id:24,name:'Asalli non',cat:'qandol',price:15000,desc:'Asal qo\'shilgan shirin',badge:'🆕 Yangi'},
  {id:25,name:'Mayizli non',cat:'qandol',price:12000,desc:'Mayiz bilan shirin',badge:''},
  {id:26,name:'Yong\'oqli non',cat:'premium',price:20000,desc:'Yong\'oq bilan',badge:'⭐ Premium'},
  {id:27,name:'Bodomli non',cat:'premium',price:25000,desc:'Bodom uni bilan',badge:'⭐ Premium'},
  {id:28,name:'Non to\'plami',cat:'maxsus',price:30000,desc:'5 xil non turidan',badge:'🔥 Best'},
  {id:29,name:'Bayram noni',cat:'premium',price:25000,desc:'Bayramlar uchun',badge:'⭐ Premium'},
  {id:30,name:'Maxsus non',cat:'maxsus',price:30000,desc:'Exclusive retsept',badge:'⭐ Premium'},
];

export const bakeries = [
  {id:'b1',name:'Raximjon Nonvoyxonasi',address:'Namangan, Navoiy 45',lat:40.9983,lng:71.6726,status:'open',rating:4.9,orders:1520,phone:'+998993921157'},
  {id:'b2',name:'ZIYOKOR Nonlari',address:'Namangan, Oxunboboyev 12',lat:40.9958,lng:71.6680,status:'open',rating:4.8,orders:890,phone:'+998993921157'},
  {id:'b3',name:'An\'anaviy Tandir',address:'Namangan, Boburshoh 28',lat:40.9920,lng:71.6750,status:'open',rating:4.7,orders:620,phone:'+998993921157'},
  {id:'b4',name:'Shifobaxsh Non',address:'Namangan, Birinchi 7',lat:41.0010,lng:71.6650,status:'closed',rating:4.5,orders:340,phone:'+998993921157'},
  {id:'b5',name:'Farg\'ona Nonlari',address:'Namangan, Do\'rmon 33',lat:40.9940,lng:71.6800,status:'open',rating:4.6,orders:450,phone:'+998993921157'},
  {id:'b6',name:'Samarqand Noni',address:'Namangan, Kosonsoy 5',lat:40.9970,lng:71.6600,status:'open',rating:4.9,orders:2300,phone:'+998993921157'},
];

export const drivers = [
  {id:'d1',name:'Akmaljon',phone:'+998991234567',status:'free',rating:4.9,deliveries:340},
  {id:'d2',name:'Bobur',phone:'+998992345678',status:'free',rating:4.7,deliveries:210},
  {id:'d3',name:'Dilshod',phone:'+998993456789',status:'delivering',rating:4.8,deliveries:560},
  {id:'d4',name:'Eldor',phone:'+998994567890',status:'free',rating:4.6,deliveries:180},
];

interface AppState {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  liveOrders: Order[];
  nextOrderId: number;
  userLocation: { lat: number; lng: number } | null;

  setUser: (user: User | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  placeOrder: (address: string) => Order;
  addLiveOrder: (order: Order) => void;
  updateLiveOrder: (id: number, status: string, driver?: { name: string; phone: string }) => void;
  setLocation: (loc: { lat: number; lng: number }) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      orders: [],
      liveOrders: [],
      nextOrderId: 1000,
      userLocation: null,

      setUser: (user) => set({ user }),

      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find((c) => c.id === product.id);
        if (existing) {
          set({ cart: cart.map((c) => (c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c)) });
        } else {
          set({ cart: [...cart, { id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: BREAD_IMG }] });
        }
      },

      removeFromCart: (id) => set({ cart: get().cart.filter((c) => c.id !== id) }),

      updateQuantity: (id, delta) => {
        set({
          cart: get()
            .cart.map((c) => (c.id === id ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
            .filter((c) => c.quantity > 0),
        });
      },

      clearCart: () => set({ cart: [] }),

      placeOrder: (address) => {
        const { cart, user, nextOrderId } = get();
        const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);
        const order: Order = {
          id: nextOrderId,
          status: 'pending',
          items: cart.map((c) => ({ name: c.name, quantity: c.quantity, price: c.price })),
          total,
          address,
          bakery: 'Raximjon Nonvoyxonasi',
          time: Date.now(),
          driver: undefined,
          userName: user?.name,
          userPhone: user?.phone,
        };
        set({ orders: [...get().orders, order], liveOrders: [order, ...get().liveOrders], nextOrderId: nextOrderId + 1, cart: [] });
        return order;
      },

      addLiveOrder: (order) => set({ liveOrders: [order, ...get().liveOrders] }),

      updateLiveOrder: (id, status, driver) => {
        set({
          liveOrders: get().liveOrders.map((o) => (o.id === id ? { ...o, status, driver: driver || o.driver } : o)),
          orders: get().orders.map((o) => (o.id === id ? { ...o, status, driver: driver || o.driver } : o)),
        });
      },

      setLocation: (loc) => set({ userLocation: loc }),
    }),
    { name: 'zn-store' }
  )
);
