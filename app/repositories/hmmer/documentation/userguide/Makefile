top_srcdir     = ../..
srcdir         = .

SHELL          = /bin/sh

# Installation targets
#
prefix      = /nfs/public/rw/xfam/skylign/live
exec_prefix = ${prefix}
datarootdir = ${prefix}/share
bindir      = ${exec_prefix}/bin
libdir      = ${exec_prefix}/lib
includedir  = ${prefix}/include
mandir      = ${datarootdir}/man
docdir      = ${datarootdir}/doc/${PACKAGE_TARNAME}
pdfdir      = ${docdir}
mandir      = ${datarootdir}/man
man1dir     = ${mandir}/man1
man1ext     = .1

HMMER_VERSION   =  3.1b1
HMMER_DATE      = "February 2013"
HMMER_COPYRIGHT = "Copyright (C) 2011 Howard Hughes Medical Institute."

INSTALL       = /usr/bin/install -c
RMAN          = rman
SEDITION      = ${top_srcdir}/easel/devkit/sedition
RMANPROCESS   = ${top_srcdir}/easel/devkit/rmanprocess.pl

MANPAGES = \
	${top_srcdir}/documentation/man/alimask.man\
	${top_srcdir}/documentation/man/hmmalign.man\
	${top_srcdir}/documentation/man/hmmbuild.man\
	${top_srcdir}/documentation/man/hmmconvert.man\
	${top_srcdir}/documentation/man/hmmemit.man\
	${top_srcdir}/documentation/man/hmmfetch.man\
	${top_srcdir}/documentation/man/hmmpgmd.man\
	${top_srcdir}/documentation/man/hmmpress.man\
	${top_srcdir}/documentation/man/hmmscan.man\
	${top_srcdir}/documentation/man/hmmsearch.man\
	${top_srcdir}/documentation/man/hmmsim.man\
	${top_srcdir}/documentation/man/hmmstat.man\
	${top_srcdir}/documentation/man/jackhmmer.man\
	${top_srcdir}/documentation/man/nhmmer.man\
	${top_srcdir}/documentation/man/nhmmscan.man\
	${top_srcdir}/documentation/man/phmmer.man

TEXFILES =\
	ack.tex\
	formats.tex\
	glossary.tex\
	install.tex\
	introduction.tex\
	macros.tex\
	main.tex\
	more.tex\
	pipeline.tex\
	tabular.tex\
	tutorial.tex

.PHONY: pdf install uninstall clean distclean TAGS

pdf:    Userguide.pdf

Userguide.pdf: symlinks.stamp titlepage.tex copyright.tex manpages.tex
	@for prog in pdflatex bibtex; do \
	  command -v $$prog >/dev/null 2>&1 || { echo >&2 "The $$prog program is required to build the Userguide, but it's not installed. Aborting."; exit 1; } \
	done
	@echo "     LATEX Userguide.pdf  (see latex.log for output)"
	@pdflatex main   > latex.log 2>&1 
	@bibtex main    >> latex.log 2>&1 
	@pdflatex main  >> latex.log 2>&1 
	@pdflatex main  >> latex.log 2>&1 
	@mv main.pdf Userguide.pdf

symlinks.stamp:
	@if test "x${srcdir}" != "x."; then \
	   for texfile in ${TEXFILES}; do \
	      if ! (test -e $$texfile); then \
	         ln -s ${srcdir}/$$texfile . ;\
	      fi ;\
	   done ;\
	fi
	@echo "symlinks created:\c" > $@
	@date >> $@

titlepage.tex: ${srcdir}/titlepage.tex.in
	@cp -f ${srcdir}/titlepage.tex.in titlepage.tex
	@${SEDITION} HMMER_VERSION ${HMMER_VERSION} HMMER_DATE ${HMMER_DATE} titlepage.tex

copyright.tex: ${srcdir}/copyright.tex.in
	@cp -f ${srcdir}/copyright.tex.in copyright.tex
	@${SEDITION} HMMER_COPYRIGHT ${HMMER_COPYRIGHT} copyright.tex

# manpages: convert man pages to LaTeX chapter in User Guide.
#    uses PolyglotMan 3.2 "rman", and rmanprocess.pl script in easel's devkit
manpages.tex: ${MANPAGES}
	@command -v ${RMAN} >/dev/null 2>&1 || { echo >&2 "The ${RMAN} program is required to build the Userguide, but it's not installed. Aborting."; exit 1; }
	@echo "%% This chapter automatically generated. Do not edit." > manpages.tex
	@echo "\section{Manual pages}" >> manpages.tex 
	@for file in ${MANPAGES}; do\
	   ${RMAN} -f LaTeX2e $$file 2>/dev/null | ${RMANPROCESS} >> manpages.tex ;\
	done

install:
	${INSTALL} -m 0644 Userguide.pdf ${DESTDIR}${pdfdir}

uninstall:
	-rm -f  ${DESTDIR}${pdfdir}/Userguide.pdf 

clean:
	-rm -f latex.log
	-rm -f main.aux main.bbl main.blg main.log main.toc x.log *~

distclean: clean
	if test "x${srcdir}" != "x."; then \
	   for texfile in ${TEXFILES}; do \
	      rm -f $$texfile ;\
	   done ;\
	fi
	-rm -f symlinks.stamp
	-rm -f titlepage.tex copyright.tex manpages.tex
	-rm -f Userguide.pdf
	-rm -f Makefile

################################################################
# @LICENSE@
#
# SVN $URL$
# SVN $Id$
################################################################
