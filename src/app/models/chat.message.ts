export class ChatMessage {
    public fromUsername: string;
    public message: string;
    public chatRoomId: string;
    public dateSend: Date;

    public static fromResponse(r: any): ChatMessage {
        var m = new ChatMessage;

        m.fromUsername = r.fromUsername;
        m.message = r.message;
        m.chatRoomId = r.chatRoomId;
        m.dateSend = r.dateSend;

        return m;
    }
    
    public valid(): boolean {
        return this.chatRoomId != null && this.message != null && this.message.length > 0;
    }
}
