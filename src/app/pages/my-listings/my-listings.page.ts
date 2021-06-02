import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from 'src/app/model/Note';
import { AuthenticationService } from 'src/app/serices/authentication.service';
import { AuthenticateService } from 'src/app/services/authentication.service';
import { FirebbaseService } from 'src/app/services/firebabse.service';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { GetuidComponent } from 'src/app/model/getuid/getuid.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage implements OnInit {
  public notes:Observable<Note[]>;
  public backupnote:Observable<Note[]>;
  things$: Observable<Note[]>;
  today:number=  Date.now();
  public time;
  public noteList: any[];
  public noteListBackup: any[];
  filterTerm: string;

  constructor(private auths:AuthenticationService,
    private router:Router,
    private ngFireAuth:AngularFireAuth,
    private fbSerice:FirebbaseService,
              private fbauth:AuthenticateService,
              private firestore: AngularFirestore,
              public loadingController: LoadingController

    ) {
      setInterval(() => {
        this.time = new Date();
     }, 1000);
    }

  ngOnInit() {

    this.fbSerice.ngOnInit();

    this.notes=this.fbSerice.getNotes();
    console.log("my listing loadeed");

  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


  static loadit(){

  }
  signout(){


    this.auths.Signout();
    this.router.navigate(['']);

  }

}
