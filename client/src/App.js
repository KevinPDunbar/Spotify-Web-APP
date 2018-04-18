import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import SpotifyWebApi from 'spotify-web-api-js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'popper.js/dist/umd/popper'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'


const spotifyApi = new SpotifyWebApi();


class App extends Component {

  playNewTrack(trackId)
  {
    console.log("NEW TRACK TO PLAY: " + trackId);


    spotifyApi.play({"uris":
    [trackId]})
    .then((response) => {
      
      });
  }

  getTopTracks(){

    spotifyApi.getMyCurrentPlaybackState()
    .then((response) => {
      console.log("Artist IDbb:" + response.item.artists[0].id);

      spotifyApi.getArtistTopTracks(response.item.artists[0].id, 'IE')
      .then((response) => {
        console.log(response.tracks[0].name);
        console.log(response.tracks[0].id);

        console.log(response.tracks[1].name);
        console.log(response.tracks[1].id);


        this.setState({
          
          topTracks: { 
              track0Id: response.tracks[0].uri,
              track0Name: response.tracks[0].name,
              track1Id: response.tracks[1].uri,
              track1Name: response.tracks[1].name,
              track2Id: response.tracks[2].uri,
              track2Name: response.tracks[2].name,
              track3Id: response.tracks[3].uri,
              track3Name: response.tracks[3].name,
              track4Id: response.tracks[4].uri,
              track4Name: response.tracks[4].name,
              track5Id: response.tracks[5].uri,
              track5Name: response.tracks[5].name,
            }
        });

        });
    
    })

  }

  getCurrentArtist(){

    spotifyApi.getMyCurrentPlaybackState()
    .then((response) => {

      spotifyApi.getArtist(response.item.artists[0].id)
      .then((response) => {

        this.setState({
          
          currentArtist: { 
              followers: response.followers.total,
              images: response.images[0].url,
              name: response.name
            }
        });

        });
    
    })

  }

  saveTrack()
  {
    spotifyApi.getMyCurrentPlaybackState()
    .then((response) => {

      console.log("TRack id to save: " + response.item.id)

      let trackIds = ['4VbDJMkAX3dWNBdn3KH6Wx'];

     spotifyApi.addToMySavedTracks(trackIds)
     .then((response) => {
      });

    })
  }

  play()
  {
    spotifyApi.getMyDevices()
    .then((response) => {
      console.log("Devices:" + response.devices[0].id + " is active: " + response.devices[0].is_active);

      let options = {'device_id': response.devices[0].id}
      spotifyApi.play(options)
      .then((response) => {
        
        });
      });
  }
  

   fmtMSS(s){   // accepts seconds as Number or String. Returns m:ss
    return( s -         // take value s and subtract (will try to convert String to Number)
            ( s %= 60 ) // the new value of s, now holding the remainder of s divided by 60 
                        // (will also try to convert String to Number)
          ) / 60 + (    // and divide the resulting Number by 60 
                        // (can never result in a fractional value = no need for rounding)
                        // to which we concatenate a String (converts the Number to String)
                        // who's reference is chosen by the conditional operator:
            9 < s       // if    seconds is larger than 9
            ? ':'       // then  we don't need to prepend a zero
            : ':0'      // else  we do need to prepend a zero
          ) + Math.floor( s) ;       // and we add Number s to the string (converting it to String as well)
  }

  previousTrack() {
    spotifyApi.getMyDevices()
    .then((response) => {
      console.log("Devices:" + response.devices[0].id + " is active: " + response.devices[0].is_active);

      let options = {'device_id': response.devices[0].id}
      spotifyApi.skipToPrevious(options)
      .then((response) => {
        console.log("Duarion:" + response);
        
        });
      });
    }

  nextTrack() {
    spotifyApi.getMyDevices()
    .then((response) => {
      console.log("Devices:" + response.devices[0].id + " is active: " + response.devices[0].is_active);

      let options = {'device_id': response.devices[0].id}
      spotifyApi.skipToNext(options)
      .then((response) => {
        console.log("Duarion:" + response);
        
        });
      });
    }

