export const apiGet = async <T,>(url: string): Promise<T> => {
  return await fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as T;
  });
}

export const apiPost = async <T, K>(url: string, data: K): Promise<T> => {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as T;
  });
};


export const apiPut = async <T, K>(url: string, data: K): Promise<T> => {
  return await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as T;
  });
};


export const apiDelete = async (url: string): Promise<void> => {
  return await fetch(url, {method: "DELETE"}).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

