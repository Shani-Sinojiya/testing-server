const CheckUserIsInDb = async (email, pass) => {
  const res = await fetch("http://localhost:8080/v1/users/email/auth/isvalid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password: pass }),
  });

  if (res.status === 200) {
    return true;
  }
  return false;
};

module.exports = { CheckUserIsInDb };
