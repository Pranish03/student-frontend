import { axios } from "../lib/axios";

export const fetchCourseResources = async ({ courseId, type }) => {
  const { data } = await axios.get(
    `/resources/course/${courseId}?type=${type}`,
  );
  return data;
};

export const createResource = async (data) => {
  const formData = new FormData();

  formData.append("course", data.course);
  formData.append("type", data.type);
  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.file && data.file[0]) formData.append("file", data.file[0]);
  if (data.deadline) {
    let deadlineValue = data.deadline;
    if (deadlineValue instanceof Date && !isNaN(deadlineValue)) {
      deadlineValue = deadlineValue.toISOString();
    }
    formData.append("deadline", deadlineValue);
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

export const editResource = async ({ id, data }) => {
  const hasFile = data.file && data.file[0];

  if (hasFile) {
    const formData = new FormData();

    formData.append("course", data.course);
    formData.append("type", data.type);
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (hasFile) formData.append("file", data.file[0]);
    if (data.deadline) {
      let deadlineValue = data.deadline;

      if (deadlineValue instanceof Date && !isNaN(deadlineValue)) {
        deadlineValue = deadlineValue.toISOString();
      }

      formData.append("deadline", deadlineValue);
    }

    const res = await axios.patch(`/resources/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res?.data;
  } else {
    const jsonData = { ...data };
    if (jsonData.deadline instanceof Date && !isNaN(jsonData.deadline)) {
      jsonData.deadline = jsonData.deadline.toISOString();
    }

    const res = await axios.patch(`/resources/${id}`, jsonData);
    return res?.data;
  }
};

export const deleteResource = async (id) => {
  const res = await axios.delete(`/resources/${id}`);
  return res?.data;
};
