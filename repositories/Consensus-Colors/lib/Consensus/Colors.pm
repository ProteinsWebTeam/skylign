use strict;
use warnings;
package Consensus::Colors;
use Moose;

# ABSTRACT: An abstract on what this package does

has probs_arr => (
 is       => 'ro',
 isa      => 'ArrayRef',
 required => 1,
);

has grey => (
  is      => 'ro',
  isa     => 'Str',
  default => '#7a7a7a',
);

sub color_map {
  my $self = shift;

  my @thresholds = qw(0.50 0.60 0.80 0.85);

  my %hydro    = map { $_ => 1 } qw(W L V I M A F C Y H P);#Hydrophobic
  my %polar    = map { $_ => 1 } qw(Q N); #Polar, non-alcohol
  my %positive = map { $_ => 1 } qw( K R H ); #Basic
  my %alcohol  = map { $_ => 1 } qw( S T ); #Polar, alcohol
  my %negative = map { $_ => 1 } qw( E D); #Acids
  my $consensus;



  my %cons = ();

  foreach my $column ( @{ $self->probs_arr } ) {
    foreach my $threshold (@thresholds){
      my %score = ();

      foreach my $aa_prob (@$column) {
        my ($aa, $prob) = split(/:/, $aa_prob);
        $score{$aa} = $prob;

        if ( $polar{ $aa } ) {
          $score{'p'} += $prob;
          next;
        }

        if ( $alcohol{$aa} ) {
          $score{'o'} += $prob;
          next;
        }

        if ( $negative{$aa}  ) {
          $score{'-'} += $prob;
          next;
        }

        if ( $positive{$aa} ) {
          $score{'+'} += $prob;
        }

        if ( $hydro{$aa} ) {
          $score{'h'} += $prob;
        }
      }
      my $consensusCol =  arbitrate($threshold, \%score);
      push(@{ $cons{ $threshold } }, $consensusCol);
    }
  }

  my @colors = ();
#Now based on the consensus assign a color per residue for that column. The default is going to be black.
  for(my $i = 0; $i < scalar @{ $self->probs_arr }; $i++ ){
    $self->D( $i, \%cons, \@colors );
    $self->R( $i, \%cons, \@colors );
    $self->Q( $i, \%cons, \@colors );
    $self->N( $i, \%cons, \@colors );
    $self->K( $i, \%cons, \@colors );
    $self->E( $i, \%cons, \@colors );
    $self->HY( $i, \%cons, \@colors );
    $self->ACFILMVW( $i, \%cons, \@colors );
    #Colour alcohol.....
    $self->ST( $i, \%cons, \@colors );
    #Proline and Glycine get fixed colors....
    $self->PG( $i, \%cons, \@colors );
  }
  return \@colors;
}

#-------------------------------------------------------------------------------
sub HY {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;

  $colorsRef->[$pos]->{H} = $self->grey;
  $colorsRef->[$pos]->{Y} = $self->grey;

  my $cyan = '#99FFFF';
  if($consensuses->{'0.60'}->[$pos] eq 'h'){
    $colorsRef->[$pos]->{H} = $cyan;
    $colorsRef->[$pos]->{Y} = $cyan;
    return 1;
  }


  foreach my $aa (qw( A C F H I L M V W Y P Q h ) ){
    if($consensuses->{0.85}->[$pos] eq $aa){

      $colorsRef->[$pos]->{H} = $cyan;
      $colorsRef->[$pos]->{Y} = $cyan;
      return 1;
    }
  }

  return 1;
}

#-------------------------------------------------------------------------------
sub ST {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;

  $colorsRef->[$pos]->{S} = $self->grey;
  $colorsRef->[$pos]->{T} = $self->grey;

  if ( $consensuses->{'0.50'}->[$pos] eq 'a' or
                  $consensuses->{'0.50'}->[$pos] eq 'S' or
                  $consensuses->{'0.50'}->[$pos] eq 'T' ){
    ##99FF99
    $colorsRef->[$pos]->{S} = '#99FF99';
    $colorsRef->[$pos]->{T} = '#99FF99';
    return 1;
  }

  foreach my $aa (qw(A C F H I L M V W Y P Q)){
    if( $consensuses->{'0.85'}->[$pos] eq $aa ){
      $colorsRef->[$pos]->{S} = '#99FF99';
      $colorsRef->[$pos]->{T} = '#99FF99';
      return 1;
    }
  }
}

sub ACFILMVW {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;

  my @aa = ( qw( A C F L I M V W ) );

  foreach my $aa (@aa){
    $colorsRef->[$pos]->{$aa} = $self->grey;
    foreach my $caa ( qw( A C F H I L M V W Y P Q h ) ) {
      $colorsRef->[$pos]->{$aa} = '#9999FF'
         if $consensuses->{'0.60'}->[$pos] eq $caa;
    }
  }
  return 1;
}
#-------------------------------------------------------------------------------

sub D {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;
  $colorsRef->[$pos]->{D} = $self->grey;

  my $red = '#FF9999';

  if ( $consensuses->{'0.60'}->[$pos] eq '+' or
                  $consensuses->{'0.60'}->[$pos] eq 'R' or
                  $consensuses->{'0.60'}->[$pos] eq 'K' ){
    $colorsRef->[$pos]->{D} = $red;
    return 1;
  }

  foreach my $aa ( qw( D E N ) ) {
    if( $consensuses->{'0.85'}->[$pos] eq $aa){
      $colorsRef->[$pos]->{D}= $red;
      return 1;
    }
  }

  if ( $consensuses->{'0.50'}->[$pos] eq '-' or
       $consensuses->{'0.60'}->[$pos] eq 'E' or
       $consensuses->{'0.60'}->[$pos] eq 'D' ){
     $colorsRef->[$pos]->{D}= $red;
     return 1;
  }

  return 1;
}

