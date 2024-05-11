import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app/app.component';
import { register as registerSwiperElements } from 'swiper/element/bundle'
registerSwiperElements()
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  /**

 yarn add bootstrap @ng-bootstrap/ng-bootstrap
 yarn add font-awesome @fortawesome/fontawesome-free
 yarn add class-transformer class-validator
 yarn add @popperjs/core  
 yarn add @auth0/angular-jwt
 */