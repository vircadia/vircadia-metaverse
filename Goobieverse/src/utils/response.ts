export const Response = {
  success: (data: any) => {
    return { status: "success", data: data };
  },
  error: (message: string) => {
    return { status: "failure", message: message };
  },
};
