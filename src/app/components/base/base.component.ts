import { Inject, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { CartService } from '../../services/cart.service';
import { CouponService } from '../../services/coupon.service';
import { OrderService } from '../../services/order.service';
import { Location } from '@angular/common';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '../../services/auth.service';

export class BaseComponent {
    router: Router = inject(Router);
    categoryService: CategoryService = inject(CategoryService);
    productService: ProductService = inject(ProductService);
    tokenService: TokenService = inject(TokenService);
    activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    userService: UserService = inject(UserService);
    roleService: RoleService = inject(RoleService);
    cartService: CartService = inject(CartService);
    couponService = inject(CouponService);
    orderService = inject(OrderService);
    authService = inject(AuthService);
    document: Document = inject(DOCUMENT);
    location: Location = inject(Location);


}


