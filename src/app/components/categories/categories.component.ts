import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { ApiResponse } from '../../responses/api.response';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { filterBrand, filterMultipleColor, filterPrice } from './filter/FilterData';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from './../header/header.component';
import { ProductCartComponent } from '../product-cart/product-cart.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatRadioModule } from '@angular/material/radio';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    CommonModule,
    FooterComponent,
    NgxPaginationModule,
    ProductCartComponent,
    MatRadioModule,
    MatCheckboxModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  filterColor: any;
  filterPrice: any;
  filterBrand: any;
  category: any;
  colors: any;
  price: any;
  productFilter:any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 8;

  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 12;
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
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, private el: ElementRef
    ) {
      this.localStorage = document.defaultView?.localStorage;
    }

    ngOnInit() {
      this.route.queryParams.subscribe((params: Params) =>{
        this.selectedCategoryId = params['selectedCategoryId'];
        
        console.log(this.selectedCategoryId);
        this.colors = params['color']?.split(',');
        console.log(this.colors);
        this.price = params['price'];
        this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
        console.log("productFilter",this.productFilter);  
  
        
      });
      this.currentPage = Number(this.localStorage?.getItem('currentProductPage')) || 0; 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);

      console.log(this.productFilter, '03u9u3u2093u2');
      this.getCategories(0, 100);
      console.log(this.products, '03u9u3u2093u2');

      this.filterColor =filterMultipleColor;
      this.filterPrice =filterPrice;
      this.filterBrand =filterBrand;


      

    }
    filterProducts(products: any[], selectedCategoryId: Number, colors: string[] | undefined, price: number | undefined) {
      let filteredProducts = [];
    
      for (let item of products) {
        
        if (Number(item.category_id) == selectedCategoryId) {
          if (colors === undefined && price === undefined) {
            filteredProducts.push(item);
          } else if (colors !== undefined && price === undefined) {
             console.log("item",item);
            if (colors.includes(item.color)) {
            
              filteredProducts.push(item);

            }
          } else if (colors === undefined && price !== undefined) {
            if (item.price < price) {
              filteredProducts.push(item);
            }
          } else if (colors !== undefined && price !== undefined) {
            if (colors.includes(item.color) && item.price < price) {
              filteredProducts.push(item);
            }
          }
        }
      }
    
      return filteredProducts;
    }
    onTableDataChange(event: any) {
      console.log(event);
      
      this.page = event;
      
    }
  
    
    ngAfterViewInit(): void {
  
      const pageSizeLabel = this.el.nativeElement.querySelector('#mat-paginator-page-size-label-0');
  
      if (pageSizeLabel) {
      
        this.renderer.setProperty(pageSizeLabel, 'textContent', 'Số sản phẩm trên mỗi trang:');
      }
      
    }
  
  
    
    
    handlefilterMuiltiple(value: string, sectionId: string){
      const queryParams = { ...this.route.snapshot.queryParams };
      
      const filterValues = queryParams[sectionId] ? queryParams[sectionId].split(',') : [];
      
      const valueIndex = filterValues.indexOf(value);
    
      if (valueIndex !== -1) {
        filterValues.splice(valueIndex, 1);
      } else {
        filterValues.push(value);
      }
    
      queryParams[sectionId] = filterValues.length > 0 ? filterValues.join(',') : undefined;
      
      this.router.navigate([], { queryParams });
    }
    
    handlefilterSimple(value: string, sectionId: string){
      const queryParams={ ...this.route.snapshot.queryParams};
  
      queryParams[sectionId] = value;
    
      this.router.navigate([], { queryParams });
    }
    sortItems(value:string){
      if(value =='l2h'){
        this.productFilter.sort((a:any, b:any) => Number(a.discountedPrice) - Number(b.discountedPrice));
      }else if(value =='h2l'){
        this.productFilter.sort((a:any, b:any) => Number(b.discountedPrice) - Number(a.discountedPrice));
      }
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
    
    searchProducts() {
      this.currentPage = 0;
      this.itemsPerPage = 12;
      debugger;
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
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
          this.productFilter=this.filterProducts(this.products,this.selectedCategoryId,this.colors,this.price);

          
          
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
    
    onPageChange(page: number) {
      debugger;
      this.currentPage = page < 0 ? 0 : page;
      this.localStorage?.setItem('currentProductPage', String(this.currentPage)); 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
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
      this.router.navigate(['/products', productId]);
    }
}



