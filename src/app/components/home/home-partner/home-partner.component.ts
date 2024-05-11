import { Partner } from './../../../Data/partner';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewEncapsulation, NgModule, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  partner: any;
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
}
