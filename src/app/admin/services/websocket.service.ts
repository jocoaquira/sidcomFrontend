import { Injectable } from '@angular/core';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@data/iapi-auth-user.metadata';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket | undefined;
    private user!:IApiUserAuthenticated;
  private baseUrlWS = localStorage.getItem('url-backend-ws');
  //private headers!:HttpHeaders;
  constructor(
      private authService:AuthService
    ) {
      //this.requestOptions = { headers: headers };
    }
  connect(): void {
    this.user=this.authService.getUser;
    console.log('Conectando al WebSocket con token:', this.user.token);
    this.ws = new WebSocket(this.baseUrlWS+'?token='+this.user.token); // Cambia el puerto si es necesario

    this.ws.onopen = () => {
      console.log('Conectado al WebSocket');
    };

    this.ws.onmessage = (event) => {
      console.log('Mensaje recibido:', event.data);
      // Aquí puedes emitir eventos o actualizar el estado de la app
    };

    this.ws.onclose = () => {
      console.log('WebSocket cerrado');
    };

    this.ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };
  }

  sendMessage(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    }
  }
}
