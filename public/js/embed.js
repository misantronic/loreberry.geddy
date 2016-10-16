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
        status: '',
        newsletter: ''
    },

    _ui: {
        shares: 'js-shares',
        currentPrice: '.js-current-price',
        startPrice: '.js-start-price',
        minPrice: '.js-min-price',
        barProgress: '.js-bar-progress'
    },

    init: function () {
        $.when(
            this.loadTemplates(),
            this.getPrice()
        ).done(this._onLoaded.bind(this));

        console.log(this);
    },

    renderPrices: function () {
        var price = this._price;

        var p = Math.round((price.start_price - price.current_price) / (price.start_price - price.min_price) * 100);

        this._ui.shares.text(price.shares);
        this._ui.currentPrice.text(price.current_price + ' €');
        this._ui.startPrice.text(price.start_price + ' €');
        this._ui.minPrice.text(price.min_price + ' €');
        this._ui.barProgress.width(p + '%');
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

        return $.when(
            $.get('./tpl/status.ejs'),
            $.get('./tpl/newsletter.ejs')
        ).done(function (statusArr, newsletterArr) {
            this._templates.status = _.template(statusArr[0]);
            this._templates.newsletter = _.template(newsletterArr[0]);
        }.bind(this));
    },

    render: function () {
        var status = this._templates.status(this._price);
        var newsletter = this._templates.newsletter();

        var $wrapper = $('<div class="embed-wrapper"></div>');

        $wrapper.append(status + newsletter);

        this._config.$el.html($wrapper);

        _.each(this._ui, function (selector, name) {
            this._ui[name] = $(selector);
        }, this);

        this.renderPrices();
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
            .fail(this.polling.bind(this))
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