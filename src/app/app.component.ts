import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig) {
        localStorage.setItem('url-backend', environment.API_URL);
        localStorage.setItem('url-frontend', environment.FRONTEND_URL);
        localStorage.setItem('url-backend-admin', environment.API_URL+'admin/');

    }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
