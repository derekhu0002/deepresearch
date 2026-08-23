# 组装《ArchGraph · Agent 组织与协作》讲解视频
# 每场景：幻灯片 PNG + 旁白 WAV -> 片段 MP4（淡入淡出）-> concat 拼接
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ff = "C:\Users\admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe"
$ffprobe = "C:\Users\admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffprobe.exe"

$base = Join-Path (Split-Path $PSScriptRoot -Parent) "docs\diagrams\actor-explainer"
$slides = Join-Path $base "slides"
$audio  = Join-Path $base "audio"
$clips  = Join-Path $base "clips"
New-Item -ItemType Directory -Force -Path $clips | Out-Null

$LEAD = 0.6   # 片头停顿
$TAIL = 0.7   # 片尾停顿
$VIDEO_FADE = 0.5
$AUDIO_FADE = 0.25

$listLines = @()
for ($i = 1; $i -le 9; $i++) {
  $png = Join-Path $slides "s$i.png"
  $wav = Join-Path $audio "s$i.wav"
  $out = Join-Path $clips "clip$i.mp4"

  # 读取音频时长（秒）
  $durStr = & $ffprobe -v error -show_entries format=duration -of csv=p=0 $wav
  $dur = [double]$durStr
  $total = $dur + $LEAD + $TAIL
  $vFadeOutStart = [math]::Round($total - $VIDEO_FADE, 3)
  $aFadeOutStart = [math]::Round($dur - $AUDIO_FADE, 3)

  $fc = "[0:v]scale=1920:1080,format=yuv420p,fade=t=in:st=0:d=$VIDEO_FADE,fade=t=out:st=${vFadeOutStart}:d=$VIDEO_FADE[v];" +
        "[1:a]aresample=44100,afade=t=in:st=0:d=$AUDIO_FADE,afade=t=out:st=${aFadeOutStart}:d=$AUDIO_FADE[a]"

  Write-Host "== scene $i  (audio ${dur}s, clip ${total}s)"
  & $ff -y -loglevel error -loop 1 -t $total -i $png -i $wav -filter_complex $fc -map "[v]" -map "[a]" `
      -c:v libx264 -preset medium -crf 20 -r 30 -c:a aac -b:a 192k $out
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg scene $i failed" }
  $listLines += "file '$(($out -replace "'", "''"))'"
}

# 写 concat 列表（绝对路径 + -safe 0，无 BOM）
$listPath = Join-Path $clips "concat.txt"
[System.IO.File]::WriteAllLines($listPath, $listLines, (New-Object System.Text.UTF8Encoding($false)))

$final = Join-Path $base "actor-explainer.mp4"
Write-Host "== concat -> $final"
& $ff -y -loglevel error -f concat -safe 0 -i $listPath -c copy -movflags +faststart $final
if ($LASTEXITCODE -ne 0) { throw "ffmpeg concat failed" }
Write-Host "DONE: $final"