  pause() {
    spotifyApi.getMyDevices()
    .then((response) => {
      console.log("Devices:" + response.devices[0].id + " is active: " + response.devices[0].is_active);

      let options = {'device_id': response.devices[0].id}
      spotifyApi.pause(options)
      .then((response) => {
        console.log("Duarion:" + response);
        
        });
      });
    }
  

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {

        this.setState({
          
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url,
              duration: Math.round(response.item.duration_ms / 1000),
              fancyDuration: this.fmtMSS(response.item.duration_ms / 1000),
              progress: Math.round(response.progress_ms / 1000),
              fancyProgress: this.fmtMSS(response.progress_ms / 1000),
              artist: response.item.artists[0].name,
              artistId: response.item.artists[0].id,
              trackId: response.item.id
            }
        });

      })

      
  }
  

  getCurrentUser(){
    spotifyApi.getMe()
      .then((response) => {
        console.log(response);
        this.setState({
          currentUser: {
            name: response.display_name,
            followers: response.followers.total,
            profilePicture: response.images[0].url
          }
        })
        });
      }
  

  constructor(){
    super();
    const params = this.getHashParams();

    this.interval = setInterval(() => this.getNowPlaying({ time: Date.now() }), 1000);
    this.interval = setInterval(() => this.getCurrentArtist({ time: Date.now() }), 1000);
    this.interval = setInterval(() => this.getTopTracks({ time: Date.now() }), 1000);

    const token = params.access_token;
  if (token) {
    spotifyApi.setAccessToken(token);
    this.getCurrentUser();
  }
  this.state = {
    loggedIn: token ? true : false,
    nowPlaying: { name: '', albumArt: '', duration: 0, fancyDuration: 0, progress: 0, fancyProgress: 0, 
    artist: '', artistId: '', isPlaying : '', trackId: '' },

    currentUser: {name: 'Unknown', followers: 0, profilePicture: ''},

    currentArtist: {name: '', followers: 0, images: '', name: ''},

    topTracks: {track0Id: '', track0Name: '', track1Id: '', track1Name: '', track2Id: '', 
    track2Name: '', track3Id: '', track3Name: '', track4Id: '', track4Name: '', track5Id: '', track5Name: ''}
  }

    console.log(params);
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  render() {
    return (
      <div className='App'>

      <div className="container-fluid">

        <div className="row">

          <div className="col-xs-12 currentUser">
          <img className="profilePicture" src={this.state.currentUser.profilePicture} />
            <p className="currentUserText">
              {this.state.currentUser.name}
              <br/>
              Followers: {this.state.currentUser.followers}
            </p>

           


            { this.state.loggedIn}
            
            <a className="login" href='http://localhost:8888'> Login to Spotify </a>
            
            
          </div>

         <div className="row">
            <div className="col-xs-12 playbackBar">
            <img src={this.state.nowPlaying.albumArt}/>
            <p className="trackPlaying">{ this.state.nowPlaying.name } 
            <br/>
            { this.state.nowPlaying.artist }
            <br />
            <span onClick={() => this.saveTrack()} className="glyphicon glyphicon-plus-sign saveTrack "></span>
            </p>
            
            <div className="playbackButtons">
           <span onClick={() => this.previousTrack()} className="glyphicon glyphicon-menu-left "></span>
           <span onClick={() => this.pause()} className="glyphicon glyphicon-pause "></span>
           <span onClick={() => this.play()} className="glyphicon glyphicon-play "></span>
           <span onClick={() => this.nextTrack()} className="glyphicon glyphicon-menu-right "></span>
           </div>
            <p className="timePlayed">{ this.state.nowPlaying.fancyProgress  }</p>
            <p className="duration">{ this.state.nowPlaying.fancyDuration }</p>

            <progress className="playProgress" value={ this.state.nowPlaying.progress  } max={ this.state.nowPlaying.duration }></progress>

            </div>
          </div> 

          

        </div>

            <div className="row mainRow">
          <div className="col-lg-12 col-xs-12 artistDisplay" >
              <img src={ this.state.currentArtist.images } />
              
              <h1>{ this.state.currentArtist.name }</h1>
              <p>Followers: { this.state.currentArtist.followers }</p>

              <p className="trackPlayButton">{ this.state.topTracks.track0Name } <span onClick={() => this.playNewTrack(this.state.topTracks.track0Id)} className="glyphicon glyphicon-menu-right"></span></p> 
         <p className="trackPlayButton">{ this.state.topTracks.track1Name }<span onClick={() => this.playNewTrack(this.state.topTracks.track1Id)} className="glyphicon glyphicon-menu-right"></span></p>
         <p className="trackPlayButton">{ this.state.topTracks.track2Name }<span onClick={() => this.playNewTrack(this.state.topTracks.track2Id)} className="glyphicon glyphicon-menu-right"></span></p>
         <p className="trackPlayButton">{ this.state.topTracks.track3Name }<span onClick={() => this.playNewTrack(this.state.topTracks.track3Id)} className="glyphicon glyphicon-menu-right"></span></p>
         <p className="trackPlayButton">{ this.state.topTracks.track4Name }<span onClick={() => this.playNewTrack(this.state.topTracks.track4Id)} className="glyphicon glyphicon-menu-right"></span></p>
         <p className="trackPlayButton">{ this.state.topTracks.track5Name }<span onClick={() => this.playNewTrack(this.state.topTracks.track5Id)} className="glyphicon glyphicon-menu-right"></span></p>


          </div>

          
        </div>
         
      </div>
      
    </div>
    );
  }
}


export default App;

