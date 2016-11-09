var $ = require('jquery');

require('../css/embed.scss');

var statusTemplate = require('../tpl/status.ejs');
var newsletterTemplate = require('../tpl/newsletter.ejs');

function Embed(config) {
    this._config = config;

    if (this._config.el) {
        this.$el = $(this._config.el);
    }

    if (this._config.baseUrl) {
        this._config.api = this._config.baseUrl + this._config.api;
    }
}

Embed.prototype = {
    _config: {
        id: Number,
        api: String,
        baseUrl: String,
        texts: {
            title: String,
            formHead: String,
            body: String
        },
        showForm: true
    },

    _price: null,
    _templates: {
        status: null,
        newsletter: null
    },
    _templateContext: {},

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

    $el: null,

    init: function () {
        this.initTemplates();

        this.getPrice().done(function () {
            this.render();
            this.polling();
        }.bind(this));

        console.log(this);

        return this;
    },

    getPrice: function (id) {
        if (!id) {
            id = this._config.id;
        }

        return $.get(this._config.api + '/price/' + id)
            .then(function (price) {
                this.setPrice(price);

                return price;
            }.bind(this));
    },

    setPrice: function (data) {
        var self = this;

        this._price = data;

        this._templateContext.texts = {};
        this._templateContext.texts.title = this._config.texts.title;
        this._templateContext.texts.body = this._config.texts.body.replace(/{(.*?)}/g, function (str, $1) {
            return self._price[$1];
        });
        this._templateContext.texts.formHead = this._config.texts.formHead;
    },

    initTemplates: function () {
        this._templates.status = statusTemplate;
        this._templates.status.context = '_templateContext';

        if (this._config.showForm) {
            this._templates.newsletter = newsletterTemplate;
            this._templates.newsletter.context = '_templateContext';
        }
    },

    render: function () {
        var $wrapper = $('<div class="embed-wrapper"></div>');
        var name;

        // Render templates
        var rendered = '';

        for (name in this._templates) {
            if (!this._templates.hasOwnProperty(name) || !this._templates[name]) continue;

            var template = this._templates[name];
            var context = this[template.context] || {};

            rendered += template(context);
        }

        $wrapper.append(rendered);

        this.$el.html($wrapper);

        // Create UI
        for (name in this._ui) {
            if (!this._ui.hasOwnProperty(name)) continue;

            var selector = this._ui[name];

            this._ui[name] = $(selector);
        }

        // Bind data
        this.renderPrices();

        setTimeout(function () {
            // Show wrapper
            $wrapper.addClass('is-show')
        }, 0);

        if (this._config.showForm) {
            // Initialize form
            this.initForm();
        }
    },

    renderPrices: function () {
        var price = this._price;

        var p = Math.round((price.start_price - price.current_price) / (price.start_price - price.min_price) * 100);

        this._ui.shares.text(price.shares);
        this._ui.startPrice.text(price.start_price);
        this._ui.minPrice.text(price.min_price);

        this._ui.currentPrice.text(price.start_price);

        setTimeout(function () {
            var d = price.start_price - price.current_price; // distance
            var t = 800; // duration
            var v = t / d; // velocity
            var delay = v;

            for (var current_price = price.start_price; current_price >= price.current_price; current_price--) {
                setTimeout(function (newPrice) {
                    this._ui.currentPrice.text(newPrice);
                }.bind(this), delay, current_price);

                delay += v;
            }

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
                            var text = 'Bei der Registrierung ist ein Fehler aufgetreten.';

                            if(res.code === 501) text = 'Bitte gib eine E-Mail Adresse an.';
                            if(res.code === 502) text = 'Du bist bereits für den Newsletter registriert.';

                            this._ui.textError.text(text);
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
                    this.setPrice(response.data);

                    // Update properties
                    this.renderPrices();
                }
            }.bind(this))
            .always(this.polling.bind(this))
    }
};

function onInit() {
    var embed = new Embed(window.EmbedConfig || {});

    embed.init();
}

$(document).ready(onInit);