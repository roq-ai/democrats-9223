import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getVoterById, updateVoterById } from 'apiSdk/voters';
import { Error } from 'components/error';
import { voterValidationSchema } from 'validationSchema/voters';
import { VoterInterface } from 'interfaces/voter';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function VoterEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<VoterInterface>(
    () => (id ? `/voters/${id}` : null),
    () => getVoterById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: VoterInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateVoterById(id, values);
      mutate(updated);
      resetForm();
      router.push('/voters');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<VoterInterface>({
    initialValues: data,
    validationSchema: voterValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Voter
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="sentiment" mb="4" isInvalid={!!formik.errors?.sentiment}>
              <FormLabel>Sentiment</FormLabel>
              <Input type="text" name="sentiment" value={formik.values?.sentiment} onChange={formik.handleChange} />
              {formik.errors.sentiment && <FormErrorMessage>{formik.errors?.sentiment}</FormErrorMessage>}
            </FormControl>
            <FormControl id="flag" mb="4" isInvalid={!!formik.errors?.flag}>
              <FormLabel>Flag</FormLabel>
              <Input type="text" name="flag" value={formik.values?.flag} onChange={formik.handleChange} />
              {formik.errors.flag && <FormErrorMessage>{formik.errors?.flag}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'voter',
    operation: AccessOperationEnum.UPDATE,
  }),
)(VoterEditPage);
