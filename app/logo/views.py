from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.http import HttpResponseRedirect

from django.views.decorators.csrf import csrf_exempt

from django.conf import settings

from .models import Job
from .forms import UploadQueryForm

import json
from datetime import datetime, timedelta

@csrf_exempt
def index(request):

    """
    If index is accessed via POST then the data is being submitted either via the
    form or through the API, otherwise if it is being accessed via GET we just
    return the home page; we are exempting this view from the need of a csrf token
    otherwise cURL requests will fail
    """

    # handle upload failure
    def hmm_upload_error(request):

        if request.accepts("text/html"):

            # request coming from browse
            return render(request, "logo/error/hmmError.html")

        else:

            # request coming from API
            content = json.dumps(
                {
                    "message": "There was some error while processing the HMM file, please check the format of your file"
                }
            )
            return HttpResponse(content, content_type="application/json")

    # if the method is POST, check if the data is coming from the API or the form
    # discriminating them via request.accepts()
    if request.method == "POST":

        # validate fields
        form = UploadQueryForm(request.POST, request.FILES)
        if form.is_valid():

            # define a quick function to return default_value if field_value is blank;
            # needed because Django seems to be enforcing the choices from the Job
            # model but it allows for the field to be empty, which is not ok
            def field_or_default(field_value, default_value):
                return field_value if field_value != "" else default_value

            job = Job(
                file=form.cleaned_data["file"],
                file_name=form.cleaned_data["file"],
                processing=field_or_default(form.cleaned_data["processing"], "hmm"),
                frag_handling=field_or_default(
                    form.cleaned_data["frag_handling"], "full"
                ),
                letter_height=field_or_default(
                    form.cleaned_data["letter_height"], "info_content_all"
                ),
            )

            # save the job so that the uploaded file will be available for reading
            job.save()

            # initializes the remaining parameters from the HMM generated
            job.init_params_from_hmm()

            # if the input is not recognized we delete the job
            # and redirect the user to the error page
            if job.upload_type not in ["hmm", "msa"]:

                job.delete_all()
                return hmm_upload_error(request)

            else:

                job.status = "completed"
                job.save()

                if request.accepts("text/html"):
                    return HttpResponseRedirect("/logo/" + str(job.id))

                else:
                    content = {
                        "url": "https://skylign.org/logo/" + str(job),
                        "uuid": str(job),
                        "message": "Logo generated successfully",
                    }
                    return HttpResponse(
                        json.dumps(content), content_type="application/json"
                    )

        else:
            # invalid form
            return hmm_upload_error(request)

    else:
        # page accessed via GET, just return the homepage
        form = UploadQueryForm()
        return render(request, "logo/index.html", {"form": form})


def results(request, job_id):

    """
    Returns the logo in different accessible formats (except HMM);
    results can be accessed through the website or the API
    """

    # since we have a specific error page for jobs that are not found
    # we dont do job = get_object_or_404(Job, pk=job_id)
    # and instead check manually if the job is or not in the database
    if Job.objects.filter(pk=job_id).count():

        job = get_object_or_404(Job, pk=job_id)

        if request.accepts("text/html"):

            # results are being accessed from the webpage

            context = {"job": job, "json_logo": job.get_logo("json")}

            return render(request, "logo/results.html", context)

        elif request.accepts("image/png"):
            contents = job.get_logo("png")
            return HttpResponse(contents, content_type="image/png")

        elif request.accepts("image/spng"):
            contents = job.get_logo("spng")
            return HttpResponse(contents, content_type="image/spng")

        elif request.accepts("image/svg"):
            contents = job.get_logo("svg")
            return HttpResponse(contents, content_type="image/svg")

        elif request.accepts("application/json"):
            contents = job.get_logo("json")
            return HttpResponse(contents, content_type="application/json")

        elif request.accepts("text/plain"):
            contents = job.get_logo("text")
            return HttpResponse(contents, content_type="text/plain")

        else:
            # hmm files are served at another url, and no other file formats are offered
            contents = "Error, requested type not recognized"
            return HttpResponse(contents, content_type="text/plain")

    else:

        # no job found with the specified uuid, return the relevant error page if coming from browser
        # otherwise a json response indicating that the job has not been found
        if request.accepts("text/html"):
            return render(request, "logo/error/missing.html")
        else:
            contents = "Specified job not found"
            return HttpResponse(contents, content_type="text/plain")


def hmm_api(request, job_id):

    """
    Returns the HMM used to generate the logo in plain text;
    this HMM will have been generated by the hmmer bin in repositories
    """

    job = get_object_or_404(Job, pk=job_id)

    return HttpResponse(job.get_logo("hmm"))


def download(request, job_id):

    """
    Returns logo formats as downloadable files
    """

    job = get_object_or_404(Job, pk=job_id)

    colors = request.GET["colors"] if "colors" in request.GET else "default"
    file_format = request.GET["format"] if "format" in request.GET else "hmm"

    # fetch logo contents in the requested format
    contents = job.get_logo(file_format, colors)

    # map spng to png and text to txt, other file formats are already valid
    if file_format == "spng":
        file_format = "png"
    elif file_format == "text":
        file_format = "txt"

    # generate response object
    response = HttpResponse(contents)
    response["Content-Disposition"] = "attachment; filename={}.{}".format(
        job.id, file_format
    )

    return response


def help_example(request):

    """
    View with interactive tutorial on example logo
    """

    return render(request, "logo/help/example.html", {"action": "logo/example"})