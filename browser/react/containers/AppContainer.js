import React, { Component } from 'react';
import axios from 'axios';

import initialState from '../initialState';
import AUDIO from '../audio';

import Albums from '../components/Albums.js';
import Album from '../components/Album';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';

import Artist from '../components/Artist';

import { convertAlbum, convertAlbums, skip, convertSong } from '../utils';

import { Route, Switch, Redirect } from 'react-router-dom';
import Artists from '../components/Artists';
import NotFound from '../components/NotFound';

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = initialState;

    this.toggle = this.toggle.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.deselectAlbum = this.deselectAlbum.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
    this.selectArtistAlbums = this.selectArtistAlbums.bind(this);
    this.selectArtistSongs = this.selectArtistSongs.bind(this);
  }

  componentDidMount () {
    axios.get('/api/albums/')
      .then(res => res.data)
      .then(album => this.onLoad(convertAlbums(album)));

    axios.get('/api/artists')
    .then(res=>res.data)
    .then(artists => this.setState({ artists }))

    AUDIO.addEventListener('ended', () =>
      this.next());
    AUDIO.addEventListener('timeupdate', () =>
      this.setProgress(AUDIO.currentTime / AUDIO.duration));
  }

  onLoad (albums) {
    this.setState({
      albums: albums
    });
  }

  play () {
    AUDIO.play();
    this.setState({ isPlaying: true });
  }

  pause () {
    AUDIO.pause();
    this.setState({ isPlaying: false });
  }

  load (currentSong, currentSongList) {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();
    this.setState({
      currentSong: currentSong,
      currentSongList: currentSongList
    });
  }

  startSong (song, list) {
    console.log('...in startSong', song, list)
    this.pause();
    this.load(song, list);
    this.play();
  }

  toggleOne (selectedSong, selectedSongList) {
    console.log('...in toggleOne', selectedSong, selectedSongList)
    if (selectedSong.id !== this.state.currentSong.id)
      this.startSong(selectedSong, selectedSongList);
    else this.toggle();
  }

  toggle () {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  next () {
    this.startSong(...skip(1, this.state));
  }

  prev () {
    this.startSong(...skip(-1, this.state));
  }

  setProgress (progress) {
    this.setState({ progress: progress });
  }

  selectAlbum (albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(album => this.setState({
        selectedAlbum: convertAlbum(album)
      }));
  }

  selectArtist (artistId) {
    axios.get(`/api/artists/${artistId}`)
      .then(res => res.data)
      .then(artist => {
        this.setState({ selectedArtist: artist })
        // console.log('artist axios')
      });
  }

  selectArtistAlbums (artistId) {
    axios.get(`/api/artists/${artistId}/albums`)
      .then(res => res.data)
      .then(albums => {
        this.setState( { artistsAlbums: convertAlbums(albums) });
        // console.log('artist albums axios')
      });
  }

  selectArtistSongs (artistId) {
    axios.get(`/api/artists/${artistId}/songs`)
      .then(res => res.data)
      .then(selectedArtistSongs => {
        selectedArtistSongs = selectedArtistSongs.map( convertSong );
        this.setState({ selectedArtistSongs })
        // console.log('select Artists Songs axios',selectedArtistSongs)
      });
  }

  deselectAlbum () {
    this.setState({ selectedAlbum: {}});
  }

  render () {

    return (
      <div id="main" className="container-fluid">
        <div className="col-xs-2">
          <Sidebar deselectAlbum={this.deselectAlbum} />
        </div>
        <div className="col-xs-10">
          <Switch>
          <Route exact path="/" render={ () => (
            this.state.albums.length ? <Albums albums={ this.state.albums } /> : null
          )} />

          <Route exact path="/albums" render={ (router) => (
            this.state.albums.length ? <Albums albums={ this.state.albums } router={ router } /> : null
          )} />

          <Route exact path="/albums/:albumId" render={ ( router ) => (
            router.match ? <Album selectAlbum={ this.selectAlbum }
            album={ this.state.selectedAlbum }
            toggle = { this.toggleOne }
            currentSong ={ this.state.currentSong }
            router={ router }/> : null
          )} />

          <Route exact path="/artists" render={() => (
              <Artists artists={ this.state.artists }/>
           )} />


          <Route path="/artists/:artistId" render={ ( router ) => (
              <Artist
              albums={ this.state.artistsAlbums }
              router={router}
              selectArtist={ this.selectArtist }
              selectArtistAlbums={ this.selectArtistAlbums }
              selectArtistSongs={ this.selectArtistSongs}
              toggleOne = { this.toggleOne }
              selectedArtist={ this.state.selectedArtist }
              selectedArtistSongs={ this.state.selectedArtistSongs }
              currentSong={ this.state.currentSong }
              isPlaying= { this.state.isPlaying }/>
          )} />

          <Route component={ NotFound }/>
          </Switch>
        </div>
        <Player
          currentSong={this.state.currentSong}
          currentSongList={this.state.currentSongList}
          isPlaying={this.state.isPlaying}
          progress={this.state.progress}
          next={this.next}
          prev={this.prev}
          toggle={this.toggle}
        />
      </div>
    );
  }
}
