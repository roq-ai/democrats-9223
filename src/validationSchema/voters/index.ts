import * as yup from 'yup';

export const voterValidationSchema = yup.object().shape({
  name: yup.string().required(),
  sentiment: yup.string().required(),
  flag: yup.string().required(),
  user_id: yup.string().nullable(),
});
