# PowerShell script to combine all World Cup JSON files into one

$baseDir = "lib\data"
$outputFile = "lib\data\worldcup-history.json"
$years = 1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022

$combinedData = @{}

foreach ($year in $years) {
    $jsonFile = "$baseDir\$year\worldcup.json"
    
    if (Test-Path $jsonFile) {
        Write-Host "Processing $year..."
        $jsonContent = Get-Content $jsonFile -Raw -Encoding UTF8
        $combinedData[$year.ToString()] = $jsonContent | ConvertFrom-Json
    } else {
        Write-Host "Warning: $jsonFile not found, skipping..."
    }
}

Write-Host "Writing combined data to $outputFile..."
$jsonOutput = $combinedData | ConvertTo-Json -Depth 10
# Remove BOM by using UTF8 encoding without BOM
[System.IO.File]::WriteAllText((Resolve-Path $outputFile).Path, $jsonOutput, [System.Text.UTF8Encoding]::new($false))

Write-Host "Done! Combined data saved to $outputFile"
