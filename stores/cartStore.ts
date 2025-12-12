import { makeAutoObservable, runInAction } from "mobx";

import {CartProduct, ProductType} from "@/types";
import api from "@/api/axios";

// export interface CartItem {
//   id: string;          // id корзины
//   productId: string;   // id продукта
//   name: string;
//   price: number;
//   quantity: number;
// }

export class CartStore {
  items: CartProduct[] = [];
  cartId: string | null = null;
  isOpenCart: boolean = false;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        const data = JSON.parse(user);
        runInAction(() => {
          this.cartId = data.cartId
        })
      }
    }
  }

  setIsOpenCart(isOpen: boolean) {
    this.isOpenCart = isOpen;
  }

  setCartId(cartId: string) {
    this.cartId = cartId;
  }

  // Получение всех товаров корзины
  async fetchCart() {
    this.loading = true;
    try {
      const res = await api.get(`/cart/${this.cartId}`);
      runInAction(() => {
        this.items = res.data.items;
      });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  // Добавление нового товара
  async addItem(productId: string, productType: ProductType, quantity: number = 1) {
    try {
      const res = await api.post("/cart/", { product_id: productId, cart_id: this.cartId, product_type: productType, quantity });
      runInAction(() => {
        this.items = res.data.items || this.items;
      });
    } catch (err) {
      console.error(err);
    }
    await this.fetchCart()
  }

  // Удаление товара
  async removeItem(itemId: string) {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      runInAction(() => {
        this.items = res.data.items || this.items.filter(i => i.id !== itemId);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Изменение количества товара
  async changeQuantity(itemId: string, quantity: number) {
    try {
      const res = await api.patch(`/cart/${itemId}?quantity=${quantity}`);
      if (quantity === 0) {
        runInAction(() => {
          this.items = this.items.filter(i => i.id !== itemId)
        })
      } else {
        runInAction(() => {
          this.items = res.data.items || this.items.map(i =>
            i.id === itemId ? {...i, quantity} : i
          );
        });
      }
      await this.fetchCart()
    } catch (err) {
      console.error(err);
    }
  }

  // Очистка корзины
  async clearCart(cartId: string) {
    try {
      const res = await api.patch(`/cart/?cart_id=${cartId}`);
      runInAction(() => {
        this.items = [];
      });
    } catch (err) {
      console.error(err);
    }
  }

  get itemsArray() {
    return this.items.map(item => ({ ...item })); // простой JS-массив объектов
  }

  // Общая сумма корзины
  get totalPrice() {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  // Общее количество товаров
  get totalItems() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }
}

// Экземпляр сторa для использования в React
export const cartStore = new CartStore();
