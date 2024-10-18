import { Component, OnInit, Inject, CUSTOM_ELEMENTS_SCHEMA, HostListener, Input } from '@angular/core';
import { Category } from './../../models/category';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { TokenService } from '../../services/token.service';
import { ApiResponse } from '../../responses/api.response';

import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-product',
  standalone: true,
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss',
  imports :[
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ListProductComponent {
  @Input() categoryId:any;
  products: Product[] = [];

  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 100;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  localStorage?:Storage;
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,    
    private router: Router,
    private tokenService: TokenService,
    @Inject(DOCUMENT) private document: Document
    ) {
      this.localStorage = document.defaultView?.localStorage;
      
    }

    ngOnInit() {
      this.currentPage =  0; 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      this.getCategories(0, 100);
    }
    
    getCategories(page: number, limit: number) {
      this.categoryService.getCategories(page, limit).subscribe({
        next: (apiResponse: ApiResponse) => {
          debugger;
          this.categories = apiResponse.data;
        },
        complete: () => {
          debugger;   
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        } 
      });
    }
    

    
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      debugger;
      this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
        next: (apiresponse: ApiResponse) => {
          debugger;
          const response = apiresponse.data;
          response.products.forEach((product: Product) => {          
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
          debugger;
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        }
      });    
    }
    
    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
      const maxVisiblePages = 5;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
      let startPage = Math.max(currentPage - halfVisiblePages, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
    
      return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
    }
    
    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    onProductClick(productId: number) {
      debugger;
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/products', productId]).then(() => {
        window.location.reload();
    });
    }

    slidesPerView: number = 4;
    screenWidth! :number;
    @HostListener('window:resize')
    getScreenWidth(){
      this.screenWidth = window.innerWidth;
      if(this.screenWidth < 768){
        this.slidesPerView = 1;
      }else{
        this.slidesPerView = 4;
      }
    }

}
