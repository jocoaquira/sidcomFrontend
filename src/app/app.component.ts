import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './admin/services/websocket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private wsService: WebsocketService
    ) {
        localStorage.setItem('url-backend', environment.API_URL);
        localStorage.setItem('url-backend-ws', environment.API_WS);
        localStorage.setItem('url-frontend', environment.FRONTEND_URL);
        localStorage.setItem('url-backend-admin', environment.API_URL+'admin/');

    }

    ngOnInit() {
        this.wsService.connect();
        this.primengConfig.ripple = true;
    }
    enviarMensaje() {
    this.wsService.sendMessage('¡Hola desde Angular!');
  }
}
