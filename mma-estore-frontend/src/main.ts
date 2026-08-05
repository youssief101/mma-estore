import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { register } from 'swiper/element/bundle';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

register();
