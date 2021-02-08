use Easel::Validation;
use Bio::HMM::Logo;
use JSON 'to_json';

sub sum_ab
{
  my ($a, $b) = @_;
  return $a + $b;
}

# returning data with the current method can be a bit unpredictive
# (at least when fetching binary data), therefore we write the results
# in files directly from Perl 
# FIX: perform checks and error handling
sub dump_to_file {
  my ($content, $file_path) = @_;

  # read/write the file in non-binary format (use >:raw for binary format)
  open my $fh, '>', $file_path or die;

  # bug alert: seems like saving the file as binary or normal text doesn't make any difference
  # if($as_binary == 1){
  #   binmode $fh;
  # }

  # output result into the file
  print $fh $content;

  # close the file handler
  close($fh);

  # FIX: we should return success or failed based on the previous operation
  return 'success';
}

# FIX: return the result as HMM
sub validation_guess_input {
  my ($input, $alignment_only, $dna_rna_ok, $frag_handling) = @_;
  my $result = Easel::Validation::guessInput($input, $alignment_only, $dna_rna_ok, $frag_handling);
  return $result->{type};
}

sub validation_hmm {
  my ($input, $alignment_only, $dna_rna_ok, $frag_handling) = @_;
  my $result = Easel::Validation::guessInput($input, $alignment_only, $dna_rna_ok, $frag_handling);
  return $result->{hmmpgmd};
}

# I don't seem to be able to make this work
sub generate_logo {
  my ($file_type, $file_path, $hmmfile, $letter_height, $method, $scaled, $processing, $colorscheme) = @_;

  if($file_type == 'json') {
    my $content = Bio::HMM::Logo::hmmToLogoJson($hmmfile, $letter_height, $processing);
    return dump_to_file($content, $file_path);
  }
  
  if($file_type == 'png') {
    my $content = Bio::HMM::Logo::hmmToLogoPNG($hmmfile, $method, $scaled, $processing, $colorscheme);
    return dump_to_file($content, $file_path);
  }
  

  return dump_to_file($content, $file_path);
}

sub logo_generate_json {
  my ($hmm, $letter_height, $processing, $file_path) = @_;
  return dump_to_file(Bio::HMM::Logo::hmmToLogoJson($hmm, $letter_height, $processing), $file_path);
}

sub logo_generate_png {
  my ($hmmfile, $method, $scaled, $processing, $colorscheme, $file_path) = @_;
  my $result = Bio::HMM::Logo::hmmToLogoPNG($hmmfile, $method, $scaled, $processing, $colorscheme);

  return dump_to_file($result, $file_path);
}

sub logo_generate_svg {
  my ($hmmfile, $method, $scaled, $processing, $colorscheme, $file_path) = @_;
  return dump_to_file(Bio::HMM::Logo::hmmToLogoSVG($hmmfile, $method, $scaled, $processing, $colorscheme), $file_path);
}

sub logo_generate_raw {
  my ($hmm, $letter_height, $file_path) = @_;
  return dump_to_file(Bio::HMM::Logo::hmmToLogo($hmm, $letter_height), $file_path);

  # this is the object returned;
  # look at how it is formatted in the current website and reproduce

    # my $height_data_hashref = {
    #   alphabet          => $alphabet[$abc_type],
    #   max_height_theory => $max_height_theoretical,
    #   max_height_obs    => $max_height_observed,
    #   min_height_obs    => "$min_height_observed",
    #   height_arr        => $height_arr_ref,
    #   insert_probs      => $insertP,
    #   insert_lengths    => $insert_len,
    #   delete_probs      => $deleteP,
    #   mmline            => $mm,
    #   ali_map           => $ali_map,
    #   height_calc       => $method,
    #   processing        => $processing,
    # };
}

sub logo_generate_tabbed {
  my ($hmm, $letter_height, $file_path) = @_;
  
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
  return dump_to_file($text, $file_path);
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