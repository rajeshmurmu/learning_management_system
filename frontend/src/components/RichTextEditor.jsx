import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ichTextEditor({ values, setValues }) {
  const handleDescription = (description = "") => {
    setValues({ ...values, description: description });
  };
  // console.log("description", values.description);
  return (
    <ReactQuill
      theme="snow"
      value={values.description}
      onChange={handleDescription}
    />
  );
}
