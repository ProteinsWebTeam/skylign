from django.core.management.base import BaseCommand
from logo.models import Job
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = "Deletes all jobs older than 2 weeks"

    def handle(self, *args, **options):

        """
        Deletes all jobs older than 2 weeks; this function should be called daily by a cronjob
        """

        # delete any job older than 2 weeks
        for job in Job.objects.filter(date__lte=datetime.now()-timedelta(days=14)):
            job.delete_all()

        self.stdout.write(self.style.SUCCESS("Operation completed"))