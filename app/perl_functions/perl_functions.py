# here we define the python equivalents of the perl functions defined in
# perl_functions/perl_functions.pm by relying on perlfunc.py script; it may be
# better in the future to implement the perl functions in a way that could be
# called directly from terminal without relying on intermediate scripts

import os
import sys
from perlfunc import perl5lib, perlfunc, perlreq

# perl libraries

libraries = [
    os.path.join(sys.path[1], "repositories/LogoServer/lib/"),
    os.path.join(sys.path[1], "repositories/Consensus-Colors/lib/"),
    os.path.join(sys.path[1], "repositories/Bio-HMM-Logo/lib/Bio/HMM"),
    '/nfs/public/rw/xfam/skylign/live/perl5/lib/perl5/',
    '/nfs/public/rw/xfam/skylign/live/perl5/lib/perl5/x86_64-linux-thread-multi/'
]

# perl script

perl_functions = os.path.join(sys.path[1], "perl_functions/perl_functions.pm")

# porting perl functions to python via perlfunc.py

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def store_hmm_and_return_file_type(inputData, frag_handling, alignment_only, file_path):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def generate_logo(
    file_type, file_path, hmmfile, letter_height, scaled, processing, colorscheme
):
    pass
