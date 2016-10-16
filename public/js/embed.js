function Embed(config) {
    this.config = config;

    if(this.config.el) {
        this.config.$el = $(this.config.el);
    }
}

Embed.prototype.config = {
    id: Number,
    api: String
};

Embed.prototype._price = null;
Embed.prototype._templates = {};

Embed.prototype.init = function () {
    $.when(
        this.loadTemplates(),
        this.getPrice()
    ).done(this._onLoaded.bind(this));

    console.log(this);
};

Embed.prototype.renderPrices = function () {
    var price = this._price;

    var p = Math.round((price.start_price - price.current_price) / (price.start_price - price.min_price) * 100);

    this.config.$el.find('.js-shares').text(price.shares);
    this.config.$el.find('.js-current-price').text(price.current_price +' €');
    this.config.$el.find('.js-start-price').text(price.start_price +' €');
    this.config.$el.find('.js-min-price').text(price.min_price +' €');
    this.config.$el.find('.js-bar-progress').width(p +'%');
};

Embed.prototype.getPrice = function (id) {
    if (!id) {
        id = this.config.id;
    }

    return $.get(this.config.api + '/price/' + id)
        .then(function (price) {
            this._price = price;

            return price;
        }.bind(this));
};

Embed.prototype.loadTemplates = function () {
    this._templates = {};

    return $.when(
        $.get('./tpl/status.ejs')
    ).then(function (statusTpl) {
        this._templates.status = _.template(statusTpl);
    }.bind(this));
};

Embed.prototype.render = function () {
    var status = this._templates.status(this._price);
    var $wrapper = $('<div class="embed-wrapper"></div>');

    $wrapper.append(status);

    this.config.$el.html($wrapper);

    this.renderPrices();
};

Embed.prototype.polling = function () {
    return $.get(this.config.api + '/polling')
        .done(function (response) {
            if (response.event === 'updatePrice') {
                this._price = response.data;

                // Update properties
                this.renderPrices();
            }
        }.bind(this))
        .fail(this.polling.bind(this))
};

Embed.prototype._onLoaded = function () {
    this.render();
    this.polling();
};

function onInit() {
    var embed = new Embed(window.EmbedConfig || {});

    embed.init();
}

$(document).ready(onInit);