from django.urls import path
from django.views.generic import TemplateView

from . import views

# app name is used for shorthand routing in the webpages
app_name = 'logo'

# url '/logo/' will open views.index

urlpatterns = [
    path('', views.index, name='index'),
    path('help/', TemplateView.as_view(template_name='logo/help/index.html'), name='help'),
    path('help/api', TemplateView.as_view(template_name='logo/help/api.html'), name='help/api'),
    path('help/get', TemplateView.as_view(template_name='logo/help/get_logo.html'), name='help/get'),
    path('help/post', TemplateView.as_view(template_name='logo/help/post.html'), name='help/post'),
    path('help/hmm', TemplateView.as_view(template_name='logo/help/get_hmm.html'), name='help/hmm'),
    path('help/install', TemplateView.as_view(template_name='logo/help/install.html'), name='help/install'),
    path('help/example', TemplateView.as_view(template_name='logo/help/example.html'), name='help/example'),
    path('submit/', views.submit, name='submit'),
    path('logo/<str:job_id>/', views.results, name='results'),
    path('logo/<str:job_id>/download/', views.download, name='results/download'),
]