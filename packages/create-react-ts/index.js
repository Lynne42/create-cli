#!/usr/bin/env node

'use strict';

if (process.env.LOCAL_DEBUG) {
  require('./src/index')
} else {
  require('./dist/index')
}
