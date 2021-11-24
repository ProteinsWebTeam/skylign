import uuid
from django.utils import timezone
from django.db import models
from django.conf import settings
import os

# import the sys module to access the perl functions
import sys

from pathlib import Path

sys.path.insert(0, "perl_functions")
import perl_functions as pf


def job_file_path(instance, filename):
    return os.path.join(settings.MEDIA_ROOT, "{}.txt".format(instance.job.id))


class Job(models.Model):

    """
    New jobs are created on job sumbission, in the submit view; right now the job is instantiated,
    then if it doesn't surpass all sanity checks (eg. uploaded file validity) the user is redirected
    to the relevant error page and the entry is removed from the database
    """

    # we use CharField instead of UUIDField because we don't need the extra checks on string
    # type and this saves us to deal with extra error messages associated with the type
    id = models.CharField(
        primary_key=True, default=uuid.uuid4, editable=False, max_length=40
    )
    date = models.DateTimeField(default=timezone.now)

    # job completion status (used only internally), either pending or complete
    status = models.CharField(max_length=20, default="pending")

    # original file name, displayed in the results page
    # (self.query may have a different name in case of duplicates)
    # note: in most unix systems the maximum filename length is 255 characters
    file_name = models.CharField(max_length=300, default="untitled")

    # actual file name in the container
    file = models.FileField(upload_to="submitted_queries")

    # uploaded file type, it must be either 'hmm' or 'msa'
    upload_choices = [("hmm", "hmm"), ("msa", "msa")]
    upload_type = models.CharField(max_length=5, choices=upload_choices, default="hmm")

    # fields from the upload form
    processing_choices = [(v, v) for v in ["hmm", "observed", "weighted", "hmm_all"]]
    processing = models.CharField(
        max_length=50, default="hmm", choices=processing_choices
    )

    frag_choices = [(v, v) for v in ["frag", "full"]]
    frag_handling = models.CharField(
        max_length=50, default="full", choices=frag_choices
    )

    height_choices = [
        (v, v) for v in ["info_content_all", "info_content_above", "score"]
    ]
    letter_height = models.CharField(
        max_length=50, default="info_content_all", choices=height_choices
    )

    # inferred from the HMM file
    alphabet = models.CharField(max_length=10, default="unknown")
    hmm_length = models.IntegerField(default=0)
    hmm_created = models.CharField(max_length=50, default="")
    nseq = models.IntegerField(default=0)

    def initialize_fields(self):

        """
        Reads the HMM file one line at a time, extrapolating all the relevant fields
        """

        for line in self.get_logo("hmm").split("\n"):

            if line.startswith("ALPH"):

                # check if the alphabet is AA, RNA or DNA
                if "amino" in line:
                    self.alphabet = "aa"
                elif "rna" in line:
                    self.alphabet = "rna"
                elif "dna" in line:
                    self.alphabet = "dna"

            elif line.startswith("LENG"):

                # get the HMM length
                self.hmm_length = int(line[4:])

            elif line.startswith("DATE"):

                # get the HMM creation date
                self.hmm_created = line[4:].strip()

            elif line.startswith("NSEQ"):

                # get the number of sequences used to create the HMM
                self.nseq = int(line[4:])

            elif line.startswith("CKSUM"):

                # we don't need any other line past this point
                break

        return

    def __str__(self):
        return str(self.id).upper()

    def get_hmm_path(self):

        """
        Get the system path of the hmm file generated with hmmer
        (which is independent of the uploaded file)
        """

        return os.path.join(settings.MEDIA_ROOT, str(self.id))

    def get_query_contents(self):

        """
        Reads and returns the file contents from the original upload
        """
        
        # get the app base dir
        BASE_DIR = Path(__file__).resolve().parent.parent

        file_path = f"{BASE_DIR}/uploads/{str(self.file)}"
        return open(file_path, "r").read()

    def write_hmm_content(self, hmm):

        """
        Writes the HMM file contents either from user upload or from the internal pipeline
        """

        file_path = self.get_hmm_path()
        return open(file_path, "w").write(hmm)

    def init_params_from_hmm(self):

        """
        Analyse the file uploaded to determine if it is a HMM, MSA or something else;
        also returns the HMM profile
        """

        # get the uploaded file contents
        file_content = self.get_query_contents()

        # convert processing to alignment
        alignment_conversion = {
            "observed": 1,
            "weighted": 2,
            "hmm_all": 3,
            "hmm": 4,
        }

        # we store the HMM in the destination specified in self.get_hmm_path() and fetch the file type
        # (MSA, HMM or something else)
        file_type = pf.store_hmm_and_return_file_type(
            file_content,
            self.frag_handling,
            alignment_conversion[self.processing],
            self.get_hmm_path(),
        )

        # upload type must be either MSA or HMM,
        # if it is something else the user will get an error message in the next step
        self.upload_type = file_type.lower()

        # initialize the model fields inferred from the hmm file
        return self.initialize_fields()

    def get_logo(self, logo_type, colors="default"):

        """
        Generates the logo file for the requested format
        """

        assert logo_type in [
            "json",
            "png",
            "svg",
            "hmm",
            "text",
            "spng",
        ], "unrecognized format"
        assert colors in ["default", "consensus"], "unrecognized coloring scheme"

        if logo_type == "hmm":
            # the hmm is generated elsewhere
            file_path = self.get_hmm_path()
        else:
            file_path = "{}-{}.{}".format(self.get_hmm_path(), colors, logo_type)

            # if the file has never been queried before, then it gets created before being delivered
            if not os.path.exists(file_path):

                response = pf.generate_logo(
                    logo_type,
                    file_path,
                    self.get_hmm_path(),
                    self.letter_height,
                    self.processing,
                    colors,
                )
                assert os.path.exists(
                    file_path
                ), "file should have been created but does not exist"

        # read file contents as binary only if it's a png
        binary_file = "b" if logo_type in ["png", "spng"] else ""

        return open(file_path, "r" + binary_file).read()

    def delete_all(self):

        """
        This function is called daily to eliminate jobs older than 2 weeks and it takes care
        of removing the record from the database as well as deleting all generated logos and
        the input file uploaded by the user
        """

        # first delete all generated logo files
        for file in os.listdir(settings.MEDIA_ROOT):
            if str(self.id) in file:
                os.remove(os.path.join(settings.MEDIA_ROOT,file))

        # then remove the uploaded file
        if os.path.isfile(self.file.path):
            os.remove(self.file.path)
        
        # finally remove job from db
        return self.delete()
