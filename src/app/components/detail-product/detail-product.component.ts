import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { ProductImage } from '../../models/product.image';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { ListProductComponent } from '../list-product/list-product.component';
import { Category } from '../../models/category';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Comment } from '../../models/comment';
import { User } from '../../models/user';
import { CommentService } from './../../services/comment.service';
import { InsertCommentDTO } from './../../dtos/comment/insert.comment.dto';
import { ApiResponse } from './../../responses/api.response';
import { environment } from '../../../environments/environment.development';
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
  isPressedAddToCart: boolean = false;
  userResponse: any = {};

  insertCommentDTO: InsertCommentDTO = {
    productId: 0,
    content: '',
    userId: 0,
  };
  

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userResponseString = localStorage.getItem('user');
      if (userResponseString) {
        this.userResponse = JSON.parse(userResponseString);
        this.insertCommentDTO.userId = this.userResponse.userId;
      }
    }

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null && !isNaN(+idParam)) {
      this.productId = +idParam;
      this.insertCommentDTO.productId = this.productId;

      this.productService.getDetailProduct(this.productId).subscribe({
        next: (apiResponse: ApiResponse) => {
          const response = apiResponse.data;
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              console.log(product_image.image_url)
              if (!product_image.image_url.startsWith('http')) {
                product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              }
              // product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              console.log(product_image.image_url)

            });
          }
          this.product = response;
          this.showImage(0);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        }
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  showImage(index: number): void {
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      index = Math.max(0, Math.min(index, this.product.product_images.length - 1));
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    this.isPressedAddToCart = true;
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
      alert("The product has been added to the cart");
    } else {
      console.error('Cannot add product to cart because product is null.');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }

  buyNow(): void {
    if (!this.isPressedAddToCart) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }

  getAllCommentByProduct(productId: number) {
    this.commentService.getAllcommentsByProduct(productId).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.comments = apiResponse.data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
  insertComment() {
    this.commentService.insertComment(this.insertCommentDTO).subscribe({
      next: () => {
        console.log("Insert comment successfully");
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
}