#-------------------------------------------------------------------------------
sub E {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;
  $colorsRef->[$pos]->{E} = $self->grey;

  my $red = '#FF9999';

  if ( $consensuses->{'0.60'}->[$pos] eq '+' or
                  $consensuses->{'0.60'}->[$pos] eq 'R' or
                  $consensuses->{'0.60'}->[$pos] eq 'K' ){
    $colorsRef->[$pos]->{E} = $red;
    return 1;
  }

  foreach my $aa ( qw( D E ) ) {
    if( $consensuses->{'0.85'}->[$pos] eq $aa){
      $colorsRef->[$pos]->{E}= $red;
      return 1;
    }
  }

  if ( $consensuses->{'0.50'}->[$pos] eq 'b' or
       $consensuses->{'0.50'}->[$pos] eq 'E' or
       $consensuses->{'0.50'}->[$pos] eq 'Q' ){
     $colorsRef->[$pos]->{E}= $red;
     return 1;
  }

  return 1;
}
#-------------------------------------------------------------------------------
sub K {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;
  $colorsRef->[$pos]->{K} = $self->grey;

  my $red = '#FF9999';

  if ( $consensuses->{'0.60'}->[$pos] eq '+' or
       $consensuses->{'0.60'}->[$pos] eq 'R' or
       $consensuses->{'0.60'}->[$pos] eq 'K' ){
    $colorsRef->[$pos]->{K} = $red;
    return 1;
  }

  foreach my $aa ( qw( K R Q ) ) {
    if( $consensuses->{'0.85'}->[$pos] eq $aa){
      $colorsRef->[$pos]->{K} = $red;
      return 1;
    }
  }
  return 1;
}

#-------------------------------------------------------------------------------

sub N {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;
  $colorsRef->[$pos]->{N} = $self->grey;

  my $green =  '#99FF99';

  if ($consensuses->{'0.50'}->[$pos] eq 'N'){
    $colorsRef->[$pos]->{N} = $green;
    return 1;
  }

  if ( $consensuses->{'0.85'}->[$pos] eq 'D' ) {
    $colorsRef->[$pos]->{N} = $green;
    return 1;
  }

  return 1;

}



#-------------------------------------------------------------------------------
sub Q {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;
  $colorsRef->[$pos]->{Q} = $self->grey;

  my $green = '#99FF99';

  if ( $consensuses->{'0.50'}->[$pos] eq 'b' or
        $consensuses->{'0.50'}->[$pos] eq 'E' or
        $consensuses->{'0.50'}->[$pos] eq 'Q' ){
      $colorsRef->[$pos]->{Q} = $green;
      return 1;
  }

  foreach my $aa ( qw( Q T K R ) ) {
    if ( $consensuses->{'0.85'}->[$pos] eq $aa ){
      $colorsRef->[$pos]->{Q} = $green;
      return 1;
    }
  }

  if ( $consensuses->{'0.60'}->[$pos] eq '+' or
                  $consensuses->{'0.60'}->[$pos] eq 'K' or
                  $consensuses->{'0.50'}->[$pos] eq 'R' ){
      $colorsRef->[$pos]->{Q} = $green;
      return 1;
  }

  return 1;
}

#-------------------------------------------------------------------------------

sub R {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;
  $colorsRef->[$pos]->{R} = $self->grey;

  my $red = '#FF9999';

  foreach my $aa ( qw( Q K R ) ) {
     if( $consensuses->{'0.85'}->[$pos] eq $aa){
      $colorsRef->[$pos]->{R} = $red;
      return 1;
    }
  }

  if ( $consensuses->{'0.60'}->[$pos] eq '+' or
       $consensuses->{'0.60'}->[$pos] eq 'R' or
       $consensuses->{'0.60'}->[$pos] eq 'K' ){
    $colorsRef->[$pos]->{R} = $red;
    return 1;

  }

  return 1;
}


#-------------------------------------------------------------------------------
sub PG {
  my ( $self, $pos, $consensuses, $colorsRef ) = @_;

  $colorsRef->[$pos]->{P} = '#ffff11' ; #yellow
  $colorsRef->[$pos]->{G} = '#ff7f11'; #orange
  return 1;
}


sub arbitrate {
  my ( $threshold, $scoreRef ) = @_;

  my ( $bestclass, $bestscore ) = ( ".", 0 );

  #key
  # "." any
  # "h" hydro
  # "+" positive
  # "-" negative
  # "o" alchohol
  # "p"  polar, not alcohol

  my %classSize = (
    '.' => 20,
    'h' => 11,
    '+' => 3,
    '-' => 2,
    'o' => 2,
    'p' => 2
  );

  #choose smallest class exceeding threshold and
  #highest percent when same size

  foreach my $class ( keys %{ $scoreRef } ) {

      if ( $scoreRef->{$class} >= $threshold ) {
        my $a = defined($classSize{$class}) ? $classSize{$class} : 1;
        my $b = defined($classSize{$bestclass}) ? $classSize{$bestclass} : 1;

        #this set is worth considering further
        if ( $a < $b ) {

          #new set is smaller: keep it
          $bestclass = $class;
          $bestscore = $scoreRef->{$class};

        }
        elsif ( $a == $b ) {

          #sets are same size: look at score instead
          if ( $scoreRef->{$class} > $bestscore ) {

            #new set has better score
            $bestclass = $class;
            $bestscore = $scoreRef->{$class};
          }
        }
      }
  }
  return $bestclass;
}

1;
