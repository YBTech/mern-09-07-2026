import React, { useState, type SubmitEvent } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTosChecked, setIsTosChecked] = useState(false);

  const isValid =
    email &&
    password &&
    confirmPassword &&
    isTosChecked &&
    password === confirmPassword;

  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // validation: a very naive implementation
    setError(null);
    if (password !== confirmPassword) {
      setError("Password doesn't match");
    } else if (!isTosChecked) {
      setError("Please agree to terms");
    }
  };

  return (
    // onEvent will call your function with "event"
    // <form onSubmit={e=>handleSubmit(e)}>
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        <label>
          <div>Email</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          <div>Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <div>Confirm Password</div>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isTosChecked}
            onChange={() => setIsTosChecked((prev) => !prev)}
          />
          <span>
            I agree to <a href="https://www.youtube.com/">ToS</a>
          </span>
        </label>
      </div>
      <button disabled={!isValid}>Sign Up</button>
      <button>not submit button</button>
    </form>
  );
}
