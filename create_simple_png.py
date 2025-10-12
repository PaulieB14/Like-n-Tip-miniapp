#!/usr/bin/env python3
import base64

# Simple 1x1 blue PNG (base64 encoded)
png_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

# Decode and write to file
with open('public/og-image.png', 'wb') as f:
    f.write(base64.b64decode(png_data))

with open('public/hero-image.png', 'wb') as f:
    f.write(base64.b64decode(png_data))

print("Created simple PNG files")
