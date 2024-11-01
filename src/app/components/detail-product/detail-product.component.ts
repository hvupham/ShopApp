import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class DetailProductComponent implements OnInit {
  product?: Product;
  category?: Category;
  comments: Comment[] = [];
  product_id: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;
  userResponse: any = {};

  insertCommentDTO: InsertCommentDTO = {
    product_id: 0,
    content: '',
    user_id: 0,
  };
  ratingStats = {
    averageRating: 4.2,
    totalReviews: 1001,
    ratingsDistribution: [
      { star: 5, percentage: 53 },
      { star: 4, percentage: 29 },
      { star: 3, percentage: 9 },
      { star: 2, percentage: 4 },
      { star: 1, percentage: 6 },
    ]
  };
  

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userResponseString = localStorage.getItem('user');
      if (userResponseString) {
        this.userResponse = JSON.parse(userResponseString);
        this.insertCommentDTO.user_id = this.userResponse.id;
      }
    }

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam !== null && !isNaN(+idParam)) {
      this.product_id = +idParam;
      this.insertCommentDTO.product_id = this.product_id;
      this.getProductDetail();
      
    } else {
      console.error('Invalid product_id:', idParam);
    }

  }
  getProductDetail(){
    this.productService.getDetailProduct(this.product_id).subscribe({
      next: (apiResponse: ApiResponse) => {
        const response = apiResponse.data;
        if (response.product_images && response.product_images.length > 0) {
          response.product_images.forEach((product_image: ProductImage) => {
            if (!product_image.image_url.startsWith('http')) {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            }

          });
        }
        this.product = response;
        this.showImage(0);
        this.getAllCommentByProduct(this.product_id);

      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
  trackByImageUrl(index: number, item: { image_url: string }): string {
    return item.image_url;
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

  getAllCommentByProduct(product_id: number) {
    this.commentService.getAllcommentsByProduct(product_id).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.comments = apiResponse.data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
  insertComment() {
    if (this.insertCommentDTO.content.trim() !== '') {
      console.log('Comment content:', this.insertCommentDTO.content);
      this.commentService.insertComment(this.insertCommentDTO).subscribe({
        next: (response) => {
          this.getAllCommentByProduct(this.product_id);
          this.insertCommentDTO.content = '';

        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding comment:', error.message);
        }
      });
    } else {
      console.log('Comment cannot be empty.');
    }
  }
  trackByCommentId(index: number, comment: any): number {
    return comment.id;
  }
  
  
}
