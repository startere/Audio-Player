function solve(){
  
  var id = -1;
  function idGenerator() {
    id++;
    return id;
  }
  
  const Validators = {
    validateRange(inputType, input, min, max){
      if(inputType === 'audio'){
        if(input <= min || input > max){
          throw new Error(`Audio length should be a number greater than 0.`);
        }
      }
      if(inputType === 'rating'){
        if(input < min || input > max){
          throw new Error(`Rating must be a number between 1 and 5.`);
        }
      }
      if(inputType === 'string'){
        if(input.length < min || input.length > max){
          throw new Error(`String must be between 3 and 25 characters.`);
        }
      }
    }
  }
  
  class Player{
    
    constructor(playerName){
      this.playerName = playerName;
      this.playLists = [];
    }
    
    get playerName(){
      return this._playerName;
    }
    set playerName(value){
      Validators.validateRange('string', value, 3, 25);
      this._playerName = value;
    }
    
    addPlayList(...playListsToAdd){
      for(const playListToAdd of playListsToAdd){
        if(playListToAdd instanceof PlayList){
          this.playLists.push(playListToAdd);
        }
        else {
          throw new Error('PlayListToAdd must be a PlayList instance.');
        }
      }
    }
    
    getPlayListById(id){
      var matchingPlaylist = this.playLists.find(pl => pl.id === id);
      if(matchingPlaylist === undefined){
        matchingPlaylist = null;
      }
      return matchingPlaylist;
    }
    
    removePlaylist(...inputs){
      for(const input of inputs){
        if(typeof input === 'number'){
          var matchingPL = this.playLists.find(pl => pl.id === input);
          if(matchingPL === undefined){
            throw new Error('A playlist with the provided id is not contained in the player.');
          }
        }
        else if(input instanceof PlayList){
          var matchingPL = this.playLists.find(pl => pl.id === input.id);
          if(matchingPL === undefined){
             throw new Error('The provided playlist is not contained in the player.');
          }
        }
        this.playLists.splice(this.playLists.indexOf(matchingPL), 1);
      }
    }
    
    listPlaylists(page, size){
      var sortedplayLists = this.playLists.sort(function(a, b){
        if(a.playListName !== b.playListName){ return a.playListName > b.playListName  }
        else { return a.id > b.id};
      });
      
      if(this.playLists.length < size && page*size <= this.playLists.length){
        return this.playLists;
      }
      else if(page*size > this.playLists.length || page < 0 || size <= 0){
        throw new Error('Invalid listPlaysists input parameters.');
      }
      else{
        return this.playLists.slice(page*size, (page + 1)*size);
      }
      
    }
    
    contains(playable, playlist){
      var matchingPlayable = playlist.find(p => p === playable);
      if(matchingPlayable !== undefined){
        return true;
      }
      else{
        return false;
      }
    }
    
    search(pattern){
      var matchingPlayLists = [];
      for(var i = 0; i < this.playLists.length; i++){
        var matchingPlayable = this.playLists[i].playables.find(pl => pl.title.toLowerCase().indexOf(pattern.toLowerCase()) !== -1);
        if(matchingPlayable !== undefined){
          matchingPlayLists.push(this.playLists[i])
        }
      }
      return matchingPlayLists;
    }  
  }
  
  class PlayList{

    constructor(playListName){
      this.id = idGenerator();
      this.playables = [];
      this.playListName = playListName;
    }
    
    get playListName(){
      return this._playListName;
    }
    set playListName(value){
      Validators.validateRange('string', value, 3, 25);
      this._playListName = value;
    }
    
    addPlayable(...playablesInput){
      for(const playable of playablesInput){
        this.playables.push(playable);
      }
    }
    getPlayableById(id){
      var matchingPlayable = this.playables.find(pl => pl.id === id);
      if(matchingPlayable === undefined){
        return null;
      }
      else{
        return matchingPlayable;
      }
    }
    removePlayable(...inputs){
      var matchingPlayable;
      for(const input of inputs){
        if (typeof input === 'number'){
          matchingPlayable = this.playables.find(pl => pl.id === input)
          if(matchingPlayable === undefined){
            throw new Error('A playable with the provided id is not contained in the playlist.');
          }
        }
        else if (input instanceof Playable){
          matchingPlayable = this.playables.find(pl => pl.id === input.id)
          if(matchingPlayable === undefined){
            throw new Error('The provided playable is not contained in the playlist.');
          }
        }
        this.playables.splice(this.playables.indexOf(matchingPlayable), 1);
      }
    }
    listPlayables(page, size){
      var sortedPlayables = this.playables.sort(function(a, b){
        if(a.title !== b.title){ return a.title > b.title  }
        else { return a.id > b.id};
      });
      

      if(this.playables.length < size && page*size <= this.playables.length){
        return this.playables;
      }
      else if(page*size > this.playables.length || page < 0 || size <= 0){
        throw new Error('Invalid listPlayables input parameters.');
      }
      else{
        return this.playables.slice(page*size, (page + 1)*size);
      }
    }
  }
  
  class Playable{
    constructor(title, author){
      this.id = idGenerator();
      this.title = title;
      this.author = author;
    }
    
    get title(){
      return this._title;
    }
    set title(value){
      Validators.validateRange('string', value, 3, 25);
      this._title = value;
    }
    
    get author(){
      return this._author;
    }
    set author(value){
      Validators.validateRange('string', value, 3, 25);
      this._author = value;
    }
    
    play(){
      return `${this.id}. ${this.title} - ${this.author}`;
    };
  }
  
  class Audio extends Playable{
    constructor(title, author, length){
      super(title, author);
      this.length = length;
    }
    
    get length(){
      return this._length;
    }
    set length(value){
      Validators.validateRange('audio', value, 0, Infinity);
      this._length = value;
    }
    play() {
      return `${Playable.prototype.play.call(this)} - ${this.length}`;

    };
  }
  
  class Video extends Playable{
    constructor(title, author, imdbRating){
      super(title, author);
      this.imdbRating = imdbRating;
    }
    
    get imdbRating(){
      return this._imdbRating
    }
    set imdbRating(value){
      Validators.validateRange('rating', value, 1 , 5);
      this._imdbRating = value;
    }
  }
  
  var module = {
    getPlayer: function(playerName){
      return new Player(playerName);
    },
    getPlaylist: function(playListName){
      return new PlayList(playListName);
    },
    getAudio: function(title, author, length){
      return new Audio(title, author, length);
    },
    getVideo: function(title, author, imdbRating){
      return new Video(title, author, imdbRating);
    }
  };
  
  //TESTS START HERE========================================
  //========================================================
  //========================================================
  
  var Winamp = module.getPlayer('Winamp');
  console.log(Winamp);
  console.log(Winamp instanceof Player);
  var BeethovenPlayList = module.getPlaylist('Beethoven Playlist');
  var MozartPlayList = module.getPlaylist('Mozart Playlist');
  var BeethovenPlayList2 = module.getPlaylist('Beethoven Playlist');
  console.log(BeethovenPlayList instanceof PlayList);
  
  Winamp.addPlayList(BeethovenPlayList);
  Winamp.addPlayList(MozartPlayList);
  console.log(Winamp.playLists);
  console.log(BeethovenPlayList.id);
  console.log(MozartPlayList.id);
  console.log(Winamp.playLists);
  Winamp.removePlaylist(BeethovenPlayList);
  console.log(Winamp.playLists);
  Winamp.removePlaylist(1);
  console.log(Winamp.playLists);

  Winamp.addPlayList(MozartPlayList);
  Winamp.addPlayList(BeethovenPlayList2);
  Winamp.addPlayList(BeethovenPlayList);

  console.log(Winamp.playLists);
  
  console.log(Winamp.listPlaylists(0, 3));
  
  var HeartbreakerPlayable = new Playable('Heartbreaker', 'Led Zeppelin');
  var ThankYouPlayable = new Playable('Thank You', 'Led Zeppelin');
  var BringItOnHomePlayable = new Playable('Bring It On Home', 'Led Zeppelin');
  var BringItOnHomePlayable2 = new Playable('Bring It On Home', 'Led Zeppelin');
  
  console.log(BeethovenPlayList.playables);
  
  var check = Winamp.contains(HeartbreakerPlayable, MozartPlayList.playables);
  
  console.log(check);
  console.log(Winamp.search('heartbreaker'));
  BeethovenPlayList.addPlayable(HeartbreakerPlayable);
  console.log(BeethovenPlayList.playables);
  
  console.log(BeethovenPlayList.getPlayableById(3));
  BeethovenPlayList.removePlayable(3);
  console.log(BeethovenPlayList.playables);
  
  BeethovenPlayList.addPlayable(HeartbreakerPlayable);
  console.log(BeethovenPlayList.playables);
  BeethovenPlayList.removePlayable(HeartbreakerPlayable);
  console.log(BeethovenPlayList.playables);
  
  BeethovenPlayList.addPlayable(HeartbreakerPlayable);
  BeethovenPlayList.addPlayable(ThankYouPlayable);
  BeethovenPlayList.addPlayable(BringItOnHomePlayable);
  BeethovenPlayList.addPlayable(BringItOnHomePlayable2);
  console.log(BeethovenPlayList.playables);
  console.log(BeethovenPlayList.listPlayables(0, 2));
  
  console.log(HeartbreakerPlayable.play());
  
  var WhentheLeeveeBreaks = module.getAudio('When the Leevee Breaks', 'Led Zeppelin', 7.07);
  console.log(WhentheLeeveeBreaks);
  console.log(HeartbreakerPlayable.play());
  console.log(WhentheLeeveeBreaks.play());
  
  var Womb = module.getVideo('Womb', 'Eva Green', 1);
  console.log(Womb);
  
  var Player2 = module.getPlayer('000000000');
  console.log(Player2);
  
  //TESTS END HERE========================================
  //========================================================
  //========================================================
  
}

solve();