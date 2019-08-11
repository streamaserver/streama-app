'use strict';

angular.module('streama.player').factory('playerService',
  function ($stateParams, $sce, $state, $rootScope, websocketService, apiService, $interval, $filter, $ionicHistory) {

    var videoData = null;
    var videoOptions;

    return {
      viewingStatusSaveInterval: null,
      setVideoOptions: setVideoOptions,
      onVideoPlay: onVideoPlay,
      onScrub: onScrub,
      onVideoPause: onVideoPause,
      onVideoClose: onVideoClose,
      onVideoError: onVideoError,
      onVideoTimeChange: onVideoTimeChange,
      onSocketSessionCreate: onSocketSessionCreate,
      handleMissingFileError: handleMissingFileError,
      handleWrongBasepathError: handleWrongBasepathError,
      registerSocketListener: registerSocketListener,
      destroyPlayer: destroyPlayer,
      handleSocketEvent: handleSocketEvent,
      onNext: onNext,
      onVideoClick: onVideoClick,
      onEpisodeChange: onEpisodeChange
    };

    /**
     *
     * @param video
     * @returns {{}}
     */
    function setVideoOptions(video, episodes) {

      var videoOptions = {};
      var videoSrc = _.get(video.defaultVideoFile, 'src') || _.get(video.defaultVideoFile, 'externalLink') || _.get(video, 'files[0].src');
      if(_.startsWith(videoSrc, '/')){
        videoOptions.videoSrc = $rootScope.serverBasePath + videoSrc;
      }else{
        videoOptions.videoSrc = videoSrc;
      }
      videoOptions.selectedVideoFile = video.defaultVideoFile || _.get(video, 'files[0]');
      videoOptions.isExternalLink = true;
      videoOptions.videoStillImage = _.get(video, 'still_path') || _.get(video, 'backdrop_path');
      videoOptions.videoMetaTitle = _.get(video, 'title') || _.get(video, 'episodeString') + ' ' + _.get(video, 'name');
      videoOptions.episodeList = _.groupBy(episodes, 'season_number');
      videoOptions.hasNextEpisode = _.get(video, 'nextEpisode');

      videoOptions.nextVideo = video.nextEpisode || video.nextVideo;
      videoOptions.isAutoplayNextActive = !!video.nextEpisode;

      if(videoOptions.nextVideo){
        videoOptions.showNextButton = true;
      }

      videoOptions.showEpisodeBrowser = episodes ? true : false;
      videoOptions.currentEpisode = {
        episode: video.episode_number,
        season: video.season_number,
        id: video.id
      };

      videoOptions.subtitles = _.map(video.subtitles, function (subtitle) {
        if(_.startsWith(subtitle.src, '/')){
          subtitle.src = $rootScope.serverBasePath + subtitle.src;
        }
        return subtitle;
      });

      videoOptions.videoFiles = _.map(video.videoFiles, function (videoFile) {
        if(_.startsWith(videoFile.src, '/')){
          videoFile.src = $rootScope.serverBasePath + videoFile.src;
        }
        return videoFile;
      });
      videoOptions.currentSubtitle = _.get(video, 'subtitles[0].id');
      videoOptions.onPlay = this.onVideoPlay.bind(videoOptions);
      videoOptions.onError = this.onVideoError.bind(videoOptions);


      console.log('%c videoOptions', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;', videoOptions);
      videoData = video;

      videoOptions.onPlay = this.onVideoPlay.bind(videoOptions);
      videoOptions.onPause = this.onVideoPause.bind(videoOptions);
      videoOptions.onError = this.onVideoError.bind(videoOptions);
      videoOptions.onTimeChange = this.onVideoTimeChange.bind(videoOptions);
      videoOptions.onClose = this.onVideoClose.bind(videoOptions);
      videoOptions.onNext = this.onNext.bind(videoOptions);
      videoOptions.onVideoClick = this.onVideoClick.bind(videoOptions);
      videoOptions.onSocketSessionCreate = this.onSocketSessionCreate.bind(videoOptions);
      videoOptions.onEpisodeChange = this.onEpisodeChange.bind(videoOptions);
      videoOptions.onScrub = this.onScrub.bind(videoOptions);


      if($stateParams.currentTime){
        videoOptions.customStartingTime = $stateParams.currentTime;
      }
      else if(video.viewedStatus){
        videoOptions.customStartingTime = video.viewedStatus.currentPlayTime;
      }else{
        videoOptions.customStartingTime = 0;
      }



      return videoOptions;
    }


    /**
     *
     * @param videoElement
     * @param socketData
     */
    function onVideoPlay(videoElement, socketData) {
      var that = this;
      // console.log('%c onVideoPlay', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');

      saveViewingStatus(that, videoElement);

      that.viewingStatusSaveInterval = $interval(function () {
        saveViewingStatus(videoOptions, videoElement);
      }, 5000);

      if($stateParams.sessionId && !socketData){
        console.log('%c send socket event PLAY', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
        apiService.websocket.triggerPlayerAction({socketSessionId: $stateParams.sessionId, playerAction: 'play', currentPlayerTime: videoElement.currentTime});
      }
    }

    function onScrub(videoElement, socketData) {
      saveViewingStatus(this, videoElement);

      //TODO update socket info
    }


    function saveViewingStatus(videoOptions, videoElement) {
      var params = {videoId: videoData.id, currentTime: videoElement.currentTime, runtime: videoElement.duration};
      if (params.runtime && params.videoId) {
        apiService.player.updateViewingStatus(params);
      }
    }

    /**
     *
     * @param videoElement
     * @param socketData
     */
    function onVideoPause(videoElement, socketData) {
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
    }

    /**
     *
     */
    function onVideoClose() {
      $state.go('main.dash');
    }


    /**
     *
     * @param errorCode
     */
    function onVideoError(errorCode) {
      var that = this;
      errorCode = errorCode || 'CODEC_PROBLEM';
      console.log('%c onVideoError', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');

      if($state.current.name == 'player'){
        alertify.alert($filter('translate')('MESSAGES.' + errorCode), function () {
          $state.go('main.dash', {})
        });
      }
    }


    /**
     *
     * @param slider
     * @param duration
     */
    function onVideoTimeChange(slider, duration) {
      var params = {videoId: videoData.id, currentTime: slider.value, runtime: duration};
      apiService.player.updateViewingStatus(params);


      if($stateParams.sessionId){
        apiService.websocket.triggerPlayerAction({socketSessionId: $stateParams.sessionId, playerAction: 'timeChange', currentPlayerTime: slider.value});
      }
    }


    /**
     *
     */
    function onSocketSessionCreate() {
      alertify.set({ buttonReverse: true, labels: {ok: "OK", cancel : "Cancel"}});
      alertify.confirm($filter('translate')('MESSAGES.SHARE_SOCKET'), function (confirmed) {
        if(confirmed){
          $stateParams.sessionId = websocketService.getUUID();
          $state.go($state.current, $stateParams, {reload: true});
        }
      });
    }


    /**
     *
     * @param video
     * @returns {boolean}
     */
    function handleMissingFileError(video) {
      var hasError = false;

      if(!video.files || !video.files.length){
        hasError = true;
        alertify.alert($filter('translate')('MESSAGES.FILE_MISSING'), function () {
          $state.go('main.dash', {})
        });
      }

      return hasError;
    }


    /**
     *
     * @param video
     * @returns {boolean}
     */
    function handleWrongBasepathError(video) {
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
    }


    /**
     *
     */
    function destroyPlayer() {
      console.log('%c $stateChangeSuccess', 'color: deeppink; font-weight: bold; text-shadow: 0 0 5px deeppink;');
      var that = this;
      $interval.cancel(that.viewingStatusSaveInterval);
      websocketService.unsubscribe();
    }


    /**
     *
     * @param data
     */
    function handleSocketEvent(data) {
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
    }


    /**
     *
     */
    function registerSocketListener() {
      if($stateParams.sessionId){
        websocketService.registerPlayerSessonListener($stateParams.sessionId);
      }
    }


    /**
     *
     */
    function onNext() {
      $state.go('player', {videoId: videoData.nextEpisode.id});
    }

    /**
     *
     */
    function onVideoClick() {
      // if($rootScope.currentUser.pauseVideoOnClick){
      //   $rootScope.$broadcast('triggerVideoToggle');
      // }
    }

    function onEpisodeChange(episode) {
      $state.go('player', {videoId: episode.id});
    }
});
