'use strict';

angular.module('streama.player').factory('playerService',
  function ($stateParams, $sce, $state, $rootScope, websocketService, apiService, $interval, $filter) {

    var videoData = null;
    var videoOptions;

    return {
      setVideoOptions: function (video) {

				console.log('%c video', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', video);
        return {
					videoSrc: _.get(video, 'files[0].src'),
					isExternalLink: true,
					videoMetaTitle: _.get(video, 'title'),
					episodeList: {
						1: [
							{id: 1, name: 'Pilot', season_number: 1, episode_number:1, episodeString: 's01e01', still_path: 'https://image.tmdb.org/t/p/original/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg', overview: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', videoDuration: 1320},
							{id: 2, name: 'The Cat\'s in the Bag', season_number: 1, episode_number:2, episodeString: 's01e02', still_path: 'https://image.tmdb.org/t/p/original/tjDNvbokPLtEnpFyFPyXMOd6Zr1.jpg', overview: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', videoDuration: 1320},
							{id: 3, name: '...and the Bag\'s in the River', season_number: 1, episode_number:3, episodeString: 's01e03', still_path: 'https://image.tmdb.org/t/p/original/2kBeBlxGqBOdWlKwzAxiwkfU5on.jpg', overview: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', videoDuration: 1320},
							{id: 3, name: '...and the Bag\'s in the River', season_number: 1, episode_number:3, episodeString: 's01e03', still_path: 'https://image.tmdb.org/t/p/original/2kBeBlxGqBOdWlKwzAxiwkfU5on.jpg', overview: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', videoDuration: 1320}
						]
					},
					showEpisodeBrowser: true,
					currentEpisode : {
						episode: 1,
						season: 1,
						id: 1
					},

					subtitles: [
						{"id": 1561, "src": "/example/sub-de.vtt", "subtitleLabel": "Deutsch", "subtitleSrcLang": "de", "contentType": "application/x-subrip"},
						{"id": 1562, "src": "/example/sub-en.vtt", "subtitleLabel": "English", "subtitleSrcLang": "en", "contentType": "application/x-subrip"}
					],

					currentSubtitle: 1562
				};


				videoOptions = {};
        videoData = video;
        videoOptions.videoSrc = $sce.trustAsResourceUrl(video.files[0].src || video.files[0].externalLink);
        videoOptions.videoType = video.files[0].contentType;

        if(video.subtitles && video.subtitles.length){
          videoOptions.videoTrack = $sce.trustAsResourceUrl(video.subtitles[0].src);
        }

        videoOptions.videoMetaTitle = (video.show ? video.show.name : video.title);
        videoOptions.videoMetaSubtitle = (video.show ? video.episodeString + ' - ' + video.name : (video.release_date ? video.release_date.substring(0, 4) : ''));
        videoOptions.videoMetaDescription = video.overview;

        if(videoData.nextEpisode){
          console.log('%c showNextButton', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
          videoOptions.showNextButton = true;
        }

        if(videoData.show){
          videoOptions.showEpisodeBrowser = true;

          apiService.tvShow.episodesForTvShow(videoData.show.id).success(function (episodes) {
            videoOptions.episodeList = _.groupBy(episodes, 'season_number');
            videoOptions.selectedEpisodes = videoOptions.episodeList[videoData.season_number];
            videoOptions.currentEpisode = {
              episode: videoData.episode_number,
              season: videoData.season_number,
              intro_start: videoData.intro_start,
              intro_end: videoData.intro_end,
              outro_start: videoData.outro_start
            };
          });
        }

        if($stateParams.currentTime){
          videoOptions.customStartingTime = $stateParams.currentTime;
        }
        else if(video.viewedStatus){
          videoOptions.customStartingTime = video.viewedStatus.currentPlayTime;
        }else{
          videoOptions.customStartingTime = 0;
        }

        videoOptions.onPlay = this.onVideoPlay.bind(videoOptions);
        videoOptions.onPause = this.onVideoPause.bind(videoOptions);
        videoOptions.onError = this.onVideoError.bind(videoOptions);
        videoOptions.onTimeChange = this.onVideoTimeChange.bind(videoOptions);
        videoOptions.onClose = this.onVideoClose.bind(videoOptions);
        videoOptions.onNext = this.onNext.bind(videoOptions);
        videoOptions.onVideoClick = this.onVideoClick.bind(videoOptions);
        videoOptions.onSocketSessionCreate = this.onSocketSessionCreate.bind(videoOptions);

        return videoOptions;
      },

      viewingStatusSaveInterval: null,

      onVideoPlay: function (videoElement, socketData) {
        var that = this;
        console.log('%c onVideoPlay', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');

        that.viewingStatusSaveInterval = $interval(function() {
          var params = {videoId: videoData.id, currentTime: videoElement.currentTime, runtime: videoElement.duration};

          if(params.runtime && params.videoId){
            apiService.viewingStatus.save(params);
          }
        }, 5000);


        if($stateParams.sessionId && !socketData){
          console.log('%c send socket event PLAY', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
          apiService.websocket.triggerPlayerAction({socketSessionId: $stateParams.sessionId, playerAction: 'play', currentPlayerTime: videoElement.currentTime});
        }
      },

      onVideoPause: function (videoElement, socketData) {
        console.log('%c onVideoPause', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', socketData);
        var that = this;
        $interval.cancel(that.viewingStatusSaveInterval);

        if($stateParams.sessionId && socketData){
          if(videoElement.currentTime+1.5 > socketData.currentPlayerTime || videoElement.currentTime-1.5 < socketData.currentPlayerTime){
            videoElement.currentTime = socketData.currentPlayerTime;
          }
        }


        if($stateParams.sessionId && !socketData){
          console.log('%c send socket event PAUSE', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
          apiService.websocket.triggerPlayerAction({socketSessionId: $stateParams.sessionId, playerAction: 'pause', currentPlayerTime: videoElement.currentTime});
        }
      },

      onVideoClose: function () {
        console.log('%c onVideoClose', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
        var that = this;
        $state.go('dash', {});
      },

      onVideoError: function (errorCode) {
        var that = this;
				errorCode = errorCode || 'CODEC_PROBLEM';
        console.log('%c onVideoError', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');

        if($state.current.name == 'player'){
          alertify.alert($filter('translate')('MESSAGES.' + errorCode), function () {
						$state.go('main.dash', {})
          });
        }
      },

      onVideoTimeChange: function (slider, duration) {
        var params = {videoId: videoData.id, currentTime: slider.value, runtime: duration};
        apiService.viewingStatus.save(params);


        if($stateParams.sessionId){
          apiService.websocket.triggerPlayerAction({socketSessionId: $stateParams.sessionId, playerAction: 'timeChange', currentPlayerTime: slider.value});
        }
      },

      onSocketSessionCreate: function () {
        alertify.set({ buttonReverse: true, labels: {ok: "OK", cancel : "Cancel"}});
        alertify.confirm($filter('translate')('MESSAGES.SHARE_SOCKET'), function (confirmed) {
          if(confirmed){
            $stateParams.sessionId = websocketService.getUUID();
            $state.go($state.current, $stateParams, {reload: true});
          }
        });
      },

      handleMissingFileError: function (video) {
        var hasError = false;

        if(!video.files || !video.files.length){
          hasError = true;
          alertify.alert($filter('translate')('MESSAGES.FILE_MISSING'), function () {
						$state.go('main.dash', {})
          });
        }

        return hasError;
      },

      handleWrongBasepathError: function (video) {
        var hasError = false;
        var videoSource = _.get(video, 'files[0].src');
        var externalLink = _.get(video, 'files[0].externalLink');
        var basePath = apiService.getBasePath();

        if(videoSource && videoSource.indexOf(basePath) == -1 && !externalLink){
          hasError = true;
          alertify.alert($filter('translate')('MESSAGES.WRONG_BASEPATH', {basePath: basePath}), function () {
						$state.go('main.dash', {})
          });
        }
        return hasError;
      },

      registerSocketListener: function () {
        if($stateParams.sessionId){
          websocketService.registerPlayerSessonListener($stateParams.sessionId);
        }
      },

      destroyPlayer: function () {
        console.log('%c $stateChangeSuccess', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
        var that = this;
        $interval.cancel(that.viewingStatusSaveInterval);
        websocketService.unsubscribe();
      },

      handleSocketEvent: function (data) {
        if(data.browserSocketUUID != websocketService.browserSocketUUID){
          console.log('%c handleSocketEvent', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
          switch (data.playerAction){
            case 'play':
              $rootScope.$broadcast('triggerVideoPlay', data);
              break;
            case 'pause':
              $rootScope.$broadcast('triggerVideoPause', data);
              break;
            case 'timeChange':
              $rootScope.$broadcast('triggerVideoTimeChange', data);
              break;
          }
        }
      },


      onNext: function () {
        $state.go('player', {videoId: videoData.nextEpisode.id});
      },


      onVideoClick: function () {
        if($rootScope.currentUser.pauseVideoOnClick){
          $rootScope.$broadcast('triggerVideoToggle');
        }
      }
    };
});
