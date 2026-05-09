#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');

// Compression step disabled — pre-compressing static assets is not used in this deployment.
console.log('compress-static: disabled');

