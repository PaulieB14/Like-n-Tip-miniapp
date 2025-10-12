#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_image(width, height, filename, text, bg_color=(0, 82, 255), text_color=(255, 255, 255)):
    # Create image with gradient-like background
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a system font, fallback to default
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 72)
        font_medium = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 36)
        font_small = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
    except:
        try:
            font_large = ImageFont.truetype("arial.ttf", 72)
            font_medium = ImageFont.truetype("arial.ttf", 36)
            font_small = ImageFont.truetype("arial.ttf", 24)
        except:
            font_large = ImageFont.load_default()
            font_medium = ImageFont.load_default()
            font_small = ImageFont.load_default()
    
    # Draw gradient-like background
    for y in range(height):
        ratio = y / height
        r = int(bg_color[0] * (1 - ratio) + 124 * ratio)  # Blue to purple
        g = int(bg_color[1] * (1 - ratio) + 58 * ratio)
        b = int(bg_color[2] * (1 - ratio) + 237 * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Draw text
    if filename == "og-image.png":
        # Main title
        bbox = draw.textbbox((0, 0), "LIke n Tip", font=font_large)
        text_width = bbox[2] - bbox[0]
        draw.text(((width - text_width) // 2, height // 2 - 80), "LIke n Tip", fill=text_color, font=font_large)
        
        # Subtitle
        bbox = draw.textbbox((0, 0), "Auto-tip when you like", font=font_medium)
        text_width = bbox[2] - bbox[0]
        draw.text(((width - text_width) // 2, height // 2 - 20), "Auto-tip when you like", fill=text_color, font=font_medium)
        
        # Tagline
        bbox = draw.textbbox((0, 0), "Base Mini App", font=font_small)
        text_width = bbox[2] - bbox[0]
        draw.text(((width - text_width) // 2, height // 2 + 40), "Base Mini App", fill=text_color, font=font_small)
    
    elif filename == "hero-image.png":
        # Hero image with heart emoji
        bbox = draw.textbbox((0, 0), "💖", font=font_large)
        text_width = bbox[2] - bbox[0]
        draw.text(((width - text_width) // 2, height // 2 - 40), "💖", fill=text_color, font=font_large)
        
        bbox = draw.textbbox((0, 0), "LIke n Tip", font=font_medium)
        text_width = bbox[2] - bbox[0]
        draw.text(((width - text_width) // 2, height // 2 + 20), "LIke n Tip", fill=text_color, font=font_medium)
    
    elif filename == "icon.png":
        # Simple icon
        draw.ellipse([width//4, height//4, 3*width//4, 3*height//4], fill=text_color)
        bbox = draw.textbbox((0, 0), "💖", font=font_medium)
        text_width = bbox[2] - bbox[0]
        draw.text(((width - text_width) // 2, (height - bbox[3] + bbox[1]) // 2), "💖", fill=bg_color, font=font_medium)
    
    # Save image
    img.save(f"public/{filename}")
    print(f"Created {filename}")

# Create the images
create_image(1200, 630, "og-image.png", "LIke n Tip")
create_image(1200, 630, "hero-image.png", "LIke n Tip")
create_image(1024, 1024, "icon.png", "LIke n Tip")

# Create screenshots (portrait format)
create_image(1284, 2778, "screenshot1.png", "Auto-Tip Settings")
create_image(1284, 2778, "screenshot2.png", "Recent Tips")
create_image(1284, 2778, "screenshot3.png", "Base Integration")

print("All images created successfully!")
