import { Injectable } from '@angular/core';
import { AuthService } from '@core/authentication/services/auth.service';
import { IApiUserAuthenticated } from '@data/iapi-auth-user.metadata';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws: WebSocket | undefined;
  private user!: IApiUserAuthenticated;
  private baseUrlWS = localStorage.getItem('url-backend-ws');
  public notificaciones$ = new Subject<any>(); // Subject para emitir notificaciones
  private reconnectionAttempts = 0; // Contador de intentos de reconexión
  private maxReconnectionAttempts = 10; // Máximo número de intentos
  private reconnectionDelay = 5000; // Tiempo de espera entre intentos (en milisegundos)

  constructor(private authService: AuthService) {}
  connect(): void {
    this.user = this.authService.getUser;

    // Verificar si el usuario está autenticado
    if (!this.user || !this.user.token) {
        console.warn('No se puede conectar al WebSocket: el usuario no está autenticado.');
        return; // Salir del método si no hay usuario autenticado
    }

    console.log('Conectando al WebSocket con token:', this.user.token);
    this.ws = new WebSocket(this.baseUrlWS + '?token=' + this.user.token);

    this.ws.onopen = () => {
        console.log('Conectado al WebSocket');
        this.reconnectionAttempts = 0; // Reinicia el contador de reconexión al conectarse
    };

    this.ws.onmessage = (event) => {
        console.log('Mensaje recibido:', event.data);
        const mensaje = JSON.parse(event.data);

        // Emitir el valor recibido si el tipo es "solicitudes_tdm"
        if (mensaje.type === 'solicitudes_tdm') {
            this.notificaciones$.next(mensaje.data);
        }
    };

    this.ws.onclose = () => {
        console.log('WebSocket cerrado');
        this.reconnect(); // Intenta reconectar
    };

    this.ws.onerror = (error) => {
        console.error('Error en WebSocket:', error);
        this.reconnect(); // Intenta reconectar en caso de error
    };
}

  private reconnect(): void {
    if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
      this.reconnectionAttempts++;
      console.log(`Intentando reconectar... (${this.reconnectionAttempts}/${this.maxReconnectionAttempts})`);
      setTimeout(() => {
        this.connect(); // Intenta reconectar
      }, this.reconnectionDelay);
    } else {
      console.error('No se pudo reconectar al WebSocket después de varios intentos.');
    }
  }

  sendMessage(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('No se puede enviar el mensaje porque el WebSocket no está conectado.');
    }
  }
}
