import { ApiResponse } from './../../responses/api.response';
import { InsertCommentDTO } from './../../dtos/comment/insert.comment.dto';
import { CommentService } from './../../services/comment.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../environments/environment';
import { ProductImage } from '../../models/product.image';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ListProductComponent } from '../list-product/list-product.component';
import { Category } from '../../models/category';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { response } from 'express';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    NgbModule,
    ListProductComponent,
    MatProgressBarModule,
    FooterComponent,
  ]
})

export class DetailProductComponent implements OnInit {
  product?: Product;
  category?: Category;
  comments: Comment[] = [];
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart:boolean = false;
  localStorage?:Storage;
  userResponse: any = {};

  insertCommentDTO: InsertCommentDTO = {
    productId: 0,
    content: '',
    userId: 0,
  }
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private commentService:CommentService,
    // private categoryService: CategoryService,
    // private router: Router,
      private activatedRoute: ActivatedRoute,
      private router: Router,
    ) {
      this.localStorage = document.defaultView?.localStorage;

      
    }
    ngOnInit() {
      // Lấy productId từ URL      
      const userResponseString = localStorage.getItem('user');
      if (userResponseString){
        this.userResponse = JSON.parse(userResponseString);
        this.insertCommentDTO.userId = this.userResponse.userId;
      }
      const idParam = this.activatedRoute.snapshot.paramMap.get('id');
      debugger
      //this.cartService.clearCart();
      //const idParam = 9 //fake tạm 1 giá trị
      if (idParam !== null) {
        this.productId = +idParam;
        this.insertCommentDTO.productId = this.productId;
      }
      if (!isNaN(this.productId)) {
        
        this.productService.getDetailProduct(this.productId).subscribe({
          next: (apiResponse: ApiResponse) => {            
            // Lấy danh sách ảnh sản phẩm và thay đổi URL
            const response = apiResponse.data
            debugger
            if (response.product_images && response.product_images.length > 0) {
              response.product_images.forEach((product_image:ProductImage) => {
                product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              });
            }            
            debugger
            this.product = response 
            // Bắt đầu với ảnh đầu tiên
            this.showImage(0);
          },
          complete: () => {
            debugger;
          },
          error: (error: HttpErrorResponse) => {
            debugger;
            console.error(error?.error?.message ?? '');
          }
        });    
      } else {
        console.error('Invalid productId:', idParam);
      }      
    }
    showImage(index: number): void {
      debugger
      if (this.product && this.product.product_images && 
          this.product.product_images.length > 0) {
        // Đảm bảo index nằm trong khoảng hợp lệ        
        if (index < 0) {
          index = 0;
        } else if (index >= this.product.product_images.length) {
          index = this.product.product_images.length - 1;
        }        
        // Gán index hiện tại và cập nhật ảnh hiển thị
        this.currentImageIndex = index;
      }
    }
    thumbnailClick(index: number) {
      debugger
      // Gọi khi một thumbnail được bấm
      this.currentImageIndex = index; // Cập nhật currentImageIndex
    }  
    nextImage(): void {
      debugger
      this.showImage(this.currentImageIndex + 1);
    }
  
    previousImage(): void {
      debugger
      this.showImage(this.currentImageIndex - 1);
    }      
    addToCart(): void {
      debugger
      this.isPressedAddToCart = true;
      if (this.product) {
        this.cartService.addToCart(this.product.id, this.quantity);
        alert("The product has been added to the cart")
      } else {
        // Xử lý khi product là null
        console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');

      }
    }    
        
    increaseQuantity(): void {
      debugger
      this.quantity++;
    }
    
    decreaseQuantity(): void {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
    getTotalPrice(): number {
      if (this.product) {
        return this.product.price * this.quantity;
      }
      return 0;
    }
    buyNow(): void {      
      if(this.isPressedAddToCart == false) {
        this.addToCart();
      }
      this.router.navigate(['/orders']);
    }    

    // comment
    getAllCommentByProduct(productId:number){
      this.commentService.getAllcommentsByProduct(productId).subscribe({
        next:(apiResponse:ApiResponse) =>{
          this.comments = apiResponse.data
        },
        complete: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        } 
      })

    }
    insertComment(){
      this.commentService.insertComment(this.insertCommentDTO).subscribe({
        next: (response) =>{
          console.log("insert comment successfully")
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        }  
      })
    }
}
