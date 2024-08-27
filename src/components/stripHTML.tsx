function stripHtml(html: string): string {
    // Replace common HTML entities
    const entityMap: { [key: string]: string } = {
      '&quot;': '"',
      '&lt;': '<',
      '&gt;': '>',
      '&amp;': '&',
      // Add other entities as needed
    };
  
    // Replace each HTML entity in the text
    const cleanHtml = Object.keys(entityMap).reduce((acc, entity) => {
      return acc.replace(new RegExp(entity, 'g'), entityMap[entity]);
    }, html);
  
    // Strip remaining HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  