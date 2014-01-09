---
layout: post
title: "LaTeX and the Kindle"
description: "How I structure my LaTeX projects"
category: 
tags: [LaTeX, Programming, Notes, Linux]
---

{% include JB/setup %}

Just before Christmas I bought a Kindle, the main justification being that I
could use it to read my university course notes on there rather than printing
them all off and wasting reams of paper.

The problem
-------------

I use [LaTeX](http://en.wikipedia.org/wiki/LaTeX) to produce my notes as `.pdf`
files, that up to now, have been formatted as A4 sized documents. However, if
you've ever tried to view a pdf file on a
[kindle](http://www.amazon.co.uk/gp/product/B007HCCOD0/ref=ksfs_sz) (I've got
the basic model), then you'll know that it maps each page of the pdf file on to
the screen without any scaling. Ah.

This is an understandable decision on Amazon's part; the pdf format was created
to be like 'digital paper', and so it might not be wise (or even feesable) to
just reformat the file so that it fits nicely on the screen of the kindle.
Uunfortunately, this results in the page being squashed down to less than half
it's original size, resulting in minute, even unreadable text. The kindle does
offer zoom functionality, but it's a pain to use, and ruins the experience.

The solution was to set up my project so that two pdf files would be created
when I compiled my notes file; one would be A4 formatted, and the other sized to
fit a kindle screen.

<!--more-->

The solution
-------------

I decided that the easiest and most logical way to produce two output pdf files
was to split my LaTeX source file into multiple parts:
 - `content.tex` - holds the actual content of the notes.
 - `packages.tex` - holds the LaTeX packages required by the content file.
 - `meta.tex` - holds information such as the name of the author and the title of the file.
 - `notes.tex` - contains the style information for formatted A4 notes
 - `kindle.tex` - contains the style information for kindle formatted notes.

I then have a bash script that I run in order to compile the project and
generate the pdf files:

{% highlight bash linenos=table %}
#!/bin/bash
aspell -t check content.tex
aspell -t check meta.tex
pdflatex notes.tex
pdflatex kindle.tex
{% endhighlight %}

When I run `build.sh`, the content files get spell checked and then both the
notes and kindle files get compiled to produce `notes.pdf` and `kindle.pdf`.

At the most basic level, the notes and kindle LaTeX files contain:

{% highlight latex linenos=table %}
\documentclass{article}

% =========================
% Import packages required to style the file here (ommitted for brevity)
% =========================

% Import the packages required for content.tex
\input{packages.tex}

% =========================
% Style code goes here (ommitted for brevity)
% =========================

\begin{document}

% Get the author, the title etc
\input{meta.tex}

\maketitle

% Get the content of the file
\input{content.tex}

\end{document}
{% endhighlight %}

The `packages.tex` file contains all the packages used by `content.tex`, and
varies between different projects. The `meta.tex` file is more intresting, since
it defines macros for the title and author name:

{% highlight latex linenos=table %}
% Set the author and title
\newcommand{\Author}{Todd Davies} 
\newcommand{\Title}{Title goes here}

% Meta
\author{\Author}
\title{\Title}
{% endhighlight %}

Accomodating for the kindle
-----------------------------

In order to get the best layout for the kindle, I used the A5 paper size, and a
14pt text size and margins of 1cm:

{% highlight latex linenos=table %}
\documentclass[a5paper]{article}

% Lets make the text nice and big
\usepackage[14pt]{extsizes}

% Make the borders really small
\usepackage[left=1cm,
            top=1cm,
            right=1cm,
            bottom=1cm,
            marginparwidth=0mm,
            marginparsep=0mm]{geometry}
{% endhighlight %}

I also used the `breqn` package along with the `dmath` environment to split my
equations over multiple lines if they exceeded the page width.

I make extensive use of margin paragraphs in my notes, in fact, I have an extra
wide right margin for them in the A4 version. However, they cause the text size
of the page on the kindle to change between pages, since it will zoom out so
that the margin can be seen on pages with margin paragraphs, and it will zoom in
to omit the margin on pages without margin paragrahs. This was a big problem,
since there was a lot of valuble information in there, so merely ommitting them
from the kindle notes would be a shame.

The solution was to make margin paragraphs inline on the kindle, to do this, I
put this code in my `kindle.tex` file:

{% highlight latex lineos=table %}
% Make margin paragrahs inline
\renewcommand{\marginpar}[1]{
\begin{tcolorbox}[colback=white!5,colframe=white!40!black,title=Note:]
#1
\end{tcolorbox}}
{% endhighlight %}

The margin paragrahs now appear in the main body of the text, wrapped in a box
that picks them out as containing extra information or remarks.

I've got the a [template project](https://github.com/Todd-Davies/latex-template)
set up on Github if you want to look at it. Any suggestions are welcome!