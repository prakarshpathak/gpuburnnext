from PIL import Image

img_path = r"C:/Users/praka/.gemini/antigravity/brain/a8f0b76f-ec6e-4d18-9a7d-fe1f98b35938/uploaded_image_0_1764931948622.png"
img = Image.open(img_path).convert("RGBA")

bbox = img.getbbox()
print(f"Original size: {img.size}")
print(f"Content bbox: {bbox}")

if bbox:
    cropped = img.crop(bbox)
    print(f"Cropped size: {cropped.size}")
    cropped.save("public/gpu-logo-final.png")
    print("Saved public/gpu-logo-final.png")
else:
    print("Image is completely transparent!")
