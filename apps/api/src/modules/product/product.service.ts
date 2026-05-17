import { Injectable, NotFoundException } from '@nestjs/common';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  bakeryId: string;
  bakeryName: string;
  available: boolean;
}

const products: Product[] = [
  { id: 'bread-1', name: 'Oq Non', description: 'An\'anaviy oq bug\'doy noni', price: 5000, image: '/images/bread-1.jpg', category: 'An\'anaviy', bakeryId: 'bakery-1', bakeryName: 'Ziyokor Nonlari', available: true },
  { id: 'bread-2', name: 'Kulcha Non', description: 'Yumshoq kulcha non', price: 4000, image: '/images/bread-2.jpg', category: 'Kulcha', bakeryId: 'bakery-1', bakeryName: 'Ziyokor Nonlari', available: true },
  { id: 'bread-3', name: 'Qatlama Non', description: 'Qatlamli yog\'li non', price: 7000, image: '/images/bread-3.jpg', category: 'An\'anaviy', bakeryId: 'bakery-1', bakeryName: 'Ziyokor Nonlari', available: true },
  { id: 'bread-4', name: 'Tandir Non', description: 'Tandirda pishirilgan an\'anaviy non', price: 6000, image: '/images/bread-4.jpg', category: 'Tandir', bakeryId: 'bakery-2', bakeryName: 'Tandirchi Non', available: true },
  { id: 'bread-5', name: 'Patir Non', description: 'Yog\'li patir non', price: 8000, image: '/images/bread-5.jpg', category: 'Patir', bakeryId: 'bakery-2', bakeryName: 'Tandirchi Non', available: true },
  { id: 'bread-6', name: 'Shirmoy Non', description: 'Shirin xamirli non', price: 9000, image: '/images/bread-6.jpg', category: 'Shirin', bakeryId: 'bakery-2', bakeryName: 'Tandirchi Non', available: true },
  { id: 'bread-7', name: 'Zog\'ora Non', description: 'Makka unidan tayyorlangan non', price: 5500, image: '/images/bread-7.jpg', category: 'Maxsus', bakeryId: 'bakery-3', bakeryName: 'Sog\'lom Non', available: true },
  { id: 'bread-8', name: 'Javdar Non', description: 'Javdar unidan tayyorlangan non', price: 6500, image: '/images/bread-8.jpg', category: 'Maxsus', bakeryId: 'bakery-3', bakeryName: 'Sog\'lom Non', available: true },
  { id: 'bread-9', name: 'Kunjutli Non', description: 'Kunjut urug\'i sepilgan non', price: 7000, image: '/images/bread-9.jpg', category: 'Maxsus', bakeryId: 'bakery-3', bakeryName: 'Sog\'lom Non', available: true },
  { id: 'bread-10', name: 'Pishloqli Non', description: 'Pishloq bilan to\'ldirilgan non', price: 11000, image: '/images/bread-10.jpg', category: 'To\'ldirilgan', bakeryId: 'bakery-4', bakeryName: 'Nurli Non', available: true },
  { id: 'bread-11', name: 'Go\'shtli Non', description: 'Go\'sht bilan to\'ldirilgan non', price: 15000, image: '/images/bread-11.jpg', category: 'To\'ldirilgan', bakeryId: 'bakery-4', bakeryName: 'Nurli Non', available: true },
  { id: 'bread-12', name: 'Kartoshkali Non', description: 'Kartoshka bilan to\'ldirilgan non', price: 10000, image: '/images/bread-12.jpg', category: 'To\'ldirilgan', bakeryId: 'bakery-4', bakeryName: 'Nurli Non', available: true },
  { id: 'bread-13', name: 'Baget', description: 'Fransuz bageti', price: 8000, image: '/images/bread-13.jpg', category: 'Yevropa', bakeryId: 'bakery-5', bakeryName: 'Yevropa Non', available: true },
  { id: 'bread-14', name: 'Ciabatta', description: 'Italiya noni', price: 10000, image: '/images/bread-14.jpg', category: 'Yevropa', bakeryId: 'bakery-5', bakeryName: 'Yevropa Non', available: true },
  { id: 'bread-15', name: 'Focaccia', description: 'Italiya yassi noni', price: 12000, image: '/images/bread-15.jpg', category: 'Yevropa', bakeryId: 'bakery-5', bakeryName: 'Yevropa Non', available: true },
  { id: 'bread-16', name: 'Briosh', description: 'Fransuz shirin noni', price: 13000, image: '/images/bread-16.jpg', category: 'Shirin', bakeryId: 'bakery-5', bakeryName: 'Yevropa Non', available: false },
  { id: 'bread-17', name: 'Kruasan', description: 'Yog\'li kruasan', price: 9000, image: '/images/bread-17.jpg', category: 'Shirin', bakeryId: 'bakery-5', bakeryName: 'Yevropa Non', available: true },
  { id: 'bread-18', name: 'Lavash', description: 'Yupqa arman noni', price: 4000, image: '/images/bread-18.jpg', category: 'Yassi Non', bakeryId: 'bakery-6', bakeryName: 'Sharq Non', available: true },
  { id: 'bread-19', name: 'Tortilla', description: 'Meksika yassi noni', price: 5000, image: '/images/bread-19.jpg', category: 'Yassi Non', bakeryId: 'bakery-6', bakeryName: 'Sharq Non', available: true },
  { id: 'bread-20', name: 'Chapati', description: 'Hind yassi noni', price: 3000, image: '/images/bread-20.jpg', category: 'Yassi Non', bakeryId: 'bakery-6', bakeryName: 'Sharq Non', available: true },
  { id: 'bread-21', name: 'Pita', description: 'Yunon yassi noni', price: 4500, image: '/images/bread-21.jpg', category: 'Yassi Non', bakeryId: 'bakery-6', bakeryName: 'Sharq Non', available: true },
  { id: 'bread-22', name: "Parmoqli Non", description: 'Parmesan pishloqli non', price: 14000, image: '/images/bread-22.jpg', category: 'Maxsus', bakeryId: 'bakery-1', bakeryName: 'Ziyokor Nonlari', available: true },
  { id: 'bread-23', name: 'Zaytunli Non', description: 'Zaytun bilan tayyorlangan non', price: 11000, image: '/images/bread-23.jpg', category: 'Maxsus', bakeryId: 'bakery-1', bakeryName: 'Ziyokor Nonlari', available: true },
  { id: 'bread-24', name: 'Sarimsoqli Non', description: 'Sarimsoq yog\'li non', price: 8000, image: '/images/bread-24.jpg', category: 'Maxsus', bakeryId: 'bakery-1', bakeryName: 'Ziyokor Nonlari', available: true },
  { id: 'bread-25', name: 'Asalli Non', description: 'Asal bilan tayyorlangan shirin non', price: 12000, image: '/images/bread-25.jpg', category: 'Shirin', bakeryId: 'bakery-3', bakeryName: 'Sog\'lom Non', available: true },
  { id: 'bread-26', name: 'Dorivor Non', description: 'Dorivor o\'tlar qo\'shilgan non', price: 10000, image: '/images/bread-26.jpg', category: 'Maxsus', bakeryId: 'bakery-3', bakeryName: 'Sog\'lom Non', available: true },
  { id: 'bread-27', name: 'Qovoqli Non', description: 'Qovoq pyuresi bilan tayyorlangan non', price: 9000, image: '/images/bread-27.jpg', category: 'Maxsus', bakeryId: 'bakery-3', bakeryName: 'Sog\'lom Non', available: true },
  { id: 'bread-28', name: 'Yong\'oqli Non', description: 'Yong\'oq va mayizli non', price: 13000, image: '/images/bread-28.jpg', category: 'Shirin', bakeryId: 'bakery-4', bakeryName: 'Nurli Non', available: true },
  { id: 'bread-29', name: 'Kokosli Non', description: 'Kokos yog\'li shirin non', price: 11000, image: '/images/bread-29.jpg', category: 'Shirin', bakeryId: 'bakery-4', bakeryName: 'Nurli Non', available: false },
  { id: 'bread-30', name: 'Skipidar Non', description: 'Maxsus retsept bo\'yicha tayyorlangan non', price: 16000, image: '/images/bread-30.jpg', category: 'Maxsus', bakeryId: 'bakery-2', bakeryName: 'Tandirchi Non', available: true },
];

@Injectable()
export class ProductService {
  findAll(): Product[] {
    return products;
  }

  findOne(id: string): Product {
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  findByBakery(bakeryId: string): Product[] {
    return products.filter((p) => p.bakeryId === bakeryId);
  }
}
