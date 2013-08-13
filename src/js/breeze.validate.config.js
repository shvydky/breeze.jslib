$.validator.setDefaults({
    showErrors: function (errorMap, errorList) {
        $.each(this.successList, function (index, value) {
            $(value).next('span.field-validation-valid, span.field-validation-error').empty();
            return $(value).parents('.control-group').removeClass('error');
        });
        return $.each(errorList, function (index, value) {
            $(value.element).parents('.control-group').addClass('error');
            return $(value.element).next('span.field-validation-valid, span.field-validation-error')
                .addClass('field-validation-error').removeClass('field-validation-valid')
                .html(value.message);
        });
    }
});

// validation with popovers
//$.validator.setDefaults({
//    showErrors: function (errorMap, errorList) {
//        $.each(this.successList, function (index, value) {
//            return $(value).popover("hide");
//        });
//        return $.each(errorList, function (index, value) {
//            var _popover;
//            _popover = $(value.element).popover({
//                trigger: "manual",
//                placement: "right",
//                content: value.message,
//                template: "<div class=\"popover\"><div class=\"arrow\"></div><div class=\"popover-inner\"><div class=\"popover-content\"><p></p></div></div></div>"
//            });
//            _popover.data("popover").options.content = value.message;
//            return $(value.element).popover("show");
//        });
//    }
//});

bootbox.animate(false);
bootbox.setBtnClasses({
    CONFIRM: 'btn btn-primary',
    CANCEL: 'btn'
});

$(document).ready(function () {
    // turn on "error mode" for server-validated errors
    $('span.field-validation-error').each(function () {
        this.parents('.control-group').addClass('error');
    });

    // bootstrap radio button group processing
    $('div.btn-group').each(function () {
        var group = $(this);
        var form = group.parents('form').eq(0);
        var name = group.attr('data-toggle-name');
        if (name != null && name != '') {
            var hidden = $('input[name="' + name + '"]', form);
            $('button', group).each(function () {
                var button = $(this);
                button.click(function () {
                    hidden.val($(this).val());
                });
                if (hidden.val() != '' && button.val() == hidden.val()) {
                    button.addClass('active');
                }
            });
        }
    });

});