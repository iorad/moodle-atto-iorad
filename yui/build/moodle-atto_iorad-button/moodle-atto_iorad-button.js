YUI.add('moodle-atto_iorad-button', function (Y, NAME) {

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
 * Atto iorad plugin.
 *
 * @package atto_iorad
 * @module moodle-atto_iorad-button
 * @extends M.editor_atto.EditorPlugin
 * @copyright 2023 iorad <info@iorad.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

var COMPONENTNAME = 'atto_iorad';

var DISPLAY_TEMPLATE = '' +
    '{{#if paragraph}}<p><br></p>{{/if}}' +
    '<div class="iorad-placeholder" contenteditable="false">{{{ ioradPlayer }}}</div>' +
    '{{#if paragraph}}<p><br></p>{{/if}}' +
    '';

var FORM_TEMPLATE = '' +
    '<form class="atto_iorad-form">' +
    '   <div class="atto_iorad-field-group {{#if ioradEmbedCode}}atto_iorad-hidden{{/if}}">' +
    '       <label for="{{elementid}}-{{uniqid}}-url" class="sr-only">{{get_string "input_url_label" "atto_iorad"}}</label>' +
    '       <input name="url" class="atto_iorad-link-input" type="url" id="{{elementid}}-{{uniqid}}-url"' +
    '              placeholder="{{get_string "input_url_placeholder" "atto_iorad"}}" value="{{ioradPlayerLink}}" />' +
    '       <div class="atto_iorad-error-link atto_iorad-hidden">{{get_string "invalid_url" "atto_iorad"}}</div>' +
    '   </div>' +
    '   <div class="atto_iorad-field-group {{#unless ioradEmbedCode}}atto_iorad-hidden{{/unless}}">' +
    '       <label for="{{elementid}}-{{uniqid}}-iframe" class="sr-only">' +
    '           {{get_string "input_iframe_label" "atto_iorad"}}' +
    '       </label>' +
    '       <textarea name="url" class="atto_iorad-iframe-textarea" id="{{elementid}}-{{uniqid}}-iframe" rows="7"' +
    '                 placeholder="{{get_string "input_iframe_placeholder" "atto_iorad"}}">{{ioradEmbedCode}}</textarea>' +
    '       <div class="atto_iorad-error-iframe atto_iorad-hidden">{{get_string "invalid_iframe" "atto_iorad"}}</div>' +
    '   </div>' +
    '   <div class="atto_iorad-buttons">' +
    '       <button type="button" class="atto_iorad-switch-button">' +
    '               {{#if ioradEmbedCode}}' +
    '                   {{get_string "swicth_to_url" "atto_iorad"}}' +
    '               {{else}}' +
    '                   {{get_string "swicth_to_iframe" "atto_iorad"}}' +
    '               {{/if}}' +
    '       </button>' +
    '       <button type="button" class="atto_iorad-save-button {{#if ioradEmbedCode}}atto_iorad-button-black{{/if}}"' +
    '               {{#unless ioradEmbedCode}}disabled{{/unless}}>' +
    '               {{get_string "save_iorad" "atto_iorad"}}' +
    '       </button>' +
    '       <button type="button" class="atto_iorad-cancel-button" data-action="cancel">' +
    '           {{get_string "cancel" "atto_iorad"}}' +
    '       </button>' +
    '   </div>' +
    '</form>' +
    '';

Y.namespace('M.atto_iorad').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * A reference to the current selection at the time that the dialogue was opened.
     *
     * @property {Range} selection
     * @private
     */
    selection: null,

    /**
     * A reference to the currently open form.
     *
     * @param form
     * @type Node
     * @private
     */
    form: null,

    /**
     * A reference to the currently selected iorad element.
     *
     * @param ioradElement
     * @type Node
     * @private
     */
    ioradElement: null,

    initializer: function() {
        this.addButton({
            icon: 'icon',
            iconComponent: COMPONENTNAME,
            callback: this.displayDialogue,
            tags: '.iorad-placeholder',
            tagMatchRequiresAll: false
        });

        this.editor.all('.iorad-placeholder').setAttribute('contenteditable', 'false');
        this.editor.delegate('dblclick', this.handleDoubleClick, '.iorad-placeholder', this);
        this.editor.delegate('click', this.handleClick, '.iorad-placeholder', this);

        this.get('host').on('atto:selectionchanged', this.handleSelectionChange, this);
    },

    /**
     * Handle a click on a iorad Placeholder.
     *
     * @method handleClick
     * @param {Event} e
     * @private
     */
    handleDoubleClick: function(e) {
        this.handleClick(e);
        this.displayDialogue();
    },

    /**
     * Handle a click on a iorad Placeholder.
     *
     * @method handleClick
     * @param {Event} e
     * @private
     */
    handleClick: function(e) {
        var placeholderElement = e.target;
        var selection = this.get('host').getSelectionFromNode(placeholderElement);
        if (this.get('host').getSelection() !== selection) {
            this.get('host').setSelection(selection);
        }
    },

    /**
     * Handle a selection change to highlight on a iorad Placeholder.
     *
     * @method handleSelectionChange
     * @param {Event} e
     * @private
     */
    handleSelectionChange: function(e) {
        this.editor.all('.iorad-placeholder').removeClass('highlight');
        e.selectedNodes.each(function(node) {
            if (node.hasClass('iorad-placeholder')) {
                node.addClass('highlight');
            }
        });
    },

    /**
     * Display the iorad editing tool.
     *
     * @method displayDialogue
     * @private
     */
    displayDialogue: function() {
        // Store the current selection.
        this.selection = this.get('host').getSelection();
        if (this.selection === false) {
            return;
        }

        this.getIoradElement();

        var dialogue = this.getDialogue({
            width: '720px',
            additionalBaseClass: 'atto_iorad-dialogue',
            headerContent: '' +
                '<span class="atto_iorad-logo"></span>' +
                '<span>' + M.util.get_string('pluginname', COMPONENTNAME, undefined) + '</span>',
            focusAfterHide: true
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this.getDialogueContent()).show();
        M.form.shortforms({formid: this.get('host').get('elementid') + '_atto_iorad_form'});
    },

    /**
     * Verify if this could be a iorad URL.
     *
     * @param {string} url Url to verify
     * @return {boolean} whether this is a valid URL.
     */
    isValidUrl: function(url) {
        return [
            /^https?:\/\/(www\.|test\.|)iorad\.com\/player\/\d+(\/.*|)$/,
            /^https?:\/\/dev\.iorad\.dev\/player\/\d+(\/.*|)$/,
            /^https?:\/\/(www\.|)ior\.ad\/\w+\/?$/,
        ].some(function(re) {
            return re.test(url);
        });
    },

    isValidIframe: function(iframe) {
        var element = document.createElement('div');
        element.innerHTML = iframe;

        var iframeElement = element.querySelector('iframe');
        return iframeElement && this.isValidUrl(iframeElement.src);
    },

    buildIoradPlayer: function(text) {
        if (this.isValidUrl(text)) {
            return '' +
                '<iframe src="' + text + '" width="100%" height="500px" style="width: 100%; height: 500px;"' +
                '        referrerpolicy="strict-origin-when-cross-origin" frameborder="0"' +
                '        webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen"' +
                '        allowfullscreen="allowfullscreen" allow="camera; microphone; clipboard-write">' +
                '</iframe>' +
                '';
        }

        return this.isValidIframe(text) ? text : '';
    },

    isUrlInput: function(htmlElement) {
        return htmlElement && htmlElement.constructor && htmlElement.constructor.name === window.HTMLInputElement.name;
    },

    isIframeInput: function(htmlElement) {
        return htmlElement && htmlElement.constructor && htmlElement.constructor.name === window.HTMLTextAreaElement.name;
    },

    clearForm: function() {
        this.form.one('.atto_iorad-link-input').set('value', '');
        this.form.one('.atto_iorad-iframe-textarea').set('value', '');
        this.form.one('.atto_iorad-error-link').addClass('atto_iorad-hidden');
        this.form.one('.atto_iorad-error-iframe').addClass('atto_iorad-hidden');
        this.form.one('.atto_iorad-save-button').removeClass('atto_iorad-button-black');
        this.form.one('.atto_iorad-save-button').setAttribute('disabled', true);
    },

    switchIoradForm: function(e) {
        e.preventDefault();
        this.clearForm();

        var ioradLinkElement = this.form.one('.atto_iorad-link-input');
        var ioradIframeElement = this.form.one('.atto_iorad-iframe-textarea');
        var ioradSwitchButtonElement = this.form.one('.atto_iorad-switch-button');

        if (ioradLinkElement.ancestor('.atto_iorad-field-group').hasClass('atto_iorad-hidden')) {
            ioradLinkElement.ancestor('.atto_iorad-field-group').removeClass('atto_iorad-hidden');
            ioradIframeElement.ancestor('.atto_iorad-field-group').addClass('atto_iorad-hidden');
            ioradSwitchButtonElement.setHTML(M.util.get_string('swicth_to_iframe', COMPONENTNAME, undefined));
        } else {
            ioradLinkElement.ancestor('.atto_iorad-field-group').addClass('atto_iorad-hidden');
            ioradIframeElement.ancestor('.atto_iorad-field-group').removeClass('atto_iorad-hidden');
            ioradSwitchButtonElement.setHTML(M.util.get_string('swicth_to_url', COMPONENTNAME, undefined));
        }
    },

    ioradInputChange: function(e) {
        e.preventDefault();

        this.form.one('.atto_iorad-error-link').addClass('atto_iorad-hidden');
        this.form.one('.atto_iorad-error-iframe').addClass('atto_iorad-hidden');

        var inputElement = e.target.getDOMNode();
        if (this.isUrlInput(inputElement) && this.isValidUrl(inputElement.value.trim())) {
            this.form.one('.atto_iorad-save-button').addClass('atto_iorad-button-black');
            this.form.one('.atto_iorad-save-button').removeAttribute('disabled');
        } else if (this.isIframeInput(inputElement) && this.isValidIframe(inputElement.value.trim())) {
            this.form.one('.atto_iorad-save-button').addClass('atto_iorad-button-black');
            this.form.one('.atto_iorad-save-button').removeAttribute('disabled');
        } else {
            this.form.one('.atto_iorad-save-button').removeClass('atto_iorad-button-black');
            this.form.one('.atto_iorad-save-button').setAttribute('disabled', true);
        }
    },

    closeIoradDialog: function(e) {
        e.preventDefault();
        this.clearForm();
        this.getDialogue({focusAfterHide: null}).hide();
    },

    saveIoradPlayer: function(e) {
        e.preventDefault();

        var inputElement = this.form
            .one('.atto_iorad-field-group:not(.atto_iorad-hidden)')
            .one('.atto_iorad-link-input, .atto_iorad-iframe-textarea')
            .getDOMNode();

        if (this.isUrlInput(inputElement) && !this.isValidUrl(inputElement.value.trim())) {
            this.form.one('.atto_iorad-error-link').removeClass('atto_iorad-hidden');
            return;
        }

        if (this.isIframeInput(inputElement) && !this.isValidIframe(inputElement.value.trim())) {
            this.form.one('.atto_iorad-error-iframe').removeClass('atto_iorad-hidden');
            return;
        }

        var ioradPlayer = this.buildIoradPlayer(inputElement.value.trim());
        this.get('host').focus();

        var paragraph = !this.ioradElement;
        if (this.ioradElement) {
            this.ioradElement.remove();
        }

        this.get('host').setSelection(this.selection);
        var template = Y.Handlebars.compile(DISPLAY_TEMPLATE);
        this.get('host').insertContentAtFocusPoint(template({ioradPlayer: ioradPlayer, paragraph: paragraph}));

        this.markUpdated();
        this.getDialogue({focusAfterHide: null}).hide();
    },

    /**
     * Get the iorad iframe
     * @private
     */
    getIoradElement: function() {
        var ioradNode = null;
        var selectednodes = this.get('host').getSelectedNodes();
        selectednodes.each(function(node) {
            if (node.hasClass('iorad-placeholder')) {
                ioradNode = node;
            }
        });

        this.ioradElement = ioradNode;
    },

    /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    getDialogueContent: function() {
        var template = Y.Handlebars.compile(FORM_TEMPLATE);
        this.form = Y.Node.create(template({
            elementid: this.get('host').get('elementid'),
            ioradEmbedCode: this.ioradElement ? this.ioradElement.get('innerHTML') : undefined,
        }));

        this.form.one('.atto_iorad-switch-button').on('click', this.switchIoradForm, this);
        this.form.one('.atto_iorad-save-button').on('click', this.saveIoradPlayer, this);
        this.form.one('.atto_iorad-cancel-button').on('click', this.closeIoradDialog, this);
        this.form.all('.atto_iorad-link-input, .atto_iorad-iframe-textarea').on(['change', 'keyup'], this.ioradInputChange, this);
        return this.form;
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
