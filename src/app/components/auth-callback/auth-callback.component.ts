import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../../responses/api.response';
import { UserResponse } from '../../responses/user/user.response';
import { BaseComponent } from '../base/base.component';
import { tap, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ], 
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent extends BaseComponent implements OnInit {
  userResponse?: UserResponse
  ngOnInit() {
    const url = this.router.url;
    let loginType: 'google' | 'facebook';
    if (url.includes('/auth/google/callback')) {
      loginType = 'google';
    } else if (url.includes('/auth/facebook/callback')) {
      loginType = 'facebook';
    } else {
      console.error('Không xác định được nhà cung cấp xác thực.');
      return;
    }
    /// Lấy mã xác thực từ URL
    this.activatedRoute.queryParams.subscribe(params => {
      debugger
      const code = params['code'];
      if (code) {
        // Gửi mã này đến server để lấy token
        this.authService.exchangeCodeForToken(code, loginType).pipe(
          tap((response: ApiResponse) => {
            debugger
            // Giả sử API trả về token trong response.data
            const token = response.data.token;
            // Lưu token
            this.tokenService.setToken(token);
          }),
          switchMap((response) => {
            debugger
            const token = response.data.token;
            // Gọi hàm getUserDetail với token
            return this.userService.getUserDetail(token);
            
          })
        ).subscribe({
          next: (apiResponse: ApiResponse) => {
            // Xử lý thông tin người dùng
            debugger
            this.userResponse = {
              ...apiResponse.data,
              date_of_birth: new Date(apiResponse.data.date_of_birth),
            };
            this.userService.saveUserResponseToLocalStorage(this.userResponse);

            // Điều hướng người dùng dựa trên vai trò
            if (this.userResponse?.role.name === 'admin') {
              this.router.navigate(['/admin']);
            } else if (this.userResponse?.role.name === 'user') {
              this.router.navigate(['/']);
            }
          },
          error: (error: HttpErrorResponse) => {
            // console.error('Lỗi khi lấy thông tin người dùng hoặc trao đổi mã xác thực:', error);
          },
          complete: () => {
            // Thực hiện các tác vụ khác nếu cần
            this.cartService.refreshCart();
          }
        });
      } else {
        console.error('Không tìm thấy mã xác thực hoặc loại đăng nhập trong URL.');
      }
    });
  }
}
