import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ChatRoom } from 'src/app/models/chat.room';
import { environment } from 'src/environments/environment';
import { ChatMessage } from 'src/app/models/chat.message';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

    private baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) {
    }
    
    public createChatRoom(chatRoom: ChatRoom): Observable<ChatRoom> {
        return this.http.post<ChatRoom>(this.baseUrl + '/chatrooms/new', chatRoom);
    }
    
    public getUserChatRooms(): Observable<ChatRoom[]> {
        return this.http.get<ChatRoom[]>(this.baseUrl + '/chatrooms/all').pipe(
            map(x => x.map(ChatRoom.fromResponse))
        );
    }
    
    public getChatRoomMessages(roomId: string): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(this.baseUrl + `/chatrooms/${roomId}/messages`).pipe(
            map(x => x.map(ChatMessage.fromResponse))
        );
    }
}
