import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from "../game-info/game-info.component";
import {MatCardModule} from '@angular/material/card';
import { collection, Firestore, collectionData, doc, addDoc, where, query, onSnapshot, docData, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatIconModule, GameInfoComponent, MatCardModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  game!: Game;
  firestore: Firestore = inject(Firestore);
  paramsId:string ='';
  game$: any;
  games: any;
  gameDocRef!: any;


   constructor(private route: ActivatedRoute ,private Afirestore: Firestore ,public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params: any) => {
     this.paramsId = params.id;
   });
   this.initializeGame();
  }

  initializeGame() {
    this.gameDocRef = this.getSingleDocRef(this.paramsId);
    this.game$ = docData(this.gameDocRef);
    this.games = this.game$.subscribe((gameList: any) => {
      console.log(gameList);
      this.game.currentPlayer = gameList.currentPlayer;
      this.game.playedCards = gameList.playedCards;
      this.game.players = gameList.players;
      this.game.stack = gameList.stack;
      this.game.pickCardAnimation = gameList.pickCardAnimation;
      this.game.currentCard = gameList.currentCard;
    });
  }
  

    getGamesRef() {
      return collection(this.firestore, 'games'); // Mit dem Befehl collection() greifen wir auf die gesamte Sammlung 'trash' in unserem Firestore zu.
    }

    getSingleDocRef(docId: string) {
      return doc(collection(this.firestore, 'games'), docId); // Mit doc() greifen wir auf ein bestimmtes Dokument zu. Dafür müssen wir wissen in welcher Sammlung (also: collection(this.firestore, colId)) und dann die ID des Dokuments (docId).
    }

  newGame(){
    this.game = new Game();
  }

  async saveGame(){
    await updateDoc(this.gameDocRef, this.game.toJson());
  }


  takeCard(){
    if(!this.game.pickCardAnimation){
    const card = this.game.stack.pop();
    if (card !== undefined) {
    this.game.currentCard = card;
    console.log(this.game.currentCard);
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    this.saveGame();
    setTimeout(() => {
      this.game.pickCardAnimation = false;
      this.game.playedCards.push(this.game.currentCard);
      this.saveGame();
    }, 1000);
  }
}
}

 openDialog(): void {
  const dialogRef = this.dialog.open(DialogAddPlayerComponent);
  dialogRef.afterClosed().subscribe((name: string) => {
    if(name && name.length > 1){
    this.game.players.push(name);
    this.saveGame();
    }
  });

}

}
