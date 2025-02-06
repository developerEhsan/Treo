# Add the System.Windows.Forms assembly
Add-Type -AssemblyName System.Windows.Forms
# Simulate Ctrl+V (often unnecessary, try commenting it out first)
[System.Windows.Forms.SendKeys]::SendWait("^v")
# Exit the script
exit
