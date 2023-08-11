import { yupResolver, zodResolver } from './resolvers';
import useForm from './useForm';

export default useForm;

export { yupResolver, zodResolver };

/*
import { yupResolver, zodResolver } from './resolvers';
import useForm from './useForm';

useForm.yupResolver = yupResolver;
useForm.zodResolver = zodResolver;

export default useForm;
*/
