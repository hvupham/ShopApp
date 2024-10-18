import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDTO } from '../../dtos/user/login.dto';
import { Role } from '../../models/role'; // Đường dẫn đến model Role
import { UserResponse } from '../../responses/user/user.response';
import { CartService } from '../../services/cart.service';
import { RoleService } from '../../services/role.service'; // Import RoleService
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../responses/api.response';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm;

  phoneNumber: string = '33445566';
  password: string = '123456789';
  showPassword: boolean = false;

  roles: Role[] = []; 
  rememberMe: boolean = true;
  selectedRole: Role | undefined; 
  userResponse?: UserResponse
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({      
      next: (apiResponse: ApiResponse) => { // Sử dụng kiểu Role[]
        debugger
        const roles = apiResponse.data
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
        debugger
      },  
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
      } 
    });
  }
  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']); 
  }
  login() {
    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}`;
    //console.error(message);
    debugger

    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1,
      email: ""
    };
    this.userService.login(loginDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        if (this.rememberMe) {          
          this.tokenService.setToken(token);
          this.userService.getUserDetail(token).subscribe({
            next: (apiResponse2: ApiResponse) => {
              this.userResponse = {
                ...apiResponse2.data,
                date_of_birth: new Date(apiResponse2.data.date_of_birth),
              };    
              this.userService.saveUserResponseToLocalStorage(this.userResponse); 
              if(this.userResponse?.role.name == 'admin') {
                this.router.navigate(['/admin']);    
              } else if(this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);                      
              }
              
            },
            complete: () => {
              this.cartService.refreshCart();
            },
            error: (error: HttpErrorResponse) => {
              console.error(error?.error?.message ?? '');
            } 
          })
        }                        
      },
      complete: () => {
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      } 
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  continueWithGoogle(){
    window.location.href = "http://localhost:8088/oauth2/authorization/google";

  }
}
