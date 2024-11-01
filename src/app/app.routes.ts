import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import {
  DetailProductComponent
} from './components/detail-product/detail-product.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MyOrderedComponent } from './components/my-ordered/my-ordered.component';
import { OrderComponent } from './components/order/order.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminGuardFn } from './guards/admin.guard';
import { AuthGuardFn } from './guards/auth.guard';
//import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { UpdateUserComponent } from './components/user-profile/update-user/update.profile.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },
  { path: 'auth/google/callback', component: AuthCallbackComponent },
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
