import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import * as signalr from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLogin: boolean = false;
  userName: string = "";
  users: { key: string, value:{avatar} string }[] = [];

  avatar:string="avatar1";

  message: string = "";

  selectedUser: string = "";

  hub: signalr.HubConnection | undefined;


  login() {
    this.isLogin = true;
    this.connection();
  }

  connection() {
    this.hub = new signalr.HubConnectionBuilder()
      .withUrl("https://localhost:7252/sohbet-hub")
      .build();

    this.hub
      .start()
      .then(() => {
        console.log("Connection started...");
        this.hub?.invoke("Connect", this.userName,this.avatar); //bu sadece 1 defa çalışır.

        this.hub?.on("Chat", (res: any) => {
          console.log(res);
          
        })

        this.hub?.on("Login", (res: any[]) => {
          this.users=res.filter();

          this.users = res;
          this.users = this.users.filter(p => p.value != this.userName)

        });
      });
  }



  select(user: string) {
    this.selectedUser = user;
  }


  send() {
    this.hub?.invoke("Send", this.selectedUser, this.message);
  }

}


