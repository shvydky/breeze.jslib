!function ($) {
    /* LAZYLOADER CLASS DEFINITION
     * ========================= */

    var lazyLoader = function (element, options) {
        this.$element = $(element);
        this.$container = this.$element.find(options.dataContainer);
        this.$loading = this.$element.find(options.loadingSelector);
        this.$loadMore = this.$element.find(options.loadMoreSelector);
        this.options = options;
        this.init();
    }

    lazyLoader.prototype = {
        init: function () {
            var plugin = this;
            if (this.$container.length == null) throw "Data container was not found";
            if (this.options.url == null || this.options.url == '')
                this.options.url = this.$element.data('url');
            $(window).on('resize scroll', function () {
                if (plugin.needMore()) plugin.more();
            }).resize();
        },
        reload: function (count) {
            if (typeof count == 'undefined')
                count = this.options.count;
            this.$container.empty();
            this.more(count);
        },
        more: function (count) {
            var plugin = this;
            if (typeof count == 'undefined')
                count = this.options.count;
            $.ajax({
                url: this.options.url,
                data: $.extend({}, this.options.data, {
                    start: $(plugin.options.dataSelector, plugin.$element).length,
                    count: count
                }),
                type: this.options.method,
                success: function (data, status, xhr) {
                    if (plugin.options.onLoaded != null) plugin.options.onLoaded.call(plugin, plugin.$element, plugin.$container, data, xhr);
                    plugin.$container.append(data);
                    plugin.totalCount = xhr.getResponseHeader(plugin.options.totalHeader);
                    if (plugin.totalCount == $(plugin.options.dataSelector, plugin.$element).length)
                        plugin.$loading.hide();
                    if (plugin.options.onAdded != null) plugin.options.onAdded.call(plugin, plugin.$element, plugin.$container, data, xhr);
                    if (plugin.needMore()) plugin.more(count);
                }
            });
        },
        setOption: function (name, value) {
            throw "NOT IMPLEMENTED";
        },
        needMore: function () {
            var marker = this.$loading;
            return marker.is(':visible') && $(window).scrollTop() + $(window).height() > marker.offset().top;
        }

    }


    /* LAZYLOADER PLUGIN DEFINITION
     * ========================== */

    var old = $.fn.lazyLoader;

    $.fn.lazyLoader = function (option) {
        var args = Array.prototype.slice.call(arguments);
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('lazyLoader')
              , options = $.extend({}, $.fn.lazyLoader.defaults, typeof option == 'object' && option)
              , action = typeof option == 'string' ? option : null
            if (!data) $this.data('lazyLoader', (data = new lazyLoader(this, options)))
            if (action) data[action].apply(data, args.slice(1));
        });
    }

    $.fn.lazyLoader.defaults = {
        dataContainer: '.data-container',
        loadingSelector: '.loading',
        loadMoreSelector: '.load-more',
        dataSelector: '.data-container .data-record',
        count: 10,
        totalHeader: 'X-Total-Count',
        url: null,
        method: 'post',
        data: {},
        onLoaded: function (element, container, data, xhr) { },
        onAdded: function (element, container, data, xhr) { }
    }

    $.fn.lazyLoader.Constructor = lazyLoader


    /* LAZYLOADER NO CONFLICT
     * ==================== */

    $.fn.lazyLoader.noConflict = function () {
        $.fn.lazyLoader = old
        return this
    }

}(window.jQuery);