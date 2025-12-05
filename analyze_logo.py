from PIL import Image
import collections

img_path = r"C:/Users/praka/.gemini/antigravity/brain/a8f0b76f-ec6e-4d18-9a7d-fe1f98b35938/uploaded_image_0_1764931948622.png"
img = Image.open(img_path).convert("RGBA")

# Analyze corners
corners = [
    (0, 0),
    (img.width - 1, 0),
    (0, img.height - 1),
    (img.width - 1, img.height - 1)
]

print("Corner colors:")
for x, y in corners:
    print(f"({x}, {y}): {img.getpixel((x, y))}")

# Check for checkerboard pattern in top-left 20x20
colors = []
for y in range(20):
    for x in range(20):
        colors.append(img.getpixel((x, y)))

print("\nMost common colors in top-left 20x20:")
print(collections.Counter(colors).most_common(5))
