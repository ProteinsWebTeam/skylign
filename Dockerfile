FROM perl

WORKDIR /app

RUN cpan App::cpanminus

# install the boundle of dependencies in separate rows for ease of debug

RUN cpanm YAML::Tiny String::RewritePrefix CGI::Simple::Cookie Catalyst
RUN cpanm Config::General YAML::Syck Catalyst Catalyst::Plugin::Static::Simple
RUN cpanm Catalyst::Plugin::ConfigLoader  Catalyst::Controller::REST Inline
RUN cpanm Imager Imager::File::PNG SVG JSON Data::UUID Inline::C
RUN cpanm Module::Install Catalyst::View::TT Parse::RecDescent
RUN cpanm File::Remove Class::C3::Adopt::NEXT
RUN cpanm MooseX::MethodAttributes::Role::AttrContainer::Inheritable Text::SimpleTable
RUN cpanm Tree::Simple Tree::Simple::Visitor::FindByUID Safe::Isa Plack::Middleware::ReverseProxy
RUN cpanm Plack::Middleware::FixMissingBodyInRedirect Plack::Middleware::RemoveRedundantBody
RUN cpanm Catalyst::Action::RenderView Module::Install::Catalyst Config::Any Sort::Naturally
RUN cpanm Clone::PP File::HomeDir Template::Timer FCGI
RUN cpanm Catalyst::Action::RenderView::ErrorHandler::Action::Log File::Slurp Term::Size::Any
RUN cpanm Catalyst::Controller::REST Catalyst::View::TT Module::Install::Catalyst

# Data::Printer needs to be forced

RUN cpanm --force Data::Printer 

# set up Python

RUN apt update
RUN apt install -y python
RUN apt install -y python3-pip

COPY requirements.txt /app

RUN pip3 install -r requirements.txt

# copy the repository folder

COPY repositories /app/repositories

# install Consensus::Colors

ENV PERL5LIB=/app/repositories/Consensus-Colors/lib/

# install Bio::HMM::Logo module

RUN cd /app/repositories/Bio-HMM-Logo \
    && perl Makefile.PL \
    && make \
    && make install

# Prepare directories

RUN mkdir -p data/logos bin fcgi logs logos

# Install less
# FIX: this can probably be removed from the Django implementation
RUN cp /app/repositories/less.js/packages/less/bin/lessc /app/bin

# Install HMMER
# Latest HMMER code won't work, /app/hmmer contains code from 10/2/2016
# FIX: try to update code if remaining infrastructure works as expected
#   or just invest time in writing tests

COPY . /app

WORKDIR /app/repositories/Bio-HMM-Logo/lib/Bio/HMM

WORKDIR /app

RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# CMD ["/bin/bash"]
# then python3 manage.py runserver 0.0.0.0:8000

# For Django:
# docker run -p 8000:8000 --rm -it -v C:\Users\Nico\projects\ebi\skylign\skylign_django\test_perl:/app/test_perl skylign
# then visit localhost:8000 to visit