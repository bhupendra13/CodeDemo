import { CocktailService } from "./../../services/cocktail.service";
import { Cocktail } from "./../../models/Cocktail.model";
import { Subject } from "rxjs";
import { Component, OnInit } from "@angular/core";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap
} from "rxjs/operators";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  keyUp$ = new Subject<string>();
  isLoading = false;
  visible: boolean;
  foundDrinks: Cocktail[] = [];
  constructor(private cocktailSvc: CocktailService) {}

  ngOnInit() {
    this.keyUp$
      .pipe(
        filter(term => term.length >= 3),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => (this.isLoading = true)),
        switchMap(searchTerm => this.cocktailSvc.getAllSearch(searchTerm)),
        tap(() => (this.isLoading = false))
      )
      .subscribe(drinks => {
        this.visible = true;
        console.log(drinks);
        this.foundDrinks = drinks;
        console.log(this.foundDrinks);
      });
  }

  getCocktailFromSearch(id: string) {
    console.log(id);
    this.cocktailSvc.getSearchedCocktail(id);
  }

  closeResults(close: boolean) {
    this.visible = false;
  }
}
