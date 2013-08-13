!function ($) {
    /* LAZYLOADER CLASS DEFINITION
     * ========================= */

    var lazyLoader = function (element, options) {
        this.$element = $(element);
        this.$container = options.dataContainer == null ? this.$element : this.$element.find(options.dataContainer);
        this.$loading = this.$element.find(options.loadingSelector);
        this.$loadMore = this.$element.find(options.loadMoreSelector);
        this.options = options;
        this.active = false;
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
            $(this.options.dataSelector, this.$element).remove();
            $(this.options.loadingSelector, this.$element).show();
            this.more(count);
        },
        more: function (count) {
            var plugin = this;
            if (typeof count == 'undefined')
                count = this.options.count;
            if (!plugin.active) {
                plugin.active = true;
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
                        var totalCount = xhr.getResponseHeader(plugin.options.totalHeader);
                        if (totalCount != plugin.totalCount) {
                            plugin.totalCount = totalCount;
                            if (plugin.options.onTotalCountChanged != null)
                                plugin.options.onTotalCountChanged.call(plugin, plugin.$element, totalCount);
                        }
                        
                        if (plugin.totalCount <= $(plugin.options.dataSelector, plugin.$element).length)
                            plugin.$loading.hide();
                        var force = false;
                        if (plugin.options.onAdded != null)
                            force = plugin.options.onAdded.call(plugin, plugin.$element, plugin.$container, data, xhr);
                        plugin.active = false;
                        if (force || plugin.needMore()) plugin.more(count);
                    }
                });
            }
        },
        setOption: function (name, value) {
            var plugin = this;
            plugin.options[name] = value;
        },
        needMore: function () {
            var marker = this.$loading;
            return marker.is(':visible') && $(window).scrollTop() + $(window).height() > marker.offset().top;
                //&& (this.options.autoLoadCount <=0 || this.options.autoLoadCount > $(this.options.dataSelector, this.$element).length);
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
        dataContainer: null,
        loadingSelector: '.loading',
        loadMoreSelector: '.load-more',
        dataSelector: '.data-container .data-record',
        count: 10,
        autoLoadCount: 0,
        totalHeader: 'X-Total-Count',
        url: null,
        method: 'post',
        data: {},
        onLoaded: function (element, container, data, xhr) { },
        onAdded: function (element, container, data, xhr) { return false; },
        onTotalCountChanged: function (element, count) { }
    }

    $.fn.lazyLoader.Constructor = lazyLoader


    /* LAZYLOADER NO CONFLICT
     * ==================== */

    $.fn.lazyLoader.noConflict = function () {
        $.fn.lazyLoader = old
        return this
    }

}(window.jQuery);
