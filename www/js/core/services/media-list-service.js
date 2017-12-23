(function () {
  'use strict';

  angular.module('streama.core')
    .factory('mediaListService', function ($rootScope) {
      var LIST_MAX = 30;

      return {
        initSwiperOptions: initSwiperOptions,
        init: initMediaList
      };


      function initMediaList(endpoint, defaultSort, defaultFilter) {
        var mediaListConfig = {
          total: 0,
          currentSort: defaultSort || {sort: 'title', order: 'ASC'},
          list: [],
          currentOffset: 0,
          isLoading: true,
          sorter: _.getterSetter(setSort, getSort),
          filter: defaultFilter || {
            tags: null,
            genre: null,
            title: null
          },
          fetch: endpoint,
          search: search,
          loadMore: loadMore,
          getThumbnail: getThumbnail
        };

        fetchData(mediaListConfig);

        return mediaListConfig;


        function search() {
          fetchData(mediaListConfig);
        }

        function getSort() {
          return mediaListConfig.currentSort;
        }

        function setSort(sort) {
          mediaListConfig.currentSort = sort;
          mediaListConfig.currentOffset = 0;
          fetchData(mediaListConfig);
        }

        function loadMore() {
          mediaListConfig.currentOffset += LIST_MAX;
          fetchData(mediaListConfig);
        }


        function getThumbnail(movie) {
          if (!movie.poster_path && !movie.poster_image_src) {
            return 'img/poster-not-found.png';
          }
          if (movie.poster_path) {
            return 'https://image.tmdb.org/t/p/w300/' + movie.poster_path;
          }

          if (movie.poster_image_src) {
            return movie.poster_image_src;
          }

        }
      }


      function initSwiperOptions() {
        return {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          paginationClickable: true,
          spaceBetween: 8,
          freeMode: true
        };
      }

      function fetchData(mediaConfig) {
        var params = {
          max: LIST_MAX,
          offset: mediaConfig.currentOffset,
          sort: mediaConfig.currentSort.sort,
          order: mediaConfig.currentSort.order
        };
        angular.extend(params, mediaConfig.filter);

        mediaConfig.fetch(params).success(function (response) {
          if(!$rootScope.serverVersion){ //fallback for older than 1.4.1
            response = {
              total: response.length,
              list: response
            };
          }
          mediaConfig.total = response.total;
          if (mediaConfig.currentOffset > 0) {
            mediaConfig.list = _.unionBy(mediaConfig.list, response.list, 'id');
          } else {
            mediaConfig.list = response.list;
          }
          mediaConfig.isLoading = false;
        });
      }

    });
}());
