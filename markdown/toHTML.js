#!/usr/bin/node

const fs = require('fs');
const md = require('markdown-it')();
const kbd = require('markdown-it-kbd')
const markdownItAttrs = require('markdown-it-attrs');

md.use(markdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: ['id', 'class', 'target', /^regex.*$/]  // empty array = all attributes are allowed
});

md.use(kbd)

// jinja syntax
const wrapper = {
    head: `{% extends "postLayout.html" %}\n\n`,
    blockTitle: `{% block postTitle %}`,
    blockHero: `{% block postHero %}\n`,
    blockContent: `{% block postSection %}\n`,
    blockToc: `{% block toc %}\n`,
    endBlock: `{% endblock %}\n`,
}

// regex 
const regex = {
    title: /^#\s\[.+\}/g,
    IdHeading: /^##\s\[.+\}/g,
    heading: /##\s\[.+\)/g,
    mdH2: /^##\s/,
    mdAttr: /\{.+\}/,
    id: /\{#.+\}/g,
    htmlH2: /<h2>.+<\/h2>/g,
    img: /!\[.+\]\(.+\)/
}

function sectionWrap(content, ids) {
    let sectionEnd = `\n</section>\n`;

    let start = content.slice(0).search(regex.htmlH2);
    for (let i = 0; i < ids.length - 1; i++)
    {
        let secLen = content.slice(start+1).search(regex.htmlH2);

        let sectionStart = `\n<section id="${ids[i]}" class="container">\n`;

        content = content.slice(0, start) + 
            sectionStart + content.slice(start, start + secLen) + sectionEnd + 
            content.slice(start + secLen);

        start = start + sectionStart.length + secLen +
                content.slice(start + sectionStart.length + secLen).search(regex.htmlH2);
    }
    let sectionStart = `\n<section id="${ids[ids.length - 1]}" class="container">\n`;
    content = content.slice(0, start) + sectionStart + content.slice(start) + sectionEnd;
    return content;
}

const args = process.argv.slice(2);

if (args.length == 1 && args[0].match(/.+.md$/)) {
    fs.readFile(args[0], 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
    
        let mdLines = data.split('\n');
        if (mdLines.length) {
            let mdHero = data.slice(data.search(regex.title), data.search(regex.heading));
            let hero = md.render(mdHero);
            
            let mdToc = '';                                 // table of contents in md
            let ids = [];                                   // heading ids
            mdLines = mdLines.map((line) => {
                // create table of contents
                if (line.match(regex.IdHeading)) {
                    let id = line.match(regex.id);        // get the id
                    ids.push(id[0].slice(2, id[0].length - 1));
    
                    line = line.replace(regex.mdAttr, '');      // remove id 
                    let li = line.replace(regex.mdH2, '* ');     // convert to li
                    mdToc += li + '\n';
                }
                
                // fix img links
                if (line.match(regex.img)) {
                    line = line.replace('..', '.');
                }

                return line;
            })
            let toc = md.render(mdToc);
            let src = ''
            mdLines.forEach((line) => {
                src += line + '\n';
            })

            // page title
            let title = mdLines[0].slice(mdLines[0].search(/\[/)+1, mdLines[0].search(/\]/)) + ' | ';
            let mdContent = src.slice(src.search(regex.heading), src.length);
            let content = md.render(mdContent);
    
            let wrappedContent = sectionWrap(content, ids);

            // final page
            let result = wrapper.head + wrapper.blockTitle + title + wrapper.endBlock + 
                        wrapper.blockHero + hero + wrapper.endBlock + 
                        wrapper.blockContent + wrappedContent + wrapper.endBlock +
                        wrapper.blockToc + toc + wrapper.endBlock;
            
            let outFile = args[0].slice(0, args[0].length - 2) + 'html'
            fs.writeFile(`../templates/${outFile}`, result, (err) => {
                if (err) {
                    console.error(err);
                }
            })
        }
    })
} else {
    console.log('Usage: node toHTML.js [input.md] [output.html]');
}