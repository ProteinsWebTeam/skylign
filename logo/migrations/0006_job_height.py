# Generated by Django 3.1.5 on 2021-01-18 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logo', '0005_auto_20210118_1226'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='height',
            field=models.CharField(default='medium', max_length=200),
        ),
    ]