# Generated by Django 3.1.5 on 2021-01-18 13:36

from django.db import migrations, models
import logo.models


class Migration(migrations.Migration):

    dependencies = [
        ('logo', '0008_auto_20210118_1311'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='query',
            field=models.FileField(default='test', upload_to=logo.models.job_file_path),
            preserve_default=False,
        ),
    ]