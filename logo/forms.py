from django import forms

# more on https://docs.djangoproject.com/en/3.1/topics/forms/

class UploadQueryForm(forms.Form):
    processing = forms.CharField(max_length=50)
    frag = forms.CharField(max_length=50)
    letter_height = forms.CharField(max_length=50)
    
    # the data from the variable below will be accessible as request.FILES['file']
    file = forms.FileField()

# from django.forms import ModelForm
# from logo.models import Job

# class UploadQueryForm(ModelForm):
#     class Meta:
#         model = Job
#         fields = ['processing', 'frag_handling', 'letter_height', 'alignment_only', 'query']