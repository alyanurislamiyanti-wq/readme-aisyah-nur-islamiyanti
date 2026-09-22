$port = 8888
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")
$listener.Start()

Write-Host "============================================"
Write-Host "  QR Generator Server running at:" 
Write-Host "  http://localhost:${port}" 
Write-Host "  Press Ctrl+C to stop" 
Write-Host "============================================"

$mimeTypeMap = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $filePath = Join-Path $root ($request.Url.LocalPath -replace '/', '\')
    if ($request.Url.LocalPath -eq '/') { $filePath = Join-Path $root 'index.html' }

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypeMap.ContainsKey($ext)) { $mimeTypeMap[$ext] } else { "application/octet-stream" }
        $response.ContentType = $contentType
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.OutputStream.Close()
}
