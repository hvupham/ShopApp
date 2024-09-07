import { Component, ViewChild, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  ValidationErrors, 
  ValidatorFn, 
  AbstractControl
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// component
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
// response
import { UserResponse } from '../../../responses/user/user.response';
// dto
import { LoginDTO } from '../../../dtos/user/login.dto';
import { RegisterDTO } from '../../../dtos/user/register.dto';
// Service
import { UserService } from '../../../services/user.service';
import { TokenService } from '../../../services/token.service';
import { CartService } from '../../../services/cart.service';
// response
import { LoginResponse } from '../../../responses/user/login.response';
import { ApiResponse } from '../../../responses/api.response';

@Component({
  selector: 'user-update',
  templateUrl: './update.profile.component.html',
  styleUrls: ['./update.profile.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,   
  ],
})
export class UpdateUserComponent implements OnInit{
  @ViewChild('updatedForm') updatedForm !: NgForm;
  userProfileForm: FormGroup;
  typeRequest: string ='';
  buttonHit: boolean = false;
  idEmail: number = 0;
  avatar: string = '';
  loginDTO: LoginDTO = {
    phone_number: '',
    password: '',
    email: '',
    role_id: 1,
  }
  
  checkExistPhoneNumber: boolean = false;
  registerDto: RegisterDTO = {
    fullname : '',
    phone_number : '0',
    password : '0',
    retype_password : '0',
    address : '0',
    date_of_birth: new Date(),
    role_id: 1,
    google_account_id: 0,
    facebook_account_id: 0,
    email: '',
  };
  rememberMe: boolean = true;

  userResponse?: UserResponse;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private cartService: CartService

  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      // email: ['', [Validators.email]],
      phone_number: ['', Validators.minLength(6)],
      password: ['', Validators.minLength(3)],
      retype_password: ['', Validators.minLength(3)],
      address: ['', [Validators.required, Validators.minLength(5)]],
      date_of_birth: [''],
    }, {
    });
  }
  ngOnInit() {
    debugger;
    this.route.queryParams.subscribe(params => {
      this.idEmail = params['id'];
      this.typeRequest = params['type'];
    });
    this.existingUser();
  }
  existingUser(){
    this.userService.existingUser(this.idEmail).subscribe({
      next: (response: ApiResponse) =>{
        console.log(response.data);
        if (response.data){
          this.userService.getGoogleUserInfo(this.idEmail).subscribe({

            next: (response: any) =>{
              console.log(response.data.email)
              debugger;
              this.loginDTO.email = response.data.email;
              this.loginDTO.phone_number = "1111111111";
              this.loginDTO.password = "123456789"
              console.log(this.loginDTO.email)
              this.userService.loginGG(this.loginDTO)
                    .subscribe({
                        next: (apiResponse: LoginResponse) => {
                          debugger;
                          const { token } = apiResponse;
                          console.log(token)

                          if (this.rememberMe) {          
                            this.tokenService.setToken(apiResponse.token);
                            debugger;
                            this.userService.getUserDetail(apiResponse.token).subscribe({
                              next: (apiResponse2: any) => {
                                console.log(apiResponse2)
                                debugger
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
                                debugger;
                              },
                              error: (error: HttpErrorResponse) => {
                                debugger;
                                console.error(error?.error?.message ?? '');
                              } 
                            })
                          }                        
                        },
                        complete: () => {
                          debugger
                        },
                        error: (error : any) => {
                          debugger
                        }
                      }
                    );
            },
            complete: () =>{
              debugger;
            },
            error: (error: any) => {
              console.log("Error fetching data error: "+error.error.message);
            }
          })
        } else {
          this.checkExistPhoneNumber = false;
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  save(){
    debugger;
    if (this.userProfileForm.get('phone_number')?.value.length<5){
      alert("Can not register this account because of invalid phone number");
      return;
    }
    if (this.userProfileForm.get('password')?.value.length<3){
      alert("Can not register this account because of invalid password");
      return;
    }
    if (this.typeRequest=="facebook"){
      this.registerDto.facebook_account_id = 1;
    
    } else {
      if (this.typeRequest=="email"){
        this.registerDto.google_account_id = this.idEmail;
        this.userService.getGoogleUserInfo(this.idEmail).subscribe({
          next: (response: any) =>{
            debugger;
            this.avatar = response.picture;
            this.registerDto.email = response.email;
            this.registerDto.fullname = "";
            this.registerDto.date_of_birth = this.userProfileForm.get('date_of_birth')?.value;
            this.registerDto.password = this.userProfileForm.get('password')?.value;
            this.registerDto.address = this.userProfileForm.get('address')?.value;
            this.registerDto.phone_number = this.userProfileForm.get('phone_number')?.value;
            this.registerDto.retype_password = this.registerDto.password;
            if (this.registerDto.phone_number.length>=6){
              this.userService.getUserByPhoneNumber(this.registerDto.phone_number).subscribe({
                next: (response: any) =>{
                  if (response.id>0){
                    alert("This phone number has been used by someone please try by another phone number");
                  }
                },
                complete: () =>{
                },
                error: (error: any) => {
                  console.log("Error fetching data error: "+error.error.message);
                }
              });
            }
            this.userService.register(this.registerDto).subscribe({
              next: (response: any) =>{
                debugger;
                alert("You have been updated successfully! Please login again");
                this.loginDTO.phone_number = this.registerDto.phone_number;
                this.loginDTO.password = this.registerDto.password;
                this.loginDTO.email = this.registerDto.email;
                this.userService.login(this.loginDTO)
                  .subscribe({
                      // next: (response: ApiResponse) => {
                      //   debugger
                      //   const {token} = response.data;
                      //   console.log(token)
                      //   this.tokenService.setToken(token);
                      //   debugger;
                      //   this.userService.getUserDetail(token).subscribe({
                      //     next: (userDetails: any) => {
                      //       debugger;
                      //       this.userResponse = {
                      //         ...userDetails,
                      //         date_of_birth: new Date(userDetails.date_of_birth)
                      //       };
                      //       this.userService.saveUserResponseToLocalStorage(this.userResponse);
                      //       if (this.userResponse?.role.name == 'admin'){
                      //         this.router.navigate(['/admin']);
                      //       } else if (this.userResponse?.role.name == 'user') {
                      //         this.router.navigate(['/']);
                      //       }
                      //     },
                      //     complete: () => {
                      //       debugger
                      //     },
                      //     error: (error : any) => {
                      //       debugger
                      //     }
                      //   })
                      // },
                      next: (apiResponse: ApiResponse) => {
                        debugger;
                        const { token } = apiResponse.data;
                        if (this.rememberMe) {          
                          this.tokenService.setToken(token);
                          debugger;
                          this.userService.getUserDetail(token).subscribe({
                            next: (apiResponse2: ApiResponse) => {
                              debugger
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
                              debugger;
                            },
                            error: (error: HttpErrorResponse) => {
                              debugger;
                              console.error(error?.error?.message ?? '');
                            } 
                          })
                        }                        
                      },
                      complete: () => {
                        debugger
                      },
                      error: (error : any) => {
                        debugger
                      }
                    }
                  );
              },
              complete: () =>{
                debugger;
              },
              error: (error: any) => {
                console.log("Error fetching data error: "+error.error.message);
              }
            });
          },
          complete: () =>{
            debugger;
          },
          error: (error: any) => {
            console.log("Error fetching data error: "+error.error.message);
          }
        })
      }
    }
  }
  confirmPhoneNumber(){
    this.checkExistPhoneNumber=false;
    this.buttonHit = true;
    this.userService.getUserByPhoneNumber(this.userProfileForm.get('phone_number')?.value).subscribe({
      next: (response: any) =>{
        debugger;
        if (response.id>=1){
          this.checkExistPhoneNumber = true;
        } else {
          this.checkExistPhoneNumber = false;
        }
        console.log(this.checkExistPhoneNumber);
      },
      complete: () =>{
        debugger;
      },
      error: (error: any) =>{
        debugger;
        console.log("Error fetching data: error "+error.error.message);
      }
    })
  }

  // protected readonly confirm = confirm;
}
