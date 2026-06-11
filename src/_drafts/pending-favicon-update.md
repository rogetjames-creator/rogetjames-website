# Favicon update — pending file drop

## What James needs to do first
1. Go to https://favicon.io/favicon-converter/
2. Upload /public/images/roj-logo.png
3. Download the zip, unzip it
4. Drop these files into /public/:
   - favicon.ico
   - favicon-16x16.png
   - favicon-32x32.png
   - apple-touch-icon.png
   - site.webmanifest (optional but good)

## Then tell Claude to execute this swap in index.html

### FIND (current line ~95):
```
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### REPLACE WITH:
```
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
```

## Status: WAITING on James to drop the image files in
