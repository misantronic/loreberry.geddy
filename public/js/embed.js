function Embed(config) {
    this._config = config;

    if (this._config.el) {
        this._config.$el = $(this._config.el);
    }
}

Embed.prototype = {
    _config: {
        id: Number,
        api: String
    },

    _price: null,
    _templates: {
        status: null,
        newsletter: null
    },

    _ui: {
        shares: '.js-shares',
        currentPrice: '.js-current-price',
        startPrice: '.js-start-price',
        minPrice: '.js-min-price',
        barProgress: '.js-bar-progress',
        newsletter: '.js-newsletter',
        form: '.js-form',
        textError: '.js-text-error'
    },

    init: function () {
        $.when(
            this.loadTemplates(),
            this.getPrice()
        ).done(this._onLoaded.bind(this));

        console.log(this);

        return this;
    },

    getPrice: function (id) {
        if (!id) {
            id = this._config.id;
        }

        return $.get(this._config.api + '/price/' + id)
            .then(function (price) {
                this._price = price;

                return price;
            }.bind(this));
    },

    loadTemplates: function () {
        this._templates = {};

        const parseTemplate = function (key, arr, context) {
            this._templates[key] = _.template(arr[0]);
            this._templates[key].context = context;
        }.bind(this);

        return $.when(
            $.get('./tpl/status.ejs'),
            $.get('./tpl/newsletter.ejs')
        ).done(function (statusArr, newsletterArr) {
            parseTemplate('status', statusArr, '_price');
            parseTemplate('newsletter', newsletterArr);
        }.bind(this));
    },

    render: function () {
        var $wrapper = $('<div class="embed-wrapper"></div>');

        // Render templates
        var rendered = _.map(this._templates, function (template) {
            const context = this[template.context] || {};

            return template(context);
        }, this);

        $wrapper.append(rendered);

        this._config.$el.html($wrapper);

        // Create UI
        _.each(this._ui, function (selector, name) {
            this._ui[name] = $(selector);
        }, this);

        // Bind data
        this.renderPrices();

        _.defer(function () {
            // Show wrapper
            $wrapper.addClass('is-show')
        }.bind(this));

        // Initialize form
        this.initForm();
    },

    renderPrices: function () {
        var price = this._price;

        var p = Math.round((price.start_price - price.current_price) / (price.start_price - price.min_price) * 100);

        this._ui.shares.text(price.shares);
        this._ui.startPrice.text(price.start_price + ' €');
        this._ui.minPrice.text(price.min_price + ' €');
        this._ui.currentPrice.text(price.current_price + ' €');

        _.delay(function () {
            this._ui.barProgress.width(p + '%');
        }.bind(this), 750);
    },

    initForm: function () {
        this._ui.form
            .off('submit')
            .on('submit', function () {
                this._ui.newsletter
                    .removeClass('is-error is-success')
                    .addClass('is-loading');

                $.post(this._config.api + '/subscribe', this._ui.form.serializeArray())
                    .done(function (res) {
                        if (res.success) {
                            this._ui.newsletter.addClass('is-success');
                        }
                    }.bind(this))
                    .fail(function (xhr) {
                        var res = xhr.responseJSON || {};

                        this._ui.textError.text('');

                        if (res.error) {
                            this._ui.textError.text(res.error);
                            this._ui.newsletter.addClass('is-error');
                        }
                    }.bind(this))
                    .always(function () {
                        this._ui.newsletter.removeClass('is-loading');
                    }.bind(this));

                return false;
            }.bind(this));
    },

    polling: function () {
        return $.get(this._config.api + '/polling')
            .done(function (response) {
                if (response.event === 'updatePrice') {
                    this._price = response.data;

                    // Update properties
                    this.renderPrices();
                }
            }.bind(this))
            .always(this.polling.bind(this))
    },

    _onLoaded: function () {
        this.render();
        this.polling();
    }
};

function onInit() {
    var embed = new Embed(window.EmbedConfig || {});

    embed.init();
}

$(document).ready(onInit);