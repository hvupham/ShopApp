import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { ApiResponse } from '../../responses/api.response';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { TokenService } from '../../services/token.service';
import { LoginDTO } from './../../dtos/user/login.dto';
import { UserService } from './../../services/user.service';

import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { LoginResponse } from '../../responses/user/login.response';
import { UserResponse } from '../../responses/user/user.response';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ListProductComponent } from '../list-product/list-product.component';
import { HomePartnerComponent } from './home-partner/home-partner.component';
@Component({
  selector: 'app-home', 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    FooterComponent,
    HeaderComponent,
    ListProductComponent,
    HomePartnerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit {
  registerDto: RegisterDTO = {
    fullname : '',
    phone_number : '',
    password : 'aaaaaaaaaaaaaaaaa',
    retype_password : 'aaaaaaaaaaaaaaaaa',
    address : '',
    date_of_birth: new Date(),
    role_id: 1,
    google_account_id: 0,
    facebook_account_id: 0,
    email: '',
  };
  loginDTO: LoginDTO = {
    phone_number: '',
    password: '',
    email: '',
    role_id: 1,
  }
  userResponse?: UserResponse;

  idEmail: number = 0;
  typeRequest: string ='';
  avatar: string = '';


  products: Product[] = [];
  
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 40;
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
    private userService: UserService,
    private route: ActivatedRoute,


    @Inject(DOCUMENT) private document: Document
    ) {
      this.localStorage = document.defaultView?.localStorage;
    }

    ngOnInit() {
      this.currentPage = Number(this.localStorage?.getItem('currentProductPage')) || 0; 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      this.getCategories(0, 100);

      this.route.queryParams.subscribe(params => {
        this.idEmail = params['id'];
        this.typeRequest = params['type'];
      });
      if (this.idEmail){
        this.loginGmail()
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
      this.router.navigate(['/categories'], { queryParams: { keyword: this.keyword, selectedCategoryId: this.selectedCategoryId  } });
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
    
  
    loginGmail( ){
      if (this.typeRequest == "email"){
        this.registerDto.google_account_id = 1;
        this.userService.getGoogleUserInfo(this.idEmail).subscribe({
          next: (response: any) =>{
            this.avatar = response.picture;
            this.registerDto.email = response.email;
            this.registerDto.fullname = response.name;
            this.registerDto.date_of_birth = response.date_of_birth;
            // this.registerDto.password = this.userProfileForm.get('password')?.value;
            // this.registerDto.address = this.userProfileForm.get('address')?.value;
            // this.registerDto.phone_number = this.userProfileForm.get('phone_number')?.value;
            // this.registerDto.avatar = this.avatar;
            // this.registerDto.retype_password = this.registerDto.password;

            this.userService.register(this.registerDto).subscribe({
              next: (response: any) => {
                this.loginDTO.phone_number = this.registerDto.phone_number;
                this.loginDTO.password = this.registerDto.password;
                this.loginDTO.email = this.registerDto.email;
                this.userService.login(this.loginDTO)
                  .subscribe({
                    next: (response: LoginResponse) => {
                      const {token}  =  response
                      this.tokenService.setToken(token);
                      this.userService.getUserDetail(token).subscribe({
                        next: (userDetail: any) =>{
                          this.userResponse = {
                            ...userDetail,
                            date_of_birth: new Date(userDetail.date_of_birth)
                          };
                          this.userService.saveUserResponseToLocalStorage(this.userResponse);
                            if (this.userResponse?.role.name == 'admin'){
                              this.router.navigate(['/admin']);
                            } else if (this.userResponse?.role.name == 'user') {
                              this.router.navigate(['/']);
                            }
                        },
                        complete: () => {
                          debugger
                        },
                        error: (error : any) => {
                          debugger
                        }
                      })

                  }
                })
              }
            })

          }
        })


      }

    }
}
