import { axios } from "../lib/axios";

export const fetchCourseNotes = async (courseId) => {
  const { data } = await axios.get(`/resources/course/${courseId}`);
  return data;
};

export const createNote = async (data) => {
  const formData = new FormData();

  formData.append("course", data.course);
  formData.append("type", data.type);
  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.file && data.file[0]) {
    formData.append("file", data.file[0]);
  }

  try {
    const res = await axios.post("/resources", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data;
  } catch (error) {
    console.error("Full error response:", error.response?.data);
    throw error;
  }
};

export const editNote = async ({ id, data }) => {
  const res = await axios.patch(`/resources/${id}`, data);
  return res?.data;
};

export const deleteNote = async (id) => {
  const res = await axios.delete(`/resources/${id}`);
  return res?.data;
};
