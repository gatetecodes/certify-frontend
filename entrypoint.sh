#!/bin/sh

# Substitute environment variables in env.template.js and output to env.js
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js
