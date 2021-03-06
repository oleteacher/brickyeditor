var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BrickyEditor;
(function (BrickyEditor) {
    var Block = (function () {
        function Block(editor, templateName, data) {
            this.fields = [];
            var block = this;
            this.editor = editor;
            this.template = templateName;
            var template = BrickyEditor.TemplateService.getTemplate(templateName);
            var $editor = $(template.html);
            this.$editor = $editor;
            this.bindEditorFields(data);
        }
        Block.prototype.showControls = function ($blockEditor) {
        };
        Block.prototype.bindEditorFields = function (data) {
            var block = this;
            this.$editor
                .find(BrickyEditor.Constants.selectorField)
                .addBack(BrickyEditor.Constants.selectorField)
                .each(function () {
                var $field = $(this);
                var fieldName = BrickyEditor.TemplateService.getFieldValue($field, "name");
                var fieldData;
                if (data) {
                    data.forEach(function (fd) {
                        if (fd.name === fieldName) {
                            fieldData = fd.data;
                        }
                    });
                }
                var field = BrickyEditor.Fields.BaseField.getField(block, $field, fieldData);
                if (field) {
                    block.fields.push(field);
                }
            });
        };
        Block.prototype.getData = function () {
            var fieldsData = [];
            this.fields.forEach(function (field) {
                fieldsData.push(field.getData());
            });
            return {
                template: this.template,
                html: this.getHtml(true),
                fields: fieldsData
            };
        };
        Block.prototype.getHtml = function (trim) {
            var $html = this.$editor.clone();
            $html
                .find(BrickyEditor.Constants.selectorField)
                .addBack(BrickyEditor.Constants.selectorField)
                .each(function (idx, el) {
                var attrsToRemove = BrickyEditor.Common.propsFilterKeys(el.attributes, function (k, v) {
                    return v.name.breStartsWith(BrickyEditor.Constants.field);
                }).map(function (attr) {
                    return el.attributes[attr].name;
                });
                attrsToRemove.push('contenteditable');
                attrsToRemove.forEach(function (attr) {
                    el.removeAttribute(attr);
                });
            });
            var html = $html[0].outerHTML;
            return trim ? html.breTotalTrim() : html;
        };
        return Block;
    }());
    BrickyEditor.Block = Block;
})(BrickyEditor || (BrickyEditor = {}));
String.prototype.breContains = function (part) {
    return this.indexOf(part) >= 0;
};
String.prototype.breStartsWith = function (part) {
    return this.indexOf(part) == 0;
};
String.prototype.breTotalTrim = function () {
    return this ? this.replace(/\s\s+/g, ' ').trim() : '';
};
String.prototype.breEqualsInvariant = function (other) {
    return this.toLowerCase() === other.toLowerCase();
};
Array.prototype.first = function (filter) {
    for (var i = 0; i < this.length; i++) {
        var elem = this[i];
        if (filter(this[i])) {
            return elem;
        }
    }
    return null;
};
var BrickyEditor;
(function (BrickyEditor) {
    var Common = (function () {
        function Common() {
        }
        Common.propsEach = function (obj, func) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    func(key, value);
                }
            }
        };
        Common.propsFilterKeys = function (obj, filter, payload) {
            var result = [];
            Common.propsEach(obj, function (key, value) {
                if (filter(key, value)) {
                    result.push(key);
                }
            });
            if (payload) {
                result.push(payload);
            }
            return result;
        };
        Common.arrayFilter = function (array, filter, payload) {
            var result = [];
            Common.arrayEach(array, function (element) {
                if (filter(element)) {
                    result.push(element);
                }
            });
            if (payload) {
                result.push(payload);
            }
            return result;
        };
        Common.arrayFind = function (array, filter) {
            Common.arrayEach(array, function (element) {
                if (filter(element)) {
                    return element;
                }
            });
            return null;
        };
        Common.arrayFindByField = function (array, fieldName, fieldValue) {
            Common.arrayEach(array, function (element) {
                if (element.hasOwnProperty(fieldName) &&
                    element[fieldName] === fieldValue) {
                    return element;
                }
            });
            return null;
        };
        Common.arrayMap = function (array, map) {
            var result = [];
            Common.arrayEach(array, function (element) {
                result.push(map(element));
            });
            return result;
        };
        Common.arrayAny = function (array, filter) {
            var result = false;
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                if (filter(element)) {
                    result = true;
                    break;
                }
            }
            return result;
        };
        Common.arrayEach = function (array, func) {
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                func(element);
            }
        };
        return Common;
    }());
    BrickyEditor.Common = Common;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Constants = (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.templatesFolder = 'templates/bootstrap4';
    Constants.field = 'data-bricky-field';
    Constants.templateModalKey = "modal";
    Constants.templateToolsKey = "tools";
    Constants.templateHtmlToolsKey = "htmlTools";
    Constants.selectorModalContent = ".brickyeditor-modal-content";
    Constants.selectorModalClose = ".brickyeditor-modal-close";
    Constants.selectorTemplates = '.templates';
    Constants.selectorTemplate = '.template';
    Constants.selectorCancel = '.brickyeditor-cancel';
    Constants.selectorSave = '.brickyeditor-save';
    Constants.selectorLoader = '#brickyeditorLoader';
    Constants.selectorFilter = '#brickyeditorFilter';
    Constants.selectorField = "[" + Constants.field + "]";
    Constants.selectorHtmlToolsCommand = '[data-brickyeditor-doc-command]';
    Constants.selectorHtmlToolsCommandRange = '[data-brickyeditor-doc-command-range]';
    Constants.dummyText = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue.";
    BrickyEditor.Constants = Constants;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Editor = (function () {
        function Editor($el, options) {
            this.blocks = [];
            var editor = this;
            this.options = options ? options : new BrickyEditor.EditorOptions();
            $.extend(this.options, new BrickyEditor.EditorOptions());
            this.$el = $el;
            this
                .loadTemplatesAsync()
                .done(function () {
                if (editor.options.blocks.length) {
                    editor.options.blocks.forEach(function (block) {
                        editor.addBlock(block.template, block.fields);
                    });
                }
                if (editor.options.onload) {
                    editor.options.onload(editor);
                }
            });
        }
        Editor.prototype.loadTemplatesAsync = function () {
            var result = $.Deferred();
            var editor = this;
            var tasks = [];
            tasks.push(BrickyEditor.TemplateService
                .loadTemplatesAsync(editor.options.templatesFolder)
                .done(function () { })
                .fail(function (err) {
                console.log("Templates loading error");
                result.reject();
            }));
            tasks.push(BrickyEditor.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateModalKey)
                .done(function (html) {
                var modal = new BrickyEditor.Modal(html);
                editor.modal = modal;
                editor.$el.append(modal.$control);
            })
                .fail(function (err) {
                console.log("Modal loading error");
                result.reject();
            }));
            BrickyEditor.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateToolsKey)
                .done(function (html) {
                editor.$tools = $(html);
            })
                .fail(function (err) {
                console.log("Tools loading error");
                result.reject();
            });
            BrickyEditor.TemplateService
                .loadTemplateAsync(editor.options.templatesBaseFolder, BrickyEditor.Constants.templateHtmlToolsKey)
                .done(function (html) {
                var htmlTools = new BrickyEditor.HtmlTools(html, editor);
                editor.htmlTools = htmlTools;
                editor.$el.append(htmlTools.$control);
            })
                .fail(function (err) {
                console.log("Html Tools loading error");
                result.reject();
            });
            $.when
                .apply($, tasks)
                .then(function () {
                editor.addTools();
                result.resolve();
            });
            return result;
        };
        Editor.prototype.addTools = function () {
            var editor = this;
            var categories = new Array();
            var $templates = $(BrickyEditor.Constants.selectorTemplates, editor.$tools);
            $templates.hide();
            editor.$el.append(editor.$tools);
            for (var templateName in BrickyEditor.TemplateService.templates) {
                var block = new BrickyEditor.Block(null, templateName);
                var template = BrickyEditor.TemplateService.templates[templateName];
                var $template = $("<div class='template m-r-1 m-b-1 m-l-1 p-1' data-bricky-template=\"" + templateName + "\">" + block.getHtml(true) + "</div>");
                $templates.append($template);
                BrickyEditor.Common.arrayEach(template.category, function (category) {
                    var exists = BrickyEditor.Common.arrayAny(categories, function (x) {
                        return x.breEqualsInvariant(category);
                    });
                    if (!exists) {
                        categories.push(category);
                    }
                });
            }
            $(BrickyEditor.Constants.selectorTemplate, $templates)
                .on('click', function () {
                var template = $(this).data().brickyTemplate;
                editor.addBlock(template);
            });
            $(BrickyEditor.Constants.selectorLoader, editor.$tools)
                .fadeOut('slow', function () {
                $templates.fadeIn('fast');
            });
            var $hideBtn = $('[data-brickyeditor-hide-tools]', editor.$tools);
            $hideBtn.on('click', function () {
                if ($hideBtn.attr("data-brickyeditor-hide-tools")) {
                    editor.$tools.animate({ right: '-204px' }, 'fast');
                    $hideBtn.removeAttr("data-brickyeditor-hide-tools");
                }
                else {
                    editor.$tools.animate({ right: '0px' }, 'fast');
                    $hideBtn.attr("data-brickyeditor-hide-tools", "true");
                }
                $hideBtn.toggleClass("fa-arrow-left").toggleClass("fa-arrow-right");
            });
        };
        Editor.prototype.addBlock = function (template, data) {
            var block = new BrickyEditor.Block(this, template, data);
            var blockTools = "<div class='brickyeditor-block-tools'>\n                <div class='brickyeditor-icon brickyeditor-icon-x'></div>\n                <div class='brickyeditor-icon brickyeditor-icon-cog'></div>\n                <div class='brickyeditor-icon brickyeditor-icon-up'></div>\n                <div class='brickyeditor-icon brickyeditor-icon-down'></div>\n            </div>";
            this.$el.append(blockTools);
            this.$el.append(block.$editor);
            this.blocks.push(block);
        };
        Editor.prototype.getData = function () {
            var blocksData = [];
            this.blocks.forEach(function (block) {
                blocksData.push(block.getData());
            });
            return blocksData;
        };
        Editor.prototype.getHtml = function () {
            var blocksData = [];
            this.blocks.forEach(function (block) {
                blocksData.push(block.getHtml(true));
            });
            return blocksData.join('\n');
        };
        return Editor;
    }());
    BrickyEditor.Editor = Editor;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var EditorOptions = (function () {
        function EditorOptions() {
            this.templatesBaseFolder = "templates";
            this.templatesFolder = "templates/bootstrap4";
        }
        return EditorOptions;
    }());
    BrickyEditor.EditorOptions = EditorOptions;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var EmbedService = (function () {
        function EmbedService() {
        }
        EmbedService.getEmbedAsync = function (url) {
            var task = $.Deferred();
            var url = "https://noembed.com/embed?url=" + url;
            $.ajax({
                url: url,
                type: "get",
                dataType: "jsonp"
            })
                .done(function (json) {
                task.resolve(json);
            })
                .fail(function (err) {
                task.reject(err);
            });
            return task;
        };
        return EmbedService;
    }());
    BrickyEditor.EmbedService = EmbedService;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var HtmlTools = (function () {
        function HtmlTools(html, editor) {
            var tools = this;
            tools.$control = $(html);
            $(BrickyEditor.Constants.selectorHtmlToolsCommand, this.$control)
                .on("click", function () {
                var $command = $(this);
                var selection = window.getSelection();
                var range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                if ($command.is(BrickyEditor.Constants.selectorHtmlToolsCommandRange) && !range)
                    return;
                var command = $command.data().brickyeditorDocCommand;
                if (command == 'CreateLink') {
                    editor.modal.promptAsync(tools.getLinkPromptParams(selection))
                        .done(function (fields) {
                        selection = window.getSelection();
                        selection.addRange(range);
                        var href = fields.first(function (f) { return f.key === 'href'; }).value;
                        if (href) {
                            document.execCommand(command, false, href);
                            var target = fields.first(function (f) { return f.key === 'target'; }).value;
                            if (target) {
                                selection.anchorNode.parentElement.setAttribute('target', target);
                            }
                            var title = fields.first(function (f) { return f.key === 'title'; }).value;
                            if (title) {
                                selection.anchorNode.parentElement.setAttribute('title', title);
                            }
                        }
                    })
                        .fail(function () {
                        selection = window.getSelection();
                        selection.addRange(range);
                    });
                }
                else {
                    document.execCommand(command);
                }
                return false;
            });
        }
        HtmlTools.prototype.getLinkPromptParams = function (selection) {
            var href = '', title = '', target = '';
            if (selection.anchorNode && selection.anchorNode.parentNode.nodeName.breEqualsInvariant('a')) {
                var a = $(selection.anchorNode.parentNode);
                href = a.attr('href');
                title = a.attr('title');
                target = a.attr('target');
            }
            return [
                new BrickyEditor.Prompt.PromptParameter('href', 'Url', href, 'Url'),
                new BrickyEditor.Prompt.PromptParameter('title', 'Title', title, 'Title'),
                new BrickyEditor.Prompt.PromptParameterOptions('target', 'Target', [
                    ['', ''],
                    ['Blank', '_blank'],
                    ['Self', '_self'],
                    ['Parent', '_parent'],
                    ['Top', '_top'],
                ], target)
            ];
        };
        return HtmlTools;
    }());
    BrickyEditor.HtmlTools = HtmlTools;
})(BrickyEditor || (BrickyEditor = {}));
(function ($) {
    $.fn.brickyeditor = function (options) {
        var editor = new BrickyEditor.Editor($(this), options);
        return editor;
    };
})(jQuery);
var BrickyEditor;
(function (BrickyEditor) {
    var Modal = (function () {
        function Modal(html) {
            var modal = this;
            this.$control = $(html);
            this.$content = $(BrickyEditor.Constants.selectorModalContent, this.$control);
            $(BrickyEditor.Constants.selectorModalClose, this.$control)
                .on('click', function () {
                modal.hideModal();
            });
        }
        Modal.prototype.hideModal = function () {
            var $content = this.$content;
            this.$control.fadeOut(function () {
                $content.html('');
            });
        };
        Modal.prototype.showModal = function ($content) {
            this.$content.append($content);
            this.$control.fadeIn();
        };
        Modal.prototype.promptAsync = function (fields) {
            var result = $.Deferred();
            var modal = this;
            var $form = $('<form></form>');
            fields.forEach(function (field) {
                $form.append(field.$control);
            });
            var $ok = $('<button type="button" class="btn btn-ok m-r-1">Ok</button>');
            $ok.on('click', function () {
                fields.forEach(function (field) { return field.parseValue(); });
                modal.hideModal();
                result.resolve(fields);
            });
            var $cancel = $('<button type="button" class="btn btn-cancel">Cancel</button>');
            $cancel.on('click', function () {
                modal.hideModal();
                result.reject(fields);
            });
            $form.append($ok);
            $form.append($cancel);
            modal.showModal($form);
            return result;
        };
        return Modal;
    }());
    BrickyEditor.Modal = Modal;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var SelectionHelper = (function () {
        function SelectionHelper() {
        }
        SelectionHelper.getSelectedText = function () {
            var sel = window.getSelection();
            debugger;
            return sel.getRangeAt(0).toString();
        };
        SelectionHelper.replaceSelectedText = function (replacement) {
            debugger;
            var sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(replacement));
                }
            }
        };
        return SelectionHelper;
    }());
    BrickyEditor.SelectionHelper = SelectionHelper;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var TemplateService = (function () {
        function TemplateService() {
        }
        TemplateService.loadTemplateAsync = function (folder, template) {
            var task = $.Deferred();
            $.get(TemplateService.getTemplateUrl(folder, template))
                .done(function (html) {
                task.resolve(html);
            })
                .fail(function (err) {
                task.reject(err);
            });
            return task;
        };
        TemplateService.loadTemplateConfigAsync = function (folder) {
            var task = $.Deferred();
            $.getJSON(TemplateService.getTemplatesConfigUrl(folder))
                .done(function (json) {
                task.resolve(json);
            })
                .fail(function (err) {
                task.reject(err);
            });
            return task;
        };
        TemplateService.filteredTemplates = function (filter) {
            return BrickyEditor.Common.arrayMap(TemplateService.templates, function (el) {
                return BrickyEditor.Common.arrayAny(el.category, function (category) {
                    category.toLowerCase() === filter.toLowerCase();
                });
            });
        };
        TemplateService.loadTemplatesAsync = function (folder) {
            var result = $.Deferred();
            var templates;
            TemplateService.loadTemplateConfigAsync(folder)
                .done(function (result) {
                templates = result;
            })
                .then(function () {
                var tasks = [];
                templates.forEach(function (t) {
                    var task = TemplateService
                        .loadTemplateAsync(folder, t.file)
                        .done(function (html) {
                        t.html = html;
                        TemplateService.templates[t.file] = t;
                    })
                        .fail(function (err) {
                        console.log(err);
                    });
                    tasks.push(task);
                });
                $.when.apply($, tasks).then(function () {
                    result.resolve();
                });
            });
            return result;
        };
        TemplateService.getTemplateUrl = function (folder, template) {
            return folder + "/" + template + ".html";
        };
        TemplateService.getTemplatesConfigUrl = function (folder) {
            return folder + "/templates.json";
        };
        TemplateService.getTemplate = function (name) {
            return TemplateService.templates[name];
        };
        TemplateService.removeTemplate = function (name) {
            delete TemplateService.templates[name];
        };
        TemplateService.getFieldValue = function ($el, prop) {
            return $el.attr("data-bricky-field-" + prop);
        };
        return TemplateService;
    }());
    TemplateService.templates = {};
    BrickyEditor.TemplateService = TemplateService;
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var BaseField = (function () {
            function BaseField(block, $field, data) {
                this.block = block;
                this.$field = $field;
                this.name = BrickyEditor.TemplateService.getFieldValue($field, "name");
                this.type = BrickyEditor.TemplateService.getFieldValue($field, "type");
                this.data = data || {};
                this.bind();
            }
            BaseField.getField = function (block, $el, data) {
                var type = BrickyEditor.TemplateService.getFieldValue($el, "type");
                switch (type) {
                    case 'html':
                        return new Fields.HtmlField(block, $el, data);
                    case 'image':
                        return new Fields.ImageField(block, $el, data);
                    case 'embed':
                        return new Fields.EmbedField(block, $el, data);
                    default:
                        throw type + " field not found";
                }
            };
            BaseField.prototype.bind = function () { };
            BaseField.prototype.getData = function () {
                return {
                    type: this.type,
                    name: this.name,
                    data: this.data
                };
            };
            return BaseField;
        }());
        Fields.BaseField = BaseField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var EmbedField = (function (_super) {
            __extends(EmbedField, _super);
            function EmbedField() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EmbedField.prototype.bind = function () {
                var field = this;
                var $field = this.$field;
                var data = this.data;
                $field.on('click', function () {
                    var url = prompt('Link to embed', 'http://instagr.am/p/fA9uwTtkSN/');
                    BrickyEditor.EmbedService
                        .getEmbedAsync(url)
                        .done(function (json) {
                        field.data.url = url;
                        field.data.embed = json;
                        var $embed = $(json.html);
                        var $script = $embed.filter('script');
                        if ($script.length > 0) {
                            $script.remove();
                            var scriptSrc = $script.attr('src');
                            if (scriptSrc.breStartsWith('//')) {
                                scriptSrc = "http:" + scriptSrc;
                                $.getScript(scriptSrc)
                                    .done(function (script) {
                                    if (scriptSrc.breContains('instgram') && instgrm) {
                                        instgrm.Embeds.process();
                                    }
                                })
                                    .fail(function (err) { });
                            }
                        }
                        $field.replaceWith($embed);
                    });
                });
            };
            return EmbedField;
        }(Fields.BaseField));
        Fields.EmbedField = EmbedField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var HtmlField = (function (_super) {
            __extends(HtmlField, _super);
            function HtmlField() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            HtmlField.prototype.bind = function () {
                var $field = this.$field;
                var data = this.data;
                if (!$field.is('[contenteditable]')) {
                    $field.attr('contenteditable', 'true');
                }
                this.data.html =
                    this.data.html ||
                        BrickyEditor.TemplateService.getFieldValue($field, 'html') ||
                        BrickyEditor.Constants.dummyText;
                $field.html(this.data.html);
                this.$field.on('blur keyup paste input', function () {
                    data.html = $(this).html().trim();
                });
            };
            return HtmlField;
        }(Fields.BaseField));
        Fields.HtmlField = HtmlField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Fields;
    (function (Fields) {
        var ImageField = (function (_super) {
            __extends(ImageField, _super);
            function ImageField() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ImageField.prototype.bind = function () {
                var field = this;
                var $field = this.$field;
                var data = this.data;
                if (!this.data.src) {
                    this.data.src = BrickyEditor.TemplateService.getFieldValue($field, 'src');
                }
                $field.attr("src", this.data.src);
                $field.on('click', function () {
                    field.block.editor.modal.promptAsync(field.getPromptParams())
                        .done(function (fields) {
                        var file = fields.first(function (f) { return f.key === 'file'; }).value;
                        var src = fields.first(function (f) { return f.key === 'src'; }).value;
                        if (file) {
                            debugger;
                            field.setFile(file);
                            field.setSrc(null);
                        }
                        else if (src) {
                            field.setSrc(src);
                            field.setFile(null);
                        }
                        var alt = fields.first(function (f) { return f.key === 'alt'; }).value;
                        field.setAlt(alt);
                    });
                });
            };
            ImageField.prototype.getPromptParams = function () {
                return [
                    new BrickyEditor.Prompt.PromptParameter('src', 'Image Link', this.data.url, 'image url'),
                    new BrickyEditor.Prompt.PromptParameterImage('file', 'or Upload file', this.data.file, 'select file'),
                    new BrickyEditor.Prompt.PromptParameter('alt', 'Alt', this.data.alt, 'alt attribute value '),
                ];
            };
            ImageField.prototype.setSrc = function (src) {
                this.data.src = src;
                if (src) {
                    this.$field.attr("src", this.data.src);
                }
            };
            ImageField.prototype.setAlt = function (alt) {
                this.data.alt = alt;
                this.$field.attr("alt", this.data.alt);
            };
            ImageField.prototype.setFile = function (file) {
                this.data.file = file;
                if (file) {
                    this.$field.attr("src", this.data.file.fileContent);
                }
            };
            return ImageField;
        }(Fields.BaseField));
        Fields.ImageField = ImageField;
    })(Fields = BrickyEditor.Fields || (BrickyEditor.Fields = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameter = (function () {
            function PromptParameter(key, title, value, placeholder) {
                this.key = key;
                this.title = title;
                this.placeholder = placeholder || '';
                this.value = value;
            }
            PromptParameter.prototype.parseValue = function () {
                this.value = this.$input.val();
                this.$control = null;
                delete this._$control;
            };
            Object.defineProperty(PromptParameter.prototype, "$control", {
                get: function () {
                    if (!this._$control) {
                        this._$control =
                            $("<div class=\"brickyeditor-prompt-field\">\n                        <label for=\"" + this.key + "\">" + (this.title ? this.title : '') + "</label>\n                        </div>");
                        this.$input = this.getEditor();
                        this._$control.append(this.$input);
                    }
                    return this._$control;
                },
                set: function (value) {
                    this._$control = value;
                },
                enumerable: true,
                configurable: true
            });
            PromptParameter.prototype.getEditor = function () {
                var value = this.value || '';
                return $("<input type=\"text\" id=\"" + this.key + "\" class=\"brickyeditor-input\" placeholder=\"" + this.placeholder + "\" value=\"" + (this.value ? this.value : '') + "\">");
            };
            return PromptParameter;
        }());
        Prompt.PromptParameter = PromptParameter;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterImage = (function (_super) {
            __extends(PromptParameterImage, _super);
            function PromptParameterImage(key, title, value, placeholder) {
                var _this = _super.call(this, key, title, value, placeholder) || this;
                if (value) {
                    _this._value = value;
                }
                return _this;
            }
            PromptParameterImage.prototype.parseValue = function () {
                this.value = this._value;
                this.$control = null;
                delete this._$control;
                this._value = null;
                delete this._value;
            };
            PromptParameterImage.prototype.getEditor = function () {
                var field = this;
                var img = this.value && this.value.fileContent ? this.value.fileContent : "";
                var $editor = $("\n                <div class='brickyeditor-image-input'>\n                    <label for=\"" + this.key + "\">\n                        <img src=\"" + img + "\"/>\n                    </label>                        \n                    <input type=\"file\" id=\"" + this.key + "\" class=\"brickyeditor-input\" placeholder=\"" + this.placeholder + "\">\n                </div>\n                <small class='brickyeditor-image-input-filename'></small>");
                var $file = $('input', $editor);
                var $filePreview = $('img', $editor);
                var $fileName = $('.brickyeditor-image-input-filename', $editor);
                var value = this.value;
                if (value) {
                    $filePreview.attr("src", value.fileContent);
                    $fileName.text(value.fileInfo.name);
                }
                $file.change(function () {
                    var fileInput = this;
                    if (fileInput.files && fileInput.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (ev) {
                            var target = ev.target;
                            field._value = new Prompt.PromptParameterImageResult();
                            field._value.fileContent = target.result;
                            field._value.fileInfo = new Prompt.PromptParameterImageResultFile(fileInput.files[0]);
                            $filePreview.attr("src", field._value.fileContent);
                            $fileName.text(field._value.fileInfo.name);
                        };
                        reader.readAsDataURL(fileInput.files[0]);
                    }
                });
                return $editor;
            };
            return PromptParameterImage;
        }(Prompt.PromptParameter));
        Prompt.PromptParameterImage = PromptParameterImage;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterImageResult = (function () {
            function PromptParameterImageResult() {
            }
            return PromptParameterImageResult;
        }());
        Prompt.PromptParameterImageResult = PromptParameterImageResult;
        var PromptParameterImageResultFile = (function () {
            function PromptParameterImageResultFile(file) {
                this.name = file.name;
                this.size = file.size;
                this.type = file.type;
                this.lastModified = file.lastModified;
                this.lastModifiedDate = file.lastModifiedDate;
            }
            return PromptParameterImageResultFile;
        }());
        Prompt.PromptParameterImageResultFile = PromptParameterImageResultFile;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterOption = (function () {
            function PromptParameterOption(title, value, selected) {
                if (selected === void 0) { selected = false; }
                this.title = title;
                this.value = value;
                this.selected = selected;
            }
            return PromptParameterOption;
        }());
        Prompt.PromptParameterOption = PromptParameterOption;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
var BrickyEditor;
(function (BrickyEditor) {
    var Prompt;
    (function (Prompt) {
        var PromptParameterOptions = (function (_super) {
            __extends(PromptParameterOptions, _super);
            function PromptParameterOptions(key, title, options, value, placeholder) {
                var _this = _super.call(this, key, title, value, placeholder) || this;
                _this.options = [];
                options.forEach(function (kv) {
                    _this.options.push(new Prompt.PromptParameterOption(kv[0], kv[1], kv[1] == value));
                });
                return _this;
            }
            PromptParameterOptions.prototype.getEditor = function () {
                var options = BrickyEditor.Common.arrayMap(this.options, function (opt) {
                    return "<option value=\"" + opt.value + "\" " + (opt.selected ? "selected" : "") + ">" + (opt.title ? opt.title : opt.value) + "</option>";
                });
                return $("<select type=\"text\" id=\"" + this.key + "\" class=\"brickyeditor-input\" placeholder=\"" + this.placeholder + "\">" + options + "</select>");
            };
            return PromptParameterOptions;
        }(Prompt.PromptParameter));
        Prompt.PromptParameterOptions = PromptParameterOptions;
    })(Prompt = BrickyEditor.Prompt || (BrickyEditor.Prompt = {}));
})(BrickyEditor || (BrickyEditor = {}));
