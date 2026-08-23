# 混入对白到完整影片
$ff = "C:\Users\admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe"
$audioDir = "docs\diagrams\huan-yi-huan\audio"

$lines = @(
  "S1-baba.mp3,3000",
  "S1-xiaoyu.mp3,6000",
  "S2-xiaoyu1.mp3,11541",
  "S2-baba.mp3,14041",
  "S2-xiaoyu2.mp3,18041",
  "S3-xiaoyu.mp3,21582",
  "S3-baba.mp3,25082",
  "S4-baba-body-xiaoyu.mp3,32123",
  "S4-xiaoyu-body-baba.mp3,41664",
  "S5-baba.mp3,51705",
  "S5-xiaoyu.mp3,54705",
  "S5-baba2.mp3,57705",
  "S6-mama.mp3,61746",
  "S6-xiaoyu.mp3,64246",
  "S6-baba.mp3,68246",
  "NARRATION-ending.mp3,73287"
)

$fcParts = New-Object System.Collections.ArrayList
$inputs = @("C:\Users\admin\AppData\Local\Temp\opencode\concat-base.mp4")
$amixInputs = New-Object System.Collections.ArrayList
$i = 0
foreach ($line in $lines) {
  $parts = $line.Split(",")
  $f = $parts[0]; $delay = $parts[1]
  $path = Join-Path $audioDir $f
  $inputs += $path
  $i++
  $label = "a$i"
  $fcParts.Add("[$i:a]aresample=24000,pan=stereo|c0=c0|c1=c0,adelay=${delay}|${delay}[$label];") | Out-Null
  [void]$amixInputs.Add("[$label]")
}
$fcParts.Add("[0:a]aresample=24000[a0];") | Out-Null
$amixStr = "[a0]" + ($amixInputs -join "")
$fcParts.Add("${amixStr}amix=inputs=17:duration=longest:normalize=0,volume=1.6[aout];[0:v][aout]") | Out-Null
$fc = $fcParts -join ""

$args = @("-y", "-i", $inputs[0])
for ($j = 1; $j -lt $inputs.Count; $j++) { $args += @("-i", $inputs[$j]) }
$args += @("-filter_complex", $fc, "-map", "0:v", "-map", "[aout]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "docs\diagrams\huan-yi-huan\huan-yi-huan-full.mp4")

Write-Host "Inputs: $($inputs.Count), filter length: $($fc.Length)"
& $ff @args 2>&1 | Select-Object -Last 8
