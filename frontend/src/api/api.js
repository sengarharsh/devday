import customAxios from "./customAxios";

const urls = {
  get_all_tasks: "/api/tasks",
  dsa_questions: "/api/dsa",
  activities: "/api/activities",
  brain_dumps: "/api/brain-dumps",
};

// Task APIs
export const getAllTasks = async () => {
  try {
    const response = await customAxios.get(urls.get_all_tasks);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createTask = async (payload) => {
  try {
    const response = await customAxios.post(urls.get_all_tasks, payload);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateTask = async (taskId, payload) => {
  try {
    const response = await customAxios.put(`${urls.get_all_tasks}/${taskId}`, payload);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await customAxios.delete(`${urls.get_all_tasks}/${taskId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

// DSA APIs
export const createDSAQuestion = async (payload) => {
  try {
    const response = await customAxios.post(urls.dsa_questions, payload);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllDSAQuestions = async () => {
  try {
    const response = await customAxios.get(urls.dsa_questions);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSolvedDSAQuestions = async () => {
  try {
    const response = await customAxios.get(`${urls.dsa_questions}/solved`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBookmarkedDSAQuestions = async () => {
  try {
    const response = await customAxios.get(`${urls.dsa_questions}/bookmarked`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateDSAQuestionStatus = async (id, updates) => {
  try {
    const response = await customAxios.patch(`${urls.dsa_questions}/${id}`, updates);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateDSAQuestion = async (id, payload) => {
  try {
    const response = await customAxios.put(`${urls.dsa_questions}/${id}`, payload);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteDSAQuestion = async (id) => {
  try {
    const response = await customAxios.delete(`${urls.dsa_questions}/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Activity APIs
export const getAllActivities = async () => {
  try {
    const response = await customAxios.get(urls.activities);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createActivity = async (payload) => {
  try {
    const response = await customAxios.post(urls.activities, payload);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteActivity = async (id) => {
  try {
    const response = await customAxios.delete(`${urls.activities}/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

// Brain Dump APIs
export const getAllBrainDumps = async () => {
  try {
    const response = await customAxios.get(urls.brain_dumps);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createBrainDump = async (payload) => {
  try {
    const response = await customAxios.post(urls.brain_dumps, payload);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteBrainDump = async (id) => {
  try {
    const response = await customAxios.delete(`${urls.brain_dumps}/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
