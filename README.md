# What are Linux Capabilities?
Linux capabilities are special attributes in the Linux kernel that grant processes and binary executables specific privileges that are normally reserved for processes whose effective user ID is 0 (root user).  

Essentially, the goal of capabilities is to divide the power of 'root' into specific privileges, so that if a process or binary that has one or more capabilities is exploited, the potential damage is limited when compared to the same process running as root.

Capabilities can be set on processes and executable files. A process resulting from the execution of a file can gain the capabilities of that file.  

To see the capabilities for a particular process, use the status file in the /proc directory. As it provides more details, let’s limit it only to the information related to Linux capabilities.  
Note that for all running processes capability information is maintained per thread, for binaries in the file system it’s stored in extended attributes.  

# Linux Capabilities List

| Capabilities name  | Description |
|---|---|
| CAP_AUDIT_CONTROL  | Allow to enable/disable kernel auditing |
| CAP_AUDIT_WRITE  | Helps to write records to kernel auditing log |
| CAP_BLOCK_SUSPEND  | This feature can block system suspends   |
| CAP_CHOWN  | Allow user to make arbitrary change to files UIDs and GIDs |
| CAP_DAC_OVERRIDE  | This helps to bypass file read, write and execute permission checks |
| CAP_DAC_READ_SEARCH  | This only bypass file and directory read/execute permission checks  |
| CAP_FOWNER  | This enables to bypass permission checks on operations that normally require the filesystem UID of the process to match the UID of the file  |
| CAP_KILL  | Allow the sending of signals to processes belonging to others  |
| CAP_SETGID  | Allow changing of the GID  |
| CAP_SETUID  | Allow changing of the UID  |
| CAP_SETPCAP  | Helps to transferring and removal of current set to any PID |
| CAP_IPC_LOCK  | This helps to lock memory  |
| CAP_MAC_ADMIN  | Allow MAC configuration or state changes  |
| CAP_NET_RAW  | Use RAW and PACKET sockets |
| CAP_NET_BIND_SERVICE  | SERVICE Bind a socket to internet domain privileged ports  |

# Linux Capabilities Analysis

You can find the capabilities of the current process by using `cat /proc/<pid>/status`.  

<pre># cat /proc/&lt;pid&gt;/status | grep Cap
CapInh: 0000000000000000
CapPrm: 0000003fffffffff
CapEff: 0000003fffffffff
CapBnd: 0000003fffffffff
CapAmb: 0000000000000000</pre>

This will give us an hexadecimal (base 16) output, for most people, that it will not make any sense, using tools like `capsh`, we can decode them into the capabilities list.
<pre># capsh --decode=0000003fffffffff
0x0000003fffffffff=cap_chown,cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_linux_immutable,cap_net_bind_service,cap_net_broadcast,cap_net_admin,cap_net_raw,cap_ipc_lock,cap_ipc_owner,cap_sys_module,cap_sys_rawio,cap_sys_chroot,cap_sys_ptrace,cap_sys_pacct,cap_sys_admin,cap_sys_boot,cap_sys_nice,cap_sys_resource,cap_sys_time,cap_sys_tty_config,cap_mknod,cap_lease,cap_audit_write,cap_audit_control,cap_setfcap,cap_mac_override,cap_mac_admin,cap_syslog,cap_wake_alarm,cap_block_suspend,37</pre>


# CAP_SETUID
CAP_SETUID allows us to make arbitrary manipulations of process UIDs and forge UID when passing socket credentials via UNIX domain sockets, this is useful because it allows you to give root user permissions to all users running the specific process or executable file.  
Like everything, it also has its downside, a low privileged can escalate his own permissions up to root (UID 0), an example of this would be, giving python the CAP_SETUID capability and the attacker running:  

<pre>python -c 'import os; os.setuid(0); os.system("/bin/bash")</pre>

This will set your processes current UID as root (0) and spawn a shell with elevated privileges, if this type of access is unauthorised, this can be a very big problem.
