const fs = require('fs');
const md = require('markdown-it')();
const markdownItAttrs = require('markdown-it-attrs');

md.use(markdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: ['id', 'class', 'target', /^regex.*$/]  // empty array = all attributes are allowed
});

// jinja syntax
const wrapper = {
    head: `{% extends "postLayout.html" %}\n\n`,
    blockTitle: `{% block postTitle %}\n`,
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
    htmlH2: /<h2>.+<\/h2>/g
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

fs.readFile('./post.md', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let mdLines = data.split('\n');
    if (mdLines.length) {
        let mdTitle = mdLines[0].match(regex.title);
        let title = md.render(mdTitle[0]);
        
        let mdToc = '';
        let ids = [];
        mdLines = mdLines.map((line) => {
            if (line.match(regex.IdHeading)) {
                let id = line.match(regex.id);        // get the id
                ids.push(id[0].slice(2, id[0].length - 1));

                line = line.replace(regex.mdAttr, '');      // remove id
                let li = line.replace(regex.mdH2, '* ');     // convert to li
                mdToc += li + '\n';
            }
            return line;
        })
        let toc = md.render(mdToc);
        let src = ''
        mdLines.forEach((line) => {
            src += line + '\n';
        })

        let mdContent = src.slice(src.search(regex.heading), src.length);

        let content = md.render(mdContent);

        let wrappedContent = sectionWrap(content, ids);

        let result = wrapper.head + wrapper.blockTitle + title + wrapper.endBlock + 
                    wrapper.blockContent + wrappedContent + wrapper.endBlock +
                    wrapper.blockToc + toc + wrapper.endBlock;
        
        // console.log(result);
        
        fs.writeFile('../templates/post.html', result, (err) => {
            if (err) {
                console.error(err);
            }
        })
    }
})