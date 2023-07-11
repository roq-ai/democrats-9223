import * as yup from 'yup';

export const reportValidationSchema = yup.object().shape({
  name: yup.string().required(),
  data: yup.string().required(),
  user_id: yup.string().nullable(),
});
