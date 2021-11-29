FROM perl:5.30.3

WORKDIR /app

RUN cpan App::cpanminus

# install Perl dependencies

COPY perl-requirements.txt cpanfile
RUN cpanm --notest --installdeps . 

# Data::Printer needs to be forced
RUN cpanm --force Data::Printer 

# install Python

RUN apt update && apt install -y python python3-pip

# prevent Python from writing pyc files to disc (equivalent to python -B option)
ENV PYTHONDONTWRITEBYTECODE 1

# prevent Python from buffering stdout and stderr (equivalent to python -u option)
ENV PYTHONUNBUFFERED 1

# copy and install required Python libraries

COPY python-requirements.txt /app
RUN pip3 install -r python-requirements.txt

# copy the repository folder

COPY repositories /app/repositories

# register Consensus::Colors in the perl environment variable

ENV PERL5LIB=/app/repositories/Consensus-Colors/lib/

# install Bio::HMM::Logo module

RUN cd /app/repositories/Bio-HMM-Logo \
    && perl Makefile.PL \
    && make \
    && make install

# Prepare directories

RUN mkdir -p data/logos bin fcgi logs logos

# Install less
RUN cp /app/repositories/less.js/packages/less/bin/lessc /app/bin

# Install HMMER
# Latest HMMER code won't work, /app/hmmer contains code from 10/2/2016
# updating the HmmerWeb codebase should take care of this

# copy entrypoint.sh, which is used to collect Django static files 
# and wait for backend database to be fully ready before running the setup operations
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

COPY . /app

# RUN mkdir /app/staticfiles

WORKDIR /app

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]