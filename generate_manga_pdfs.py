"""
Generate PDF file from manga images.
"""
from fpdf import FPDF
from PIL import Image
import os


class PDF(FPDF):
    def header(self):
        pass

    def footer(self):
        pass


def convert_images(image_paths, output_format):
    converted_paths = []
    for image_path in image_paths:
        if not image_path.endswith(".webp"):
            print("Skipping non-webp image: " + image_path)
            continue
        im = Image.open(image_path)
        converted_path = image_path.rsplit(".", 1)[0] + "." + output_format
        im.save(converted_path)
        converted_paths.append(converted_path)
    return converted_paths


def generate_pdf_from_image(image_paths, margin, output_path):
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=margin)

    for image_path in image_paths:
        # Get the image dimensions
        image = Image.open(image_path)
        image_width, image_height = image.size

        # Calculate the scaling factor to fit the image within the PDF page
        scaling_factor = min(
            (pdf.w - 2 * margin) / image_width, (pdf.h - 2 * margin) / image_height
        )

        # Calculate the position to center the image on the page
        x = (pdf.w - image_width * scaling_factor) / 2
        y = (pdf.h - image_height * scaling_factor) / 2

        # Add the image to a new page
        pdf.add_page()
        pdf.image(
            image_path,
            x=x,
            y=y,
            w=image_width * scaling_factor,
            h=image_height * scaling_factor,
        )

    # Save the PDF file
    pdf.output(output_path)


def generate_manga_pdf(webp_paths, output_path, margin=10, output_format="png"):
    image_paths = convert_images(webp_paths, output_format)
    generate_pdf_from_image(image_paths, margin, output_path)

    for image_path in image_paths:
        os.remove(image_path)


# Example usage
manga_name = "葬送者芙莉莲"

for i in os.scandir(f"mangas/{manga_name}/"):
    if not os.path.exists(i.name + ".pdf"):
        if i.name != ".DS_Store":
            print(f"Generating pdf for {i.name}...")
            with os.scandir(i) as entries:
                sorted_entries = sorted(
                    entries, key=lambda entry: entry.stat().st_ctime
                )
                print([j.path for j in sorted_entries])
                generate_manga_pdf([j.path for j in sorted_entries], i.name + ".pdf")
