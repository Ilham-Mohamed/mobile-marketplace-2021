import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Note } from '../model/Note';
import { FirebbaseService } from '../services/firebabse.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  note:Note={
    id:'',
    title:'',
    content:'',
    createAt:'',
    name:''
  };
  constructor(private fbSerice:FirebbaseService,

    private router:Router,
    public loadingController: LoadingController,
    private activatedRouter : ActivatedRoute) { }

  ngOnInit() {
  }
  ngAfterViewInit():void{
    const id =this.activatedRouter.snapshot.paramMap.get('id');
    if(id){
      this.fbSerice.getNote(id).subscribe(notedata=>{
        this.note=notedata;
      })
    }
  }
  deleteNote(){
    this.presentLoading();
    this.fbSerice.deleteNote(this.note.id).then(()=>{
      this.router.navigateByUrl('tabs/my-listing');
    })
  }
  back(){
    this.router.navigate(['tabs/home']);
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
