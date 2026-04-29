const fs = require('fs');
const path = require('path');

async function testUpload() {
  const dummyPdfPath = path.join(__dirname, 'dummy2.pdf');
  // Just create a tiny valid PDF
  const pdfBase64 = "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQMzYwNlOwUShLr0xRKEotLylPzSgHajwlTCmVuZHN0cmVhbQplbmRvYmoKCjMgMCBvYmoKNDIKZW5kb2JqCgo1IDAgb2JqCjw8L0xlbmd0aCA2IDAgUi9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoMSA0NTE+PgpzdHJlYW0KeJwlT9EKwjAMfO9X9AkL22pr1wdxMBDxUUR8EJQp07WCw6Yv+vdN0SDEkOSSm1ySc8l2zE4O7HkI0LItmB4aHqwDEZ5sB+bJbGA14A0u4Aeu4B0+4BN8XzG4wA8sg3zG/wP9wAM8wS28wj28wye8wwf8mXmAB3iCW3iFe3iHT3iHD/gG/U48gK28wz28wyfsgB/X8wBPeIeP63mAB3iC2/U8wBM+rucBnuAWXuEe3uET3uEDPq7nAZ7gFl7hHt7hEz6u5wGe4BZe4R7e4RM+rucBnuAWXuEe3uET3uEDPq7nAZ7gFl7hHt7hEz6u5wGe4BZe4R7e4RM+rucBnuAWXuEe3uET3q7nAZ7gFl7hHt7hEz6u5wGe4BZe4R7e4RM+rucBnuAWXuEe3uET3uED/kzPAzzBLbzCPbzDJ7zDB/wJ3s1p+gplbmRzdHJlYW0KZW5kb2JqCgo2IDAgb2JqCjI5NgplbmRvYmoKCjQgMCBvYmoKPDwvVHlwZS9Gb250RGVzY3JpcHRvci9Gb250TmFtZS9CQUFBQUErSGVsdmV0aWNhL0ZvbnRCQm94WzAgLTIwNiAxMDAwIDg5N10vRmxhZ3MgNi9Bc2NlbnQgODk3L0NhcEhlaWdodCA3MTgvRGVzY2VudCAtMjA2L0l0YWxpY0FuZ2xlIDAvU3RlbVYgMTA5L01pc3NpbmdXaWR0aCAxMDAwL0ZvbnRGaWxlMiA1IDAgUj4+CmVuZG9iagoKNyAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UcnVlVHlwZS9CYXNlRm9udC9CQUFBQUErSGVsdmV0aWNhL0ZpcnN0Q2hhciAwL0xhc3RDaGFyIDMvV2lkdGhzWzAgMjc3IDcyMiAyNzhdL0ZvbnREZXNjcmlwdG9yIDQgMCBSL1RvVW5pY29kZSA4IDAgUj4+CmVuZG9iagoKOCAwIG9iago8PC9MZW5ndGggOSAwIFIvRmlsdGVyL0ZsYXRlRGVjb2RlPj4Kc3RyZWFtCnicM08tSswrSUxRVTAwNVCyA1MwjTDRjM5LTE4tUNJUSk8sSckrSdVU0lHwLChQ8Axz1g1z1tUN93ZSCArwddZNUwABgC2oAABlbmRzdHJlYW0KZW5kb2JqCgo5IDAgb2JqCjc3CmVuZG9iagoKMTAgMCBvYmoKPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNyAwIFI+Pj4+L0NvbnRlbnRzIDIgMCBSL1BhcmVudCAxMSAwIFI+PgplbmRvYmoKCjExIDAgb2JqCjw8L1R5cGUvUGFnZXMvQ291bnQgMS9LaWRzWzEwIDAgUl0+PgplbmRvYmoKCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDExIDAgUj4+CmVuZG9iagoKeHJlZgowIDEyCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMTE1MSAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDU0MiAwMDAwMCBuIAowMDAwMDAwMTQ2IDAwMDAwIG4gCjAwMDAwMDA1MjIgMDAwMDAgbiAKMDAwMDAwMDc1OCAwMDAwMCBuIAowMDAwMDAwOTAyIDAwMDAwIG4gCjAwMDAwMDEwNDggMDAwMDAgbiAKMDAwMDAwMTA2OSAwMDAwMCBuIAowMDAwMDAxMTkxIDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSAxMi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjEyNDcKJSVFT0YK";
  fs.writeFileSync(dummyPdfPath, Buffer.from(pdfBase64, 'base64'));

  const fileBuffer = fs.readFileSync(dummyPdfPath);
  const blob = new Blob([fileBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('filepond', blob, 'dummy2.pdf');

  try {
    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response text:', text);
  } catch(e) {
    console.error('Error fetching:', e);
  }
}

testUpload();
