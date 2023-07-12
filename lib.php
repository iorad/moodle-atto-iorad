<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto text editor integration version file.
 *
 * @package atto_iorad
 * @copyright 2023 iorad <info@iorad.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Initialise the js strings required for this module.
 */
function atto_iorad_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js([
        'button_title',
        'modal_title',
        'save_iorad',
        'cancel',
        'input_url_label',
        'input_url_placeholder',
        'invalid_url',
        'input_iframe_label',
        'input_iframe_placeholder',
        'invalid_iframe',
        'swicth_to_url',
        'swicth_to_iframe',
    ], 'atto_iorad');
}
