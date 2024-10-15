import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

function CustomForm({ status, message, onValidated }) {
  const [email, setEmail] = useState("");

  const resetForm = () => {
    setEmail("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    email && email.indexOf("@") > -1 && onValidated({ EMAIL: email });
    resetForm();
  };

  return (
    <>
        
        <a
          href="https://www.fastercook.fr/immo" // Remplacez par l'URL de destination
          className="d-block btn btn-primary mt-4 w-full">
            En savoir plus !
        </a>

      {status === "sending" && (
        <div className="mt-4 text-primary">sending...</div>
      )}
      {status === "error" && (
        <div
          className="mt-4 text-red-700"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div className="mt-4 text-green-700">Abonné !</div>
      )}
    </>
  );
}

export default CustomForm;
