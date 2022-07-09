const fs = require('fs');
const md = require('markdown-it')();
const markdownItAttrs = require('markdown-it-attrs');

md.use(markdownItAttrs, {
    allowedAttributes: ['id', 'class', 'target', /^regex.*$/]
});

md.use(markdownItAttrs, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: []  // empty array = all attributes are allowed
});

// jinja syntax
const jinjaStr = {
    head: `{% extends "postLayout.html" %}\n\n`,
    blockTitle: `{% block postTitle %}\n`,
    blockContent: `{% block postSection %}\n`,
    blockToc: `{% block toc %}\n`,
    endBlock: `{% endblock %}\n`
}

// regex 
const regex = {
    title: /^#\s\[.+\}/g,
    heading: /^##\s\[.+\}/g,
    mdH2: /^##\s/,
    mdAttr: /\{.+\}/
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
        mdLines.forEach((line) => {
            if (line.match(regex.heading)) {
                line = line.replace(regex.mdH2, '* ');
                line = line.replace(regex.mdAttr, '');

                mdToc += line + '\n';
            }
        })
        let toc = md.render(mdToc);

        let start = data.search(/##\s\[.+\}/g);
        let end = data.length;
        let src = data.slice(start, end);

        let content = md.render(src);

        let result = jinjaStr.head + jinjaStr.blockTitle + title + jinjaStr.endBlock + 
                    jinjaStr.blockContent + content + jinjaStr.endBlock +
                    jinjaStr.blockToc + toc + jinjaStr.endBlock;
        
        fs.writeFile('../templates/post.html', result, (err) => {
            if (err) {
                console.error(err);
            }
        })
    }
})