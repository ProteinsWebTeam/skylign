use strict;
use warnings;
use Inline::MakeMaker;
use Cwd;

# since these files get called from different locations during compilation and execution time
# issues arise when we try to load the path dinamically; the paths are therefore hard encoded
# and we just uncomment the relevant line in staging and live environments

my $app_path;

# docker
$app_path = '/app/';

# staging
# $app_path = '/nfs/public/rw/xfam/skylign/staging/';

# live
# $app_path = '/nfs/public/rw/xfam/skylign/live_django/';

my $orig_location = getcwd;

# need to get included src compiled here:
# cd to src dir
my $hmmer_src = __FILE__;

warn $hmmer_src, "\n";

$hmmer_src =~ s/Makefile.PL/src/;

chdir $hmmer_src;

system("./configure");
system("make");

chdir $orig_location;

WriteMakefile(
    NAME                => 'Bio::HMM::Logo',
    AUTHOR              => q{Jody Clements <clementsj@janelia.hhmi.org>},
    VERSION_FROM        => "$app_path/repositories/Bio-HMM-Logo/lib/Bio/HMM/Logo.pm",
    ABSTRACT_FROM       => "$app_path/repositories/Bio-HMM-Logo/lib/Bio/HMM/Logo.pm",
    ($ExtUtils::MakeMaker::VERSION >= 6.3002
      ? ('LICENSE'=> 'perl')
      : ()),
    PL_FILES            => {},
    PREREQ_PM => {
        'File::Slurp'       => 0,
        'Test::More'        => 0,
        'Test::Deep'        => 0,
        'Test::Warn'        => 0,
        'Consensus::Colors' => 0,
        'Imager'            => 0,
        'SVG'               => 0,
        'JSON'              => 0,
    },
    CONFIGURE_REQUIRES  =>  {
      'Inline::MakeMaker'     => 0.45,
      'ExtUtils::MakeMaker'   => 6.52,
    },
    dist                => { COMPRESS => 'gzip -9f', SUFFIX => 'gz', },
    clean               => { FILES => 'Bio-HMM-Logo-* _Inline Logo.inl' },
);
