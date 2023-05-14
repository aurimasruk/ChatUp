import { ChatMessage } from "./chat.message";

export class ChatRoom {
    public id: string;
    public participants: string[];
    public lastActive: Date;
    public title: string;
    public messages: ChatMessage[];
    
    // not mapped
    public hasOnlineUsers: boolean;
    public isUserDeleted: boolean;
    
    public static fromResponse(r: any): ChatRoom {
        var m = new ChatRoom;

        m.id = r.id;
        m.participants = r.participants;
        m.lastActive = r.lastActive;
        m.title = r.title;
        m.hasOnlineUsers = r.hasOnlineUsers;

        return m;
    }
}
