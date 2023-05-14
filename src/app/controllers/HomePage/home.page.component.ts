import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular/ionic-module';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ChatMessage } from 'src/app/models/chat.message';
import { ChatRoom } from 'src/app/models/chat.room';
import { User } from 'src/app/models/user';
import { ChatRoomService } from 'src/app/services/Chat/chat.room.service';
import { LocalStorageService } from 'src/app/services/local.storage.service';
import { SignalrService } from 'src/app/services/SignalR/signalr.service';
import { UsersService } from 'src/app/services/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './SideNav/side.nav.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.css'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, SideNavComponent], 
})
export class HomePageComponent implements OnInit, OnDestroy {
    @HostListener('window:resize', ['$event']) onWindowResize() {
        if (window.innerWidth < 776) {
            // Small screen
            if (this.activeChatRoom == null) {
                this.navBarOpen = true;
            }
            // else {
            //     this.navBarOpen == false
            // }
            
            this.smallScreen = true;
        }
        else {
            // Big screen
            this.smallScreen = false;
        }
    }
    @ViewChild('messagesListContainer') messagesListContainer:ElementRef;
    
    public smallScreen: boolean = false;
    public backArrowIcon: string = "bi-arrow-left-circle";
    
    public messageList: ChatMessage[];
    public activeChatRoom: ChatRoom;
    public navBarOpen: boolean = false;
    
    // New message properties
    public currentUserName: string;
    public activeChatRoomId: string;
    public messageInput: string = "";
    
    // For admin user
    public isAdmin: boolean;
    public allUsersForAdmin: User[];
    public usernameSearchInput: string;
    public usersSearchResult: User[];
    
    public constructor(private _signalrService: SignalrService,
                       private _localStorageService: LocalStorageService,
                       private _usersService: UsersService) { 
        this.messageList = [];
        this.currentUserName = this._localStorageService.currentUser.username;
        this.isAdmin = this._localStorageService.currentUser.isAdmin;
        this.onWindowResize();
    }

    public ngOnInit() {
        this._signalrService.startConnection();
        setTimeout(() => {
            this._signalrService.addDataListeners();
        }, 2000);
        this._signalrService.messageReceived.subscribe(newMessage => this.onNewMessageReceived(newMessage));
        
        if(this.isAdmin) {
            this.loadAllUsersForAdmin();
        }
    }
    
    public onSendMessageClick(): void {
        const chatMessage: ChatMessage = new ChatMessage();
        chatMessage.fromUsername = this.currentUserName;
        chatMessage.chatRoomId = this.activeChatRoomId;
        chatMessage.message = this.messageInput;
        this.messageInput = "" // clear message input
        
        if (!chatMessage.valid()) {
            return;
        }
        
        this._signalrService.sendMessage(chatMessage);
        this.addNewMessage(chatMessage);
    }
    
    public onNewActiveChatOpened(activeChatRoom: ChatRoom): void {
        this.navBarOpen = false;
        
        this.activeChatRoomId = activeChatRoom.id;
        this.activeChatRoom = activeChatRoom;
        this.messageList = activeChatRoom.messages || [];
        this.scrollToBottom();
        
        if (activeChatRoom.participants.length == 2) {
            // When only 2 users in the chat room
            
        }
    }
    public onToggleNavBarClick(): void {
        this.navBarOpen = !this.navBarOpen;
    }
    public deleteUser(user: User): void {
        firstValueFrom(this._usersService.deleteUser(user.id)).then(deletedUser => {
            if (this.allUsersForAdmin == null || this.allUsersForAdmin.length == 0 || deletedUser == null) {
                return;
            }
            
            const deletedUserIndex = this.allUsersForAdmin.findIndex(x => x.username == deletedUser.username);
            this.allUsersForAdmin.splice(deletedUserIndex, 1);
        });
    }
    public searchUsers(): void {
        if (this.usernameSearchInput.length > 0) {
            this.usersSearchResult = this.allUsersForAdmin.filter(x => x.username.indexOf(this.usernameSearchInput) != -1);
        }
        else {
            this.usersSearchResult = [];
        }
    }
    
    private onNewMessageReceived(message: ChatMessage) {
        this.addNewMessage(message);
    }
    
    private addNewMessage(message: ChatMessage) {
        // if(message.fromUsername == activeChatUsername)
        this.messageList.push(message);
        
        this.scrollToBottom();
    }
    private scrollToBottom(): void {
        if (this.messagesListContainer == null || this.messagesListContainer.nativeElement == null) {
            return;
        }
        setTimeout(() => {
            this.messagesListContainer.nativeElement.scrollTo(0, this.messagesListContainer.nativeElement.scrollHeight);
        }, 0);
    }
    private loadAllUsersForAdmin(): void {
        firstValueFrom(this._usersService.getAllUsers()).then(x => {
            this.allUsersForAdmin = x;
        });
    }
    
    
    public ngOnDestroy() {
        this._signalrService.disconnect();
    }
}
