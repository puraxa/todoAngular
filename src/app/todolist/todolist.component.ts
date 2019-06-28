import { Component, OnInit, NgModule } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  items:any;
  showAdd: number = 0;
  newItemValue: string;
  required: boolean = false;
  showEdit: number = 0;
  logged:boolean;
  page:number = 0;
  currentPage;
  nextPage;
  previousPage:Array<any>=[];
  currentItems;
  firstItem;
  constructor(private db:AngularFirestore, public auth:AuthService, private router:Router) { 
    this.items = db.collection('todolist',ref => ref.orderBy('dateCreated').limit(10)).valueChanges();
    this.currentItems = db.collection('counter').doc('todolist').valueChanges();
  }
  next = async() => {
    try {
      const cItem = await this.db.collection('counter').doc('todolist').get().toPromise();
      if((this.page)*10 - cItem.data().counter > 0){
        throw new Error('no more pages to show');
      }
      if(this.page > 0){
        this.items = this.db.collection('todolist',ref => ref.orderBy('dateCreated').startAt(this.nextPage).limit(10)).valueChanges();
        const snapshot = await this.db.collection('todolist',ref => ref.orderBy('dateCreated').startAt(this.nextPage).limit(11)).get().toPromise();
        this.nextPage = snapshot.docs[snapshot.docs.length - 1];
        this.previousPage.push(this.currentPage);
        this.currentPage = snapshot.docs[0];
        this.page++;
      }else{
        const snapshot = await this.db.collection('todolist',ref => ref.orderBy('dateCreated').limit(11)).get().toPromise();
        this.nextPage = snapshot.docs[snapshot.docs.length - 1];
        this.currentPage = snapshot.docs[0];
        this.page++;
      }
    } catch (err) {
      console.log(err);
    }
  }
  previous = () => {
    if(this.page == 1){
      return;
    }else{
      this.items = this.db.collection('todolist', ref => ref.orderBy('dateCreated').startAt(this.previousPage[this.page-2]).limit(10)).valueChanges();
      this.db.collection('todolist', ref => ref.orderBy('dateCreated').startAt(this.previousPage[this.page-2]).limit(10)).get().toPromise().then(snapshot => {
        this.nextPage = this.currentPage;
        this.currentPage = this.previousPage[this.page-2];
        this.previousPage.pop();
        this.page--;
      })
    }
  }
  async checkAuth(callback?,id?) {
    try {
      this.auth.loggedIn = await this.auth.checkAuth();
      if(!this.auth.loggedIn){
        await this.router.navigate(['login']);
      }else{
        callback(id);
      }
    } catch (err) {
      console.log(err);
    }
  }
  showAddMenu(){
    if(this.showAdd==0){
      this.showAdd = 1;
    }else{
      this.showAdd = 0;
    }
  }
  showEditMenu = (id) => {
    this.db.collection('todolist').doc(id).update({edit:1});
  }
  hideEditMenu = (id) => {
    this.db.collection('todolist').doc(id).update({edit:0});
  }
  edit = (id) =>{
    this.db.collection('todolist').doc(id).update({edit:0,title:this.newItemValue});
    this.newItemValue = null;
  }
  addItem = () => {
    if(this.newItemValue){
      const date = new Date();
      const id = this.db.createId();
      this.db.collection('todolist').doc(id).set({id:id,title:this.newItemValue,done:false,edit:0,dateCreated:date}).then(fullfiled =>{
        this.showAdd--;
        // this.items = this.db.collection('todolist',ref=> ref.orderBy('dateCreated').startAt(this.currentPage).limit(10)).valueChanges();
        this.newItemValue = undefined;
        this.required = false;
      });
    }else {
      this.required = true;
    }
  }
  deleteItem = (id) => {
    this.db.collection('todolist').doc(id).delete().then(ne => {
      if(this.page == 1){
        this.items = this.db.collection('todolist',ref => ref.orderBy('dateCreated').limit(10)).valueChanges();
        this.page = 0;
        this.previousPage = [];
        this.next();
      }else{
        this.nextPage = this.currentPage;
        this.currentPage = this.previousPage[this.previousPage.length-1];
        this.previousPage.pop();
        this.page--;
        this.next();
      }
    });
  }
  doneItem = (id) => {
    this.db.collection('todolist').doc(id).update({done:true});
  }
  undoItem = (id) => {
    this.db.collection('todolist').doc(id).update({done:false});
  }
  async ngOnInit() {
    try {
      this.auth.loggedIn = await this.auth.checkAuth();
      if(!this.auth.loggedIn){
        await this.router.navigate(['login']);
      }
      this.next();
    } catch (err) {
      console.log(err);
    }
  }
}
