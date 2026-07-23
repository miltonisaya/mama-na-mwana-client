import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

// Wraps the STOMP client used for the live dashboard. One long-lived
// connection per dashboard session: the periodic per-preset snapshot
// (/topic/dashboard.{preset}) and the outbox row-change feed (/topic/outbox)
// both ride over it. See WebSocketConfig/StompAuthChannelInterceptor on the
// backend for the other half of this.
@Injectable({
  providedIn: 'root'
})
export class DashboardSocketService {
  private client: Client | null = null;
  private presetSubscription: StompSubscription | null = null;
  private outboxSubscription: StompSubscription | null = null;

  constructor(private authService: AuthService) {}

  connect(onConnected: () => void): void {
    if (this.client?.active) {
      onConnected();
      return;
    }

    const wsUrl = environment.baseURL.replace(/^http/, 'ws') + '/ws-dashboard';

    this.client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      },
      reconnectDelay: 5000,
      onConnect: onConnected,
      onStompError: frame => {
        console.error('WebSocket STOMP error:', frame.headers['message'], frame.body);
      }
    });

    this.client.activate();
  }

  // Only one preset topic is ever "live" at a time - switching presets means
  // unsubscribing from the old one first, which this handles automatically.
  subscribeToPreset(preset: string, onMessage: (body: any) => void): void {
    this.presetSubscription?.unsubscribe();
    this.presetSubscription = this.client!.subscribe(`/topic/dashboard.${preset}`, (message: IMessage) => {
      onMessage(JSON.parse(message.body));
    });
  }

  unsubscribeFromPreset(): void {
    this.presetSubscription?.unsubscribe();
    this.presetSubscription = null;
  }

  subscribeToOutboxChanges(onMessage: (body: any) => void): void {
    if (this.outboxSubscription) {
      return;
    }
    this.outboxSubscription = this.client!.subscribe('/topic/outbox', (message: IMessage) => {
      onMessage(JSON.parse(message.body));
    });
  }

  disconnect(): void {
    this.presetSubscription?.unsubscribe();
    this.outboxSubscription?.unsubscribe();
    this.presetSubscription = null;
    this.outboxSubscription = null;
    this.client?.deactivate();
    this.client = null;
  }
}
