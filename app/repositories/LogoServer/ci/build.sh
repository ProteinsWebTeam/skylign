#!/bin/bash -x

export OUTPUT=$WORKSPACE/logs
export DISPLAY=:1
export PATH=/nfs/public/rw/xfam/skylign/dev/bin:/nfs/public/rw/xfam/skylign/dev/bin/node/bin:$PATH

# minify css

/nfs/public/rw/xfam/skylign/dev/bin/lessc --yui-compress LogoServer/root/static/css/app.less LogoServer/root/static/css/main.min.css

# clear out old build files
rm /nfs/public/rw/xfam/skylign/dev/LogoServer/root/static/js/main.js
rm /nfs/public/rw/xfam/skylign/dev/LogoServer/root/static/js/main.min.js
rm /nfs/public/rw/xfam/skylign/dev/LogoServer/root/static/js/00-libs.js


# minify and compress the javascript
cat /nfs/public/rw/xfam/skylign/dev/LogoServer/root/static/js/libs/*.js > /opt/www/Skylign/current/root/static/js/00-libs.js
cat /nfs/public/rw/xfam/skylign/dev/LogoServer/root/static/js/*.js > /opt/www/Skylign/current/root/static/js/main.js


/usr/bin/java -jar /opt/lib/java/compiler.jar --js /opt/www/Skylign/current/root/static/js/main.js --js_output_file /opt/www/Skylign/current/root/static/js/main.min.js


# set permission on the build directory for Inline-C
#chown -R nobody: $WORKSPACE/*

mkdir -p $OUTPUT

/etc/init.d/skylign restart
