from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.http import FileResponse
from django.http import HttpResponseRedirect
from django.http import Http404
from django.template import loader

from django.conf import settings

from .models import Job
from .forms import UploadQueryForm

import uuid

# a view must return either an HttpResponse
# or raise an exception such as Http404

# FIX: don't use absolute redirect!

def index(request):
    print('uploading form')
    form = UploadQueryForm()
    return render(request, 'logo/index.html', {'form': form})

def results(request, job_id):

    # results can be accessed through the website or the API

    job = get_object_or_404(Job, pk=job_id)

    if request.accepts('text/html'):

        # results are being accessed from the webpage
        
        context = { 'job': job, 'json_logo': job.get_logo('json') }

        return render(request, 'logo/results.html', context)

    elif request.accepts('image/png'):

        # png image of the logo requested from API

        contents = job.get_logo('png')

    elif request.accepts('application/json'):

        # json of the logo requested from API

        contents = job.get_logo('json')

    else:
        assert False, 'requested type not recognized'

    return HttpResponse(contents)

def submit(request):
    
    # conversion = {
    #     'observed': 1,
    #     'weighted': 2,
    #     'hmm_all': 3,
    #     'hmm': 4,
    # }

    # assert processing in conversion, 'processing variable outside list of possibilities'
    # processing = conversion[processing]

    if request.method == 'POST':
        form = UploadQueryForm(request.POST, request.FILES)
        if form.is_valid():

            job = Job(
                query           = request.FILES['file'], 
                file_name       = request.FILES['file'], 
                processing      = request.POST['processing'],
                frag_handling   = request.POST['frag'],
                letter_height   = request.POST['letter_height'],
                alignment_only  = 3,
                dna_rna_ok      = 1,
            )

            job.save()

            file_type, hmm = job.validate_file_type()

            # if the input is not recognized we should delete the job
            # and return the user to the home page
            assert file_type in ['HMM', 'MSA'], 'input file format must be HMM or MSA'

            job.write_query_contents(hmm)

            job.initialize_fields()

            # FIX: move this to the form validation page
            assert job.processing in ['observed', 'weighted', 'hmm_all', 'hmm'], 'unrecognized processing type'
            assert job.frag_handling in ['frag', 'full']
            assert job.letter_height in ['info_content_all', 'info_content_above', 'score']

            job.save()

            return HttpResponseRedirect('/logo/' + str(job.id))
    
    return HttpResponseRedirect('/')

def download(request, job_id):

    job = get_object_or_404(Job, pk=job_id)

    # FIX: check that the specified format is valid
    # check for Django way of sanitizing GET calls

    if 'colors' in request.GET:
        colors = request.GET['colors']
    else:
        colors = 'default'

    # FIX: file_format should also not be mandatory
    file_format = request.GET['format']

    # check if the file asked has already been produced
    # otherwise it does that now,
    # then it returns the file

    contents = job.get_logo(file_format, colors)

    response = HttpResponse(contents, content_type = 'application/force-download')
    response['Content-Disposition'] = 'attachment; filename={}.{}'.format(job.id, file_format)

    return response

    # using a simple httpresponse seems to be working better than FileResponse
    response = FileResponse(contents, content_type='application/force-download')
    response['Content-Disposition'] = 'attachment; filename={}.{}'.format(job.id, file_format)

    return response