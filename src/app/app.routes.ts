import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { 
  DetailProductComponent 
} from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { CategoriesComponent } from './components/categories/categories.component';
import { MyOrderedComponent } from './components/my-ordered/my-ordered.component';
//import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { UpdateUserComponent } from './components/user-profile/update-user/update.profile.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },  
  { path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn] },
  // { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'categories', component: CategoriesComponent},
  { path: 'my-ordered', component: MyOrderedComponent, canActivate:[AuthGuardFn] },
  { path: 'my-ordered/:id', component: OrderDetailComponent, canActivate:[AuthGuardFn] },
  { path: 'users/update', component: UpdateUserComponent },



  //Admin   
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate:[AdminGuardFn] 
  },      
];
