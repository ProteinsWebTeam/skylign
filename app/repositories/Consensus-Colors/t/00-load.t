use Test::More tests => 1;

BEGIN {
  use_ok( 'Consensus::Colors' ) || print "Bail out!\n";
}

diag( "Testing Consensus::Colors $Consensus::Colors::VERSION, Perl $], $^X" );
