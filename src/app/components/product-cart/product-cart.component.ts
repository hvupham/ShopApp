import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.scss'
})
export class ProductCartComponent {
  @Input() product:any
  constructor( private router:Router){}
  navigateTo(path:string) {
    console.log(path);
    
    this.router.navigate([path]);
  }
  HandleLogin(){
    this.router.navigate(['/login']);
  }

}
