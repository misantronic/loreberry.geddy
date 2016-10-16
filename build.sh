#!/usr/bin/env bash

cat node_modules/jquery/dist/jquery.js node_modules/underscore/underscore.js app/js/embed.js > public/embed.js
cp -R app/tpl public/
cp app/css/embed.css public/embed.css