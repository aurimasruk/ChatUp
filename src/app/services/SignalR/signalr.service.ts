import { EventEmitter, Injectable, Output } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { ChatMessage } from 'src/app/models/chat.message';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../local.storage.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
    @Output() messageReceived: EventEmitter<ChatMessage> = new EventEmitter();
    @Output() userConnected: EventEmitter<string> = new EventEmitter();
    @Output() userDisconnected: EventEmitter<string> = new EventEmitter();
    
    
    public data: ChatMessage[];
    public connected: boolean = false;
    
    private baseUrl = environment.baseUrl;
    private _hubConnection: signalR.HubConnection;
    
    public constructor(private _localStorageService: LocalStorageService) {
        
    }
    
    public startConnection(): void {


        const hubConnectionBuilder = new HubConnectionBuilder()
        .withUrl(this.baseUrl + "/chathub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => {
            return this._localStorageService.getJwtToken(); // localStorage["auth_token"];
            }
        });
        // .withAutomaticReconnect();
        
        this._hubConnection = hubConnectionBuilder.build();

        this._hubConnection.start()
        .then(() => {
            console.log(' Connection started');
            this.connected = true;
        })
        .catch(err => console.log('Error while starting connection: ' + err));


        // this._hubConnection = new signalR.HubConnectionBuilder()
        //     .withUrl(this.baseUrl + "/chathub" , {
        //         skipNegotiation: true,
        //         transport: signalR.HttpTransportType.WebSockets,
        //         // send bearer token that was received in login method
        //         accessTokenFactory: () => {
        //             return this._localStorageService.getJwtToken(); // localStorage["auth_token"];
        //         }
        //     })
        //     .withAutomaticReconnect()
        //     .build();
        
        // this._hubConnection
        //     .start()
        //     .then(() => {
        //         console.log(' Connection started');
        //         this.connected = true;
        //     })
        //     .catch(err => console.log('Error while starting connection: ' + err));
    }
    
    public addDataListeners = () => {
        this._hubConnection.on("ReceiveMessage", (message) => {
            if (message != null) {
                this.messageReceived.emit(message);
            }
        })
        this._hubConnection.on("UserConnected", (username) => {
            if (username != null) {
                this.userConnected.emit(username);
            }
        })
        this._hubConnection.on("UserDisconnected", (username) => {
            if (username != null) {
                this.userDisconnected.emit(username);
            }
        })
    }
    
    public sendMessage(chatMessage: ChatMessage): void {
        this._hubConnection.invoke("SendMessage", chatMessage).then(x => {
            console.log("Message sent");
        })
    }
    
    public disconnect(): void {
        this._hubConnection.off("");
        this._hubConnection.stop();
    }


}
