import React, { ChangeEvent, useState } from 'react';

const FileForm = () => {
  const [files, setFiles] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fileReader = new FileReader();
    if (e.target.files) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        console.log(e.target?.result)
      }
    }
  }

  return (
    <form>
      <input type="file" onChange={(e) => handleChange(e)}/>
      <p>hello</p>
    </form>
  )
}

export { FileForm }