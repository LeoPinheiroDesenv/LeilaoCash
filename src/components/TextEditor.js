import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Autoformat,
    Bold,
    Italic,
    Underline,
    BlockQuote,
    Base64UploadAdapter,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    Indent,
    IndentBlock,
    Link,
    List,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    Alignment,
    Font,
    SourceEditing,
    HtmlEmbed,
    GeneralHtmlSupport
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';
import './TextEditor.css';

const TextEditor = ({ value, onChange, placeholder = 'Digite seu conteúdo aqui...' }) => {
    return (
        <div className="text-editor-wrapper">
            <CKEditor
                editor={ClassicEditor}
                data={value || ''}
                config={{
                    placeholder: placeholder,
                    toolbar: {
                        items: [
                            'undo', 'redo',
                            '|',
                            'sourceEditing', 'htmlEmbed',
                            '|',
                            'heading',
                            '|',
                            'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
                            '|',
                            'bold', 'italic', 'underline',
                            '|',
                            'link', 'insertImage', 'insertTable', 'mediaEmbed',
                            '|',
                            'alignment',
                            'bulletedList', 'numberedList', 'outdent', 'indent',
                            '|',
                            'blockQuote'
                        ],
                        shouldNotGroupWhenFull: true
                    },
                    plugins: [
                        Autoformat,
                        BlockQuote,
                        Bold,
                        CloudServices,
                        Essentials,
                        Heading,
                        Image,
                        ImageCaption,
                        ImageResize,
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Base64UploadAdapter,
                        Indent,
                        IndentBlock,
                        Link,
                        List,
                        MediaEmbed,
                        Mention,
                        Paragraph,
                        PasteFromOffice,
                        PictureEditing,
                        Table,
                        TableColumnResize,
                        TableToolbar,
                        TextTransformation,
                        Alignment,
                        Font,
                        SourceEditing,
                        HtmlEmbed,
                        GeneralHtmlSupport
                    ],
                    heading: {
                        options: [
                            { model: 'paragraph', title: 'Parágrafo', class: 'ck-heading_paragraph' },
                            { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                            { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                            { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' },
                            { model: 'heading4', view: 'h4', title: 'Título 4', class: 'ck-heading_heading4' }
                        ]
                    },
                    image: {
                        toolbar: [
                            'imageTextAlternative',
                            'toggleImageCaption',
                            'imageStyle:inline',
                            'imageStyle:block',
                            'imageStyle:side'
                        ]
                    },
                    table: {
                        contentToolbar: [
                            'tableColumn',
                            'tableRow',
                            'mergeTableCells',
                            'tableCellProperties',
                            'tableProperties'
                        ]
                    },
                    htmlSupport: {
                        allow: [
                            {
                                name: /.*/,
                                attributes: true,
                                classes: true,
                                styles: true
                            }
                        ]
                    },
                    licenseKey: 'GPL'
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
            />
        </div>
    );
};

export default TextEditor;
