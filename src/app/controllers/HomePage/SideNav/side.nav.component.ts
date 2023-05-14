import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular/ionic-module';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ChatMessage } from 'src/app/models/chat.message';
import { ChatRoom } from 'src/app/models/chat.room';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { ChatRoomService } from 'src/app/services/Chat/chat.room.service';
import { LocalStorageService } from 'src/app/services/local.storage.service';
import { SignalrService } from 'src/app/services/SignalR/signalr.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side.nav.component.html',
  styleUrls: ['./side.nav.component.css'],
  standalone: true,
  imports: [IonicModule]
})
export class SideNavComponent implements OnInit {
    @Input() smallScreen: boolean;
    @Input() chatRooms: ChatRoom[];
    @Input() navBarOpen: boolean;
    @Output() newChatOpened = new EventEmitter<ChatRoom>();
    
    public usernameSearchInput: string;
    public usersSearchResult: User[];
    public creatingChatRoom: boolean = false;
    public userIsDeleted: boolean = false;
    
    public logoutIcon: string = "bi-box-arrow-in-left";
    public settingsIcon: string = "bi-gear";
    
    public constructor(private _usersService: UsersService,
                       private _chatRoomService: ChatRoomService,
                       private _localStorageService: LocalStorageService,
                       private _signalrService: SignalrService,
                       private _router: Router) { 
        this.usernameSearchInput = "";
    }
    
    public get currentUserName(): string {
        if (this._localStorageService.currentUser == null) {
            return "";
        }
        return this._localStorageService.currentUser.username;
    }
    
    public ngOnInit(): void {
        this.loadAllChatRooms();
        
        this._signalrService.userConnected.subscribe(username => this.onUserConnected(username));
        this._signalrService.userDisconnected.subscribe(username => this.onUserDisconnected(username));
    }

    public searchUsers(): void {
        if (this.usernameSearchInput.length > 0) {
            firstValueFrom(this._usersService.searchUsers(this.usernameSearchInput))
            .then(x => {
                this.usersSearchResult = x;
            })
        }
        else {
            this.usersSearchResult = [];
        }
    }
    
    public onOpenChatClick(chatRoom: ChatRoom): void {
        this.loadChatRoomMessages(chatRoom).then(() => {
            this.newChatOpened.emit(chatRoom);
        });
    }
    public onCreateNewChatClick(user: User): void {
        var currentUserName = this.currentUserName;
        var newChatRoom = new ChatRoom();
        newChatRoom.participants = [currentUserName, user.username];
        
        this.creatingChatRoom = true;
        firstValueFrom(this._chatRoomService.createChatRoom(newChatRoom))
        .then(x => {
            // remove user from search results
            const userIndex = this.usersSearchResult.indexOf(user);
            this.usersSearchResult.splice(userIndex, 1);
            
            // add user to chatRooms list
            this.chatRooms.push(x);
            
            this.newChatOpened.emit(x);
        })
        .catch(err => {
            // To do: show a notification
            console.log(err);
        })
        .finally(() => this.creatingChatRoom = false);
    }
    public onLogoutBtnClick(): void {
        this.logoutUser();
    }
    
    private loadAllChatRooms(): void {
        if (this._signalrService.connected) {
            lastValueFrom(this._chatRoomService.getUserChatRooms())
            .then(x => {
                this.chatRooms = x;
                // for (let index = 0; index < 25; index++) {
                //     this.chatRooms.push(x[0]);
                // }
            })
        }
        else {
            // retry after timeout
            setTimeout(() => {
                this.loadAllChatRooms();
            }, 100);
        }
    }
    private loadChatRoomMessages(chatRoom: ChatRoom): Promise<void> {
        return lastValueFrom(this._chatRoomService.getChatRoomMessages(chatRoom.id))
            .then(x => {
                if (x == null) {
                    chatRoom.messages = [];
                }
                chatRoom.messages = x;
            })
            .then(() => this.checkIfUserIsDeleted(chatRoom))
    }
    private logoutUser(): void {
        this._localStorageService.remove("auth_token");
        this._signalrService.disconnect();
        this._router.navigate(["login"])
        // to do: remove refreshToken cookie
    }
    private checkIfUserIsDeleted(chatRoom: ChatRoom): void {
        if (chatRoom.participants.length != 2) {
            return;
        }
        const otherUserName = chatRoom.participants.find(x => x != this.currentUserName);
        if (!otherUserName) {
            return;
        }
        
        lastValueFrom(this._usersService.isUserDeleted(otherUserName)).then(x => {
            chatRoom.isUserDeleted = x || false;
        })
    }
    
    // Chat user status changes
    private onUserConnected(username: string) {
        const connectedUserChatRoom = this.chatRooms.find(x => x.participants.find(participant => participant == username))
        if (connectedUserChatRoom != null) {
            connectedUserChatRoom.hasOnlineUsers = true;
        }
        console.log("User connected: " + username);
    }
    private onUserDisconnected(username: string) {
        const connectedUserChatRoom = this.chatRooms.find(x => x.participants.find(participant => participant == username))
        if (connectedUserChatRoom != null) {
            connectedUserChatRoom.hasOnlineUsers = false;
        }
        console.log("User disconnected: " + username);
    }
}
