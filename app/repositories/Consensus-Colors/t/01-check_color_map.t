use Test::Most tests => 1;
use JSON;
use File::Slurp;
use FindBin;

use Consensus::Colors;

my $probs_array = decode_json(read_file($FindBin::Bin . '/data/piwi_probs_array.json'));

my $cc = Consensus::Colors->new({
  probs_arr => $probs_array,
});

my $map = $cc->color_map();

my $expected = decode_json(read_file($FindBin::Bin . '/data/expected.json'));

cmp_deeply($map, $expected, 'got the expected colormap.');



