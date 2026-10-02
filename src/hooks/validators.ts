export const validators = {
  id: (value: string) => {
    const idPattern = /^[A-Za-z0-9]{4,15}$/;
    return {
      isValid: idPattern.test(value),
      message: "영문과 숫자 조합 4-15자를 입력해주세요."
    };
  },

  password: (value: string) => {
    const pwPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    return {
      isValid: pwPattern.test(value),
      message: "영문자, 숫자, 특수문자 조합의 8-20자리를 입력해주세요."
    };
  }
};

export default validators;
