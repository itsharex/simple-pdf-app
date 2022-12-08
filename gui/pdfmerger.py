import tkinter as tk
import sv_ttk
from tkinter import ttk
from tkinter import filedialog
from PyPDF2 import PdfFileMerger

# Create the main window
root = tk.Tk()
root.title("PDF Merger")
root.geometry("400x400")
root.attributes("-alpha", 0.9)
root.configure(background="black")
root.iconbitmap("gui\logo.ico")

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
clear_button = ttk.Button(root, text="Clear All", command=clear_pdfs)
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

    # Add the first selected PDF to the beginning of the list of selected PDFs
    if files:
        # Add the remaining selected PDFs to the end of the list of selected PDFs
        selected_pdfs.extend(files)

        # Update the list of selected PDFs displayed at the bottom of the window
        selected_pdf_label["text"] = "\n".join(selected_pdfs)

# Register the select PDF files button event handler
select_button.config(command=handle_select_pdfs)

# Create a label to display the list of selected PDFs
selected_pdf_label = tk.Label(root, text="No PDF files selected..")
selected_pdf_label.pack(padx=10, pady=10)
selected_pdf_label.configure(background="black", foreground="white")

# Create a function to remove a selected PDF from the list of selected PDFs
def remove_pdf(index):
    global selected_pdfs

    # Remove the PDF from the list of selected PDFs
    selected_pdfs.pop(index)

    # Update the list of selected PDFs displayed at the bottom of the window
    selected_pdf_label["text"] = "\n".join(selected_pdfs)

remove_button = ttk.Button(root, text="🗑️")
remove_button.configure(width=2)
remove_button.pack(padx=10, pady=10)
remove_button.config(command=lambda: remove_pdf(selected_pdfs.index(selected_pdf_label["text"].split("\n")[0])))


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

# Add version number bottom right
version_label = tk.Label(root, text="Ivan Ryan - v0.3.0 - 08 DEC 22")
version_label.pack(side="bottom", anchor="se")
version_label.configure(background="black", foreground="white")

# Set Theme
sv_ttk.set_theme("dark")

# Run the main window loop
root.mainloop()