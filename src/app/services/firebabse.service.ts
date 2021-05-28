import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../model/Note';
import {map, take} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import { getLocaleMonthNames } from '@angular/common';
import {firebase} from '@firebase/app';
import '@firebase/auth';

import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';


import { GetuidComponent } from '../model/getuid/getuid.component';
import { Data } from './file.service';
import { Details } from '../model/Details';
import { UserDetailsService } from './user-details.service';
@Injectable({
  providedIn: 'root'
})
export class FirebbaseService {
  public static notes : Observable<Note[]>;
  public static noteCollection:AngularFirestoreCollection<Note>;

  public  static details : Observable<Details[]>;
  public detailsCollection:AngularFirestoreCollection<Details>;

  constructor(private afs:AngularFirestore,

    private navCtrl: NavController
    ) {
    //getUid.uid=firebase.auth().currentUser.uid;
    console.log("addpage " + GetuidComponent.uid);
    //define collections
    //this.noteCollection=this.afs.collection<Note>('notes');
    FirebbaseService.noteCollection=this.afs.collection('notes').doc(GetuidComponent.uid).collection<Note>('data');
   this.detailsCollection=this.afs.collection('notes').doc(GetuidComponent.uid).collection<Details>('user_details');
    //get collection data
    FirebbaseService.notes=FirebbaseService.noteCollection.snapshotChanges().pipe(
      map(action=>{
        return action.map(a=>{
          //get other datat
          const data=a.payload.doc.data();
          //get key
          const id=a.payload.doc.id;
          console.log(id);
          //return
          return {id,...data};
        });
      })
    );




  }
  ngOnInit() {
    console.log("inside init    "+GetuidComponent.uid);
    FirebbaseService.noteCollection=this.afs.collection('notes').doc(GetuidComponent.uid).collection<Note>('data');
    this.detailsCollection=this.afs.collection('notes').doc(GetuidComponent.uid).collection<Details>('user_details');
    FirebbaseService.notes=FirebbaseService.noteCollection.snapshotChanges().pipe(
      map(action=>{
        return action.map(a=>{
          //get other datat
          const data=a.payload.doc.data();
          //get key
          const id=a.payload.doc.id;
          console.log(id);
          //return
          return {id,...data};
        });
      })
    );


  }
  addimageData(url:string){
    this.afs.collection('notes').doc(GetuidComponent.uid).update({
      url:url
    })
  }
  getimageUri(){
    return this.afs.collection('notes').doc<Data>(GetuidComponent.uid).valueChanges().pipe(
      take(1),
      map(note=>{
        return note.url;
      })
    )
  }


  //getting all notes
  getNotes(): Observable<Note[]>{
    console.log(GetuidComponent.uid);
      return FirebbaseService.notes;
  }

  //get single note by id
  getNote(id:string):Observable<Note>{
    return FirebbaseService.noteCollection.doc<Note>(id).valueChanges().pipe(
      take(1),
      map(note=>{
        note.id=id;
        return note;
      })
    )
  }

  //create new note
  addNote(note:Note):Promise<DocumentReference>{
    console.log("adding to firebase");
    return FirebbaseService.noteCollection.add(note);
  }

  updateNote(note : Note):Promise<void>{
    return FirebbaseService.noteCollection.doc(note.id).update(
      {
        title:note.title,
        content:note.content,
        createAt:note.createAt
      }
    );
  }
  updateProfile(fname, lname, pnum):Promise<void>{
    return this.detailsCollection.doc(UserDetailsService.docid).update(
      {
        fname:fname,
        lname:lname,
        pnum:pnum
      }
    )
  }


  deleteNote(id:string):Promise<void>{
    return FirebbaseService.noteCollection.doc(id).delete();
  }


}
