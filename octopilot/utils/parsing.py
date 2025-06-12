import urllib
import time
from selenium import webdriver
from octopilot.config import logger


def parse_docx(file_path):
    """
    Parse a DOCX file and return its content as a string.
    """
    try:
        from docx import Document
        doc = Document(file_path)
        return '\n'.join([para.text for para in doc.paragraphs])
    except ImportError:
        print("python-docx is not installed. Please install it to parse DOCX files.")
        return None


def html2pdf(content, driver: webdriver.Chrome):
        # Validazione del contenuto HTML
    if not isinstance(content, str) or not content.strip():
        raise ValueError("Il contenuto HTML deve essere una stringa non vuota.")

    # Codifica l'HTML in un URL di tipo data
    encoded_html = urllib.parse.quote(content)
    data_url = f"data:text/html;charset=utf-8,{encoded_html}"

    try:
        driver.get(data_url)
        time.sleep(2)

        # Esegue il comando CDP per stampare la pagina in PDF
        pdf_base64 = driver.execute_cdp_cmd("Page.printToPDF", {
            "printBackground": True,         
            "landscape": False,              
            "paperWidth": 8.27,              
            "paperHeight": 11.69,            
            "marginTop": 0.8,                
            "marginBottom": 0.8,             
            "marginLeft": 0.5,               
            "marginRight": 0.5,              
            "displayHeaderFooter": False,    
            "preferCSSPageSize": True,       
            "generateDocumentOutline": False,
            "generateTaggedPDF": False,      
            "transferMode": "ReturnAsBase64"   
        })
        return pdf_base64['data']
    except Exception as e:
        logger.error(f"Si è verificata un'eccezione WebDriver: {e}")
        raise RuntimeError(f"Si è verificata un'eccezione WebDriver: {e}")
