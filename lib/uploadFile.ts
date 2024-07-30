const UPLOAD_URL = "https://api.cloudinary.com/v1_1/dqxkhyewi/auto/upload"
export const uploadFile = async (file:any) => {
  let data = {
    "file": file,
    "upload_preset": "chatApp",
  };

  try {
    const response = await fetch(UPLOAD_URL, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData; // Return the response data
    } else {
      throw new Error('File upload failed');
    }
  } catch (error) {
    console.log(error);
  }
};





