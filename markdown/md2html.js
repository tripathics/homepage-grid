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

// extract TOC from md file
function extractToc(mdStr) {
    // rejex for matching with headings
    const hRegex = /#{2,3}\s\[.+\}/g;
    
    let headings = mdStr.match(hRegex);   // array of headings

    let tocList = headings.map((h) => {
        h = h.replace(/^#{2}\s/, '* ');
        h = h.replace(/^#{3}\s/, '\t* ');
        h = h.replace(/\{.+\}/, '');     // remove id attribute
        return h;
    });

    let toc = '';
    tocList.forEach(l => {
        toc += l + '\n';
    })
    return toc;
}

fs.readFile('./post.md', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // jinja block starts and ends
    const blockPost = `{% extends "postLayout.html" %}

    {% block postSection %}
    `
    const endBlockPost = `{% endblock %}
    `
    const blockToc = `
    {% block toc %}
    `
    const endBlockToc = `
    {% endblock %}
    `

    let src = data + '\n';
    let toc = extractToc(src);

    let srcRendered = md.render(src);
    let tocRendered = md.render(toc); 

    let result = blockPost + srcRendered + endBlockPost + blockToc + tocRendered + endBlockToc;
    
    fs.writeFile('../templates/post.html', result, err => {
        if (err) {
            console.error(err);
        }
    });
})

