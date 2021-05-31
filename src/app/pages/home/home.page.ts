import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/app/guard/auth.guard';
import { Details } from 'src/app/model/Details';
import { Note } from 'src/app/model/Note';
import { AuthenticationService } from 'src/app/serices/authentication.service';
import { FirebbaseService } from 'src/app/services/firebabse.service';
import { UserDetailsService } from 'src/app/services/user-details.service';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('myInput') myInput: ElementRef;
  note:Note={
    title:'',
    content:'',
    createAt:new Date().getTime(),
    name:''
  };
  username='';
  public user : Observable<Details[]>;
  constructor(
private auths:AuthenticationService,
private router:Router,
private fbSerice:FirebbaseService,
private ngFireAuth:AngularFireAuth,
public toastCtrl: ToastController,
public loadingController: LoadingController,
private udtl:UserDetailsService,
  ) { }

  ngOnInit() {

    this.udtl.ngOnInit();
      console.log("profile page constructor");
      this.user=this.udtl.getNotes();

     this.user.subscribe(x => x.forEach(p=>{

       this.note.name=p.fname;
     }))


  }
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
}
  addNote(){
    this.fbSerice.addNote(this.note).then(()=>{

    }, err=>{

    }
    )

    this.presentLoading()
    this.note.title="";
    this.note.content="";
    console.log("Add button clicked");
    this.router.navigateByUrl("tabs/my-listing");
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1500
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  signout(){
    this.ngFireAuth.authState.subscribe(user=>{
      if(user){

        localStorage.setItem('user',JSON.stringify(user));
      }

    })

    this.auths.Signout();
    this.router.navigate(['']);

  }

}
