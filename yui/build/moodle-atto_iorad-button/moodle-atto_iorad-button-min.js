YUI.add("moodle-atto_iorad-button",function(i,t){var a="atto_iorad";i.namespace("M.atto_iorad").Button=i.Base.create("button",i.M.editor_atto.EditorPlugin,[],{selection:null,form:null,ioradElement:null,initializer:function(){this.addButton({icon:"icon",iconComponent:a,callback:this.displayDialogue,tags:".iorad-placeholder",tagMatchRequiresAll:!1}),this.editor.all(".iorad-placeholder").setAttribute("contenteditable","false"),this.editor.delegate("dblclick",this.handleDoubleClick,".iorad-placeholder",this),this.editor.delegate("click",this.handleClick,".iorad-placeholder",this),this.get("host").on("atto:selectionchanged",this.handleSelectionChange,this)},handleDoubleClick:function(t){this.handleClick(t),this.displayDialogue()},handleClick:function(t){t=t.target,t=this.get("host").getSelectionFromNode(t);this.get("host").getSelection()!==t&&this.get("host").setSelection(t)},handleSelectionChange:function(t){this.editor.all(".iorad-placeholder").removeClass("highlight"),t.selectedNodes.each(function(t){t.hasClass("iorad-placeholder")&&t.addClass("highlight")})},displayDialogue:function(){this.selection=this.get("host").getSelection(),!1!==this.selection&&(this.getIoradElement(),this.getDialogue({width:"720px",additionalBaseClass:"atto_iorad-dialogue",headerContent:'<span class="atto_iorad-logo"></span><span>'+M.util.get_string("pluginname",a,undefined)+"</span>",focusAfterHide:!0}).set("bodyContent",this.getDialogueContent()).show(),M.form.shortforms({formid:this.get("host").get("elementid")+"_atto_iorad_form"}))},isValidUrl:function(e){return[/^https?:\/\/(www\.|test\.|)iorad\.com\/player\/\d+(\/.*|)$/,/^https?:\/\/dev\.iorad\.dev\/player\/\d+(\/.*|)$/,/^https?:\/\/(www\.|)ior\.ad\/\w+\/?$/].some(function(t){return t.test(e)})},isValidIframe:function(t){var e=document.createElement("div");return e.innerHTML=t,(t=e.querySelector("iframe"))&&this.isValidUrl(t.src)},buildIoradPlayer:function(t){return this.isValidUrl(t)?'<iframe src="'+t+'" width="100%" height="500px" style="width: 100%; height: 500px;"        referrerpolicy="strict-origin-when-cross-origin" frameborder="0"        webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen"        allowfullscreen="allowfullscreen" allow="camera; microphone; clipboard-write"></iframe>':this.isValidIframe(t)?t:""},isUrlInput:function(t){return t&&t.constructor&&t.constructor.name===window.HTMLInputElement.name},isIframeInput:function(t){return t&&t.constructor&&t.constructor.name===window.HTMLTextAreaElement.name},clearForm:function(){this.form.one(".atto_iorad-link-input").set("value",""),this.form.one(".atto_iorad-iframe-textarea").set("value",""),this.form.one(".atto_iorad-error-link").addClass("atto_iorad-hidden"),this.form.one(".atto_iorad-error-iframe").addClass("atto_iorad-hidden"),this.form.one(".atto_iorad-save-button").removeClass("atto_iorad-button-black"),this.form.one(".atto_iorad-save-button").setAttribute("disabled",!0)},switchIoradForm:function(t){var e,o;t.preventDefault(),this.clearForm(),t=this.form.one(".atto_iorad-link-input"),e=this.form.one(".atto_iorad-iframe-textarea"),o=this.form.one(".atto_iorad-switch-button"),t.ancestor(".atto_iorad-field-group").hasClass("atto_iorad-hidden")?(t.ancestor(".atto_iorad-field-group").removeClass("atto_iorad-hidden"),e.ancestor(".atto_iorad-field-group").addClass("atto_iorad-hidden"),o.setHTML(M.util.get_string("swicth_to_iframe",a,undefined))):(t.ancestor(".atto_iorad-field-group").addClass("atto_iorad-hidden"),e.ancestor(".atto_iorad-field-group").removeClass("atto_iorad-hidden"),o.setHTML(M.util.get_string("swicth_to_url",a,undefined)))},ioradInputChange:function(t){t.preventDefault(),this.form.one(".atto_iorad-error-link").addClass("atto_iorad-hidden"),this.form.one(".atto_iorad-error-iframe").addClass("atto_iorad-hidden");t=t.target.getDOMNode();this.isUrlInput(t)&&this.isValidUrl(t.value.trim())||this.isIframeInput(t)&&this.isValidIframe(t.value.trim())?(this.form.one(".atto_iorad-save-button").addClass("atto_iorad-button-black"),this.form.one(".atto_iorad-save-button").removeAttribute("disabled")):(this.form.one(".atto_iorad-save-button").removeClass("atto_iorad-button-black"),this.form.one(".atto_iorad-save-button").setAttribute("disabled",!0))},closeIoradDialog:function(t){t.preventDefault(),this.clearForm(),this.getDialogue({focusAfterHide:null}).hide()},saveIoradPlayer:function(t){var e,o;t.preventDefault(),t=this.form.one(".atto_iorad-field-group:not(.atto_iorad-hidden)").one(".atto_iorad-link-input, .atto_iorad-iframe-textarea").getDOMNode(),!this.isUrlInput(t)||this.isValidUrl(t.value.trim())?!this.isIframeInput(t)||this.isValidIframe(t.value.trim())?(t=this.buildIoradPlayer(t.value.trim()),this.get("host").focus(),e=!this.ioradElement,this.ioradElement&&this.ioradElement.remove(),this.get("host").setSelection(this.selection),o=i.Handlebars.compile('{{#if paragraph}}<p><br></p>{{/if}}<div class="iorad-placeholder" contenteditable="false">{{{ ioradPlayer }}}</div>{{#if paragraph}}<p><br></p>{{/if}}'),this.get("host").insertContentAtFocusPoint(o({ioradPlayer:t,paragraph:e})),this.markUpdated(),this.getDialogue({focusAfterHide:null}).hide()):this.form.one(".atto_iorad-error-iframe").removeClass("atto_iorad-hidden"):this.form.one(".atto_iorad-error-link").removeClass("atto_iorad-hidden")},getIoradElement:function(){var e=null,t=this.get("host").getSelectedNodes();t.each(function(t){t.hasClass("iorad-placeholder")&&(e=t)}),this.ioradElement=e},getDialogueContent:function(){var t=i.Handlebars.compile(
'<form class="atto_iorad-form">   <div class="atto_iorad-field-group {{#if ioradEmbedCode}}atto_iorad-hidden{{/if}}">       <label for="{{elementid}}-{{uniqid}}-url" class="sr-only">{{get_string "input_url_label" "atto_iorad"}}</label>       <input name="url" class="atto_iorad-link-input" type="url" id="{{elementid}}-{{uniqid}}-url"              placeholder="{{get_string "input_url_placeholder" "atto_iorad"}}" value="{{ioradPlayerLink}}" />       <div class="atto_iorad-error-link atto_iorad-hidden">{{get_string "invalid_url" "atto_iorad"}}</div>   </div>   <div class="atto_iorad-field-group {{#unless ioradEmbedCode}}atto_iorad-hidden{{/unless}}">       <label for="{{elementid}}-{{uniqid}}-iframe" class="sr-only">           {{get_string "input_iframe_label" "atto_iorad"}}       </label>       <textarea name="url" class="atto_iorad-iframe-textarea" id="{{elementid}}-{{uniqid}}-iframe" rows="7"                 placeholder="{{get_string "input_iframe_placeholder" "atto_iorad"}}">{{ioradEmbedCode}}</textarea>       <div class="atto_iorad-error-iframe atto_iorad-hidden">{{get_string "invalid_iframe" "atto_iorad"}}</div>   </div>   <div class="atto_iorad-buttons">       <button type="button" class="atto_iorad-switch-button">               {{#if ioradEmbedCode}}                   {{get_string "swicth_to_url" "atto_iorad"}}               {{else}}                   {{get_string "swicth_to_iframe" "atto_iorad"}}               {{/if}}       </button>       <button type="button" class="atto_iorad-save-button {{#if ioradEmbedCode}}atto_iorad-button-black{{/if}}"               {{#unless ioradEmbedCode}}disabled{{/unless}}>               {{get_string "save_iorad" "atto_iorad"}}       </button>       <button type="button" class="atto_iorad-cancel-button" data-action="cancel">           {{get_string "cancel" "atto_iorad"}}       </button>   </div></form>');return this.form=i.Node.create(t({elementid:this.get("host").get("elementid"),ioradEmbedCode:this.ioradElement?this.ioradElement.get("innerHTML"):undefined})),this.form.one(".atto_iorad-switch-button").on("click",this.switchIoradForm,this),this.form.one(".atto_iorad-save-button").on("click",this.saveIoradPlayer,this),this.form.one(".atto_iorad-cancel-button").on("click",this.closeIoradDialog,this),this.form.all(".atto_iorad-link-input, .atto_iorad-iframe-textarea").on(["change","keyup"],this.ioradInputChange,this),this.form}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});