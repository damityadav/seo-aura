import os
import sys

def install_and_import(package):
    import importlib
    try:
        importlib.import_module(package)
    except ImportError:
        import subprocess
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
    finally:
        globals()[package] = importlib.import_module(package)

# Ensure Pillow is installed
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    install_and_import('pillow')
    from PIL import Image, ImageDraw, ImageFont

def create_gradient_circle(size):
    # Create an image with transparent background
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    
    # Draw radial-like gradient (concentric circles of fading color)
    # Deep purple to electric indigo
    r_start, g_start, b_start = 99, 102, 241  # indigo-500 (#6366f1)
    r_end, g_end, b_end = 168, 85, 247      # purple-500 (#a855f7)
    
    center = size / 2
    max_radius = size / 2
    
    for r in range(int(max_radius), 0, -1):
        ratio = r / max_radius
        # Interpolate colors
        nr = int(r_start * (1 - ratio) + r_end * ratio)
        ng = int(g_start * (1 - ratio) + g_end * ratio)
        nb = int(b_start * (1 - ratio) + b_end * ratio)
        
        left = center - r
        top = center - r
        right = center + r
        bottom = center + r
        draw.ellipse([left, top, right, bottom], fill=(nr, ng, nb, 255))
        
    # Draw white decorative circle border
    border_width = max(1, int(size * 0.05))
    inner_r = max_radius - border_width * 2
    draw.ellipse([center - inner_r, center - inner_r, center + inner_r, center + inner_r], outline=(255, 255, 255, 60), width=border_width)
    
    # Draw a stylized magnifying glass or 'S' inside
    # For small sizes (16), simple graphic
    # For larger sizes (48, 128), richer graphics
    if size >= 48:
        # Drawing a stylized search magnifying glass combined with a checkmark
        # Draw magnifying glass handle
        handle_w = max(2, int(size * 0.08))
        draw.line(
            [center + int(size * 0.05), center + int(size * 0.05), center + int(size * 0.28), center + int(size * 0.28)],
            fill=(255, 255, 255, 255),
            width=handle_w
        )
        # Draw glass circle
        glass_r = int(size * 0.18)
        glass_center_x = center - int(size * 0.08)
        glass_center_y = center - int(size * 0.08)
        draw.ellipse(
            [glass_center_x - glass_r, glass_center_y - glass_r, glass_center_x + glass_r, glass_center_y + glass_r],
            outline=(255, 255, 255, 255),
            width=max(2, int(size * 0.06))
        )
        # Add a glowing spark in the glass
        spark_r = max(1, int(size * 0.04))
        draw.ellipse(
            [glass_center_x - spark_r, glass_center_y - spark_r, glass_center_x + spark_r, glass_center_y + spark_r],
            fill=(34, 197, 94, 255) # Green check/dot for active audit
        )
    else:
        # Size 16: simple white square/circle in the center
        r_small = 3
        draw.ellipse([center - r_small, center - r_small, center + r_small, center + r_small], fill=(255, 255, 255, 255))
        
    return image

def main():
    icons_dir = "/Users/damityadav/New Extension/icons"
    os.makedirs(icons_dir, exist_ok=True)
    
    sizes = [16, 48, 128]
    for size in sizes:
        img = create_gradient_circle(size)
        path = os.path.join(icons_dir, f"icon-{size}.png")
        img.save(path, "PNG")
        print(f"Generated {size}x{size} icon at {path}")

if __name__ == "__main__":
    main()
