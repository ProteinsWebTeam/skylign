from django.test import TestCase
from django.test import Client

from .models import Job


class APITests(TestCase):

    # input test files
    hmm_file_path = "test_files/hmmer_profile.hmm"
    msa_file_path = "test_files/msa.txt"
    nucleotides_file_path = "test_files/nucleotides_msa.clustal"

    # random text file, used to check for error response
    broken_hmm_file_path = "test_files/broken_profile.hmm"

    @classmethod
    def setUpTestData(self):

        """
        Create a job that will be used to test other methods
        """

        self.client = Client()

        # this should be equivalent to send a post request to the API with
        # curl -H 'Accept:application/json' -F file='@aln.hmm' -F processing=hmm http://localhost:8005/
        response = self.client.post(
            "/",
            {"processing": "hmm", "file": open(self.hmm_file_path)},
            HTTP_ACCEPT="application/json",
        )

        # response should be something like
        # '{"url": "http://skylign.org/logo/363D5E37-03E8-4C31-A645-0EC2C3FB0CD8", "uuid": "363D5E37-03E8-4C31-A645-0EC2C3FB0CD8", "message": "Logo generated successfully"}'
        res = response.json()

        assert response.status_code == 200

        assert "url" in res
        assert "message" in res
        assert "uuid" in res

        assert res["message"] == "Logo generated successfully"

        self.test_hmm_uuid = res["uuid"]

    def test_post_failed_job(self):

        """
        Upload an invalid hmm file and check that the expected error message is returned
        """

        response = self.client.post(
            "/",
            {"processing": "hmm", "file": open(self.broken_hmm_file_path)},
            HTTP_ACCEPT="application/json",
        )

        self.assertEqual(response.status_code, 200)

        res = response.json()

        # check that all expected fields are in there
        self.assertTrue("message" in res)

        # check for expected error message
        self.assertEqual(
            res["message"],
            "There was some error while processing the HMM file, please check the format of your file",
        )

    def test_trailing_slash_optional(self):

        """
        Test that the trailing slash in retrieving a logo format is optional
        """

        # fetch page without trailing slash
        response = self.client.get(
            "/logo/{}".format(self.test_hmm_uuid), HTTP_ACCEPT="application/json"
        )
        self.assertEqual(response.status_code, 200)

        # fetch page with trailing slash
        response = self.client.get(
            "/logo/{}/".format(self.test_hmm_uuid), HTTP_ACCEPT="application/json"
        )
        self.assertEqual(response.status_code, 200)

    def test_download_formats(self):

        """
        Tests a number of different formats, using amino acids and nucleotides sequences and MSA and HMM as inputs
        1. hmm file, selecting "Information Content - Above Background", color scheme: consensus colors, svg image
        2. hmm file, selecting "Information Content - Above Background", color scheme: default, svg image
        3. hmm file, selecting "Information Content - Above Background", json file
        4. hmm file, selecting "Information Content - Above Background", hmm file
        5. nucleotides file, alignment: weighted counts, full length fragment, score, tabular text
        6. nucleotides file, alignment: weighted counts, full length fragment, score, svg
        7. msa file, alignment: create hmm removing mostly-empty columns, some sequences are fragment, information content all, hmm
        8. msa file, alignment: create hmm removing mostly-empty columns, some sequences are fragment, information content all, consensus color, svg
        """

        # we have already tested the post function somewhere else, so the uploading part should go smooth
        # encode the validation in a single function to avoid repeating the code
        def test_response_and_return_json(response):

            self.assertEqual(response.status_code, 200)

            res = response.json()

            # usual assertions
            self.assertTrue("url" in res)
            self.assertTrue("message" in res)
            self.assertTrue("uuid" in res)
            self.assertEqual(res["message"], "Logo generated successfully")

            return res

        # ad hoc function to clean hmm files, ignoring the first 12 lines
        # that contain details on date of generation and HMMER version
        def clean_hmm(file_content):
            return "".join(file_content.split("\n")[12:])

        # ad hoc function to compare svg files by removing all commented content
        def clean_svg(file_content):

            if "<!--" in file_content:
                splitted_file = file_content.split("<!--")
                # remove commented blocks
                for i in range(1, len(splitted_file)):
                    splitted_file[i] = splitted_file[i].split("-->")[1]

                file_content = "".join(splitted_file)

            return file_content

        # ad hoc function to compare json files by ordering their characters
        # note: the file will lose all its meaning, but still be a valid test,
        # whereas doing something like json.dumps(json.loads(file_content)) will
        # produce strings with dict keys in different positions
        def clean_json(file_content):
            return "".join(sorted(file_content))

        # Test case: 1
        response = self.client.post(
            "/",
            {
                "processing": "hmm",
                "letter_height": "info_content_above",
                "file": open(self.hmm_file_path),
            },
            HTTP_ACCEPT="application/json",
        )

        job_uuid = test_response_and_return_json(response)["uuid"].lower()

        # load the job using the uuid
        job = Job.objects.get(id=job_uuid)

        # generate svg and check against database
        test_file = clean_svg(open("test_files/logo_test_1.svg").read())
        self.assertTrue(test_file == clean_svg(job.get_logo("svg", "consensus")))
        self.assertTrue(test_file != clean_svg(job.get_logo("svg", "default")))

        # Test case: 2
        test_file = clean_svg(open("test_files/logo_test_2.svg").read())
        self.assertTrue(test_file == clean_svg(job.get_logo("svg", "default")))

        # Test case: 3
        test_file = clean_json(open("test_files/logo_test_3.json").read())
        self.assertTrue(test_file == clean_json(job.get_logo("json")))

        # Test case: 4
        test_file = clean_hmm(open("test_files/logo_test_4.hmm").read())
        self.assertTrue(test_file, clean_hmm(job.get_logo("hmm")))

        # Test case: 5
        response = self.client.post(
            "/",
            {
                "processing": "msa",
                "letter_height": "score",
                "frag_handling": "full",
                "processing": "weighted",
                "file": open(self.nucleotides_file_path),
            },
            HTTP_ACCEPT="application/json",
        )

        job_uuid = test_response_and_return_json(response)["uuid"].lower()
        job = Job.objects.get(id=job_uuid)

        # test
        test_file = open("test_files/logo_test_5.txt").read()
        self.assertTrue(test_file == job.get_logo("text") or test_file.replace("Inf","inf") == job.get_logo("text"))

        # Test case: 6
        test_file = clean_svg(open("test_files/logo_test_6.svg").read())
        self.assertTrue(test_file == clean_svg(job.get_logo("svg", "default")))

        # Test case: 7
        response = self.client.post(
            "/",
            {
                "processing": "msa",
                "letter_height": "info_content_all",
                "frag_handling": "frag",
                "processing": "hmm",
                "file": open(self.msa_file_path),
            },
            HTTP_ACCEPT="application/json",
        )

        job_uuid = test_response_and_return_json(response)["uuid"].lower()
        job = Job.objects.get(id=job_uuid)

        # test
        test_file = clean_hmm(open("test_files/logo_test_7.hmm").read())
        self.assertTrue(test_file, clean_hmm(job.get_logo("hmm")))

        # Test case: 8
        test_file = clean_svg(open("test_files/logo_test_8.svg").read())
        self.assertTrue(test_file == clean_svg(job.get_logo("svg", "consensus")))


class ViewsTest(TestCase):

    """
    Check that all url endpoints return the expected views
    """

    @classmethod
    def setUpTestData(self):

        self.client = Client()

    def test_help_pages_url(self):

        urls_template = [
            ("/", "logo/index.html"),
            ("/help/", "logo/help/index.html"),
            ("/help/api", "logo/help/api.html"),
            ("/help/get", "logo/help/get_logo.html"),
            ("/help/post", "logo/help/post.html"),
            ("/help/hmm", "logo/help/get_hmm.html"),
            ("/help/install", "logo/help/install.html"),
            ("/help/example", "logo/help/example.html"),
        ]

        for url_template in urls_template:
            response = self.client.get(url_template[0])
            self.assertEqual(response.status_code, 200)
            self.assertTemplateUsed(response, url_template[1])

    def test_error_pages(self):

        # test page not found
        response = self.client.get("/random-url-404-test")
        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, "404.html")
