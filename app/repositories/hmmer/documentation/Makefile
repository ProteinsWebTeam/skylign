top_srcdir     = ..
srcdir         = .


QUIET_SUBDIR0 = +${MAKE} -C #space separator after -c
QUIET_SUBDIR1 = 
ifndef V
	QUIET_SUBDIR0 = +@subdir=
	QUIET_SUBDIR1 = ; echo '    ' SUBDIR $$subdir; \
		        ${MAKE} -C $$subdir
endif


.PHONY: pdf install uninstall clean distclean

pdf:
	${QUIET_SUBDIR0}userguide ${QUIET_SUBDIR1} pdf

install: 
	${QUIET_SUBDIR0}man       ${QUIET_SUBDIR1} install

uninstall:
	${QUIET_SUBDIR0}man       ${QUIET_SUBDIR1} uninstall

clean:
#Use 'ifneq' instead of 'test -e' because the '+@' in QUIET_SUBDIR0 can't
#be passed to the shell. Note that ifneq breaks if indented.
ifneq (,$(wildcard userguide/.))
	${QUIET_SUBDIR0}userguide ${QUIET_SUBDIR1} clean
endif
	${QUIET_SUBDIR0}man       ${QUIET_SUBDIR1} clean;
	-rm -f *~

distclean:
#See above for explanation of 'ifneq' usage
ifneq (,$(wildcard userguide/.))
	${QUIET_SUBDIR0}userguide ${QUIET_SUBDIR1} distclean
endif
	${QUIET_SUBDIR0}man       ${QUIET_SUBDIR1} distclean
	-rm -f Makefile

################################################################
# @LICENSE@
# 
# SVN $URL$
# SVN $Id$
################################################################
