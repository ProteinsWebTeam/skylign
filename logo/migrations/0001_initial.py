# Generated by Django 3.1.5 on 2021-01-14 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('query', models.TextField(max_length=200)),
                ('date', models.DateTimeField(verbose_name='date posted')),
                ('_id', models.CharField(max_length=200)),
                ('status', models.CharField(default='pending', max_length=200)),
            ],
        ),
    ]