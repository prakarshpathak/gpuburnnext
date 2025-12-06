from PIL import Image

# Open the previously cropped (clean) logo
img_path = "public/gpu-logo-final.png"
img = Image.open(img_path).convert("RGBA")

print(f"Original size: {img.size}")

# Determine new square size
size = max(img.size)
new_size = (size, size)

# Create a transparent square canvas
square_img = Image.new("RGBA", new_size, (0, 0, 0, 0))

# Calculate position to center the logo
x = (size - img.width) // 2
y = (size - img.height) // 2

# Paste the logo
square_img.paste(img, (x, y))

print(f"New square size: {square_img.size}")

# Save as new favicon file
output_path = "public/favicon-square.png"
square_img.save(output_path)
print(f"Saved square favicon to {output_path}")
