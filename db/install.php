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
 * Atto iorad plugin install script.
 *
 * @package atto_iorad
 * @copyright 2023 iorad <info@iorad.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Add the iorad button to the Atto toolbar.
 *
 * @throws dml_exception
 */
function xmldb_atto_iorad_install() {
    $toolbar = get_config('editor_atto', 'toolbar');
    if ($toolbar && $toolbar != '' && stripos($toolbar, 'iorad') === false) {
        $groups = explode("\n", $toolbar);
        $found = false;
        foreach ($groups as $i => $group) {
            $parts = explode('=', $group);
            if (trim($parts[0]) == 'files') {
                $groups[$i] = 'files = ' . trim($parts[1]) . ', iorad';
                $found = true;
            }
        }
        // Otherwise create a file group in the second position starting from the end.
        if (!$found) {
            do {
                $last = array_pop($groups);
            } while (empty($last) && !empty($groups));

            $groups[] = 'files = iorad';
            $groups[] = $last;
        }
        // Update config variable.
        $toolbar = implode("\n", $groups);
        set_config('toolbar', $toolbar, 'editor_atto');
    }
}
