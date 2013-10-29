"use strict";

(function ($) {
    var timeUpdater = function (container, options) {
        this.timer = null;
        this.$items = null;
        this.$container = container;
        this.options = options;
        this.init();
    }

    timeUpdater.prototype = {
        init: function () {
            var _self = this;
            this.$items = $('.time-update', this.$container);
            this.timer = setInterval(function () {
                _self.doUpdate.call(_self);
            }, this.options.timeout);
        },

        update: function (element) {
            this.$items = $('.time-update', this.$container);
            this.doUpdate();
        },

        remove: function () {
            clearInterval(this.timer);
            this.$items = null;
        },

        doUpdate: function () {
            var _self = this;
            return this.$items.each(function (i) {
                var item = $(this);
                var date = item.data("time");
                if (!date) {
                    date = item.html();
                    item.data("time", date);
                }
                item.text(_self.processTime(date));
            });
        },

        now: function () {
            return this.options.words[this.options.lang][0];
        },

        ago: function () {
            return this.options.words[this.options.lang][1];
        },

        getWordForm: function (amount) {
            if (this.options.lang == "en") {
                return (amount == 1) ? 0 : 1;
            }            
            var last = amount % 10;
            var preLast = Math.floor(amount / 10) % 10;
            var lastTwo = amount % 100;
            if (last == 1 && preLast != 1)
                return 0
            else if ((last >= 5 || last == 0) || (lastTwo >= 5 && lastTwo <= 20))
                return 1;
            return 2;
        },

        translate: function (amount, value) {
            var ind = null;
            if (value == "days")
                ind = 2
            else if (value == "hours")
                ind = 3;
            else if (value == "minutes")
                ind = 4;
            else if (values == "seconds")
                ind = 5;
            return this.options.words[this.options.lang][ind][this.getWordForm(amount)];
        },

        processTime: function (time) {
            var ans = null;
            var delta = (Date.now() - Date.parse(time)) / 1000;
            if (delta < 60)
                ans = this.formatRightNow(delta);
            else if (delta < 60 * 60)
                ans = this.formatMinutes(Math.round(delta / 60));
            else if (delta < 24 * 60 * 60)
                ans = this.formatHours(Math.round(delta / 3600), Math.round(delta / 60) % 60)
            else if (delta < 14 * 24 * 60 * 60)
                ans = this.formatDays(Math.round(delta / (24 * 60 * 60)));
            else
                ans = this.formatDate(new Date(time));
            return ans;
        },

        formatRightNow: function (amount) {
            return this.now();
        },

        formatMinutes: function (minutes) {
            return minutes + " " + this.translate(minutes, "minutes") + " " + this.ago();
        },

       formatHours: function (hours, minutes) {
            return hours + " " + this.translate(hours, "hours") + ((minutes > 0) ? (" " + minutes + " " + this.translate(minutes, "minutes")) : ("")) + " " + this.ago();
       },

       formatDays: function (amount) {
           return amount + " " + this.translate(amount, "days") + " " + this.ago();
       },

       formatDate: function (date) {
            return date.toLocaleString();
       }        
    }
    /*
       TimeUpdater PLUGIN DEFINITION
   */
    $.fn.timeUpdater = function (option) {
        var args = Array.prototype.slice.call(arguments);
        return this.each(function () {
            var $this = $(this),
                data = $this.data('timeUpdater'),
                options = $.extend({}, $.fn.timeUpdater.defaults, typeof option == 'object' && option),
                action = typeof option == 'string' ? option : null;
            if (!data) $this.data('timeUpdater', (data = new timeUpdater(this, options)));
            if (action) data[action].call(data, this, args.slice(1));
        });
    };

    $.fn.timeUpdater.defaults = {
        words: {
            "uk": ["щойно", "тому", ["день", "днів", "дні"], ["годину", "годин", "години"], ["хвилину", "хвилин", "хвилини"], ["секунду", "секунд", "секунди"]],
            "ru": ["только что", "назад", ["день", "дней", "дня"], ["час", "часов", "часа"], ["минуту", "минут", "минуты"], ["секунду", "секунд", "секунды"]],
            "en": ["just now", "ago", ["day", "days"], ["hour", "hours"], ["minute", "minutes"], ["second", "seconds"]]
        },
        lang: "uk",
        timeout: 30000
    };
}(jQuery))