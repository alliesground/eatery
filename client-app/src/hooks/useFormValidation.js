import { useState, useEffect } from 'react';

const useFormValidation = (submitForm, isSubmitted) => {

  const [errors, setErrors] = useState({})

  const handlePresenceValidation = (fields) => {

    setErrors({});

    const fieldEntries = Object.entries(fields)

    for(const [fieldName, val] of fieldEntries) {
      if(!val) {
        setErrors(prevErrors => ({...prevErrors, [fieldName]: 'cannot be empty'}))
      }
    }

  }

  useEffect(() => {
    const noErrors = Object.keys(errors).length === 0;

    if(isSubmitted && noErrors) submitForm();

  }, [errors, isSubmitted])

  return {
    handlePresenceValidation,
    errors
  }

}

export default useFormValidation;
