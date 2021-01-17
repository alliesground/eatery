image:
					docker build -t northsail/sls-ruby2.7-builder:latest .
 
install:
					make image
					docker run --rm -it -v $$PWD:/var/task -w /var/task northsail/sls-ruby2.7-builder:latest make _install
 
_install:
					bundle config --local silence_root_warning true
					bundle install --path vendor/bundle --clean
					mkdir -p /var/task/lib
					cp -a /usr/lib64/libpq.so.5.5 /var/task/lib/libpq.so.5
					cp -a /usr/lib64/libldap_r-2.4.so.2.10.7 /var/task/lib/libldap_r-2.4.so.2
					cp -a /usr/lib64/liblber-2.4.so.2.10.7 /var/task/lib/liblber-2.4.so.2
					cp -a /usr/lib64/libsasl2.so.3.0.0 /var/task/lib/libsasl2.so.3
					cp -a /usr/lib64/libssl3.so /var/task/lib/
					cp -a /usr/lib64/libsmime3.so /var/task/lib/
					cp -a /usr/lib64/libnss3.so /var/task/lib/
					cp -a /usr/lib64/libnssutil3.so /var/task/lib/
