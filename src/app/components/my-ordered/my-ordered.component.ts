import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderDTO } from '../../dtos/order/order.dto';
import { ApiResponse } from '../../responses/api.response';
import { Injectable } from '@angular/core';
import { OrderResponse } from '../../responses/order/order.response';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-my-ordered',
  standalone: true,
  imports: [
    HeaderComponent, 
    CommonModule,
    FormsModule,
    FooterComponent
  ],
  templateUrl: './my-ordered.component.html',
  styleUrl: './my-ordered.component.scss'
})
@Injectable({
  providedIn: 'root'
})
export class MyOrderedComponent {
  orders :OrderResponse[]=[];
  user_id :number=5;
  orderedProducts: { 
    user_id: number ;
    address: string;
    cart_items: [];
    email: string;
    fullname: string;
    payment_method: string;
    phone_number: string;
    shipping_method: string;
    status: string;
    total_money: number;
  }[] = [];
  constructor(
    private orderService:OrderService,
    private router: Router,

  ){

  }
  ngOnInit() {
    this.loadOrderedProducts();
    this.getOrderByUserId(this.user_id)
    console.log(this.orders)

    
  }
  getOrderByUserId(user_id:number) {
    this.orderService.getOrdersByUserId(user_id).subscribe({
      next: (apiResponse: ApiResponse) => {
        debugger;
        this.orders = apiResponse.data
        
            .map((orders: OrderResponse) => {
              // order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
              orders.order_details[0].thumbnail = `${environment.apiBaseUrl}/products/images/${orders.order_details[0].thumbnail}`;
      
              return orders;}
          )
        console.log(apiResponse.data)
      },
      complete: () => {
        debugger;
      }
    })

    
  }
  loadOrderedProducts() {
    const products = localStorage.getItem('orderedProducts');
    const user = localStorage.getItem('user');
    if (products) {
      this.orderedProducts = JSON.parse(products);
      console.log(1)
      console.log(this.orderedProducts);
    }
    if (user) {
      const userObj = JSON.parse(user);
      this.user_id = userObj.id;
      console.log(`User ID: ${this.user_id}`);
    }
     else {
      console.log('No ordered products found in localStorage.');
    }
  }
  toOrderDetail(id:number){
    this.router.navigate([`/my-ordered/${id}`]);
  }

}
