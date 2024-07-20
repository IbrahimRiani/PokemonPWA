import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private httpClient: HttpClient = inject(HttpClient);

  constructor() {}

  // Método para obtener Pokémon con paginación
  getPokemons(limit: number, offset: number): Observable<Pokemon[]> {
   
    return this.httpClient.get<PokemonListResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`).pipe(
      switchMap((response: PokemonListResponse) => {
       
        const pokemonRequests: Observable<Pokemon>[] = response.results.map((pokemon: PokemonResult) =>
          this.httpClient.get<PokemonDetails>(pokemon.url).pipe(
            map((details: PokemonDetails) => ({
              name: details.name,
              image: details.sprites.front_default,
              type: details.types.map((t: any) => t.type.name).join(', '),
              height: details.height.toString(),
              weight: details.weight.toString()
            }))
          )
        );
        // Combinamos todos los Observables de Pokémon en un único Observable
        return forkJoin(pokemonRequests);
      })
    );
  }
}



export interface PokemonListResponse {
  results: PokemonResult[];
}

export interface PokemonResult {
  url: string;
}

export interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
  height: number;
  weight: number;
}

export interface Pokemon {
  name: string;
  image: string;
  type: string;
  height: string;
  weight: string;
}
