import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService, Pokemon } from './pokemon.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pwa_pokemon';
  pokemons: Pokemon[] = [];
  currentPage = 1;
  totalPages = 1;
  pokemonsPerPage = 15; // Ajustado a 15 Pokémon por página

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    const offset = (this.currentPage - 1) * this.pokemonsPerPage;
    this.pokemonService.getPokemons(this.pokemonsPerPage, offset).subscribe(pokemons => {
      this.pokemons = pokemons;
      // Supongamos que hay una forma de obtener el número total de Pokémon
      // Aquí es donde puedes ajustar el número total de Pokémon si es dinámico
      this.totalPages = Math.ceil(1000 / this.pokemonsPerPage); // Cambia 1000 al número total de Pokémon si es dinámico
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPokemons();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPokemons();
    }
  }
}
