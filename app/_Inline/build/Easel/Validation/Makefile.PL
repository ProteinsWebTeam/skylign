use ExtUtils::MakeMaker;
my %options = %{
{
  'INC' => '-iquote"/tmp" -I/repositories/hmmer/easel -I/repositories/hmmer/src',
  'TYPEMAPS' => [
    '/usr/local/lib/perl5/5.30.3/ExtUtils/typemap'
  ],
  'NAME' => 'Easel::Validation',
  'VERSION' => '0.00',
  'LIBS' => [
    '-L/repositories/hmmer/easel -L/repositories/hmmer/src -lhmmer -leasel -lsvml -lirc'
  ]
}
};
WriteMakefile(%options);

# Remove the Makefile dependency. Causes problems on a few systems.
sub MY::makefile { '' }
