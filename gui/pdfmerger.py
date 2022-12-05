# A simple PDF Merger by Ivan Ryan
# I really just wanted a easier way to merge PDFs on my computer than adobe 
# I also opted for a GUI because my dad would also use it.
# Version 0.2.0

import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
from PyPDF2 import PdfFileMerger

# Create the main window
root = tk.Tk()
root.title("PDF Merger")
root.geometry("400x400")
root.attributes("-alpha", 0.8)
root.configure(background="black")

# Create a list to store the selected PDF files
selected_pdfs = []

# Clear pdf function
def clear_pdfs():
    global selected_pdfs
    selected_pdfs = []
    selected_pdf_label["text"] = "No PDF files selected."

# Create a new style for the buttons
style = ttk.Style()

# Change the background color of the buttons to blue
style.configure("TButton", background="black", foreground="black", font=("Arial", 10))

# Create button to exec clear_pdfs
clear_button = ttk.Button(root, text="Clear", command=clear_pdfs)
clear_button.pack(pady=10)

# Create a button for selecting PDF files
select_button = ttk.Button(root, text="Select PDF Files")
select_button.pack(padx=10, pady=10)
select_button.configure(style="TButton")

# Function to handle selecting PDF files
def handle_select_pdfs():
    global selected_pdfs

    # Use the file dialog to select PDF files
    files = filedialog.askopenfilenames(title="Select PDF Files", filetypes=[("PDF files", "*.pdf")])

    # Add each selected file to the list of selected PDFs
    for file in files:
        selected_pdfs.append(file)

    # Update the list of selected PDFs displayed at the bottom of the window
    selected_pdf_label["text"] = "\n".join(selected_pdfs)

# Register the select PDF files button event handler
select_button.config(command=handle_select_pdfs)

# Create a label to display the list of selected PDFs
selected_pdf_label = tk.Label(root, text="No PDF files selected..")
selected_pdf_label.pack(padx=10, pady=10)
selected_pdf_label.configure(background="black", foreground="white")

# Create a function to move a selected PDF up in the list
def move_pdf_up(index):
    global selected_pdfs

    # Check if the PDF is already at the top of the list
    if index == len(selected_pdfs) + 1:
        return

    # Swap the PDF with the one above it in the list
    selected_pdfs[index], selected_pdfs[index - 1] = selected_pdfs[index - 1], selected_pdfs[index]

    # Update the list of selected PDFs displayed at the bottom of the window
    selected_pdf_label["text"] = "\n".join(selected_pdfs)

move_up_button = ttk.Button(root, text="🔼")
move_up_button.configure(width=2)
move_up_button.pack(padx=10, pady=10)
move_up_button.config(command=lambda: move_pdf_up(selected_pdfs.index(selected_pdf_label["text"].split("\n")[0])))

# Create a function to move a selected PDF down in the list
def move_pdf_down(index):
    global selected_pdfs

    # Check if the PDF is already at the bottom of the list
    if index == len(selected_pdfs) - 1:
        return

    # Swap the PDF with the one below it in the list
    selected_pdfs[index], selected_pdfs[index + 1] = selected_pdfs[index + 1], selected_pdfs[index]

    # Update the list of selected PDFs displayed at the bottom of the window
    selected_pdf_label["text"] = "\n".join(selected_pdfs)

move_down_button = ttk.Button(root, text="🔽")
move_down_button.configure(width=2)
move_down_button.pack(padx=10, pady=10)
move_down_button.pack(padx=10, pady=10)
move_down_button.config(command=lambda: move_pdf_down(selected_pdfs.index(selected_pdf_label["text"].split("\n")[0])))

# Create a button for merging the selected PDFs
merge_button = ttk.Button(root, text="Merge PDFs")
merge_button.pack(padx=10, pady=10)

# Function to handle merging the selected PDFs
def handle_merge_pdfs():
    global selected_pdfs

    # Check if at least one PDF file is selected
    if len(selected_pdfs) == 0 or len(selected_pdfs) == 1:
        tk.messagebox.showerror("Error", "Please select at least two PDF files to merge.")
        return

    # Create a new PDF merger object
    merger = PdfFileMerger()

    # Add each selected PDF to the merger
    for pdf in selected_pdfs:
        try:
            merger.append(pdf)
        except FileNotFoundError:
            tk.messagebox.showerror("Error", "Could not find specified PDF file(s). Please select valid PDF files.")
            selected_pdfs = []
            selected_pdf_label["text"] = "\n".join(selected_pdfs)
            return

    # Use the file dialog to select the output file
    output_file = filedialog.asksaveasfilename(title="Save Merged PDF", defaultextension=".pdf")

    # Write the merged PDF to the output file
    with open(output_file, "wb") as f:
        merger.write(f)

    tk.messagebox.showinfo("Success", "PDFs merged successfully!")

# Register the merge PDFs button event handler
merge_button.config(command=handle_merge_pdfs)

# Add version number bottom right
version_label = tk.Label(root, text="v0.2.0 - 05 DEC 22")
version_label.pack(side="bottom", anchor="se")
version_label.configure(background="black", foreground="white")

# Run the main window loop
root.mainloop()