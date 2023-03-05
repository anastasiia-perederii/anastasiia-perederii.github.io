'use strict'; 

  let pokemonsContainer = document.querySelector('.pokemons-list');
  let templateElement = document.querySelector('#pokemon-template');
  let detailsContainer = document.querySelector('#details');
  let elementToClone;
  let pokemonsList = [];
  let loadedData;
  let id = 0;

  let pokemon_load_url = 'https://pokeapi.co/api/v2/pokemon/?limit=12';
  let pokemon_img_base_url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.pokemon');
  } else {
    elementToClone = templateElement.querySelector('.pokemon');
  }

  // Create Pokemon card
 
  let getPokemonElement = function(data, container, id) {
    let element = elementToClone.cloneNode(true);
    element.querySelector('.pokemon_name').textContent = data.name; 
   // element.querySelector('.pokemon__idx').innerHTML = 'Type:' + ' ' + data.types;  
    container.appendChild(element);


    element.addEventListener('click', function() {
      getPokemonData(data.url, showDetails);
    });


    let image = new Image();
    image.onload = function(evt) {
      element.querySelector('.pokemon_img img').setAttribute('src', evt.target.src);
    };
    image.onerror = function() {
      element.classList.add('no-photo');
    };
    image.src = pokemon_img_base_url + id + '.png';

    return element;

    

  };


  // Show info about chosen pokemon

  let showDetails = function(data) {
    detailsContainer.querySelector('.descr_img img').setAttribute('src', data.sprites.front_default);
    detailsContainer.querySelector('.descr_name').textContent = data.name + ' #' + data.id;

    detailsContainer.querySelector('.descr_speed').textContent = data.stats[0].base_stat;
    detailsContainer.querySelector('.descr_sp-defense').textContent = data.stats[1].base_stat;
    detailsContainer.querySelector('.descr_sp-attack').textContent = data.stats[2].base_stat;
    detailsContainer.querySelector('.descr_defense').textContent = data.stats[3].base_stat;
    detailsContainer.querySelector('.descr_attack').textContent = data.stats[4].base_stat;
    detailsContainer.querySelector('.descr_hp').textContent = data.stats[5].base_stat;

    detailsContainer.querySelector('.descr_weight').textContent = data.weight;
    detailsContainer.querySelector('.descr_total-moves').textContent = data.moves.length;

    detailsContainer.querySelector('.descr_type').textContent = '';

    data.types.forEach(function(it) {
      let li = document.createElement('li');
      li.textContent = it.type.name;
      detailsContainer.querySelector('.descr_type').appendChild(li);
    });

    detailsContainer.removeAttribute('hidden');
    setScrollEnabled();
  };

  let hideDetails = function() {
    detailsContainer.setAttribute('hidden');
  };

  // Get pokemons list

  let getPokemons = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function(evt) {
      let loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', url);
    xhr.send();
  };

  // Get pokemon details data

  let getPokemonData = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function(evt) {
      let loadedPokemon = JSON.parse(evt.target.response);
      callback(loadedPokemon)
    };
    xhr.open('GET', url);
    xhr.send();
  };

  // Render pokemon's list

  function renderPokemons(pokemons) {
    let fragment = document.createDocumentFragment();

    pokemons.forEach(function(pokemon) {
      id++;
      getPokemonElement(pokemon, fragment, id);
    });

    pokemonsContainer.appendChild(fragment);
  }

  function cb(loadedPokemons) {
    loadedData = loadedPokemons;
    pokemonsList = loadedData['results'];
    renderPokemons(pokemonsList);
    setBtnEnabled();
  }


  let limit = 0;

  function renderNextPages() {
    getPokemons(pokemon_load_url + '&offset=' + (++limit * 12), cb);
  }

  function setBtnEnabled() {
    let btn = document.querySelector('#load-more');
    btn.addEventListener('click', renderNextPages);
  }

  getPokemons(pokemon_load_url, cb);

  // Sticky Details block

  let setScrollEnabled = function() {
    window.addEventListener('scroll', function() {
      let GAP = 300;

      if (document.body.scrollTop + document.documentElement.scrollTop > GAP) {
        detailsContainer.classList.add('descr-sticky');
      } else {
        detailsContainer.classList.remove('descr-sticky');
      }
    });
  };
