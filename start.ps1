$host.ui.RawUI.WindowTitle = "PocketNode: Minecraft Bedrock Edition Server Software"
$Loop = "false"

function StartServer{
    $command = "node .\start.js"
    iex $command
}

if (!(Get-Command "node.exe" -ErrorAction SilentlyContinue)){ 
    echo('You require Node.js to run this program!');
    echo('Download it from https://nodejs.org/en/ and try again!');
    exit 1
} else {
    $loops = 1
    StartServer
    while($Loop -eq "true") {
       	if($loops -ne 0){
		echo ("Restarted " + $loops + " time(s)")
	}
	$loops++
	echo "To escape the loop, press CTRL+C now. Otherwise, wait 5 seconds for the server to restart."
	echo ""
	Start-Sleep 5
	StartServer        
    }
    cmd /c pause | Out-Null
}