from logo.models import Job
from django import forms


class UploadQueryForm(forms.ModelForm):

    # this fields will always be present when submitting form the website
    # but are all optional when submitting through the API
    frag_handling = forms.CharField(required=False)
    processing = forms.CharField(required=False)
    letter_height = forms.CharField(required=False)

    class Meta:
        model = Job
        fields = ["processing", "frag_handling", "letter_height", "file"]
