export function validateRegistration({ displayName, email, password, confirmPassword }) {
  if (!displayName || !email || !password || !confirmPassword) {
    return {
      title: "Missing information",
      message: "Please fill in all fields.",
    };
  }
  
    if (password.length < 6) {
    return {
      title: "Password too short",
      message: "Your password must be at least 6 characters long.",
    };
  }

  if (password !== confirmPassword) {
    return {
      title: "Passwords do not match",
      message: "Please enter the same password twice.",
    };
  }

  return null;
}