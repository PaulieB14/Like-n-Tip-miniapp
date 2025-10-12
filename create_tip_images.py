#!/usr/bin/env python3
import base64

# Create a simple PNG with "LEAVE A TIP" text and coin icon
# This is a minimal 1x1 blue PNG that we'll use as a placeholder
simple_png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

# Create all the required image files
images = [
    "og-image.png",
    "hero-image.png", 
    "icon.png",
    "screenshot1.png",
    "screenshot2.png",
    "screenshot3.png"
]

for image_name in images:
    with open(f"public/{image_name}", "wb") as f:
        f.write(base64.b64decode(simple_png))
    print(f"Created {image_name}")

print("All placeholder images created!")
