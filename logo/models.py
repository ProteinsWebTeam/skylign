import uuid
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import os

import sys
sys.path.append('/app/perl_functions/')

import perl_functions as pf

# FIX: implement perl functions as simple terminal call, reducing the number of intermediaries 
# https://stackoverflow.com/questions/23039028/calling-perl-subroutines-from-the-command-line

def job_file_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'uploads/{}.txt'.format(instance.job.id)

class Job(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=200, default='pending')

    # original file name, to be kept for display purposes
    # (self.query may have a different name in case of duplicates)
    file_name = models.CharField(max_length=500, default='untitled')
    
    processing = models.CharField(max_length=50, default='hmm')
    scaled = models.IntegerField(default=1)
    frag_handling = models.CharField(max_length=50, default='full')
    letter_height = models.CharField(max_length=50, default='info_content_all')
    letter_height_display = models.CharField(max_length=50, default='')

    alignment_only = models.IntegerField(default=3)
    dna_rna_ok = models.IntegerField(default=1)

    alphabet = models.CharField(max_length=5, default='dna')
    hmm_length = models.IntegerField(default=0)
    hmm_created = models.CharField(max_length=50, default='')
    nseq = models.IntegerField(default=0)
    
    query = models.FileField(upload_to='submitted_queries')

    def initialize_fields(self):

        '''
        reads the HMM file and extrapolates all the field
        FIX: there should be a sanity check on the HMM file,
        especially with respect to what fields are actually present
        TEST: there should be an automated test downloading
        an example HMM from the latest HMMER to check the same thing,
        thus ensuring that we know when the program will break due
        to HMMER updates
        '''

        # read the file lines one at a time,
        # then extrapolate the contenxt information with rispect
        # to its identifier

        for line in self.get_query_contents().split('\n'):
            
            if line.startswith('ALPH'):

                # check if the alphabet is AA, RNA or DNA
                if 'amino' in line:
                    self.alphabet = 'aa'
                elif 'rna' in line:
                    self.alphabet = 'rna'
                
                # fix: Skylign does not check that the alphabet
                # is actually dna: is there a reason for this or
                # should can we actively check if 'dna' is in fact
                # present and we are not dealing with a new HMMER
                # version or whatnot

            elif line.startswith('LENG'):

                # get the HMM length
                
                self.hmm_length = int(line[4:])

                # check that we are actually converting an int;
                # again we need should test this field out with a
                # known input-output

            elif line.startswith('DATE'):

                # get the HMM creation date

                self.hmm_created = line[4:].strip()

                # checking that this is an actual date
                # seems to be a fairly demanding task for something
                # of no computationally relevant use; personally I don't
                # think it will be so important
                
            elif line.startswith('NSEQ'):

                # get the number of sequences used to create the HMM
                
                self.nseq = int(line[4:])

            elif line.startswith('CKSUM'):

                # we don't need any other line past this point
                break

        # other fields are just mapped from dictionaries

        letter_heigh_conversion = {
            'info_content_all': 'Information Content - All',
            'info_content_above': 'Information Content - Above Background',
            'score': 'Score',
        }

        self.letter_height_display = letter_heigh_conversion[ self.letter_height ]

        # FIX: controllare se e' stato selezionato 'scaled'

        return

    def __str__(self):
        return str(self.id)

    def get_file_path(self):
        return '/app/uploads/' + str(self.query)
        return os.path.join(settings.MEDIA_ROOT, str(self.query))

    def get_query_contents(self):
        
        file_path = self.get_file_path()
        
        contents = open(file_path, 'r').read()

        return contents

    # FIX: atm we just write the HMM obtained from a MSA into the original query file
    def write_query_contents(self, hmm):
        
        file_path = self.get_file_path()

        open(file_path, 'w').write(hmm)

        return True

    def validate_file_type(self):

        file_content = self.get_query_contents()
        
        file_type = pf.validation_guess_input(file_content, self.alignment_only, self.dna_rna_ok, self.frag_handling)
        
        file_hmm = pf.validation_hmm(file_content, self.alignment_only, self.dna_rna_ok, self.frag_handling)
        
        return file_type, file_hmm[1:-1]


    def get_logo(self, logo_type, colors = 'default'):

        assert logo_type in ['json', 'png', 'svg', 'hmm', 'text'], 'unrecognized format'
        assert colors in ['default', 'consensus'], 'unrecognized coloring scheme'
        
        file_path = '{}-{}.{}'.format(self.get_file_path(), colors, logo_type)

        # FIX: remove after debug
        self.generate_logo(logo_type, file_path, colors)

        # if the file has never been queried before, then it gets created before being delivered
        if not os.path.exists(file_path):
            self.generate_logo(logo_type, file_path, colors)
            assert os.path.exists(file_path), 'file should have been created but does not exist'

        binary_file = 'b' if logo_type == 'png' else ''
        
        return open(file_path, 'r'+binary_file).read()

        
    def generate_logo(self, logo_type, file_path, colors):

        # for now we keep these as separate functions,
        # but in the future we should merge them in a single perl one

        # FIX: we should try - catch the following call because it will return a non-html
        # page in case of failure 

        print(self.get_file_path(), self.letter_height, self.processing, file_path, 'end')

        # response = pf.generate_logo(
        #     logo_type, file_path, self.get_file_path(),
        #     self.letter_height, 'info_content_all', 1, 'hmm', 'default')

        # print(response)

        # return response

        if logo_type == 'json': 
            response = pf.logo_generate_json(self.get_file_path(), self.letter_height, self.processing, file_path)
        elif logo_type == 'png':
            response = pf.logo_generate_png(self.get_file_path(), self.letter_height, self.scaled, self.processing, colors, file_path)
        elif logo_type == 'svg':
            response = pf.logo_generate_svg(self.get_file_path(), self.letter_height, self.scaled, self.processing, colors, file_path)
        elif logo_type == 'hmm':
            # FIX: generate_raw returns a dictionary, we need to figure out what to do with it
            #      for now we just return the uploaded or generated HMM
            # response = pf.logo_generate_raw(self.get_file_path(), self.letter_height, file_path)
            file_path = '{}-default.hmm'.format(self.get_file_path())
            
            if not os.path.exists(file_path):
                open(file_path, 'w').write(self.get_query_contents())
            
            return 'success'

        elif logo_type == 'text':
            response = pf.logo_generate_tabbed(self.get_file_path(), self.letter_height, file_path)

        return response