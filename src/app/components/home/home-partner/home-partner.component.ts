import { Partner } from './../../../Data/partner';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewEncapsulation, NgModule, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
@Component({
  selector: 'app-home-partner',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home-partner.component.html',
  styleUrl: './home-partner.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomePartnerComponent {
  @Input() categoryId:any;
  partner: any;
  keyword:string = "";
  // selectedCategoryId: number  = 0; // Giá trị category được chọn
  constructor(
    private router: Router
  ){}

  ngOnInit(){
    this.partner = Partner;
  }
  slidesPerView: number = 3;
    screenWidth! :number;
    @HostListener('window:resize')
    getScreenWidth(){
      this.screenWidth = window.innerWidth;
      if(this.screenWidth < 768){
        this.slidesPerView = 1;
      }else{
        this.slidesPerView = 3;
      }
    }
    toCategory(selectedCategoryId: number){
      this.router.navigate(['/categories'], { queryParams: { keyword: this.keyword, selectedCategoryId  } });
    }
}
