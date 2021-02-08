import os
from perlfunc import perl5lib, perlfunc, perlreq

# FIX: when fetching SVG the text is wrapped in single quotes, therefore to get a valid
#       SVG we need to drop the first and last characters; the same seems to be true for PNG

libraries = [
    '/app/repositories/LogoServer/lib/', 
    '/app/repositories/Consensus-Colors/lib/',
    '/app/repositories/Bio-HMM-Logo/lib/Bio/HMM'
]

perl_functions = '/app/perl_functions/perl_functions.pm'

file_dir = '/app/test_files/aln.hmm'

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def sum_ab(a, b):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def validation_guess_input(inputData, ali_hmm, dna_rna_ok, frag_handling):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def validation_hmm(inputData, ali_hmm, dna_rna_ok, frag_handling):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def generate_logo(file_type, file_path, hmmfile, letter_height, method, scaled, processing, colorscheme):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def logo_generate_json(hmm, letter_height, processing, file_path):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def logo_generate_png(hmmfile, method, scaled, processing, colorscheme, file_path):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def logo_generate_svg(hmmfile, method, scaled, processing, colorscheme, file_path):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def logo_generate_raw(hmm, letter_height, file_path):
    pass

@perlfunc
@perlreq(perl_functions)
@perl5lib(*libraries)
def logo_generate_tabbed(hmm, letter_height, file_path):
    pass


if __name__ == "__main__":

    print(myfunc(1, 3))  # Should print 4

    # print(file_content[:10])

    print(validation_guess_input(open(file_dir).read(), 3, 0, 'full'))

    print('done')

    # print(generate_json(file_dir, 'info_content_all', 'hmm'))

    print('done')

    png_file = logo_generate_png(file_dir, 'info_content_all', 1, 'hmm', 'default')

    with open('test_png.png', 'wb') as f:
        f.write(png_file[1:-1])

    print('done')

    png_file = logo_generate_svg(file_dir, 'info_content_all', 1, 'hmm', 'default')

    with open('test_svg.svg', 'w') as f:
        f.write(png_file[1:-1])

    print('done')