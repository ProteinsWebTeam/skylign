use Easel::Validation;
use Bio::HMM::Logo;
use JSON 'to_json';

use Data::Printer;

# returning data with the current method can be a bit unpredictive
# (at least when fetching binary data), therefore we write the results
# in files directly from Perl 
sub dump_to_file {
  my ($content, $file_path) = @_;

  # read/write the file in non-binary format (use >:raw for binary format)
  # (it doesn't seem like opening the file in binary or non-binary format)
  open my $fh, '>', $file_path or die;

  # output result into the file
  print $fh $content;

  # close the file handler
  close($fh);
  
  return 'success';
}

# unifies the above two functions
sub store_hmm_and_return_file_type {
  my ($input, $frag_handling, $alignment_only, $file_path) = @_;

  # in Skylign $dna_rna_ok is always 1
  my $result = Easel::Validation::guessInput($input, $alignment_only, 1, $frag_handling);

  # store the hmm
  dump_to_file($result->{hmmpgmd}, $file_path);

  # return the file type
  return $result->{type};
}

# generates logo according to requested type
sub generate_logo {
  my ($file_type, $file_path, $hmmfile, $letter_height, $processing, $colorscheme) = @_;
  my $scaled = 1;

  # hmmToLogoPNG will scale the image if $scaled is not undefined, regardless of its value
  if ($file_type != 'spng') {
    undef $scaled;
  }

  # declaring "my content" within an if makes the variable become blank outside of the if scope
  # therefore we declare the "else" value as initial
  my $content = 'error';

  if ($file_type eq 'json') {
    $content = Bio::HMM::Logo::hmmToLogoJson($hmmfile, $letter_height, $processing);
  } elsif ($file_type eq 'png' or $file_type eq 'spng') {
    $content = Bio::HMM::Logo::hmmToLogoPNG($hmmfile, $letter_height, $scaled, $processing, $colorscheme);
  } elsif ($file_type eq 'svg') {
    $content = Bio::HMM::Logo::hmmToLogoSVG($hmmfile, $letter_height, $scaled, $processing, $colorscheme);
  } elsif ($file_type eq 'text') {
    $content = logo_generate_tabbed($hmmfile, $letter_height);
  }

  return dump_to_file($content, $file_path, $file_type);
}

sub logo_generate_tabbed {
  my ($hmm, $letter_height) = @_;

  # mostly just a copy-paste of the original function in LogoServer 
  
  my $data = Bio::HMM::Logo::hmmToLogo($hmm, $letter_height);
  my @keys = keys %$data;

  my $sorted = logo_sort_residues($data->{height_arr}->[0]);
  my $letter_header = join "\t", @$sorted;

  my $height_header = "\t" x scalar @$sorted;
  my $text = qq(# Theoretical Max Height\t$data->{max_height_theory}
# Observed Max Height\t$data->{max_height_obs}
# Column\tHeights${height_header}Expected Insert Length\tInsert Probability\tDelete Probability\tModel Mask
#       \t$letter_header\n);

  # get the number of columns we need
  my $length = scalar @{$data->{height_arr}};
  for (my $i = 0; $i < $length; $i++) {
    # generate the heights column
    my %residues = ();
    for my $res (@{$data->{height_arr}->[$i]}) {
      my ($letter, $value) = split(':', $res);
      $residues{$letter} = $value;
    }
    my @sorted = sort {$a cmp $b} keys %residues;

    my @sorted_vals = ();

    for my $sorted_letter (@sorted) {
      push @sorted_vals, $residues{$sorted_letter};
    }

    my $heights = join "\t", @sorted_vals;
    # build the row
    $text .= sprintf "%s\t%s\t%s\t%s\t%s\t%s\n",
      $i + 1,
      $heights,
      $data->{insert_lengths}->[$i],
      $data->{insert_probs}->[$i],
      $data->{delete_probs}->[$i],
      $data->{mmline}->[$i];
  }
  return $text;
}

sub logo_sort_residues {
  my ($residue_list) = @_;
  my %residues = ();
  # work out what letters to place in the header.
  for my $res (@$residue_list) {
    my $letter = [split(':', $res)]->[0];
    $residues{$letter}++;
  }
  my @sorted = sort {$a cmp $b} keys %residues;
  return \@sorted;
}

1;