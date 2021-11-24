# What are Linux Capabilities?
Linux capabilities are special attributes in the Linux kernel that grant processes and binary executables specific privileges that are normally reserved for processes whose effective user ID is 0 (root user).  

Essentially, the goal of capabilities is to divide the power of 'root' into specific privileges, so that if a process or binary that has one or more capabilities is exploited, the potential damage is limited when compared to the same process running as root.

Capabilities can be set on processes and executable files. A process resulting from the execution of a file can gain the capabilities of that file.  

To see the capabilities for a particular process, use the status file in the /proc directory. As it provides more details, let’s limit it only to the information related to Linux capabilities.  
Note that for all running processes capability information is maintained per thread, for binaries in the file system it’s stored in extended attributes.  

You can find the capabilities of the current process by using `cat /proc/<pid>/status`.  

<pre># cat /proc/&lt;pid&gt;/status | grep Cap
CapInh: 0000000000000000
CapPrm: 0000003fffffffff
CapEff: 0000003fffffffff
CapBnd: 0000003fffffffff
CapAmb: 0000000000000000</pre>

This will give us an hexadecimal (base 16) output, that for most people it will not make sense, using tools like `capsh`, we can decode them into the capabilities name.
<pre># capsh --decode=0000003fffffffff
0x0000003fffffffff=cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,37</pre>

# CAP_SETUID
CAP_SETUID allows us to make arbitrary manipulations of process UIDs and forge UID when passing socket credentials via UNIX domain sockets, this is useful because it allows you to give root user permissions to all users running the specific process or executable file.  
Like everything, it also has its downside, a low privileged can escalate his own permissions up to root (UID 0), an example of this would be, giving python the CAP_SETUID capability and the attacker running:  

<pre>python -c 'import os; os.setuid(0); os.system("/bin/bash")</pre>

This will set your processes current UID as root (0) and spawn a shell with elevated privileges, if this type of access is unauthorised, this can be a very big problem.
