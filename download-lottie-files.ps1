# PowerShell script to download Lottie animation JSON files
# Run this script: .\download-lottie-files.ps1

$animationsDir = "public\animations"

# Create directory if it doesn't exist
if (-not (Test-Path $animationsDir)) {
    New-Item -ItemType Directory -Path $animationsDir | Out-Null
    Write-Host "Created directory: $animationsDir"
}

Write-Host "`nDownloading Lottie animation files..."
Write-Host "=====================================`n"

# Function to download file
function Download-LottieFile {
    param(
        [string]$Url,
        [string]$OutputPath,
        [string]$Name
    )
    
    Write-Host "Downloading $Name..."
    try {
        # Try to get the direct download URL from LottieFiles
        # First, we'll try to get the JSON directly
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction Stop
        $jsonContent = $response.Content
        
        # Save to file
        $jsonContent | Out-File -FilePath $OutputPath -Encoding UTF8
        Write-Host "✓ Successfully downloaded $Name to $OutputPath" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Failed to download $Name automatically" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "  Please download manually from: $Url" -ForegroundColor Yellow
        return $false
    }
}

# Animation URLs and file names
$animations = @(
    @{
        Name = "KuttyMakers (Thinking)"
        PageUrl = "https://lottiefiles.com/free-animation/thinking-O8a7dvcMvR"
        FilePath = "$animationsDir\kuttymakers.json"
    },
    @{
        Name = "Friends of the Movement (Man and Robot)"
        PageUrl = "https://lottiefiles.com/free-animation/man-and-robot-with-computers-sitting-together-in-workplace-QnbODCGAFt"
        FilePath = "$animationsDir\friends.json"
    },
    @{
        Name = "Chatbot"
        PageUrl = "https://lottiefiles.com/free-animation/chatbot-9e242FbdlM"
        FilePath = "$animationsDir\chatbot.json"
    }
)

Write-Host "`nNOTE: LottieFiles requires manual download due to authentication."
Write-Host "Please follow these steps:`n" -ForegroundColor Yellow

foreach ($anim in $animations) {
    Write-Host "1. Visit: $($anim.PageUrl)" -ForegroundColor Cyan
    Write-Host "2. Click the 'Download' button"
    Write-Host "3. Select 'Lottie JSON' format"
    Write-Host "4. Save the file as: $($anim.FilePath)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "`nAfter downloading all three files, refresh your browser to see the animations!"
Write-Host "=====================================`n"

