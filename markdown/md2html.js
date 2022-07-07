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

var txt = `
## [Python](#section-h1) {#section-h1}

### [Printing 'hello, world'](#section-h10) {#section-h10}
\`\`\`python
print("hello, world")
\`\`\`
we don't need \`\`\`\\n\`\`\` or \`\`\`;\`\`\` here as we did in C

### [getting input](#section-h11) {#section-h11}

**in C:**
\`\`\`C
string answer = get_string("What's your name? ");
printf("hello, %s\\n", answer);
\`\`\`

**in Python:**
\`\`\`python
answer = get_string("What's your name? ")
print("Hello, " + answer)
\`\`\`

## [F-Strings](#section-h2) {#section-h2}

The last program can be implemented in a different way as follows

\`\`\`python
from cs50 import get_string

answer = get_string("What's your name? ")
print(f"hello, {answer}")
\`\`\`

shown in: [name-f.py](name-f.py)


Just like in C, we still have for counter variables

**in C:**
\`\`\`C
counter = 0;
counter = counter + 1;

/* or */
counter += 1;

/* or */
counter ++;
\`\`\`

**in Python**
\`\`\`python
counter = 0
counter = counter + 1

# or 
counter += 1

# this syntactic sugar does not exist
counter++
\`\`\`
## [Conditions](#section-h3) {#section-h3}

**in C:**
\`\`\`C
if (x < y)
{
    printf("x is less than y\\n");
}
\`\`\`

**in Python:**
\`\`\`python
if x < y:
    print("X is less than y")       # but indentation is must
\`\`\`
illustrated in 
- [conditions.py](conditions.py)
- [conditions2.py](conditions2.py)
- [conditions3.py](conditions3.py)


## [Loops](#section-h4) {#section-h4}

**in C:**
we had \`\`\`while\`\`\`, \`\`\`for\`\`\` loops

e.g. 
\`\`\`C
while (true)
{
    printf("hello, world\\n");
}
\`\`\`

**in Python:**
\`\`\`python
while True:                     # True must be capitalized
    print("hello, world")
\`\`\`
illustrated in 
- [loop.py](loop.py)
- [loop2.py](loop2.py)
- [loop3.py](loop3.py)
- [loop4.py](loop4.py)

repeating for a number of times

**in C:**
\`\`\`C
int i = 0;
while (i < 3)
{
    printf("hello, world");
    i++;
}
\`\`\`

**in Python**
\`\`\`python
i = 0
while i < 3:
    print("hello, world")
    i += 1
\`\`\`

**like the for loop in C, we have a foreach loop in python**
\`\`\`python
for i in [0, 1, 2]:   # <-- this is a list
    print("Hello, world")
\`\`\`

## [Types](#section-h5) {#section-h5}

- Python is a "loosely typed language" while C is a "strongly typed language"

**Data types in python:**
- bool
- float
- int
- str (string)


## [Sequence types](#section-h6) {#section-h6}

**other data types:**
- range
- list (an array that resizes itself)
- tuple (for implementing comma separated values)
- dict (store) 
- set (just like in maths without duplicate elements)


## [cs50 library](#section-h7) {#section-h7}

cs50 library for python contains:
- get_string
- get_int
- get_float

we can import explicitely one function at a time
\`\`\`python
from cs50 import get_string
from cs50 import get_float

# or

import cs50
\`\`\`

## [blur.py](#section-h8) {#section-h8}

\`\`\`python
from PIL import image, imageFilter
before = Image.open("bridge.bmp")             # '.' is serving a new role here

# in C we used . to access a variable inside a struct
# in Python we can have functions inside a structure

after = before.filter(ImageFilter.BoxBlur(10))

after.save("out.bmp")
\`\`\`

## [Python Short](#section-h9) {#section-h9}
Access the [jupyter notebook](Python_short.ipynb) for short on Python
`

var toc = `
* [Python](#section-h1)
    * [Printing 'hello, world'](#section-h10)
    * [getting input](#section-h11)
* [F-Strings](#section-h2)
* [Conditions](#section-h3)
* [Loops](#section-h4)
* [Types](#section-h5)
* [cs50 library](#section-h6)
* [blur.py](#section-h7)
* [Python Short](#section-h8)
`
var txtLayoutStart = `{% extends "postLayout.html" %}

{% block postSection %}
`
var txtLayoutEnd = `{% endblock %}
`
var tocLayoutStart = `
{% block toc %}
`
var tocLayoutEnd = `
{% endblock %}
`


var res_txt = md.render(txt);
var res_toc = md.render(toc);



console.log(txtLayoutStart + res_txt + txtLayoutEnd + tocLayoutStart + res_toc + tocLayoutEnd);