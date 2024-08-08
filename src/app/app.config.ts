import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-ee0d0","appId":"1:178408385018:web:59306dfa6efa3e5dc31c43","storageBucket":"ring-of-fire-ee0d0.appspot.com","apiKey":"AIzaSyDVxYLYYN187mJrTmTIgDvZUVT06fnhkiM","authDomain":"ring-of-fire-ee0d0.firebaseapp.com","messagingSenderId":"178408385018"})), provideFirestore(() => getFirestore()), provideAnimations()]
};
