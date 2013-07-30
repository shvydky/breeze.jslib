!function ($) {
    /* AJAXMODALFORM CLASS DEFINITION
     * ========================= */

    var ajaxModalForm = function (element, options) {
        this.$element = $(element);
        this.options = options;
        this.init();
    }

    ajaxModalForm.prototype = {
        init: function () {
            var plugin = this;
            $.ajax({
                cache: false,
                url: plugin.options.url,
                data: plugin.options.data,
                success: function (data) {
                    plugin.$element.modal('show').empty().append(data);
                    plugin.$element.modal('show').on('hide', function () {
                        plugin.destroy();
                    });
                    var formOptions = {
                        success: function (data) {
                            if (data == "success") {
                                plugin.options.onSuccess.call(plugin);
                                plugin.$element.modal('hide').empty();
                            } else {
                                plugin.$element.empty().append();
                                $('form', plugin.$element).ajaxForm(formOptions);
                            }
                        }
                    };
                    $('form', plugin.$element).ajaxForm(formOptions);
                }
            });
        },

        destroy: function () {
            if (this.$element.data('ajaxModalForm') != null) {
                this.$element.data('ajaxModalForm', null);
                this.$element.modal('hide');
            }
        }
    }


    /* AJAXMODALFORM PLUGIN DEFINITION
     * ========================== */

    var old = $.fn.ajaxModalForm;

    $.fn.ajaxModalForm = function (option) {
        var args = Array.prototype.slice.call(arguments);
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('ajaxModalForm')
              , options = $.extend({}, $.fn.ajaxModalForm.defaults, typeof option == 'object' && option)
              , action = typeof option == 'string' ? option : null
            if (!data) $this.data('ajaxModalForm', (data = new ajaxModalForm(this, options)))
            if (action) data[action].apply(data, args.slice(1));
        });
    }

    $.fn.ajaxModalForm.defaults = {
        url: null,
        data: null,
        onSuccess: function (element) { }
    }

    $.fn.ajaxModalForm.Constructor = ajaxModalForm


    /* LAZYLOADER NO CONFLICT
     * ==================== */

    $.fn.ajaxModalForm.noConflict = function () {
        $.fn.ajaxModalForm = old
        return this
    }

}(window.jQuery);