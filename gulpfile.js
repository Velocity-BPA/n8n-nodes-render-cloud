/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

const { src, dest } = require('gulp');
const rename = require('gulp-rename');

// Copy SVG icons to dist folder
function buildIcons() {
	return src('nodes/**/*.svg')
		.pipe(dest('dist/nodes/'));
}

exports['build:icons'] = buildIcons;
exports.default = buildIcons;
