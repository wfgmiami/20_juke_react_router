import React, {Component} from 'react';
import axios from 'axios';
import Albums from './Albums';
import Songs from './Songs';
import { Link } from 'react-router-dom';

class Artist extends Component{

  componentDidMount () {
      const artistId = this.props.router.match.params.artistId;
      const selectArtist = this.props.selectArtist;
      const selectArtistAlbums = this.props.selectArtistAlbums;
      const selectArtistSongs = this.props.selectArtistSongs;

      selectArtist(artistId);
      selectArtistAlbums(artistId);
      selectArtistSongs(artistId);
  }

  render(){

    const currentSong = this.props.currentSong;
    const isPlaying = this.props.isPlaying;
    const selectedArtistSongs = this.props.selectedArtistSongs;
    const toggleOne = this.props.toggleOne;
    const artistId = this.props.router.match.params.artistId;
    // console.log('...artist',this.props);

    return(
      <div>
        <h3>{ this.props.selectedArtist.name }</h3>
        <div>
          <ul className="nav nav-tabs">
            <li><Link to={ `/artists/${artistId}/albums`}>ALBUMS</Link></li>
            <li><Link to={ `/artists/${artistId}/songs`}>SONGS</Link></li>
          </ul>
        </div>

        { this.props.router ? ( this.props.router.location.pathname === `/artists/${artistId}/albums` ?  <Albums albums = { this.props.albums } /> : null )
         : null }

         { this.props.router ? ( this.props.router.location.pathname === `/artists/${artistId}/songs` ?  <Songs
          currentSong={ currentSong }
          toggleOne={ toggleOne }
          isPlaying={ isPlaying }
          songs={ selectedArtistSongs } /> : null )
         : null }



      </div>
    )
  }
}

export default Artist;



