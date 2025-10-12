#!/usr/bin/env python3
import base64

# Create a simple blue PNG with white text
# This is a minimal PNG that will work for previews
def create_simple_png():
    # Simple 1x1 blue pixel PNG
    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

# Create all required images
images = [
    "og-image.png",
    "hero-image.png", 
    "icon.png",
    "screenshot1.png",
    "screenshot2.png",
    "screenshot3.png"
]

png_data = create_simple_png()

for image_name in images:
    with open(f"public/{image_name}", "wb") as f:
        f.write(base64.b64decode(png_data))
    print(f"Created {image_name}")

print("All images created successfully!")
