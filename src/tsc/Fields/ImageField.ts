namespace BrickyEditor {
    export namespace Fields {
        export class ImageField extends BaseField {

            bind() {
                let field = this;
                let $field = this.$field;
                let data = this.data;

                if(!this.data.src) {
                    this.data.src = TemplateService.getFieldValue($field, 'src');
                }
                $field.attr("src", this.data.src);                
                $field.on('click', function() {
                    field.block.editor.modal.promptAsync(field.getPromptParams())                    
                    .done(fields => {
                        var file = fields.first(f => f.key === 'file').value;
                        var src = fields.first(f => f.key === 'src').value;
                        if(file) {
                            debugger;
                            field.setFile(file);
                            field.setSrc(null);
                        }
                        else if (src) {
                            field.setSrc(src);
                            field.setFile(null);
                        }

                        var alt = fields.first(f => f.key === 'alt').value;
                        field.setAlt(alt);
                    });
                });
            }

            private getPromptParams() : Array<Prompt.PromptParameter> {
                return [
                    new Prompt.PromptParameter('src', 'Image Link', this.data.url, 'image url'),
                    new Prompt.PromptParameterImage('file', 'or Upload file', this.data.file, 'select file'),
                    new Prompt.PromptParameter('alt', 'Alt', this.data.alt, 'alt attribute value '),
                ];
            }

            setSrc(src) {
                this.data.src = src;
                if(src) {
                    this.$field.attr("src", this.data.src);
                }
            }

            setAlt(alt) {
                this.data.alt = alt;
                this.$field.attr("alt", this.data.alt);
            }

            setFile(file) {
                this.data.file = file;
                if(file) {
                    this.$field.attr("src", this.data.file.fileContent);
                }
            }
        }
    }
}